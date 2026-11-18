import http from 'node:http';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import fs from 'node:fs/promises';
import {protectSecret} from './windows-secret-store.mjs';

const origin='http://127.0.0.1:8765';
const redirect=origin+'/oauth/callback';
const csrf=randomBytes(32).toString('hex');
let pending=null,finished=false;
const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const page=body=>`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Autorizar backup da clínica</title><style>body{font:17px system-ui;background:#f3f6f5;color:#17383b;max-width:620px;margin:50px auto;padding:24px}label{display:block;margin:24px 0}input{box-sizing:border-box;width:100%;padding:14px;font:inherit}button{padding:14px 20px;font:inherit;background:#17383b;color:white;border:0;border-radius:8px}p{line-height:1.6}</style><h1>Backup da clínica</h1>${body}</html>`;
const server=http.createServer(async(req,res)=>{
  const send=(status,body)=>{res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'same-origin','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://accounts.google.com; base-uri 'none'; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff'});res.end(page(body));};
  if(req.headers.host!=='127.0.0.1:8765')return send(403,'<p>Acesso recusado.</p>');
  const url=new URL(req.url,origin);
  try{
    if(req.method==='GET'&&url.pathname==='/')return send(200,finished?'<p>Autorização concluída. Pode fechar esta tela.</p>':`<p>Informe o cliente OAuth criado no Google Cloud. Use a chave nova, após desativar a que apareceu na captura.</p><p>A próxima etapa solicita acesso à conta <strong>odontopersonnallite.admin@gmail.com</strong> para criar e manter os arquivos desta integração no Drive. Nenhum contato será exportado nesta etapa.</p><form method="post" action="/start" autocomplete="off"><input type="hidden" name="csrf" value="${csrf}"><label>ID do cliente<input name="client_id" required autocomplete="off"></label><label>Nova chave secreta do cliente<input name="client_secret" type="password" required autocomplete="off"></label><button>Continuar no Google</button></form><p>As credenciais serão protegidas pelo Windows e não serão enviadas ao GitHub.</p>`);
    if(req.method==='POST'&&url.pathname==='/start'){
      if(req.headers.origin!==origin)return send(403,'<p>Abra esta ferramenta no Chrome em http://127.0.0.1:8765/ e tente novamente. O navegador precisa enviar a origem local correta.</p>');
      if(finished)return send(409,'<p>A autorização já foi concluída. Pode avisar no chat.</p>');
      if(!req.headers['content-type']?.startsWith('application/x-www-form-urlencoded'))return send(415,'<p>Formato inválido.</p>');
      let body='';for await(const chunk of req){body+=chunk;if(body.length>12000)return send(413,'<p>Pedido muito grande.</p>');}
      const form=new URLSearchParams(body);
      if(!equal(form.get('csrf'),csrf))return send(403,'<p>Pedido inválido.</p>');
      const client_id=form.get('client_id')?.trim(),client_secret=form.get('client_secret')?.trim();
      if(!client_id?.endsWith('.apps.googleusercontent.com')||!client_secret)return send(400,'<p>Confira o ID e a chave do cliente.</p>');
      pending={client_id,client_secret,state:randomBytes(32).toString('hex'),verifier:randomBytes(48).toString('base64url'),expires:Date.now()+10*60*1000};
      const params=new URLSearchParams({client_id,redirect_uri:redirect,response_type:'code',scope:'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email',access_type:'offline',prompt:'consent select_account',login_hint:'odontopersonnallite.admin@gmail.com',state:pending.state,code_challenge:createHash('sha256').update(pending.verifier).digest('base64url'),code_challenge_method:'S256'});
      res.writeHead(303,{Location:'https://accounts.google.com/o/oauth2/v2/auth?'+params,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});return res.end();
    }
    if(req.method==='GET'&&url.pathname==='/oauth/callback'){
      if(!pending||pending.expires<Date.now()||!equal(url.searchParams.get('state'),pending.state))return send(400,'<p>Esta etapa precisa começar na página inicial local. <a href="/">Abrir início</a>.</p>');
      const auth=pending;pending=null;
      if(url.searchParams.has('error')||!url.searchParams.get('code'))return send(400,'<p>Autorização não concluída. Reinicie a ferramenta para tentar novamente.</p>');
      const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:auth.client_id,client_secret:auth.client_secret,code:url.searchParams.get('code'),code_verifier:auth.verifier,redirect_uri:redirect,grant_type:'authorization_code'}),signal:AbortSignal.timeout(20000)});
      if(!response.ok){
        const failure=await response.json().catch(()=>({}));
        throw Error(failure.error==='invalid_client'?'invalid_client':failure.error==='invalid_grant'?'invalid_grant':'authorization_failed');
      }
      const tokens=await response.json();
      const profile=await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{headers:{Authorization:'Bearer '+tokens.access_token},signal:AbortSignal.timeout(20000)});
      const user=profile.ok?await profile.json():{};
      if(user.email?.toLowerCase()!=='odontopersonnallite.admin@gmail.com'||!user.verified_email)throw Error('wrong_account');
      if(!tokens.refresh_token)throw Error('refresh_missing');
      const granted=new Set((tokens.scope||'').split(' '));
      if(!granted.has('https://www.googleapis.com/auth/drive.file'))throw Error('scope_missing');
      const protectedValue=protectSecret(JSON.stringify({client_id:auth.client_id,client_secret:auth.client_secret,refresh_token:tokens.refresh_token,email:user.email}));
      await fs.mkdir('backups',{recursive:true});
      await fs.writeFile('backups/google-oauth.dpapi',protectedValue,{flag:'wx',mode:0o600});
      finished=true;
      return send(200,'<h2>Autorização concluída</h2><p>Conta da clínica confirmada. Credenciais protegidas no Windows, em pasta ignorada pelo Git. Nenhum contato foi exportado e o backup automático ainda não foi ativado.</p><p>Avise no chat que esta tela apareceu.</p>');
    }
    send(404,'<p>Página não encontrada.</p>');
  }catch(error){
    const messages={invalid_client:'O Google recusou o ID ou a chave secreta. Confira se a chave está ativa no mesmo cliente.',invalid_grant:'A autorização expirou ou já foi usada. Comece novamente.',authorization_failed:'O Google não concluiu a troca da autorização.',wrong_account:'A conta autorizada não foi confirmada como a conta administrativa da clínica.',refresh_missing:'O Google não forneceu autorização para acesso automático. Comece novamente e confira o consentimento.',scope_missing:'A permissão de arquivos do Drive não foi concedida.',protection_failed:'O Windows não conseguiu proteger as credenciais.',EEXIST:'Já existe uma autorização protegida no computador. Avise no chat para verificarmos sem sobrescrever.'};
    const known=messages[error.message]||messages[error.code];
    const network=error.name==='TimeoutError'||error.message==='fetch failed';
    console.error('Autorização local:',known?Object.keys(messages).find(key=>messages[key]===known):network?'network_failed':'local_failed');
    send(400,`<p>${known||(network?'Não foi possível conectar ao Google.':'Falha local ao processar a autorização.')}</p><p><a href="/">Voltar ao início e tentar novamente</a></p>`);
  }
});
server.requestTimeout=30000;server.headersTimeout=10000;
server.listen(8765,'127.0.0.1',()=>console.log('Tela privada disponível em http://127.0.0.1:8765/'));
server.on('error',()=>{console.error('Não foi possível abrir a porta local.');process.exitCode=1;});
setTimeout(()=>server.close(),30*60*1000).unref();
