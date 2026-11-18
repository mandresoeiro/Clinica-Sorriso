const fs=require('node:fs'), path=require('node:path');
const sharp=require('C:/Users/mandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'output/instagram/destaques/00-kit-principal-verde-dourado');
const input='C:/Users/mandr/OneDrive/Imagens/WhatsApp Unknown 2026-11-05 at 22.20.14';
const folders=['00-originais-recebidos','01-capas-para-instagram','02-stories-para-publicar','03-editaveis/capas','03-editaveis/stories','04-previas','05-orientacoes'];
const data=[
 {id:'01-clinica',label:'Clínica',icon:'clinica',file:'WhatsApp Image 2026-10-11 at 10.42.59.jpeg',tag:'BEM-VINDO À NOSSA CLÍNICA',title:['Cuidado que começa','com acolhimento.'],body:['Na Odonto Personnallite, cada sorriso','recebe atenção e planejamento individual.'],list:['Escuta e atenção às suas necessidades','Orientação para cada etapa do cuidado','Tratamentos definidos após avaliação'],cta:'Solicite sua avaliação'},
 {id:'02-equipe',label:'Equipe',icon:'equipe',file:'WhatsApp Image 2026-10-11 at 10.42.59 (2).jpeg',tag:'PESSOAS QUE CUIDAM DE PESSOAS',title:['Uma equipe para','cuidar de você.'],body:['Converse com nossa equipe sobre','o atendimento que você procura.'],list:['Conheça os profissionais e suas áreas','Tire suas dúvidas antes da consulta','Receba orientação para o próximo passo'],cta:'Converse com nossa equipe'},
 {id:'03-tratamentos',label:'Tratamentos',icon:'cuidados',file:'WhatsApp Image 2026-10-11 at 10.42.59 (1).jpeg',tag:'ODONTOLOGIA HUMANIZADA',title:['Seu sorriso merece','atenção completa.'],body:['Conheça os serviços da clínica.','A indicação depende de avaliação.'],list:['Clínica Geral · Harmonização Facial','Endodontia · Ortodontia','Próteses · Implantes'],cta:'Saiba mais sobre os tratamentos'},
 {id:'04-proteses',label:'Próteses',icon:'proteses',file:'WhatsApp Image 2026-10-11 at 10.42.59 (4).jpeg',tag:'PRÓTESES E IMPLANTES',title:['Conforto para sorrir.','Cuidado para você.'],body:['Avaliação e planejamento conforme','as necessidades do seu sorriso.'],list:['Converse sobre próteses e implantes','Relate desconfortos e dificuldades','Conheça as possibilidades para seu caso'],cta:'Solicite uma avaliação'},
 {id:'05-urgencias',label:'Urgências',icon:'urgencias',tag:'URGÊNCIAS EM PRÓTESES E IMPLANTES',title:['Um imprevisto?','Fale com a equipe.'],body:['Dentistas de sobreaviso para avaliar','sua necessidade, conforme disponibilidade.'],list:['Cimentação de coroas','Atendimento relacionado a provisórios','Avaliação de fraturas em próteses'],cta:'Consulte a disponibilidade'},
 {id:'06-atendimento',label:'Atendimento',icon:'atendimento',file:'WhatsApp Image 2026-10-11 at 10.42.58.jpeg',tag:'VAMOS CONVERSAR?',title:['Seu próximo passo','começa aqui.'],body:['Fale com nossa equipe pelo WhatsApp','para solicitar informações e atendimento.'],list:['Conte qual atendimento você procura','Consulte os horários disponíveis','Confirme seu agendamento com a equipe'],cta:'Solicite seu atendimento'},
 {id:'07-localizacao',label:'Localização',icon:'localizacao',file:'WhatsApp Image 2026-10-11 at 10.42.59 (3).jpeg',tag:'PLANEJE SUA VISITA',title:['Esperamos você','em Belém.'],body:['Travessa Almirante Wandenkolk, 1243','Belém · PA'],list:['Atendimento mediante agendamento','Consulte dias e horários pelo WhatsApp','Confirme sua visita com a equipe'],cta:'Peça a localização pelo WhatsApp'}
];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=(x,y,s,size=34,color='#f5f0e8',font='Arial',extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" ${extra}>${esc(s)}</text>`;
async function main(){
 for(const f of folders)fs.mkdirSync(path.join(base,f),{recursive:true});
 let previews=[],caps=[];
 for(let i=0;i<data.length;i++){
  const d=data[i];
  if(d.file) fs.copyFileSync(path.join(input,d.file),path.join(base,'00-originais-recebidos',d.id+'.jpeg'));
  const source=fs.readFileSync(path.join(root,'public/images/highlights',(d.icon==='urgencias'?'proteses':d.icon)+'.svg'),'utf8');
  let inner=source.match(/<svg x="170"[\s\S]*?>([\s\S]*?)<\/svg>/)[1];
  if(d.icon==='urgencias') inner += '<circle cx="37" cy="12" r="8" fill="#17383b"/><path d="M37 8v8M33 12h8"/>';
  const icon=(x,y,size)=>`<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="#e5c99e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  // Existing vector system: refined scale and stroke for a clear circular crop.
  const cover=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><title>${d.label} — Odonto Personnallite</title><rect width="1080" height="1080" fill="#17383b"/><circle cx="540" cy="540" r="444" fill="none" stroke="#c7a77a" stroke-width="2"/><circle cx="540" cy="540" r="421" fill="none" stroke="#c7a77a" stroke-opacity=".28"/>${icon(270,270,540)}</svg>`;
  fs.writeFileSync(path.join(base,'03-editaveis/capas',d.id+'.svg'),cover);
  const cap=path.join(base,'01-capas-para-instagram',d.id+'.png');
  await sharp(Buffer.from(cover)).png().toFile(cap);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><title>${d.label} — Story</title><rect width="1080" height="1920" fill="#17383b"/><circle cx="1050" cy="430" r="500" fill="none" stroke="#c7a77a" stroke-width="2" opacity=".15"/><circle cx="1050" cy="430" r="440" fill="none" stroke="#c7a77a" opacity=".1"/><path d="M96 284H984" stroke="#c7a77a" opacity=".5"/>`;
  s+=text(96,220,'ODONTO PERSONNALLITE',30,'#e5c99e','Arial','letter-spacing="4"');
  s+=text(984,220,String(i+1).padStart(2,'0')+' / 07',23,'#e5c99e','Arial','text-anchor="end"');
  s+=icon(96,330,170);
  s+=text(96,572,d.tag,22,'#e5c99e','Arial','letter-spacing="2"');
  d.title.forEach((line,j)=>s+=text(96,675+j*86,line,66,'#f5f0e8','Georgia'));
  d.body.forEach((line,j)=>s+=text(96,867+j*49,line,34,'#dce5e1'));
  s+='<rect x="96" y="1010" width="888" height="304" rx="20" fill="#214447"/>';
  d.list.forEach((line,j)=>{s+=`<circle cx="132" cy="1080" r="4" fill="none" opacity="0"/>`;s+=`<circle cx="132" cy="${1081+j*78}" r="4" fill="#e5c99e"/>`;s+=text(158,1092+j*78,line,30);});
  s+=text(96,1410,d.cta,34,'#e5c99e','Arial','font-weight="600"');
  s+=text(96,1470,'WhatsApp: (91) 98188-8353',32);
  s+=text(96,1523,'Acesse o link da bio para conversar.',27,'#dce5e1');
  s+='<path d="M96 1590H984" stroke="#c7a77a" opacity=".4"/>';
  s+=text(96,1642,'Dra. Sônia Almeida · CRO-PA 2638',23,'#dce5e1');
  s+='</svg>';
  fs.writeFileSync(path.join(base,'03-editaveis/stories',d.id+'.svg'),s);
  const story=path.join(base,'02-stories-para-publicar',d.id+'.png');
  await sharp(Buffer.from(s)).png().toFile(story);
  const meta=await sharp(story).metadata();if(meta.width!==1080||meta.height!==1920)throw Error('Dimensão de story incorreta');
  previews.push({input:await sharp(story).resize(324,576).toBuffer(),left:24+i%3*348,top:24+Math.floor(i/3)*600});
  const ct=await sharp(cap).resize(180).toBuffer();caps.push({input:ct,left:24+i*204,top:24});
  caps.push({input:Buffer.from(`<svg width="204" height="45">${text(102,30,d.label,19,'#17383b','Arial','text-anchor="middle"')}</svg>`),left:12+i*204,top:210});
 }
 await sharp({create:{width:1068,height:1824,channels:3,background:'#ece8df'}}).composite(previews).png().toFile(path.join(base,'04-previas/stories.png'));
 await sharp({create:{width:1452,height:270,channels:3,background:'#ece8df'}}).composite(caps).png().toFile(path.join(base,'04-previas/capas.png'));
 const guide=`# Kit principal — verde escuro e dourado

Sete capas e sete stories de abertura, um por destaque.
Ordem: Clínica, Equipe, Tratamentos, Próteses, Urgências, Atendimento, Localização.

00-originais-recebidos: cópias dos seis JPEGs enviados, sem alteração.
01-capas-para-instagram: novas capas PNG 1080 × 1080, com ícones vetoriais do projeto, escala mais uniforme e margem para recorte circular.
02-stories-para-publicar: sete stories PNG 1080 × 1920.
03-editaveis: SVGs das novas capas e stories.
04-previas: visão conjunta para conferência.

## Publicação
1. Publique o story do assunto desejado no Instagram.
2. Adicione-o a um novo destaque e use o nome correspondente.
3. Em Editar destaque > Editar capa, escolha o PNG de 01-capas-para-instagram.
4. Centralize o ícone no recorte circular.
5. Acrescente os próximos stories do mesmo assunto ao destaque existente.

O texto de WhatsApp nas imagens é visual. Para permitir o toque, adicione no Instagram um adesivo de link: https://wa.me/5591981888353
Localização: use o adesivo de localização ou o link do mapa do site.

Contato, endereço e identificação profissional foram usados conforme src/config/site.config.ts. Horários não foram inventados; o story orienta consultar a equipe. Atendimento de sobreaviso está condicionado à disponibilidade.

## Correspondência dos originais
${data.filter(d=>d.file).map(d=>d.file+' → '+d.id+'.jpeg').join('\n')}

As versões verdes claras e anteriores continuam preservadas. Este é o conjunto principal seguindo as referências enviadas nesta conversa.
`;
 fs.writeFileSync(path.join(base,'05-orientacoes/COMO-PUBLICAR.md'),guide);
 fs.writeFileSync(path.join(base,'05-orientacoes/TEXTOS-DOS-STORIES.txt'),data.map(d=>d.label+'\n'+d.title.join(' ')+'\n'+d.body.join(' ')+'\n'+d.list.join('\n')+'\n'+d.cta).join('\n\n---\n\n'));
 console.log('Concluído: 6 originais preservados, 7 capas, 7 stories, 14 SVGs e 2 prévias.');
}
main().catch(e=>{console.error(e);process.exitCode=1});