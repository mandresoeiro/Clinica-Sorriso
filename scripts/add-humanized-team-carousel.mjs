import fs from 'node:fs/promises';
const root='landing-pages/tratamento-humanizado/web/';
const photos=[["equipe-sonia","Dra. Sônia Almeida, CRO-PA 2638."],["equipe-fabienne","Dra. Fabienne de Freitas Rodrigues, Mestre e Especialista em Endodontia. CRO/PA 8997."],["equipe-nayra-odontologia","Nayra Martins, Odontologia."]];
const group=duplicate=>`<div class="care-team__group"${duplicate?' aria-hidden="true" inert':''}>${photos.map(([name,alt])=>`<figure><img src="assets/${name}.webp" width="900" height="1125" loading="lazy" decoding="async" alt="${duplicate?'':alt}"></figure>`).join('')}</div>`;
const section=`<section class="care-team" aria-labelledby="care-team-title"><div class="wrap"><p class="eyebrow">NOSSA EQUIPE</p><h2 id="care-team-title">Pessoas que cuidam de você.</h2><div class="care-team__viewport" role="region" aria-label="Apresentação da equipe"><div class="care-team__track">${group(false)}${group(true)}</div></div><button class="care-team__pause" type="button" aria-pressed="false">Pausar movimento</button></div></section>`;
let html=await fs.readFile(root+'index.html','utf8');
if(!html.includes('id="care-team-title"')){
 const faq=/<section\b[^>]*id="duvidas"[^>]*>/;
 html=faq.test(html)?html.replace(faq,match=>section+match):html.replace('</main>',section+'</main>');
 await fs.writeFile(root+'index.html',html);
}
for(const file of ['scripts/build-cloudflare-landing.mjs','scripts/prepare-humanized-landing.mjs']){
 let source=await fs.readFile(file,'utf8');
 const prefix=file.includes('build-')?'assets/':'';
 if(!source.includes(prefix+'equipe-sonia.webp'))source=source.replace(`'${prefix}simbolo.svg',`, `'${prefix}simbolo.svg',`+photos.map(([name])=>`'${prefix}${name}.webp',`).join(''));
 await fs.writeFile(file,source);
}
