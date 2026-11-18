import fs from 'node:fs/promises';
const base = new URL('../landing-pages/tratamento-humanizado/', import.meta.url);
async function edit(file, fn) { const url = new URL(file, base); await fs.writeFile(url, fn(await fs.readFile(url, 'utf8'))); }
await edit('web/index.html', s => s
  .replace('src="assets/rosto-sorriso.png"', 'src="assets/rosto-sorriso-1200.webp" srcset="assets/rosto-sorriso-768.webp 768w, assets/rosto-sorriso-1200.webp 1200w" sizes="(max-width: 820px) calc(100vw - 48px), (max-width: 1350px) 52vw, 720px" decoding="async"')
  .replace('autocomplete="given-name"', 'autocomplete="name"')
  .replace('<aside class="whatsapp-card">', '<aside class="whatsapp-card" aria-labelledby="contact-title">')
  .replace('<h2>Vamos conversar?</h2>', '<h2 id="contact-title">Vamos conversar?</h2>')
  .replace('<form id="whatsapp-form">', '<form id="whatsapp-form" aria-describedby="contact-note">')
  .replace('<p class="form-note">', '<p class="form-note" id="contact-note">')
  .replace('</form>', '<noscript><p>Para conversar com a equipe, <a href="https://wa.me/559181888353">abra o WhatsApp</a>.</p></noscript></form>')
  .replace('<meta property="og:title" content="Um cuidado humano. Um sorriso com a sua história.">', '<meta property="og:title" content="Tratamento Odontológico Humanizado em Belém | Odonto Personnallite"><meta property="og:locale" content="pt_BR">'));
await edit('build.mjs', s => s.replace("'assets/rosto-sorriso.png','assets/planejamento.webp'", "'assets/rosto-sorriso-768.webp','assets/rosto-sorriso-1200.webp'"));
const prepare = new URL('./prepare-humanized-landing.mjs', import.meta.url);
await fs.writeFile(prepare, (await fs.readFile(prepare, 'utf8')).replace("'rosto-sorriso.png','planejamento.webp'", "'rosto-sorriso-768.webp','rosto-sorriso-1200.webp'"));
await edit('web/styles.css', s => s + `
/* Acessibilidade e leitura em telas menores */
.hero-copy,.whatsapp-card,.care-grid>div,.faq-grid>div{min-width:0}
.whatsapp-card input,.whatsapp-card select{font-size:16px}
.whatsapp-card input,.whatsapp-card select,.whatsapp-card button{scroll-margin-block:110px}
.whatsapp-card noscript a{text-decoration:underline}
.footer-bottom{gap:16px;flex-wrap:wrap}
.footer-bottom a,.footer-bottom button{min-height:44px;display:inline-flex;align-items:center}
.dental-visual:before{animation-iteration-count:2}
.dental-visual img{animation-iteration-count:2}
@media(max-width:820px){
  .menu-toggle{width:44px;height:44px;padding:10px}
  .services .service{padding:24px}
  .services .service p{font-size:14px}
  .section-note{font-size:12px}
}
@media(max-width:600px){
  .whatsapp-card{padding:24px 20px}
  .hero-form{padding-inline:20px}
  .mobile-cta{bottom:max(12px,env(safe-area-inset-bottom))}
  .footer{padding-bottom:calc(96px + env(safe-area-inset-bottom))}
  html{scroll-padding-bottom:90px}
  body:has(.whatsapp-card :focus) .mobile-cta{visibility:hidden;pointer-events:none}
  .phone{font-size:clamp(28px,8.4vw,39px)}
}
`);
console.log('Imagem responsiva e melhorias de leitura aplicadas.');
