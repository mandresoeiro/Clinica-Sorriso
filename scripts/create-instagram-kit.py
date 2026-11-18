from pathlib import Path
import re, html, json, zipfile, sys, base64

ROOT = Path(__file__).resolve().parents[1]
PHOTO = '--photo' in sys.argv
OUT = ROOT / ('output/instagram-rotina-fotografico' if PHOTO else 'output/instagram-rotina-saudavel')
ART = OUT / '01_vetores_editaveis'
ART.mkdir(parents=True, exist_ok=True)
INK='#17383B'; SAGE='#647C69'; GOLD='#B2A184'; CREAM='#F8F6EF'
logo=(ROOT/'public/images/brand/symbol.svg').read_text(encoding='utf-8')
logo=re.sub(r'<title>.*?</title>', '', logo)
logo=logo.replace('<svg ', '<svg x="76" y="72" width="60" height="66" ')

def text(x,y,lines,size=62,color=INK,serif=False,weight='400',step=None):
    if isinstance(lines,str): lines=[lines]
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="{ "Georgia" if serif else "Arial" }" font-size="{size}" font-weight="{weight}">' + ''.join(f'<tspan x="{x}" dy="{0 if i==0 else (step or size*1.18)}">{html.escape(line)}</tspan>' for i,line in enumerate(lines))+'</text>'

def icon(kind,x,y,s=1):
    if kind=='brush':
        p='<rect x="130" y="130" width="44" height="250" rx="22" fill="#647C69"/><rect x="100" y="45" width="104" height="115" rx="22" fill="#17383B"/>' + ''.join(f'<path d="M{111+i*17} 55v60" stroke="#F8F6EF" stroke-width="9" stroke-linecap="round"/>' for i in range(5))+'<path d="M226 80h45m-40 35h25" stroke="#B2A184" stroke-width="8" stroke-linecap="round"/>'
    elif kind=='floss':
        p='<rect x="65" y="130" width="220" height="210" rx="62" fill="#647C69"/><rect x="82" y="145" width="186" height="74" rx="30" fill="#17383B"/><path d="M174 145C98 80 260 20 285 87S355 100 310 35" fill="none" stroke="#B2A184" stroke-width="10" stroke-linecap="round"/><path d="M135 265h80" stroke="#F8F6EF" stroke-width="8" stroke-linecap="round"/>'
    else:
        p='<path d="M90 88C28 88 40 179 68 232C90 272 76 346 111 346C135 346 128 260 168 260C210 260 205 346 232 346C265 346 251 273 277 225C312 159 297 88 247 88C205 88 201 107 168 107C133 107 124 88 90 88Z" fill="#F8F6EF" stroke="#17383B" stroke-width="9"/><path d="M213 164h49m-24-25v50" stroke="#B2A184" stroke-width="10" stroke-linecap="round"/>'
    return f'<g transform="translate({x} {y}) scale({s})">{p}</g>'

