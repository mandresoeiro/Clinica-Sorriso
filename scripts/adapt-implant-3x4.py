from pathlib import Path
import shutil,json,re,xml.etree.ElementTree as E
root=Path(__file__).resolve().parents[1]
src=root/'output/projeto-02-acompanhamento-implantes'
dst=root/'output/projeto-02-implantes-1080x1440'
dst.mkdir(parents=True,exist_ok=True)
for folder in ['01_ABERTO_EDITAVEL','02_FECHADO_PUBLICAR','03_IMAGENS']:
 (dst/folder).mkdir(exist_ok=True)
shutil.copytree(src/'03_IMAGENS',dst/'03_IMAGENS',dirs_exist_ok=True)
ns={'s':'http://www.w3.org/2000/svg'}
E.register_namespace('',ns['s']);E.register_namespace('xlink','http://www.w3.org/1999/xlink')
specs=json.loads((src/'manifesto.json').read_text())
for spec in specs:
 tree=E.parse(src/'01_ABERTO_EDITAVEL'/spec['file']);svg=tree.getroot()
 if spec['height']==1350:
  spec['height']=1440;svg.set('height','1440');svg.set('viewBox','0 0 1080 1440')
  svg.find('./s:g[@id="01_FUNDO"]/s:rect',ns).set('height','1440')
  # Reveal 60px more of each photo without changing the image scale.
  for rect in svg.findall('.//s:clipPath/s:rect',ns):rect.set('height',str(float(rect.get('height'))+60))
  for img in svg.findall('.//s:image',ns):
   if float(img.get('width','0'))<600:img.set('height',str(float(img.get('height'))+60))
  for group in svg.findall('./s:g',ns):
   gid=group.get('id','')
   if gid=='04_APOIO':group.set('transform','translate(0 30)' if spec['file']=='03_EXAMES_DE_IMAGEM.svg' else 'translate(0 60)')
   elif gid=='04_PONTOS':group.set('transform','translate(0 20)')
   elif gid=='09_RODAPE':group.set('transform','translate(0 90)')
  for t in svg.findall('./s:text',ns):
   if float(t.get('y','0'))>=1100:t.set('y',str(float(t.get('y'))+60))
 tree.write(dst/'01_ABERTO_EDITAVEL'/spec['file'],encoding='utf-8',xml_declaration=True)
(dst/'manifesto.json').write_text(json.dumps(specs),encoding='utf-8')
jsx=(src/'ABRIR_CARROSSEL_NO_ILLUSTRATOR.jsx').read_text(encoding='utf-8')
jsx=re.sub(r'specs=\[.*?\];','specs='+json.dumps(specs)+';',jsx)
jsx=jsx.replace('DocumentColorSpace.RGB,1080,1350','DocumentColorSpace.RGB,1080,1440')
(dst/'ABRIR_CARROSSEL_NO_ILLUSTRATOR.jsx').write_text(jsx,encoding='utf-8')
for name in ['LEGENDA_PARA_COPIAR.txt','EDICAO_DA_FOTO.txt']:
 shutil.copy2(src/name,dst/name)
guide=(src/'COMECE_AQUI.txt').read_text(encoding='utf-8').replace('1080 x 1350','1080 x 1440')
guide+='\nVERSÃO 3:4\nCinco slides do feed em 1080 x 1440. O Story continua em 1080 x 1920. Fotos mantidas sem deformação; mais área visível e rodapés reposicionados. Esta versão não substitui nem remove a anterior 4:5.\n'
(dst/'COMECE_AQUI.txt').write_text(guide,encoding='utf-8')
print(dst)
