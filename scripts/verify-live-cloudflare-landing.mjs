import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='https://odontopersonnallite.com.br/tratamento-humanizado/';
const requestId=process.argv[2];if(!requestId)throw Error('Provide test UUID');
const get=path=>fetch(base+path,{signal:AbortSignal.timeout(20000)});
const page=await get('');assert.equal(page.status,200);assert.match(await page.text(),/Tratamento Odontológico Humanizado em Belém/);
const health=await get('api/health');assert.equal(health.status,200);assert.equal((await health.json()).database,'ready');
const config=await get('api/contact/config');assert.equal(config.status,200);
const {csrfToken}=await config.json();const cookie=config.headers.get('set-cookie').split(';')[0];
const payload={name:'TESTE TECNICO - IGNORAR',phone:'91000000000',treatment:'Quero uma avaliação',period:'',acknowledged:true,request_id:requestId,website:''};
async function post(){return fetch(base+'api/contact/requests',{method:'POST',headers:{Origin:new URL(base).origin,'Content-Type':'application/json',Cookie:cookie,'X-CSRF-Token':csrfToken},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)})}
const first=await post();assert.equal(first.status,201);assert.equal((await first.json()).status,'received');
const repeat=await post();assert.equal(repeat.status,200);assert.equal((await repeat.json()).status,'received');
const noList=await get('api/requests');assert.equal(noList.status,404);
const home=await fetch(new URL('/',base),{signal:AbortSignal.timeout(20000)});assert.equal(home.status,200);
const www=await fetch(base.replace('https://','https://www.'),{signal:AbortSignal.timeout(20000)});assert.equal(www.status,200);
const report={page:200,database:'ready',first_post:201,repeat_post:200,public_listing:404,main_site:200,www_page:200,test_request_id:requestId,checked_at:new Date().toISOString()};
await fs.writeFile('output/cloudflare-landing/live-verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
