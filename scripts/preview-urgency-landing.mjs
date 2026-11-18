import http from 'node:http';
import worker from '../output/cloudflare-landing/worker.mjs';
http.createServer(async(req,res)=>{
 try{
  const path=new URL(req.url,'http://127.0.0.1:4301').pathname;
  if(req.method!=='GET'||path.includes('/api/')||path.includes('/painel')){res.writeHead(503);return res.end('Prévia visual local, sem gravação de dados')}
  const result=await worker.fetch(new Request('https://odontopersonnallite.com.br'+req.url),{});
  res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview error')}
}).listen(4301,'127.0.0.1',()=>console.log('http://127.0.0.1:4301/urgencia-protese-implante/'));
