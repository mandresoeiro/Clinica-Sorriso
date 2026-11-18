const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/mandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'../output/odonto-social-diario-v3');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const P='#17383B',C='#F8F6EF',G='#B2A184';
const rows=[
 ['Dica prática','Sua escova merece','uma escolha gentil.','Prefira cerdas macias e movimentos suaves.','escova','tip'],
 ['Mito ou verdade?','Mais força,','mais limpeza?','Mito. Escove com cuidado, sem fazer força.','escova','myth'],
 ['Pergunta frequente','Só escovar','é suficiente?','O fio dental complementa a limpeza entre os dentes.','fio','faq'],
 ['Bastidores','Quem cuida','do seu sorriso?','Apresente uma profissional da equipe, com nome e CRO validados.','kit','team'],
 ['Lembrete do dia','Seu sorriso,','todo dia.','Pequenos hábitos fazem parte de uma rotina de cuidado.','sorriso','reminder'],
 ['Dica prática','Na sua rotina,','lembre do fio.','Use o fio dental para complementar a escovação.','fio','tip'],
 ['Mito ou verdade?','O fio substitui','a escovação?','Mito. O fio dental e a escovação se complementam.','fio','myth'],
 ['Pergunta frequente','Como escolher','o creme dental?','Procure um creme dental com flúor e peça orientação.','kit','faq'],
 ['Bastidores','Um olhar','para a clínica.','Use uma foto real do ambiente e conte um detalhe do atendimento.','kit','team'],
 ['Lembrete do dia','Sua rotina também','é autocuidado.','Reserve um momento para cuidar da higiene bucal.','sorriso','reminder'],
 ['Dica prática','Escova macia.','Cuidado diário.','Escolha uma escova de tamanho adequado e cerdas macias.','escova','tip'],
 ['Mito ou verdade?','Creme dental','é tudo igual?','Não. Observe a presença de flúor e converse com sua dentista.','kit','myth'],
 ['Pergunta frequente','Como cuidar','entre os dentes?','O fio dental ajuda a alcançar os espaços entre os dentes.','fio','faq'],
 ['Bastidores','Vamos conhecer','quem atende você?','Apresente outra profissional com foto real e identificação revisada.','kit','team'],
 ['Lembrete do dia','Salve este','lembrete de cuidado.','Escova macia, creme dental com flúor e fio dental na rotina.','kit','reminder'],
 ['Dica prática','Gentileza também','na escovação.','Faça movimentos suaves e peça orientação sobre sua técnica.','escova','tip'],
 ['Mito ou verdade?','Fio dental é só','quando incomoda?','Mito. Ele faz parte da higiene e complementa a escovação.','fio','myth'],
 ['Pergunta frequente','Sua rotina serve','para todo mundo?','A orientação de higiene deve considerar as necessidades individuais.','sorriso','faq'],
 ['Bastidores','Sua dúvida pode','virar conversa.','Grave uma resposta real da dentista a uma dúvida frequente.','kit','team'],
 ['Lembrete do dia','Cuidar começa','com uma conversa.','Leve suas dúvidas à dentista e construa sua rotina de cuidado.','sorriso','reminder'],
];
function t(x,y,s,size=32,color=P,serif=false,weight=400){return `<text x="${x}" y="${y}" font-family="${serif?'Georgia':'Arial'}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(s)}</text>`;}
function wrap(s,n=45){let lines=[''];for(const w of s.split(' ')){let i=lines.length-1;if((lines[i]+' '+w).trim().length>n)lines.push(w);else lines[i]=(lines[i]+' '+w).trim();}return lines;}
let symbol=fs.readFileSync(path.resolve(__dirname,'../public/images/brand/symbol.svg'),'utf8').replace(/<title>.*?<\/title>/,'');
const manifest=[];const images={};
async function init(){for(const k of ['escova','fio','sorriso','kit']){await sharp(path.join(root,'03_imagens',k+'.png')).jpeg({quality:91}).toFile(path.join(root,'03_imagens',k+'.jpg'));images[k]='data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'03_imagens',k+'.jpg')).toString('base64');}}
function make(file,row,h=1350,model=false){
const [tag,a,b,desc,key,type]=row;const tall=h===1920,square=h===1080;
const dark=type==='myth'||type==='reminder',fg=dark?C:P,bg=dark?P:C;
const safeTop=tall?160:60, titleY=safeTop+220;
let picY=titleY+180,picH=tall?620:square?260:430;
if(type==='reminder'){picY=safeTop+125;picH=tall?810:square?450:650;}
const bodyY=type==='reminder'?picY+picH+40:picY+picH+45;
let s=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="${h}" viewBox="0 0 1080 ${h}"><title>${esc(file)}</title><defs><clipPath id="photo"><rect x="64" y="${picY}" width="952" height="${picH}" rx="26"/></clipPath></defs><g id="01_FUNDO"><rect width="1080" height="${h}" fill="${bg}"/><path d="M64 ${safeTop+110}H1016" stroke="${G}" stroke-width="2"/></g>`;
s+=`<g id="02_LOGO">${symbol.replace('<svg ',`<svg x="64" y="${safeTop}" width="50" height="56" `)}${t(134,safeTop+25,'Odonto Personnallite',27,fg,false,700)}${t(134,safeTop+52,'SEU SORRISO, TODO DIA',12,G,false,700)}</g>`;
s+=`<g id="03_IMAGEM" clip-path="url(#photo)"><image x="64" y="${picY}" width="952" height="${picH}" preserveAspectRatio="xMidYMid slice" xlink:href="${images[key]}"/></g>`;
if(type==='reminder'){
s+=`<g id="04_TITULO"><rect x="88" y="${picY+picH-180}" width="904" height="160" rx="16" fill="${P}" opacity=".96"/>${t(116,picY+picH-113,a,57,C,true)}${t(116,picY+picH-47,b,57,C,true)}</g>`;
}else{
s+=`<g id="04_TITULO">${t(64,titleY-60,tag.toUpperCase(),18,G,false,700)}${t(64,titleY,a,68,fg,true)}${t(64,titleY+79,b,68,fg,true)}</g>`;
}
if(type==='myth')s+=`<g id="05_RESPOSTA"><rect x="80" y="${picY+20}" width="160" height="54" rx="27" fill="${C}"/>${t(112,picY+57,'MITO',23,P,false,700)}</g>`;
if(type==='faq')s+=`<g id="05_PERGUNTA"><circle cx="942" cy="${picY+62}" r="42" fill="${P}"/>${t(926,picY+79,'?',48,C,true)}</g>`;
if(type==='team')s+=`<g id="05_FOTO_REAL"><rect x="90" y="${picY+picH-110}" width="900" height="80" rx="12" fill="${P}"/>${t(124,picY+picH-62,'MODELO · INSIRA FOTO REAL DA CLÍNICA',22,C,false,700)}</g>`;
s+=`<g id="06_TEXTO_EDITAVEL">${wrap(desc,square?48:46).map((line,i)=>t(64,bodyY+35+i*42,line,30,fg)).join('')}</g>`;
const foot=tall?1660:h-135;
s+=`<g id="07_RODAPE"><path d="M64 ${foot-25}H1016" stroke="${G}" opacity=".5"/>${t(64,foot+15,type==='team'?'Revisar antes de publicar.':'Salve. Compartilhe. Cuide de você.',22,fg,false,700)}${t(64,foot+56,'odontopersonnallite.com.br',19,fg)}${t(64,foot+88,type==='team'?'Foto ilustrativa de apoio · substituir por imagem real.':'Imagem ilustrativa gerada por IA · conteúdo educativo.',13,fg)}</g></svg>`;
fs.writeFileSync(path.join(root,'01_editaveis',file+'.svg'),s);manifest.push({file:file+'.svg',width:1080,height:h});
}
async function main(){fs.mkdirSync(path.join(root,'01_editaveis'),{recursive:true});fs.mkdirSync(path.join(root,'02_png'),{recursive:true});await init();
rows.slice(0,5).forEach((r,i)=>{make(`modelo_${i+1}_feed`,r);make(`modelo_${i+1}_story`,r,1920);make(`modelo_${i+1}_reel_capa`,r,1920);});
rows.forEach((r,i)=>make(`dia_${String(i+1).padStart(2,'0')}_feed`,r));
fs.writeFileSync(path.join(root,'manifesto.json'),JSON.stringify(manifest,null,2));
for(const item of manifest)await sharp(path.join(root,'01_editaveis',item.file)).png().toFile(path.join(root,'02_png',item.file.replace('.svg','.png')));
const tiles=[];for(let i=0;i<5;i++)tiles.push({input:await sharp(path.join(root,'02_png',`modelo_${i+1}_feed.png`)).resize(324,405).toBuffer(),left:24+i*348,top:24});
await sharp({create:{width:1764,height:453,channels:3,background:'#DDE4D9'}}).composite(tiles).png().toFile(path.join(root,'PREVIA_MODELOS.png'));
let csv='Dia;Categoria;Título;Legenda;Imagem;Revisão\n';let txt='CALENDÁRIO — 20 PUBLICAÇÕES / 4 SEMANAS ÚTEIS\nNão há datas fixas: comece no dia que preferir.\n\n';
rows.forEach((r,i)=>{const caption=r[5]==='team'?`${r[3]} Substitua esta orientação por uma apresentação real aprovada pela clínica. Não publique a pessoa gerada como dentista ou paciente.`:`${r[1]} ${r[2]} ${r[3]} Converse com sua dentista sobre os cuidados adequados para você. Salve este lembrete. Odonto Personnallite • Belém. odontopersonnallite.com.br`;
csv+=`${i+1};${r[0]};${r[1]} ${r[2]};${caption};${r[4]};Pendente\n`;txt+=`DIA ${i+1} — ${r[0]}\n${r[1]} ${r[2]}\nLegenda: ${caption}\nStory: ${r[5]==='team'?'Foto ou vídeo real da equipe/ambiente, com autorização.':'Faça uma pergunta simples sobre a rotina e abra espaço para dúvidas.'}\nReel: título (0–3s), dica (3–9s), lembrete para salvar (9–12s).\n\n`;});
fs.writeFileSync(path.join(root,'CALENDARIO_20_POSTAGENS.csv'),'\ufeff'+csv);fs.writeFileSync(path.join(root,'LEGENDAS_E_ROTEIROS.txt'),txt+'\nFonte editorial: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-bucal\nRevisar conteúdo e identificação profissional com a clínica antes de publicar.\n');
let old=fs.readFileSync(path.resolve(__dirname,'../output/instagram-rotina-saudavel/ABRIR_NO_ILLUSTRATOR.jsx'),'utf8');
old=old.replace(/var specs=.*?;\r?\n/,`var specs=${JSON.stringify(manifest)};\n`).replaceAll('01_vetores_editaveis','01_editaveis').replaceAll('(i%4)*1250','(i%8)*1250').replaceAll('Math.floor(i/4)','Math.floor(i/8)').replaceAll('Odonto_Rotina_Saudavel.ai','Odonto_Social_Diario_v3.ai');
fs.writeFileSync(path.join(root,'ABRIR_NO_ILLUSTRATOR.jsx'),old);
fs.writeFileSync(path.join(root,'LEIA-ME.txt'),`ODONTO PERSONNALLITE — SISTEMA SOCIAL DIÁRIO V3\n\n35 artes editáveis: 5 modelos (feed, Story, capa de Reel) e 20 exemplos de feed.\n5 categorias: dica, mito, pergunta, bastidores e lembrete.\nFotografias ilustrativas geradas por IA. A pessoa retratada é fictícia, não paciente nem profissional da clínica.\nNos bastidores há um aviso de FOTO REAL. Substitua a imagem e o texto antes de publicar.\n\nILLUSTRATOR\nExtraia o ZIP. Arquivo > Scripts > Outro script > ABRIR_NO_ILLUSTRATOR.jsx.\nO script foi preparado para criar 35 pranchetas e salvar um .ai. Não foi executado nem validado no Illustrator nesta sessão.\nTambém é possível abrir cada SVG diretamente e salvar como .ai.\nTextos, logo e formas são editáveis; fotografias são raster incorporadas. Georgia e Arial.\nA aparência tipográfica pode mudar se a fonte não estiver instalada.\n\nROTINA DIÁRIA\n1 Escolha um tema no CSV. Os 20 dias correspondem a quatro semanas de segunda a sexta.\n2 Duplique o modelo no Illustrator e altere título, apoio e imagem.\n3 Revise o conteúdo com a dentista, identificação profissional e autorizações de imagem.\n4 Exporte PNG RGB usando pranchetas: feed 1080x1350, Story/capa 1080x1920.\n5 Confira o recorte no Instagram e use a legenda incluída.\n6 No CSV marque revisão e registre o dia real de publicação.\n\nREEL\nSão capas estáticas, não vídeos MP4. Grave a profissional respondendo ou monte as cenas no editor de vídeo. Não há música incluída.\nEvite inserir texto sobre o rosto. Os textos centrais das versões verticais ficam afastados das bordas.\n\nIMAGENS\n03_imagens contém originais PNG e JPG. As imagens também estão incorporadas aos SVGs para portabilidade.\nPara trocar uma imagem em SVG aberto, entre no grupo 03_IMAGEM pelo painel Camadas e selecione a imagem dentro do recorte. Substitua/incorpore o novo arquivo pelo painel Vínculos, se disponível na sua versão.\n\nDIREÇÃO VISUAL\nVerde #17383B, marfim #F8F6EF, dourado #B2A184. Título curto, uma ideia por arte e rodapé consistente.\nNão publicar os exemplos de bastidores sem substituir instruções e fotos.\n`);
console.log('35 artes e calendário prontos.');}
main().catch(e=>{console.error(e);process.exit(1)});
