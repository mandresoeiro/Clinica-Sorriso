import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import worker from '../output/cloudflare-landing/worker.mjs';
const source=fs.readFileSync('infra/cloudflare/landing/analytics.js','utf8');
const id='G-LLJLL8E1PH',key='clinic_analytics_consent_v1';
function setup(path='/tratamento-humanizado/',saved){
 const dom=new JSDOM('<!doctype html><head></head><body><input value="Maria 91999999999"><a href="https://wa.me/559181888353?text=Maria%2091999999999%20Implante">WhatsApp</a></body>',{url:'https://odontopersonnallite.com.br'+path+'?email=private@example.test#segredo',runScripts:'outside-only',referrer:'https://example.test/?nome=Maria'});
 if(saved)dom.window.localStorage.setItem(key,JSON.stringify(saved));
 dom.window.eval(source);return dom;
}
const commands=w=>w.dataLayer.map(a=>Array.from(a));
const events=w=>commands(w).filter(a=>a[0]==='event');
const click=(w,s)=>w.document.querySelector(s).click();
let dom=setup(),w=dom.window;
assert.equal(w.document.querySelectorAll('script[src*="googletagmanager"]').length,0);
w.dispatchEvent(new w.CustomEvent('clinic:lead-saved',{detail:{id:'test-id'}}));assert.equal(events(w).length,0);
click(w,'[data-consent="reject"]');assert.equal(w.document.querySelectorAll('script').length,0);assert.equal(w['ga-disable-'+id],true);
click(w,'.analytics-preferences');click(w,'[data-consent="accept"]');
assert.equal(w.document.querySelectorAll('script[src*="googletagmanager"]').length,1);assert.equal(events(w).filter(e=>e[1]==='page_view').length,1);
for(let i=0;i<2;i++)w.dispatchEvent(new w.CustomEvent('clinic:lead-saved',{detail:{id:'test-id'}}));
assert.equal(events(w).filter(e=>e[1]==='generate_lead').length,1);
click(w,'a[href^="https://wa.me"]');assert.equal(events(w).filter(e=>e[1]==='whatsapp_click').length,1);
const outbound=JSON.stringify(commands(w));assert.doesNotMatch(outbound,/Maria|91999999999|private@example|segredo|Implante|test-id|wa\.me/);
assert.match(outbound,/https:\/\/odontopersonnallite.com.br\/landing\/lp1/);
const config=commands(w).find(c=>c[0]==='config')[2];assert.equal(config.send_page_view,false);assert.equal(config.allow_google_signals,false);assert.equal(config.page_referrer,'');
w.document.cookie='_ga=demo; Path=/';w.document.cookie='_ga_LLJLL8E1PH=demo; Path=/';
click(w,'.analytics-preferences');click(w,'[data-consent="reject"]');const before=events(w).length;
w.dispatchEvent(new w.Event('clinic:whatsapp-open'));assert.equal(events(w).length,before);assert.equal(w['ga-disable-'+id],true);assert.doesNotMatch(w.document.cookie,/_ga/);
dom.window.close();
dom=setup('/urgencia-protese-implante/',{value:'granted',at:Date.now()});w=dom.window;assert.equal(events(w)[0][2].landing_id,'lp2');assert.equal(w.document.querySelector('.analytics-consent').hidden,true);w.close();
dom=setup('/tratamento-humanizado/',{value:'granted',at:Date.now()-181*86400000});w=dom.window;assert.equal(w.document.querySelectorAll('script').length,0);assert.equal(w.document.querySelector('.analytics-consent').hidden,false);w.close();
dom=setup('/tratamento-humanizado/painel/');assert.equal(dom.window.document.querySelector('.analytics-consent'),null);dom.window.close();
for(const path of ['/tratamento-humanizado/','/urgencia-protese-implante/']){
 const r=await worker.fetch(new Request('https://odontopersonnallite.com.br'+path),{}),html=await r.text();
 assert.match(html,/analytics.js\?v=/);assert.match(html,/Cookies de análise são opcionais/);assert.match(r.headers.get('Content-Security-Policy'),/https:\/\/www.googletagmanager.com/);
}
console.log('OK: sem coleta antes do consentimento/recusa, aceite, revogação, expiração, eventos permitidos, deduplicação, URLs sanitizadas e exclusão do painel.');
