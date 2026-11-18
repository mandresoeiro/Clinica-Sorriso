import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=path.join(root,'landing-pages/tratamento-humanizado/web');
const out=path.join(root,'output/cloudflare-landing');
await fs.mkdir(out,{recursive:true});
const prefix='/tratamento-humanizado/';
const files=['index.html','styles.css','app.js','contact.js','assets/simbolo.svg','assets/equipe-sonia-gola-padre.webp','assets/equipe-nayra-odontologia.webp','assets/equipe-fabienne-padrao.webp','assets/equipe-fernanda.webp','assets/equipe-ingrid.webp','assets/rosto-sorriso-480.webp','assets/conversa-ilustrativa-480.webp','assets/cuidado-ilustrativo-480.webp','assets/rosto-sorriso-768.webp','assets/rosto-sorriso-1200.webp','assets/conversa-ilustrativa-2026.webp','assets/cuidado-ilustrativo-2026.webp'];
for(const name of await fs.readdir(path.join(src,"assets/fonts")))files.push("assets/fonts/"+name);
const assets={};const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'};
for(const file of files){
 let body=await fs.readFile(path.join(src,file));
 if(file==='contact.js')body=Buffer.from(body.toString().replaceAll("'/api/contact/","'"+prefix+"api/contact/"));
 if(file==='index.html'){
  let s=body.toString().replace('<meta name="theme-color"','<link rel="canonical" href="https://odontopersonnallite.com.br/tratamento-humanizado/"><meta name="theme-color"')
    .replace('<a href="/solicitacoes">Solicitações da minha conta</a>','')
    .replace('banco hospedado desta página','banco de atendimento da clínica')
    .replace('Esta é uma prévia privada: o acesso aos registros exige identificação e fica restrito às solicitações da conta conectada.','O acesso aos registros é restrito à equipe autorizada da clínica. O registro não confirma uma consulta.');
  body=Buffer.from(s);
 }
 assets[prefix+file]={type:mime[path.extname(file)],data:body.toString('base64')};
}
for(const file of ['index.html','panel.css','panel.js','avatar.svg']){
 const body=await fs.readFile(path.join(root,'infra/cloudflare/panel',file));
 assets[prefix+'painel/'+file]={type:mime[path.extname(file)],data:body.toString('base64')};
}
assets[prefix+'painel/panel.js'].data=Buffer.from(Buffer.from(assets[prefix+'painel/panel.js'].data,'base64').toString()+'\n'+await fs.readFile(path.join(root,'infra/cloudflare/panel/workflow.js'),'utf8')+'\n'+await fs.readFile(path.join(root,'infra/cloudflare/panel/staff.js'),'utf8')+'\n'+await fs.readFile(path.join(root,'infra/cloudflare/panel/desk.js'),'utf8')).toString('base64');
const panelCss=Buffer.from(assets[prefix+'painel/panel.css'].data,'base64').toString()+'\n'+await fs.readFile(path.join(root,'infra/cloudflare/panel/enhancements.css'),'utf8')+'\n'+await fs.readFile(path.join(root,'infra/cloudflare/panel/desk.css'),'utf8')+'\n'+await fs.readFile(path.join(root,'infra/cloudflare/panel/profile.css'),'utf8');
assets[prefix+'painel/panel.css'].data=Buffer.from(panelCss).toString('base64');
let panelHtml=Buffer.from(assets[prefix+'painel/index.html'].data,'base64').toString();
for(const file of ['panel.css','panel.js']){
 const hash=createHash('sha256').update(assets[prefix+'painel/'+file].data).digest('hex').slice(0,12);
 panelHtml=panelHtml.replaceAll('"'+file+'"','"'+file+'?v='+hash+'"');
}
assets[prefix+'painel/index.html'].data=Buffer.from(panelHtml).toString('base64');
let html=Buffer.from(assets[prefix+'index.html'].data,'base64').toString();
for(const name of ['styles.css','app.js','contact.js']){
 const hash=createHash('sha256').update(assets[prefix+name].data).digest('hex').slice(0,12);
 html=html.replaceAll('"'+name+'"','"'+name+'?v='+hash+'"');
}
assets[prefix+'index.html'].data=Buffer.from(html).toString('base64');
const urgencyPrefix='/urgencia-protese-implante/';
for(const file of ['index.html','styles.css','assets/protese.webp']){
 const body=await fs.readFile(path.join(root,'landing-pages/urgencia-protese-implante/web',file));
 assets[urgencyPrefix+file]={type:mime[path.extname(file)],data:body.toString('base64')};
}
assets[urgencyPrefix+'app.js']=assets[prefix+'app.js'];
const urgencyContact=(await fs.readFile(path.join(src,'contact.js'),'utf8'))
 .replaceAll("'/api/contact/","'"+urgencyPrefix+"api/contact/")
 .replace('Conheci a página de atendimento humanizado','Conheci a página de urgência em prótese e implante')
 .replace('Gostaria de consultar os horários disponíveis.','Gostaria de consultar a disponibilidade de atendimento.');
