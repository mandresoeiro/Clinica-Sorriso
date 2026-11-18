from pathlib import Path
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,Image,Table
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PIL
root=Path(__file__).resolve().parents[1];folder=root/'output/kit-logo-atual'
pdfmetrics.registerFont(TTFont('S','C:/Windows/Fonts/segoeui.ttf'));pdfmetrics.registerFont(TTFont('SB','C:/Windows/Fonts/segoeuib.ttf'))
s=getSampleStyleSheet();s.add(ParagraphStyle(name='B',fontName='S',fontSize=10,leading=15,spaceAfter=12,textColor=colors.HexColor('#17383b')));s.add(ParagraphStyle(name='H',fontName='SB',fontSize=24,leading=29,spaceAfter=20,textColor=colors.HexColor('#17383b')))
a=[]
def title(t):
 if a:a.append(PageBreak())
 a.append(Paragraph(t,s['H']))
def p(t):a.append(Paragraph(t,s['B']))
def img(n,w,h):
 file=next(folder.glob(f'{n:02d}-*.png'));im=PIL.open(file);ratio=min(w/im.width,h/im.height);return Image(str(file),width=im.width*ratio,height=im.height*ratio)
title('Kit de comunicação<br/>Logo atual preservada');p('Clínica Odonto Personnallite | Cartão de visita: frente e verso');a.extend([img(1,460,250),Spacer(1,15),img(2,460,250)]);p('PROVAS PARA REVISÃO. Confirmar telefone completo, endereço e identificação profissional antes da impressão. Este PDF é apresentação, não arquivo final de gráfica.')
title('Papel timbrado');a.append(img(3,470,560));p('Formato proporcional A4. Campo de identificação profissional pendente; dados de contato sujeitos à conferência.')
title('Perfil e WhatsApp');a.append(Table([[img(4,240,240),img(15,240,240)]]));p('Esquerda: perfil compartilhado para Instagram e WhatsApp. Direita: card manual de boas-vindas. As respostas sugeridas estão em arquivo de texto separado. Não há automação instalada.')
title('Seis capas dos destaques');a.append(Table([[img(5,155,155),img(6,155,155),img(7,155,155)],[Paragraph('Clínica',s['B']),Paragraph('Equipe',s['B']),Paragraph('Cuidados',s['B'])],[img(8,155,155),img(9,155,155),img(10,155,155)],[Paragraph('Próteses',s['B']),Paragraph('Atendimento',s['B']),Paragraph('Localização',s['B'])]]));p('Ícones dourados sobre verde. Nomes identificados nos arquivos. Mantidas as seis categorias existentes.')
title('Três modelos de publicação');a.append(Table([[img(11,160,250),img(12,160,250),img(13,160,250)]]));p('Formato 1080 x 1350. São modelos editáveis; revisar conteúdo, dados e identificação profissional antes de publicar. Não incluem fotografias ou depoimentos fictícios.')
title('Story e instruções');a.append(img(14,230,400));p('Formato 1080 x 1920. Adicionar o link na ferramenta de stories do Instagram; o texto da imagem não é um botão clicável. SVGs editáveis no Illustrator, PNGs para uso digital. Leia as instruções do ZIP antes de produzir. As peças mantêm o símbolo do site e usam assinatura textual adaptada ao formato.')
def footer(c,d):
 c.setFont('S',8);c.drawString(44,28,'ODONTO PERSONNALLITE | PROVAS E MODELOS | DADOS A VALIDAR');c.drawRightString(550,28,str(d.page))
SimpleDocTemplate(str(root/'output/pdf/kit-comunicacao-logo-atual.pdf'),leftMargin=44,rightMargin=44,topMargin=40,bottomMargin=48).build(a,onFirstPage=footer,onLaterPages=footer)
