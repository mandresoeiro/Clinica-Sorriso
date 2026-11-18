from pathlib import Path
import json, re, shutil
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
src=root/'output/odonto-social-diario-v3'
out=root/'output/primeiro-post-escova-macia'
for folder in ['01_ABERTO_EDITAVEL','02_FECHADO_PUBLICAR','03_IMAGEM_ORIGINAL']:
    (out/folder).mkdir(parents=True,exist_ok=True)
formats=[('FEED_1080x1350','modelo_1_feed.svg',1350),('STORY_1080x1920','modelo_1_story.svg',1920),('CAPA_REEL_1080x1920','modelo_1_reel_capa.svg',1920)]
ns={'s':'http://www.w3.org/2000/svg'}
ET.register_namespace('',ns['s']);ET.register_namespace('xlink','http://www.w3.org/1999/xlink')
for name,source,h in formats:
    tree=ET.parse(src/'01_editaveis'/source)
    for el in tree.findall('.//s:text',ns):
        if el.text=='Sua escova merece': el.text='Escova macia.'
        elif el.text=='uma escolha gentil.': el.text='Cuidado diário.'
    # Crop the photo inside the layout, retaining the complete toothbrush head.
    pic=tree.find('.//s:g[@id="03_IMAGEM"]/s:image',ns)
    pic.set('y',str(float(pic.get('y'))-290));pic.set('height','1190');pic.set('preserveAspectRatio','xMidYMid meet')
    tree.write(out/'01_ABERTO_EDITAVEL'/(name+'.svg'),encoding='utf-8',xml_declaration=True)
