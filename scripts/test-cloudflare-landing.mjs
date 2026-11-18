import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import vm from 'node:vm';
import {api} from '../infra/cloudflare/landing/api.mjs';
import worker from '../output/cloudflare-landing/worker.mjs';
const db=new DatabaseSync(':memory:');
db.exec(fs.readFileSync('landing-pages/tratamento-humanizado/drizzle/0000_contact_requests.sql','utf8'));
const env={DB:{prepare(sql){let params=[];return {bind(...p){params=p;return this},async first(){return db.prepare(sql).get(...params)||null},async all(){return {results:db.prepare(sql).all(...params)}},async run(){return db.prepare(sql).run(...params)}}}}};
const origin='https://odontopersonnallite.com.br', base=origin+'/tratamento-humanizado/api/';
const config=await api(new Request(base+'contact/config'),env);const token=(await config.json()).csrfToken;
const headers={'Origin':origin,'Content-Type':'application/json','Cookie':'clinic_contact_csrf='+token,'X-CSRF-Token':token,'CF-Connecting-IP':'192.0.2.1'};
const payload={name:'Teste fictício',phone:'91000000000',treatment:'Clínica Geral',period:'',acknowledged:true,request_id:crypto.randomUUID(),website:''};
const post=(body=payload,h=headers)=>api(new Request(base+'contact/requests',{method:'POST',headers:h,body:JSON.stringify(body)}),env);
assert.equal((await post()).status,201);assert.equal((await post()).status,200);
assert.equal((await post({...payload,name:'Outro nome'})).status,409);
const mainId=crypto.randomUUID();assert.equal((await post({...payload,source:'site-principal',request_id:mainId},{...headers,'CF-Connecting-IP':'192.0.2.2'})).status,201);assert.equal(db.prepare('SELECT campaign FROM contact_requests WHERE request_id=?').get(mainId).campaign,'site-principal');db.prepare('DELETE FROM contact_requests WHERE request_id=?').run(mainId);
assert.equal((await post(payload,{...headers,Origin:'https://other.test'})).status,403);
assert.equal((await post(payload,{...headers,'X-CSRF-Token':'bad'})).status,403);
assert.equal((await post({...payload,acknowledged:false})).status,400);
assert.equal((await post({...payload,owner_id:'admin'})).status,400);
assert.equal((await post({...payload,website:'bot'})).status,400);
assert.equal((await post({...payload,name:'x'.repeat(5000)})).status,413);
const many=await Promise.all(Array.from({length:12},()=>post({...payload,request_id:crypto.randomUUID()})));
assert.equal(many.filter(r=>r.status===201).length,7);
assert.equal(many.filter(r=>r.status===429).length,5);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM contact_requests').get().n,8);
for(const pathname of ['requests','contact/requests']){
 const read=await api(new Request(base+pathname,{headers:{'oai-authenticated-user-id':'pretend-owner'}}),env);
 assert.ok([404,405].includes(read.status));
 assert.doesNotMatch(await read.text(),/Teste fictício/);
}
assert.equal((await api(new Request(base+'health'),env)).status,200);
assert.equal((await api(new Request(base+'health'),{})).status,503);
const page=await worker.fetch(new Request(origin+'/tratamento-humanizado/'),env);
const html=await page.text();assert.equal(page.status,200);assert.match(html,/canonical/);assert.doesNotMatch(html,/Solicitações da minha conta|prévia privada/);
assert.equal((await worker.fetch(new Request(origin+'/tratamento-humanizado'),env)).status,308);
assert.equal((await worker.fetch(new Request(origin+'/'),env)).status,404);
for(const file of ['styles.css','app.js','contact.js','assets/rosto-sorriso-768.webp','assets/rosto-sorriso-1200.webp'])assert.equal((await worker.fetch(new Request(origin+'/tratamento-humanizado/'+file),env)).status,200);
const source=fs.readFileSync('output/cloudflare-landing/contact.js','utf8');
async function submit(ok,callback=false){
 let handler;const calls=[];let navigation=null,hideToast;const toast={hidden:true};
 const fields={nome:{value:'Teste fictício'},telefone:{value:'91000000000',setCustomValidity(){},reportValidity(){}},tratamento:{value:'Clínica Geral'},acknowledged:{checked:true}};
 const status={classList:{remove(){},add(){}}},fallback={},button={};
 const form={elements:fields,reportValidity:()=>true,addEventListener(type,fn){if(type==='submit')handler=fn},querySelector:()=>button};
 vm.runInNewContext(source,{document:{querySelector:q=>q==='#whatsapp-form'?form:q==='#form-feedback'?status:q==='#callback-success'?toast:fallback},crypto,encodeURIComponent,AbortController,setTimeout:(fn,ms)=>{if(ms===3000){hideToast=fn;return 123456}return setTimeout(fn,ms)},clearTimeout,Event,CustomEvent,window:{dispatchEvent(){},location:{assign:url=>navigation=url}},fetch:async(url,options)=>{calls.push([url,options]);return calls.length===1?{ok:true,json:async()=>({csrfToken:token})}:{ok,status:ok?201:503,json:async()=>({status:ok?'received':'unavailable'})}}});
 await handler({preventDefault(){},...(callback?{submitter:{value:"callback"}}:{})});return {calls,navigation,fallback,status,toast,hideToast};
}
const good=await submit(true);assert.equal(good.calls[0][0],'/tratamento-humanizado/api/contact/config');assert.equal(good.calls[1][0],'/tratamento-humanizado/api/contact/requests');assert.equal(new URL(good.navigation).hostname,'wa.me');
const callback=await submit(true,true);assert.equal(callback.navigation,null);assert.equal(callback.fallback.hidden,true);assert.equal(callback.status.textContent,'Obrigado pelo contato! Recebemos sua solicitação. Nossa recepção ligará para você conforme a disponibilidade.');assert.equal(JSON.parse(callback.calls[1][1].body).source,'ligacao');
assert.equal(callback.toast.hidden,false);assert.equal(typeof callback.hideToast,'function');callback.hideToast();assert.equal(callback.toast.hidden,true);assert.match(callback.status.textContent,/Obrigado pelo contato/);
const failedCallback=await submit(false,true);assert.equal(failedCallback.toast.hidden,true);assert.equal(failedCallback.hideToast,undefined);
const bad=await submit(false);assert.equal(bad.navigation,null);assert.equal(bad.fallback.hidden,false);
console.log('OK: gravação, repetição, limite concorrente, validação, CSRF, ausência de consulta pública, arquivos e abertura do WhatsApp após confirmação.');
db.close();

