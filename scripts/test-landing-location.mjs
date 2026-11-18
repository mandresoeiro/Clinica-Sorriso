import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import worker from '../output/cloudflare-landing/worker.mjs';
const address='Travessa Almirante Wandenkolk, 1243, Belém, PA';
for(const path of ['/tratamento-humanizado/','/urgencia-protese-implante/']){
 const response=await worker.fetch(new Request('https://odontopersonnallite.com.br'+path),{});
 const dom=new JSDOM(await response.text(),{url:'https://odontopersonnallite.com.br'+path,runScripts:'outside-only'}),doc=dom.window.document;
 const section=doc.querySelector('#localizacao');assert.equal(section.querySelectorAll('[data-clinic-map]').length,1);
 assert.equal(doc.querySelectorAll('iframe').length,0);
 for(const link of section.querySelectorAll('a[href*="google.com/maps"]')){
  const u=new URL(link.href);assert.equal(u.pathname,'/maps/dir/');assert.equal(u.searchParams.get('destination'),address);assert.equal(u.searchParams.has('origin'),false);
 }
 dom.window.eval(fs.readFileSync('infra/cloudflare/landing/location.js','utf8'));
 doc.querySelector('[data-load-map]').click();
 const frame=doc.querySelector('iframe');const embedded=new URL(frame.src);assert.equal(embedded.origin,'https://www.google.com');assert.equal(embedded.pathname,'/maps/embed');assert.match(embedded.searchParams.get('pb'),/Wandenkolk, 1243 - Umarizal, Belém - PA/);assert.equal(frame.loading,'eager');assert.equal(frame.referrerPolicy,'strict-origin-when-cross-origin');assert.match(frame.title,/1243/);assert.equal(doc.querySelector('.clinic-map-placeholder'),null);
 assert.match(response.headers.get('Content-Security-Policy'),/frame-src https:\/\/www.google.com;/);
 dom.window.close();
}
console.log('OK: endereço e destino exatos nas duas páginas, rota sem origem fixa e mapa somente após clique.');
