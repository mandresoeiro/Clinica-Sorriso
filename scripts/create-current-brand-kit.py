from pathlib import Path
from html import escape
import re
out=Path('output/kit-logo-atual');out.mkdir(parents=True,exist_ok=True)
source=Path('public/images/brand/symbol.svg').read_text(encoding='utf-8-sig')
paths=re.search(r'</title>(.*)</svg>',source,re.S).group(1)
G='#17383B';A='#B2A184';I='#F8F6EF'
def symbol(x,y,size):return f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="380 170 330 360">{paths}</svg>'
def text(x,y,t,size=24,color=G,anchor='start',family='Arial',weight='normal'):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-family="{family}" font-weight="{weight}" text-anchor="{anchor}">{escape(t)}</text>'
def brand(x,y,size=100,color=G):
 return symbol(x,y,size)+text(x+size+20,y+size*.46,'Odonto Personnallite',size*.24,color,weight='bold')+text(x+size+20,y+size*.7,'CLÍNICA ODONTOLÓGICA',size*.105,color)
def svg(name,w,h,body,bg=I):
 (out/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>{escape(name)} - logo atual preservada</title><rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>',encoding='utf-8')
def line(x1,y,x2):return f'<path d="M{x1} {y} H{x2}" stroke="{A}" stroke-width="2"/>'
# Card 96x56 mm incl. 3mm bleed each side, trim90x50mm
svg('01-cartao-frente',1134,661,symbol(440,70,250)+text(567,390,'ODONTO',40,I,'middle',family='Georgia')+text(567,460,'PERSONNALLITE',58,I,'middle',family='Georgia')+line(360,510,774)+text(567,555,'CLÍNICA ODONTOLÓGICA',22,A,'middle'),G)
svg('02-cartao-verso',1134,661,brand(90,65,150)+line(90,255,1044)+text(90,325,'WhatsApp  (91) 8188-8353',34)+text(90,390,'Instagram  @odontopersonallite_',30)+text(90,455,'Travessa Almirante Wandenkolk, 1243',28)+text(90,500,'Belém • PA',27)+text(90,580,'PROVA • Confirmar contato e identificação profissional',18))
svg('03-papel-timbrado',1240,1754,brand(85,75,130)+line(85,250,1155)+text(85,320,'[Identificação profissional / CRO a confirmar]',17)+line(85,1570,1155)+text(85,1620,'Travessa Almirante Wandenkolk, 1243 • Belém/PA',20)+text(85,1660,'(91) 8188-8353  |  @odontopersonallite_',20)+text(85,1710,'PROVA • Dados sujeitos à conferência antes do uso',15))
svg('04-perfil-instagram-whatsapp',1080,1080,symbol(210,140,660)+text(540,880,'ODONTO',55,I,'middle')+text(540,950,'PERSONNALLITE',50,I,'middle'),G)
icons={
'clinica':'<path d="M-65 65 V-65 H65 V65 M-90 65 H90 M-20 65 V20 H20 V65 M-25 -30 H25 M0 -55 V-5"/>',
'equipe':'<circle cx="0" cy="-35" r="28"/><path d="M-50 65 V35 Q-50 0 0 0 Q50 0 50 35 V65 M-90 55 V30 Q-90 0 -65 -5 M90 55 V30 Q90 0 65 -5"/>',
'cuidados':'<path d="M0 75 C-130 -5 -60 -110 0 -45 C60 -110 130 -5 0 75 M-25 0 H25 M0 -25 V25"/>',
'proteses':'<path d="M0 -55 C-80 -100 -100 -20 -65 40 Q-40 120 -20 50 Q0 5 20 50 Q40 120 65 40 C100 -20 80 -100 0 -55 Z"/>',
'atendimento':'<path d="M-80 45 V-35 Q-80 -70 -45 -70 H45 Q80 -70 80 -35 V25 Q80 60 45 60 H-35 L-80 95 Z M-40 -20 H40 M-40 15 H20"/>',
'localizacao':'<path d="M0 95 C-160 -45 -45 -125 0 -75 C45 -125 160 -45 0 95 Z"/><circle cx="0" cy="-30" r="25"/>'}
for i,(name,path) in enumerate(icons.items(),5):
 svg(f'{i:02d}-destaque-{name}',1080,1080,f'<circle cx="540" cy="540" r="405" fill="none" stroke="{A}" stroke-width="3"/><g transform="translate(540 540) scale(3.1)" fill="none" stroke="{A}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">{path}</g>',G)
posts=[('Cuidado começa','com uma conversa.','Conheça a clínica e consulte horários.'),('Cada sorriso','tem sua história.','Avaliação individual para planejar seu cuidado.'),('Estamos','em Belém.','Trav. Almirante Wandenkolk, 1243')]
for n,(a,b,c) in enumerate(posts,11):
 svg(f'{n:02d}-post-modelo',1080,1350,brand(90,80,130)+symbol(660,400,500)+text(90,570,a,65,family='Georgia')+text(90,665,b,65,family='Georgia')+line(90,750,540)+text(90,850,c,28)+text(90,1190,'@odontopersonallite_',26)+text(90,1270,'MODELO • Revisar dados e identificação profissional',19))
svg('14-story-modelo',1080,1920,brand(90,180,130,I)+text(90,750,'Vamos',105,I,family='Georgia')+text(90,880,'conversar?',105,I,family='Georgia')+line(90,1000,720)+text(90,1120,'Consulte horários para sua avaliação.',34,I)+text(90,1480,'Adicione o link do WhatsApp no Instagram',27,I)+text(90,1700,'MODELO • Dados e identificação a validar',22,A),G)
svg('15-whatsapp-boas-vindas',1080,1080,brand(80,75,120)+text(80,430,'Bem-vindo(a)!',70,family='Georgia')+text(80,550,'Conte como podemos ajudar.',36)+text(80,650,'A equipe confirma a disponibilidade',30)+text(80,705,'e as informações de agendamento.',30)+text(80,950,'Modelo visual para envio • sem automação',22))
(out/'LEIA-ME.txt').write_text('KIT COM LOGO ATUAL DO SITE\n\nO símbolo SVG do site foi preservado. Assinaturas de texto foram compostas para os formatos, sem redesenhar o símbolo. SVGs abrem no Illustrator; PNGs são cópias rasterizadas. Fontes de apoio: Arial e Georgia; confirme licença/disponibilidade e preserve uma cópia editável antes de converter textos em contornos.\n\nCartão: documento 96x56mm, incluindo sangria3mm em cada lado; corte90x50mm. SVG/PNG em RGB. PDF de apresentação NÃO é arquivo de gráfica. Antes de imprimir, confirmar telefone completo, endereço, CRO/responsável técnico e requisitos de CMYK, sangria e corte com a gráfica. O telefone informado ainda precisa de confirmação. Os domínios não foram incluídos porque não estão contratados.\n\nCartão e papel timbrado são provas. Posts/stories são modelos. Não publicar ou imprimir como definitivo sem validação dos dados e identificação profissional. Fotos de pacientes e depoimentos não foram usados.\n\nWhatsApp: imagem de perfil e card de boas-vindas para uso manual. Respostas sugeridas no arquivo separado. Nenhuma mensagem foi enviada e nenhuma automação foi ativada.\n\nCapas: Clinica, Equipe, Cuidados, Proteses, Atendimento e Localizacao. Os nomes estão nos arquivos, os ícones não precisam de texto dentro do círculo.\n',encoding='utf-8')
(out/'respostas-whatsapp.txt').write_text('SUGESTÕES PARA REVISÃO DA CLÍNICA\n\nBoas-vindas: Olá! Seja bem-vindo(a) à Clínica Odonto Personnallite. Como podemos ajudar?\n\nHorários: Informe, por favor, sua preferência de dia e período para consultarmos a disponibilidade. A equipe confirma o agendamento após verificar a agenda.\n\nEndereço: Estamos na Travessa Almirante Wandenkolk, 1243, Belém/PA. Confirme seu horário antes de sair.\n\nAvaliação: As possibilidades, etapas e valores são definidos pelo profissional após avaliação. Podemos consultar um horário para você?\n\nAusência: Obrigado pelo contato. Responderemos no próximo período de atendimento. Esta mensagem não confirma agendamento.\n\nRevisar textos, endereço, horários e rotina antes do uso. Não é atendimento clínico, não substitui orientação profissional e não foi instalado como resposta automática.\n',encoding='utf-8')
print('15 SVGs criados')
