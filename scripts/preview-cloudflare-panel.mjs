import http from 'node:http';
import fs from 'node:fs/promises';
const root=new URL('../infra/cloudflare/panel/',import.meta.url),base='/tratamento-humanizado/painel/';
const items=[
 {request_id:'11111111-1111-4111-8111-111111111111',name:'Contato de demonstração 01',phone:'91000000001',treatment:'Prótese Dentária',status:'novo',created_at:'2026-10-21 11:00:00'},
 {request_id:'22222222-2222-4222-8222-222222222222',name:'Contato de demonstração 02',phone:'91000000002',treatment:'Clínica Geral',status:'em_atendimento',created_at:'2026-10-21 10:30:00'},
 {request_id:'33333333-3333-4333-8333-333333333333',name:'Contato de demonstração 03',phone:'91000000003',treatment:'Implante Dentário',status:'agendado',created_at:'2026-10-21 10:00:00'}
];
items.forEach((item,index)=>{item.campaign=index===0?'urgencia-protese-implante':'tratamento-humanizado';item.period=index===0?'Manhã':''});
const history=[],workflows=new Map();
function json(res,data){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data))}
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:4299');
  if(url.pathname===base+'api/session')return json(res,{email:'demo@example.test · dados fictícios',csrfToken:'local-preview',expiresAt:Math.floor(Date.now()/1000)+3600});
  if(url.pathname===base+'api/reminders')return json(res,{reminders:[]});
  if(url.pathname===base+'api/workflow'){
   const id=url.searchParams.get('id');
   if(req.method==='GET')return json(res,{workflow:workflows.get(id)||{assignee:'',callback_at:'',appointment_at:'',professional:'',version:0}});
   let text='';for await(const c of req){text+=c;if(text.length>1024)throw Error()}
   const data=JSON.parse(text);workflows.set(data.request_id,{...data,version:data.version+1,updated_by:'demo@example.test',updated_at:new Date().toISOString()});return json(res,{status:'updated'});
  }
  if(url.pathname===base+'api/detail'){const record=items.find(i=>i.request_id===url.searchParams.get('id'));if(!record){res.writeHead(404);return res.end()}return json(res,{record,history:history.filter(e=>e.request_id===record.request_id)})}
  if(url.pathname===base+'api/requests'){
   const state=url.searchParams.get('status'),q=(url.searchParams.get('q')||'').toLowerCase(),campaign=url.searchParams.get('campaign'),from=url.searchParams.get('from'),to=url.searchParams.get('to'),order=url.searchParams.get('order');
   const filtered=items.filter(i=>(!state||i.status===state)&&(!campaign||i.campaign===campaign)&&(!from||i.created_at.slice(0,10)>=from)&&(!to||i.created_at.slice(0,10)<=to)&&(!q||i.name.toLowerCase().includes(q)||i.phone.includes(q)));
   const ranking={novo:0,em_atendimento:1,agendado:2,arquivado:3};filtered.sort((a,b)=>order==='recent'?b.created_at.localeCompare(a.created_at):order==='queue'?ranking[a.status]-ranking[b.status]||a.created_at.localeCompare(b.created_at):a.created_at.localeCompare(b.created_at));
   const summary={novo:0,em_atendimento:0,agendado:0,arquivado:0};for(const item of items)summary[item.status]++;
   return json(res,{requests:filtered,summary,pagination:{page:1,pages:1,total:filtered.length}});
  }
  if(url.pathname===base+'api/status'&&req.method==='POST'){
   let body='';for await(const c of req){body+=c;if(body.length>1024)throw Error()}
   const data=JSON.parse(body),item=items.find(i=>i.request_id===data.request_id);if(!item)throw Error();if(item.status!==data.expected_status){res.writeHead(409);return res.end('{}')}history.unshift({request_id:item.request_id,old_status:item.status,new_status:data.status,actor:'demo@example.test',created_at:new Date().toISOString()});item.status=data.status;return json(res,{status:'updated'});
  }
  if(url.pathname==='/tratamento-humanizado/assets/simbolo.svg'){
   const logo=await fs.readFile(new URL('../public/images/brand/symbol.svg',import.meta.url));res.writeHead(200,{'Content-Type':'image/svg+xml'});return res.end(logo);
  }
  const file=url.pathname===base?'index.html':url.pathname.startsWith(base)?url.pathname.slice(base.length):'';
  if(!['index.html','panel.css','panel.js'].includes(file)){res.writeHead(404);return res.end()}
  let body=await fs.readFile(new URL(file,root));
  if(file==='panel.js')body=Buffer.concat([body,Buffer.from('\n'),await fs.readFile(new URL('workflow.js',root))]);
  if(file==='panel.css')body=Buffer.concat([body,Buffer.from('\n'),await fs.readFile(new URL('enhancements.css',root))]);
  if(file==='index.html')body=Buffer.from(body.toString().replace('ADMINISTRAÇÃO E RECEPÇÃO','DEMONSTRAÇÃO · DADOS FICTÍCIOS').replace('href="/cdn-cgi/access/logout"','href="'+base+'"'));
  res.writeHead(200,{'Content-Type':file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html','Cache-Control':'no-store'});res.end(body);
 }catch{res.writeHead(500);res.end('Preview error')}
}).listen(4299,'127.0.0.1',()=>console.log('Prévia local com dados fictícios: http://127.0.0.1:4299'+base));
