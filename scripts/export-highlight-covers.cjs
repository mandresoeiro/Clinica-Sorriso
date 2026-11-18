const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/mandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..');
const base = path.join(root, 'output/instagram/destaques/01-capas-verdes');
const svgDir = path.join(base, '02-editaveis-svg');
const pngDir = path.join(base, '01-prontas-png');
const previewDir = path.join(base, '03-previa');
const notesDir = path.join(base, '04-orientacoes');
const items = [['01-clinica','Clínica'],['02-equipe','Equipe'],['03-tratamentos','Tratamentos'],['04-urgencias','Urgências'],['05-duvidas','Dúvidas'],['06-contato','Contato']];
async function main() {
 for (const d of [svgDir,pngDir,previewDir,notesDir]) fs.mkdirSync(d,{recursive:true});
 for (const [oldName,newName] of [['04-duvidas','05-duvidas'],['05-contato','06-contato']]) {
  for (const [dir,ext] of [[svgDir,'.svg'],[pngDir,'.png']]) {
   const from = path.join(dir,oldName+ext), to = path.join(dir,newName+ext);
   if (fs.existsSync(from)) {
    if (fs.existsSync(to)) throw new Error('Destino já existe: '+to);
    fs.renameSync(from,to);
   }
  }
 }
 const icon = '<path d="M47 26C37 27 28 19 21 28C13 40 25 55 28 71C31 86 40 84 43 69C46 59 52 59 55 69C58 84 67 86 70 71C73 55 85 40 77 28C70 19 58 27 47 26Z"/><path d="M32 36Q28 40 31 46" stroke="#69b99a"/><circle cx="77" cy="24" r="15" fill="#f7faf5"/><path d="M77 16V32M69 24H85" stroke="#287655"/>';
 const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><title>Urgências - Odonto Personnallite</title><g id="Fundo"><rect width="1080" height="1080" fill="#edf6ef"/><circle cx="540" cy="540" r="310" fill="#deeee1"/><circle cx="540" cy="540" r="270" fill="#f7faf5"/></g><g id="Icone" transform="translate(300 300) scale(4.8)" fill="none" stroke="#287655" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+icon+'</g></svg>';
 fs.writeFileSync(path.join(svgDir,'04-urgencias.svg'),svg,'utf8');
 const layers=[];
 for (let i=0;i<items.length;i++) {
  const [name,label]=items[i], source=path.join(svgDir,name+'.svg');
  await sharp(source).png().toFile(path.join(pngDir,name+'.png'));
  const small=await sharp(source).resize(200).composite([{input:Buffer.from('<svg width="200" height="200"><circle cx="100" cy="100" r="99" fill="white"/></svg>'),blend:'dest-in'}]).png().toBuffer();
  layers.push({input:small,left:24+i*224,top:24});
  const caption=Buffer.from('<svg width="224" height="50"><text x="112" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" font-weight="600" fill="#287655">'+label+'</text></svg>');
  layers.push({input:caption,left:12+i*224,top:228});
 }
 await sharp({create:{width:1368,height:292,channels:3,background:'#edf6ef'}}).composite(layers).png().toFile(path.join(previewDir,'previa-capas.png'));
 for (const [name] of items) {
  const meta=await sharp(path.join(pngDir,name+'.png')).metadata();
  if(meta.width!==1080||meta.height!==1080) throw new Error('Dimensão incorreta: '+name);
 }
 fs.writeFileSync(path.join(notesDir,'LEIA-ME.txt'),'Seis capas em PNG 1080 × 1080: Clínica, Equipe, Tratamentos, Urgências, Dúvidas e Contato.\nSVGs editáveis na pasta 02-editaveis-svg. Prévia na pasta 03-previa.\nUse os nomes abaixo das bolinhas; os ícones ficam sem texto para manter a leitura no recorte circular.\nPara exportar novamente: node scripts/export-highlight-covers.cjs\n','utf8');
 console.log('Verificado: 6 PNGs 1080 x 1080, 6 SVGs e prévia com os nomes.');
}
main().catch(e=>{console.error(e);process.exitCode=1});