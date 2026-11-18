const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/mandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, process.argv.includes('--photo') ? '../output/instagram-rotina-fotografico' : '../output/instagram-rotina-saudavel');
const list = JSON.parse(fs.readFileSync(path.join(root, 'manifesto.json'), 'utf8'));
(async()=>{
 const pngDir=path.join(root,'02_png_para_revisao'); fs.mkdirSync(pngDir,{recursive:true});
 for(const item of list) await sharp(path.join(root,'01_vetores_editaveis',item.file)).png().toFile(path.join(pngDir,item.file.replace('.svg','.png')));
 const selected=list.filter(i=>i.file.startsWith('feed_'));
 const tiles=[];
 for(let i=0;i<selected.length;i++) tiles.push({input:await sharp(path.join(pngDir,selected[i].file.replace('.svg','.png'))).resize(324,405).toBuffer(),left:24+i*348,top:24});
 await sharp({create:{width:1764,height:453,channels:3,background:'#DDE4D9'}}).composite(tiles).png().toFile(path.join(root,'PREVIA_CARROSSEL.png'));
 console.log('14 PNGs e prévia gerados.');
})();