def make(name,w,h,title,body,kind='tooth',num='01',dark=False,tag='CUIDADO QUE VIRA HÁBITO',action='Salve para lembrar na sua rotina.'):
    tall=h>1500
    bg=INK if dark else CREAM; fg=CREAM if dark else INK
    top=270 if tall else 240
    title_size=70 if h==1080 else (84 if len(title)<4 else 74)
    pic_y=top+len(title)*title_size*1.18+40
    # Icon is vector geometry; copy occupies its own lower panel.
    panel_y=h-650 if tall else h-415
    if h==1080: panel_y=720; pic_y=370
    icon_scale=.78 if h==1080 else 1.0
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>{html.escape(name)}</title>'
    svg+=f'<g id="Fundo"><rect width="{w}" height="{h}" fill="{bg}"/><circle cx="1030" cy="{int(h*.45)}" r="380" fill="{SAGE}" opacity=".10"/><path d="M76 174H1004" stroke="{GOLD}" stroke-width="2"/></g>'
    svg+=f'<g id="Marca">{logo}'+text(158,103,'Odonto Personnallite',27,fg,weight='700')+text(158,132,'CLÍNICA ODONTOLÓGICA',13,GOLD,weight='400')+'</g>'
    svg+='<g id="Titulo">'+text(80,top-42,tag,17,GOLD,weight='700')+text(76,top+46,title,title_size,fg,serif=True)+'</g>'
    svg+=f'<g id="Ilustracao"><circle cx="810" cy="{pic_y+145}" r="180" fill="{GOLD}" opacity=".17"/>'+icon(kind,640,pic_y-30,icon_scale)+text(80,pic_y+160,num,126,GOLD,serif=True)+'</g>'
    bottom=200 if tall else 0
    svg+=f'<g id="Conteudo"><rect x="56" y="{panel_y}" width="968" height="{h-panel_y-150-bottom}" rx="28" fill="{ "#24474A" if dark else "#E9EEE6" }"/>'+text(88,panel_y+68,body,30,fg,step=46)+'</g>'
    svg+='<g id="Rodape">'+text(80,h-111-bottom,action,22,fg,weight='700')+text(80,h-70-bottom,'odontopersonnallite.com.br',19,GOLD)+text(80,h-38-bottom,'Conteúdo educativo • orientação individual com sua dentista.',14,GOLD)+'</g></svg>'
    if PHOTO:
        jpg=OUT/'03_imagens/fotografia-editorial.jpg'
        data=base64.b64encode(jpg.read_bytes()).decode()
        photo_y=top+len(title)*title_size*1.18+85
        photo_h=panel_y-photo_y-25
        full=dark
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>{html.escape(name)}</title><defs><clipPath id="photo"><rect x="56" y="{photo_y}" width="968" height="{photo_h}" rx="28"/></clipPath><linearGradient id="shade" x2="0" y2="1"><stop stop-color="#102E30" stop-opacity=".6"/><stop offset=".7" stop-color="#102E30" stop-opacity="0"/><stop offset="1" stop-color="#102E30" stop-opacity=".75"/></linearGradient></defs>'
        svg+=f'<g id="Fundo"><rect width="{w}" height="{h}" fill="{bg}"/></g>'
        if full:
            svg+=f'<g id="Fotografia"><image width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/jpeg;base64,{data}"/><rect width="{w}" height="{h}" fill="url(#shade)"/></g>'
        else:
            svg+=f'<g id="Fotografia" clip-path="url(#photo)"><image x="56" y="{photo_y}" width="968" height="{photo_h}" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/jpeg;base64,{data}"/></g>'
        svg+='<g id="Marca">'+logo+text(158,103,'Odonto Personnallite',27,fg,weight='700')+text(158,132,'CLÍNICA ODONTOLÓGICA',13,GOLD)+f'<path d="M76 174H1004" stroke="{GOLD}" stroke-width="2"/></g>'
        svg+='<g id="Titulo">'+text(80,top-42,f'GUIA DO CUIDADO DIÁRIO   /   {num}',17,GOLD,weight='700')+text(76,top+46,title,title_size,fg,serif=True)+'</g>'
        svg+=f'<g id="Conteudo"><rect x="56" y="{panel_y}" width="968" height="{h-panel_y-150-bottom}" rx="22" fill="{INK if full else "#E9EEE6"}" opacity=".95"/>'+text(88,panel_y+68,body,30,fg,step=46)+'</g>'
        svg+='<g id="Rodape">'+text(80,h-111-bottom,action,22,fg,weight='700')+text(80,h-70-bottom,'odontopersonnallite.com.br',19,fg)+text(80,h-38-bottom,'Imagem ilustrativa gerada por IA • conteúdo educativo.',14,fg)+'</g></svg>'
    (ART/(name+'.svg')).write_text(svg,encoding='utf-8')
    return {'file':name+'.svg','width':w,'height':h}

