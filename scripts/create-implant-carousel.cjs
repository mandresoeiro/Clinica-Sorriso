const fs=require('fs'),path=require('path'),sharp=require('C:/Users/mandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'../output/projeto-02-acompanhamento-implantes');
const P='#17383B',C='#F8F6EF',G='#B2A184',S='#647C69';
const e=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,lines,size=32,color=P,serif=false,step=size*1.2)=>{if(!Array.isArray(lines))lines=[lines];return `<text x="${x}" y="${y}" font-family="${serif?'Georgia':'Arial'}" font-size="${size}" fill="${color}">${lines.map((l,i)=>`<tspan x="${x}" dy="${i?step:0}">${e(l)}</tspan>`).join('')}</text>`;};
let logo=fs.readFileSync(path.resolve(__dirname,'../public/images/brand/symbol.svg'),'utf8').replace(/<title>.*?<\/title>/,'');
const specs=[];let photos={};
const photo=(key,x,y,w,h,id)=>{
 const manual=w>600, ih=manual?w*(key==='clinica'?1650/954:1402/1122):h;
 const offset=key==='escova'?290:h<350?580:h<500?330:260;
 const iy=manual?y-offset:y;
 return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24"/></clipPath></defs><g id="FOTO_${id}" clip-path="url(#${id})"><image x="${x}" y="${iy}" width="${w}" height="${ih}" preserveAspectRatio="xMidYMid slice" xlink:href="${photos[key]}"/></g>`;
};
function base(name,n,dark=false,h=1350){let fg=dark?C:P;return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="${h}" viewBox="0 0 1080 ${h}"><title>${name}</title><g id="01_FUNDO"><rect width="1080" height="${h}" fill="${dark?P:C}"/></g><g id="02_MARCA">${logo.replace('<svg ','<svg x="64" y="58" width="50" height="56" ')}${text(134,84,'Odonto Personnallite',27,fg)}${text(134,111,'ACOMPANHAMENTO DOS IMPLANTES',13,G)}<path d="M64 153H1016" stroke="${G}" opacity=".7"/>${text(n.length>7?810:928,109,n,n.length>7?18:23,G)}</g>`;}
function footer(s,idx,dark=false,h=1350){const fg=dark?C:P;return s+`<g id="09_RODAPE">${text(64,h-112,idx<5?'Continue para o próximo cuidado →':'Salve e converse com sua dentista.',23,fg)}${text(64,h-69,'odontopersonnallite.com.br',20,fg)}${text(64,h-34,'Conteúdo educativo • orientações individuais com a equipe.',13,fg)}</g></svg>`;}
function save(name,s,h=1350){fs.writeFileSync(path.join(root,'01_ABERTO_EDITAVEL',name+'.svg'),s);specs.push({file:name+'.svg',width:1080,height:h});}
async function main(){for(const d of ['01_ABERTO_EDITAVEL','02_FECHADO_PUBLICAR'])fs.mkdirSync(path.join(root,d),{recursive:true});
for(const [key,file] of [['clinica','foto-tratada-monitor-oculto'],['escova','escova-ilustrativa-IA']]){await sharp(path.join(root,'03_IMAGENS',file+'.png')).jpeg({quality:93}).toFile(path.join(root,'03_IMAGENS',file+'.jpg'));photos[key]='data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'03_IMAGENS',file+'.jpg')).toString('base64');}
let s=base('O cuidado continua após a cirurgia','01 / 05',true);
s+=`<g id="03_TITULO">${text(64,236,'IMPLANTES DENTÁRIOS',18,G)}${text(64,324,['O cuidado continua','após a cirurgia.'],76,C,true)}</g>`;
s+=photo('clinica',64,490,952,610,'capa');s+=`<g id="04_APOIO">${text(64,1160,'Entenda por que o acompanhamento faz parte do cuidado.',27,C)}</g>`;save('01_CAPA',footer(s,1,true));
s=base('Avaliação clínica individual','02 / 05');
s+=`<g id="03_TITULO">${text(64,242,'NA CONSULTA',18,S)}${text(64,326,['Olhar clínico.','Cuidado individual.'],70,P,true)}</g>`;
s+=photo('clinica',600,510,416,620,'avaliacao');
const cards=[['01','Gengiva e tecidos',['A dentista observa as condições','ao redor dos implantes.']],['02','Conforto e função',['A conversa e o exame clínico','ajudam a avaliar seu caso.']],['03','Evolução do cuidado',['Cada retorno tem uma finalidade','definida para você.']]];
s+='<g id="04_PONTOS">';cards.forEach((c,i)=>{let y=570+i*185;s+=text(64,y,c[0],24,G)+text(64,y+44,c[1],31,P,true)+text(64,y+85,c[2],23,P,false,34);});s+='</g>';save('02_AVALIACAO_CLINICA',footer(s,2));
s=base('Exames de imagem quando indicados','03 / 05',true);
s+=`<g id="03_TITULO">${text(64,242,'INFORMAÇÕES QUE SE COMPLEMENTAM',18,G)}${text(64,326,['A imagem ajuda.','O olhar clínico','faz a diferença.'],70,C,true)}</g>`;
s+=`<g id="04_APOIO">${text(64,643,['Quando indicados, exames de imagem','complementam a avaliação clínica.','A dentista define a necessidade.'],33,C,false,50)}</g>`;
s+=photo('clinica',64,818,952,290,'exames');s+=text(80,1150,'Exame da paciente não exibido para preservar sua privacidade.',21,C);save('03_EXAMES_DE_IMAGEM',footer(s,3,true));
s=base('Higiene orientada para cada caso','04 / 05');
s+=`<g id="03_TITULO">${text(64,242,'FORA DO CONSULTÓRIO',18,S)}${text(64,326,['Seu cuidado diário','também faz parte.'],70,P,true)}</g>`;
s+=photo('escova',64,510,952,430,'higiene');
s+=`<g id="04_APOIO">${text(64,1005,['Siga a orientação de higiene para seu caso.','No pós-operatório, os cuidados são específicos.'],30,P,false,44)}${text(64,1127,'Não substitua orientações individuais por dicas gerais.',23,S)}</g>`;save('04_CUIDADO_DIARIO',footer(s,4));
s=base('Acompanhamento e retornos','05 / 05',true);
s+=`<g id="03_TITULO">${text(64,242,'O PRÓXIMO PASSO',18,G)}${text(64,326,['E depois?','Continue voltando.'],76,C,true)}</g>`;
s+=photo('clinica',64,510,952,440,'retorno');
s+=`<g id="04_APOIO">${text(64,1018,['O intervalo entre retornos é individual.','Combine seu acompanhamento com a equipe.'],30,C,false,44)}<rect x="64" y="1110" width="710" height="65" rx="14" fill="${C}"/>${text(88,1152,'Fale com a recepção pelo nosso site ↗',27,P)}</g>`;save('05_RETORNOS',footer(s,5,true));
// Story é um convite para ler o carrossel; não é uma cena de vídeo pronta.
s=base('Story - convite ao carrossel','NOVO NO FEED',true,1920);
s+=`<g id="03_TITULO">${text(64,316,['Implantes: o cuidado','continua depois','da cirurgia.'],70,C,true)}</g>`;
s+=photo('clinica',64,600,952,800,'story');s+=text(64,1490,['Veja o carrossel e entenda','o papel dos retornos.'],38,C,true,49);s+=text(64,1625,'Compartilhe o post do feed nos seus Stories.',24,C);save('STORY_DIVULGACAO',footer(s,5,true,1920),1920);
let jsx=fs.readFileSync(path.resolve(__dirname,'../output/primeiro-post-escova-macia/ABRIR_PROJETO_NO_ILLUSTRATOR.jsx'),'utf8').replace(/specs=\[.*?\];/,'specs='+JSON.stringify(specs)+';').replace('x=i*1250,y=0','x=(i%3)*1250,y=-Math.floor(i/3)*2100');
fs.writeFileSync(path.join(root,'ABRIR_CARROSSEL_NO_ILLUSTRATOR.jsx'),jsx);fs.writeFileSync(path.join(root,'manifesto.json'),JSON.stringify(specs));
for(const v of specs)await sharp(path.join(root,'01_ABERTO_EDITAVEL',v.file)).png().toFile(path.join(root,'02_FECHADO_PUBLICAR',v.file.replace('.svg','.png')));
let tiles=[];for(let i=0;i<5;i++)tiles.push({input:await sharp(path.join(root,'02_FECHADO_PUBLICAR',specs[i].file.replace('.svg','.png'))).resize(324,405).toBuffer(),left:24+348*i,top:24});await sharp({create:{width:1764,height:453,channels:3,background:'#DDE4D9'}}).composite(tiles).png().toFile(path.join(root,'PREVIA_CARROSSEL.png'));
console.log('Carrossel: 5 imagens + Story, editáveis e PNGs.');}
main().catch(e=>{console.error(e);process.exit(1)});

