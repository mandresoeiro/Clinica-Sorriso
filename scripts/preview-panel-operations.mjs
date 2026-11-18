// Isolated preview: synthetic data in memory, loopback only, never production DB.
import http from 'node:http';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {panelApi} from '../infra/cloudflare/panel/api.mjs';
const db=new DatabaseSync(':memory:');
for(const file of ['landing-pages/tratamento-humanizado/drizzle/0000_contact_requests.sql',...['schema.sql','workflow.sql','staff-photos.sql','operations.sql','agenda.sql'].map(f=>'infra/cloudflare/panel/'+f)])db.exec(fs.readFileSync(file,'utf8'));
const prepare=sql=>{let args=[];return {sql,get args(){return args},bind(...a){args=a;return this},async first(){return db.prepare(sql).get(...args)||null},async all(){return {results:db.prepare(sql).all(...args)}}}};
const env={PANEL_ADMIN_EMAILS:'demonstracao@example.test',DB:{prepare,async batch(s){db.exec('BEGIN');try{const results=s.map(x=>{const q=db.prepare(x.sql);return q.columns().length?{results:q.all(...x.args),meta:{changes:0}}:{results:[],meta:{changes:q.run(...x.args).changes}}});db.exec('COMMIT');return results}catch(e){db.exec('ROLLBACK');throw e}}}};
const now=new Date(),day=new Date(now.getTime()-10800000).toISOString().slice(0,10);
for(let i=1;i<=3;i++){
 const id=`00000000-0000-4000-8000-00000000000${i}`;
 db.prepare("INSERT INTO contact_requests (request_id,name,phone,treatment,campaign,status,fingerprint,rate_key,acknowledged_at) VALUES (?,?,?,?,?,?,?,'demo',?)").run(id,['Marina · exemplo fictício','Lucas · exemplo fictício','Ana · exemplo fictício'][i-1],'9199999000'+i,'Quero uma avaliação',i===3?'manual-whatsapp':'tratamento-humanizado',i===2?'em_atendimento':'novo','demo'+i,now.toISOString());
 if(i===2)db.prepare("INSERT INTO contact_request_workflow (request_id,assignee,callback_at,updated_by) VALUES (?,'atendente-1',?,'demonstracao@example.test')").run(id,new Date(now.getTime()-3600000).toISOString());
 if(i===3)db.prepare("INSERT INTO reception_appointments (request_id,professional,starts_at,ends_at,duration,status,updated_by) VALUES (?,'Dra. Sônia Almeida',?,?,45,'confirmed','demonstracao@example.test')").run(id,day+'T18:00:00.000Z',day+'T18:45:00.000Z');
}
const base='/tratamento-humanizado/painel/';
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1:4301');
 if(url.pathname.startsWith(base+'api/')){
  const headers=new Headers(req.headers);if(headers.get('origin')==='http://127.0.0.1:4301')headers.set('origin','https://odontopersonnallite.com.br');
  const chunks=[];for await(const c of req)chunks.push(c);
  const response=await panelApi(new Request('https://odontopersonnallite.com.br'+url.pathname+url.search,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})}),env,{email:'demonstracao@example.test',expiresAt:Math.floor(Date.now()/1000)+3600});
  res.writeHead(response.status,Object.fromEntries(response.headers));return res.end(Buffer.from(await response.arrayBuffer()));
 }
 let file=url.pathname===base?'index.html':url.pathname.slice(base.length),body,type;
 if(url.pathname==='/tratamento-humanizado/assets/simbolo.svg'){body=fs.readFileSync('landing-pages/tratamento-humanizado/web/assets/simbolo.svg');type='image/svg+xml'}
 else if(file==='index.html'){body=fs.readFileSync('infra/cloudflare/panel/index.html','utf8').replace('ADMINISTRAÇÃO E RECEPÇÃO','DEMONSTRAÇÃO · DADOS FICTÍCIOS');type='text/html; charset=utf-8'}
 else if(file==='panel.js'){body=['panel.js','workflow.js','staff.js','desk.js'].map(f=>fs.readFileSync('infra/cloudflare/panel/'+f,'utf8')).join('\n');type='text/javascript'}
 else if(file==='panel.css'){body=['panel.css','enhancements.css','desk.css','profile.css'].map(f=>fs.readFileSync('infra/cloudflare/panel/'+f,'utf8')).join('\n');type='text/css'}
 else if(file==='avatar.svg'){body=fs.readFileSync('infra/cloudflare/panel/avatar.svg');type='image/svg+xml'}else{res.writeHead(404);return res.end()}
 res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body);
 }catch(e){console.error(e.message);res.writeHead(500);res.end('Preview indisponível')}}).listen(4301,'127.0.0.1',()=>console.log('Prévia fictícia: http://127.0.0.1:4301'+base));