items=[]
slides=[
('01_capa',['Seu sorriso','começa','na rotina.'],['3 cuidados simples para','levar para o dia a dia.'],'tooth',True),
('02_escova',['Cerdas macias.','Cuidado gentil.'],['Use escova de cerdas macias.','Escove com movimentos suaves,','sem fazer força.'],'brush',False),
('03_fluor',['No creme dental,','procure o flúor.'],['Escolha um creme dental com flúor.','Ele ajuda a proteger os dentes','contra a cárie.'],'tooth',False),
('04_fio',['Entre os dentes','também conta.'],['Use o fio dental para complementar','a escovação e limpar os espaços','entre os dentes.'],'floss',False),
('05_final',['Pequenos hábitos.','Cuidado contínuo.'],['Escova macia + creme dental com flúor','+ fio dental. Converse com sua dentista','sobre a rotina adequada para você.'],'tooth',True),
]
for i,(name,title,body,kind,dark) in enumerate(slides): items.append(make('feed_'+name,1080,1350,title,body,kind,f'{i+1:02}',dark,action='Deslize para continuar →' if i<4 else 'Salve e compartilhe esses cuidados.'))
items.append(make('post_quadrado',1080,1080,['Seu sorriso','começa na rotina.'],['Escova macia • creme dental com flúor','Fio dental para complementar o cuidado.'],'brush','01',False,action='Um lembrete para cuidar de você.'))
for i,idx in enumerate([0,1,4]):
    name,title,body,kind,dark=slides[idx]
    items.append(make(f'story_{i+1:02}',1080,1920,title,body,kind,f'{i+1:02}',dark,action='Compartilhe um lembrete de cuidado.'))
for i,(name,title,body,kind,dark) in enumerate(slides):
    items.append(make(f'reel_cena_{i+1:02}',1080,1920,title,body,kind,f'{i+1:02}',dark,action='Odonto Personnallite • cuidado diário'))