shutil.copy2(src/'03_imagens/escova.png',out/'03_IMAGEM_ORIGINAL/escova-foto-ilustrativa-IA.png')
manifest=[{'file':n+'.svg','width':1080,'height':h} for n,_,h in formats]
jsx='''#target illustrator
(function(){
 var base=File($.fileName).parent, specs=SPECS;
 var doc=app.documents.add(DocumentColorSpace.RGB,1080,1350);
 try {
 for(var i=0;i<specs.length;i++){
  var spec=specs[i],x=i*1250,y=0;
  if(i===0)doc.artboards[0].artboardRect=[x,y,x+1080,y-spec.height];
  else doc.artboards.add([x,y,x+1080,y-spec.height]);
  doc.artboards[i].name=spec.file.replace('.svg','');
  var source=new File(base.fsName+'/01_ABERTO_EDITAVEL/'+spec.file);
  if(!source.exists)throw new Error('Extraia o ZIP completo antes de executar.');
  var src=app.open(source),rect=src.artboards[0].artboardRect;
  var layer=doc.layers.add();layer.name=spec.file.replace('.svg','');
  for(var p=src.pageItems.length-1;p>=0;p--){
   var item=src.pageItems[p];
   if(item.parent.typename==='Layer'){
    var copied=item.duplicate(layer,ElementPlacement.PLACEATEND);
    copied.translate(x-rect[0],y-rect[1]);
   }
  }
  src.close(SaveOptions.DONOTSAVECHANGES);
 }
 app.activeDocument=doc;doc.artboards.setActiveArtboardIndex(0);
 var target=File.saveDialog('Salvar o projeto aberto do Illustrator','*.ai');
 if(target){
  if(!/\\.ai$/i.test(target.name))target=new File(target.fsName+'.ai');
  var opt=new IllustratorSaveOptions();opt.pdfCompatible=true;
  doc.saveAs(target,opt);
 }
 alert('Projeto aberto. Revise fontes, texto e identificação profissional antes de publicar.');
 }catch(e){alert('Não foi possível concluir: '+e.message+'. Abra os SVGs individualmente como alternativa.');}
})();
'''.replace('SPECS',json.dumps(manifest))
(out/'ABRIR_PROJETO_NO_ILLUSTRATOR.jsx').write_text(jsx,encoding='utf-8')
(out/'LEGENDA_PARA_COPIAR.txt').write_text('''Escova macia. Cuidado diário. 🦷

Na hora de escolher sua escova, prefira cerdas macias. Faça movimentos suaves durante a escovação, sem usar força.

Complete a rotina com creme dental com flúor e fio dental. Sua dentista pode orientar a técnica mais adequada para você.

Salve este lembrete para a próxima vez que for escolher sua escova!

Odonto Personnallite | Belém
odontopersonnallite.com.br

Imagem ilustrativa gerada por IA.
#SaúdeBucal #HigieneBucal #OdontoPersonnallite #Belém

ANTES DE PUBLICAR
Validar texto e identificação profissional com a clínica. Nenhum CRO foi inventado.
Fonte editorial: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-bucal
''',encoding='utf-8')
(out/'COMECE_AQUI.txt').write_text('''PRIMEIRO PROJETO — ESCOVA MACIA. CUIDADO DIÁRIO.

ABERTO / EDITÁVEL
01_ABERTO_EDITAVEL: SVGs para abrir diretamente no Illustrator. Logo, títulos, texto e formas editáveis. Foto incorporada, sem vínculo externo.
Para reunir as 3 peças: extraia o ZIP inteiro > Illustrator > Arquivo > Scripts > Outro script > ABRIR_PROJETO_NO_ILLUSTRATOR.jsx. Escolha onde salvar o .ai.
Não há .ai nativo previamente validado no pacote. O .ai será salvo pelo seu Illustrator. O script teve sintaxe conferida, mas não foi executado no Illustrator nesta sessão.
Alternativa: Arquivo > Abrir > selecione o SVG > Salvar como > Adobe Illustrator (.ai).
Fontes: Georgia e Arial. Confirme as fontes ao abrir.

FECHADO / EXPORTADO
02_FECHADO_PUBLICAR: PNG RGB em tamanho final, pronto para importar no Instagram após revisão. PDF rasterizado de conferência; não é a matriz editável.
Feed: 1080x1350. Story: 1080x1920. Capa de Reel: 1080x1920.
A capa de Reel não é vídeo. Para publicar Reel é necessário gravar/montar um vídeo; roteiro incluído.

PUBLICAR
1 Revise com a clínica o texto e a identificação profissional aplicável.
2 No Instagram: + > Publicação > selecione FEED_1080x1350.png > use o enquadramento vertical completo.
3 Cole o texto de LEGENDA_PARA_COPIAR.txt e confira a prévia antes de compartilhar.
4 Para Story, selecione STORY_1080x1920.png e, se desejar, acrescente adesivo de link para o site.
As artes não foram publicadas automaticamente. Não use PDF ou SVG para enviar ao Instagram.

IMAGEM
Fotografia ilustrativa gerada com image_gen; não representa produto específico, paciente, equipe ou instalações da clínica. Original em 03_IMAGEM_ORIGINAL. Prompt registrado em PROMPT_DA_IMAGEM.txt.
''',encoding='utf-8')
(out/'ROTEIRO_REEL.txt').write_text('''REEL — SUGESTÃO DE 12 SEGUNDOS
0–3 s: Escova macia. Cuidado diário. Mostrar a foto ou filmar uma escova real.
3–7 s: Narração: Prefira cerdas macias e faça movimentos suaves, sem usar força.
7–10 s: Narração: Complete o cuidado com creme dental com flúor e fio dental.
10–12 s: Narração: Salve este lembrete e converse com sua dentista.
Use a CAPA_REEL_1080x1920 como capa. Confira o recorte na prévia do perfil.
Grave áudio original ou use música com licença adequada. Este pacote não inclui vídeo, narração ou música.
''',encoding='utf-8')
(out/'PROMPT_DA_IMAGEM.txt').write_text((src/'PROMPTS_IMAGENS.txt').read_text(encoding='utf-8').split('ESCOVA\n')[1].split('\nFIO')[0],encoding='utf-8')
print(out)
