import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const base='https://odontopersonnallite.com.br/tratamento-humanizado/';
const get=(path,headers={})=>fetch(base+path,{headers,redirect:'manual',signal:AbortSignal.timeout(20000)});
const landing=await get('');assert.equal(landing.status,200);
const health=await get('api/health');assert.equal(health.status,200);assert.equal((await health.json()).database,'ready');
const page=await get('painel/');assert.equal(page.status,503);assert.match(await page.text(),/Acesso restrito/);
const api=await get('painel/api/requests',{'Cf-Access-Authenticated-User-Email':'fake@example.test','oai-authenticated-user-id':'owner'});assert.equal(api.status,503);const body=await api.text();assert.doesNotMatch(body,/phone|requests|TESTE TECNICO/);
const report={landing:200,database:'ready',panel_without_config:503,forged_identity_rejected:503,checked_at:new Date().toISOString()};
await fs.writeFile('output/cloudflare-panel/live-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