(OUT/'manifesto.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
jsx='''#target illustrator
(function(){
 var base=File($.fileName).parent;
 var specs=SPECIFICATIONS;
 var doc=app.documents.add(DocumentColorSpace.RGB,1080,1350);
 try {
 for(var i=0;i<specs.length;i++){
  var spec=specs[i], x=(i%4)*1250, y=-Math.floor(i/4)*2150;
  if(i===0) doc.artboards[0].artboardRect=[x,y,x+spec.width,y-spec.height];
  else doc.artboards.add([x,y,x+spec.width,y-spec.height]);
  doc.artboards[i].name=spec.file.replace('.svg','');
  var src=app.open(new File(base.fsName+'/01_vetores_editaveis/'+spec.file));
  var rect=src.artboards[0].artboardRect;
  var dest=doc.layers.add(); dest.name=spec.file.replace('.svg','');
  for(var p=src.pageItems.length-1;p>=0;p--){
   var item=src.pageItems[p];
   if(item.parent.typename==='Layer'){
    var copied=item.duplicate(dest,ElementPlacement.PLACEATEND);
    copied.translate(x-rect[0],y-rect[1]);
   }
  }
  src.close(SaveOptions.DONOTSAVECHANGES);
 }
 app.activeDocument=doc; doc.artboards.setActiveArtboardIndex(0);
 var options=new IllustratorSaveOptions(); options.pdfCompatible=true;
 doc.saveAs(new File(base.fsName+'/Odonto_Rotina_Saudavel.ai'),options);
 alert('Projeto salvo: Odonto_Rotina_Saudavel.ai. Revise textos, fontes e identificação profissional antes de publicar.');
 } catch(e){alert('Não foi possível concluir: '+e.message+'. Os SVGs individuais continuam disponíveis para abrir no Illustrator.');}
})();
'''.replace('SPECIFICATIONS',json.dumps(items,ensure_ascii=True))
(OUT/'ABRIR_NO_ILLUSTRATOR.jsx').write_text(jsx,encoding='utf-8')
(OUT/'LEIA-ME.txt').write_text('''ODONTO PERSONNALLITE — SEU SORRISO COMEÇA NA ROTINA
Projeto vetorial RGB, textos editáveis, ilustrações vetoriais e logo existente.

COMO ABRIR
1. Extraia o ZIP inteiro, mantendo a pasta 01_vetores_editaveis.
2. Illustrator > Arquivo > Scripts > Outro script.
3. Selecione ABRIR_NO_ILLUSTRATOR.jsx.
4. O script cria 14 pranchetas e salva Odonto_Rotina_Saudavel.ai nesta pasta.
Alternativa: abra qualquer SVG diretamente e use Salvar como > Adobe Illustrator (.ai).
O .ai é criado pelo seu Illustrator; não há arquivo .ai nativo previamente validado neste pacote.
Script preparado, mas não executado no Illustrator nesta sessão. Não sobrescreve o projeto do site.

FORMATOS
Feed: carrossel de 5 peças, 1080 x 1350.
Post: 1080 x 1080.
Story: sequência de 3 peças, 1080 x 1920.
Reel: 5 cenas verticais, 1080 x 1920; cena 01 serve de capa.
Reel não é um vídeo MP4: monte as cenas em um editor de vídeo. Roteiro incluído.
As áreas centrais acomodam os textos; confira o recorte na prévia do Instagram.

EDIÇÃO / EXPORTAÇÃO
Fontes: Georgia para títulos e Arial para apoio. Se faltarem, substitua antes de exportar.
Os PNGs são cópias prontas para revisão. Edite os SVGs ou o .ai gerado.
Arquivo > Exportar > Exportar para telas > PNG, escala 1x, RGB.
Antes de publicar, a clínica deve revisar o conteúdo e acrescentar a identificação profissional aplicável. Não foram inventados CROs, especialidades nem credenciais.
''',encoding='utf-8')
(OUT/'LEGENDA_E_ROTEIRO.txt').write_text('''TEMA: Seu sorriso começa na rotina

LEGENDA
Seu sorriso merece cuidado todos os dias. 🦷
Três lembretes para a rotina:
• Escova com cerdas macias e movimentos suaves.
• Creme dental com flúor.
• Fio dental para complementar a escovação.
Converse com sua dentista sobre a higiene adequada para você.
Salve este post para lembrar e compartilhe com alguém que você cuida.
Odonto Personnallite | Belém
odontopersonnallite.com.br
#SaúdeBucal #HigieneBucal #OdontoPersonnallite #Belém

REEL — 20 SEGUNDOS
00–04: cena 01. Narração: Seu sorriso começa na rotina.
04–08: cena 02. Narração: Escolha uma escova macia e faça movimentos suaves.
08–12: cena 03. Narração: Use creme dental com flúor para ajudar a proteger os dentes.
12–16: cena 04. Narração: Complete o cuidado com fio dental.
16–20: cena 05. Narração: Salve esses lembretes e converse com sua dentista.
Animação sugerida: entrada suave de títulos, leve aproximação das ilustrações e transições curtas. Mantenha as legendas legíveis.
Use áudio original ou música com licença adequada. Nenhuma faixa foi incluída.
As cenas são artes estáticas: a duração, narração e animação são montadas no editor de vídeo.

STORIES
01: abertura do tema.
02: dica da escova. Pode adicionar enquete nativa: Você prefere escova macia? Sim / Tenho dúvidas.
03: resumo. Adicione o adesivo de link do Instagram para o site, se desejar.

FONTE EDITORIAL
Ministério da Saúde — Saúde Bucal:
https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-bucal
Referência de conteúdo, não endosso à clínica. Conteúdo educativo geral, sem diagnóstico individual.
''',encoding='utf-8')
print(str(OUT))