assets[urgencyPrefix+'contact.js']={type:mime['.js'],data:Buffer.from(urgencyContact).toString('base64')};
let urgencyHtml=Buffer.from(assets[urgencyPrefix+'index.html'].data,'base64').toString();
for(const name of ['styles.css','app.js','contact.js']){
 const hash=createHash('sha256').update(assets[urgencyPrefix+name].data).digest('hex').slice(0,12);
 urgencyHtml=urgencyHtml.replaceAll('"'+name+'"','"'+name+'?v='+hash+'"');
}
assets[urgencyPrefix+'index.html'].data=Buffer.from(urgencyHtml).toString('base64');
for(const pagePrefix of [prefix,urgencyPrefix]){
 let page=Buffer.from(assets[pagePrefix+'index.html'].data,'base64').toString();
 for(const file of ['analytics.js','analytics.css','location.js','location.css']){
  const body=await fs.readFile(path.join(root,'infra/cloudflare/landing',file));
  assets[pagePrefix+file]={type:mime[path.extname(file)],data:body.toString('base64')};
  const hash=createHash('sha256').update(body).digest('hex').slice(0,12),url=pagePrefix+file+'?v='+hash;
  page=page.replace('</head>',(file.endsWith('.js')?'<script defer src="'+url+'"></script>':'<link rel="stylesheet" href="'+url+'">')+'</head>');
 }
 const privacy='<p>Cookies de análise são opcionais. Somente após sua autorização carregamos o Google Analytics para medir visitas, cadastros concluídos e cliques no WhatsApp. Não enviamos nome, telefone, tratamento escolhido, texto da mensagem, parâmetros da URL ou o endereço de origem da visita. As páginas são identificadas como lp1 e lp2. A autorização pode ser retirada pelo botão Cookies. Sua escolha é lembrada neste navegador por até 180 dias. <a href="https://policies.google.com/technologies/partner-sites?hl=pt-BR" target="_blank" rel="noopener noreferrer">Como o Google usa os dados</a>.</p>';
 page=page.replace('</dialog>',privacy+'<p>O mapa interativo é carregado somente quando você escolhe Exibir mapa. Ele é fornecido pelo Google, que recebe os dados técnicos da conexão conforme suas próprias políticas. O botão Abrir rota usa sua origem escolhida no Google Maps e o endereço da clínica como destino.</p><p>Para dúvidas sobre seus dados, peça à recepção o encaminhamento ao responsável por privacidade pelo WhatsApp (91) 98188-8353. Arquivar uma solicitação não elimina o registro. Identificação jurídica informada pela clínica: S&amp;F serviços odontológicos — CNPJ 55.062.946/0001-74. Responsável pelas solicitações de privacidade: Dra. Sônia Almeida, por encaminhamento da recepção no WhatsApp (91) 98188-8353. Contatos recebidos pelo site que não tenham continuidade serão revisados após seis meses do último atendimento pela recepção, para decidir sobre eliminação ou conservação justificada. A revisão é manual; não há exclusão automática. Esse critério não se aplica a prontuários odontológicos. <a href="/privacidade">Leia o aviso completo de privacidade</a>.</p></dialog>');
 const directions='https://www.google.com/maps/dir/?api=1&amp;destination=Travessa%20Almirante%20Wandenkolk%2C%201243%2C%20Bel%C3%A9m%2C%20PA';
 page=page.replaceAll('https://www.google.com/maps/search/?api=1&amp;query=Travessa%20Almirante%20Wandenkolk%2C%201243%2C%20Bel%C3%A9m%2C%20PA',directions);
 const locationStart=page.indexOf('id="localizacao"');
 const locationEnd=page.indexOf('</section>',locationStart);
 if(locationStart<0||locationEnd<0)throw Error('Seção de localização ausente');
 const map='<div class="wrap clinic-map-wrap"><div class="clinic-map" data-clinic-map><div class="clinic-map-placeholder"><span aria-hidden="true">⌖</span><strong>Encontre a nossa clínica.</strong><p>Travessa Almirante Wandenkolk, 1243<br>Belém · Pará</p><button class="btn" type="button" data-load-map>Exibir mapa do Google</button><small>Ao exibir o mapa, você se conecta ao Google Maps. Você também pode abrir a rota diretamente.</small></div><div class="clinic-map-caption"><span>Destino: Travessa Almirante Wandenkolk, 1243, Belém/PA</span><a href="'+directions+'" target="_blank" rel="noopener noreferrer">Abrir rota até a clínica ↗</a></div></div></div>';
 page=page.slice(0,locationEnd)+map+page.slice(locationEnd);
 assets[pagePrefix+'index.html'].data=Buffer.from(page).toString('base64');
}
const api=(await fs.readFile(path.join(root,'infra/cloudflare/landing/api.mjs'),'utf8')).replace('export async function api','async function api');
const panelAuth=(await fs.readFile(path.join(root,'infra/cloudflare/panel/auth.mjs'),'utf8')).replace('export async function authorizePanel','async function authorizePanel');
const operationSource=(await fs.readFile(path.join(root,'infra/cloudflare/panel/operations-api.mjs'),'utf8')).replace('export {receptionOperations};','');
const panelApiSource=(await fs.readFile(path.join(root,'infra/cloudflare/panel/api.mjs'),'utf8')).replace("import {receptionOperations} from './operations-api.mjs';",'').replace('export async function panelApi','async function panelApi');
const handler=`
const assets=${JSON.stringify(assets)};
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(!['odontopersonnallite.com.br','www.odontopersonnallite.com.br'].includes(url.hostname))return new Response('Not found',{status:404});
 if(url.protocol!=='https:'){url.protocol='https:';return Response.redirect(url.toString(),308)}
 if(url.pathname==='/tratamento-humanizado'){url.pathname+='/';return Response.redirect(url.toString(),308)}
 if(url.pathname==='/urgencia-protese-implante'){url.pathname+='/';return Response.redirect(url.toString(),308)}
 if(url.pathname==='/tratamento-humanizado/painel'){url.pathname+='/';return Response.redirect(url.toString(),308)}
 if(url.pathname.startsWith('/tratamento-humanizado/painel/')){
  const access=await authorizePanel(request,env);
  if(!access.user){
   if(url.pathname.includes('/api/'))return panelJson({error:access.error,reason:access.reason},access.status);
   return new Response('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Recepção | Odonto Personnallite</title><style>body{margin:0;background:#f6f6ef;color:#17383b;font:16px/1.7 Arial,sans-serif;display:grid;min-height:100vh;place-items:center}main{max-width:480px;padding:40px}small{letter-spacing:.12em;font-size:10px}h1{font:40px/1.15 Georgia,serif}p{color:#60705f}a{color:#17383b;text-underline-offset:5px}</style><main><small>ODONTO PERSONNALLITE · RECEPÇÃO</small><h1>Acesso restrito.</h1><p>O login desta área está em preparação. As solicitações continuam sendo recebidas pelo site.</p><p>O acesso aos contatos será liberado somente para a equipe autorizada.</p><a href="/tratamento-humanizado/">Voltar ao site →</a></main></html>',{status:access.status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",'Referrer-Policy':'no-referrer'}});
  }
  if(url.pathname.startsWith('/tratamento-humanizado/painel/api/'))return panelApi(request,env,access.user);
 }
 if(url.pathname.startsWith('/tratamento-humanizado/api/')||url.pathname.startsWith('/urgencia-protese-implante/api/'))return api(request,env);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const key=url.pathname==='/tratamento-humanizado/'?'/tratamento-humanizado/index.html':url.pathname==='/urgencia-protese-implante/'?'/urgencia-protese-implante/index.html':url.pathname==='/tratamento-humanizado/painel/'?'/tratamento-humanizado/painel/index.html':url.pathname;
 const a=assets[key];if(!a)return new Response('Not found',{status:404});
 return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(a.data),c=>c.charCodeAt(0)),{headers:{
 'Content-Type':a.type,'Cache-Control':(key.endsWith('.html')||key.includes('/painel/'))?'no-store':'public, max-age=3600',
 'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
 'Content-Security-Policy':key.includes('/painel/')?"default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'":"default-src 'self'; img-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; style-src 'self'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com; frame-src https://www.google.com; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
 'Permissions-Policy':'camera=(), microphone=(), geolocation=()'
 }});
}};
`;
await fs.writeFile(path.join(out,'worker.mjs'),api+'\n'+panelAuth+'\n'+operationSource+'\n'+panelApiSource+'\n'+handler);
await fs.writeFile(path.join(out,'contact.js'),Buffer.from(assets[prefix+'contact.js'].data,'base64'));
console.log('Worker da landing gerado em '+out);
