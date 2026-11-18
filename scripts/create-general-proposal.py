from pathlib import Path
from xml.sax.saxutils import escape
import re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
root=Path(__file__).resolve().parents[1]
pdfmetrics.registerFont(TTFont('Segoe','C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold','C:/Windows/Fonts/segoeuib.ttf'))
pdfmetrics.registerFont(TTFont('Georgia','C:/Windows/Fonts/georgia.ttf'))
G=colors.HexColor('#17383b'); A=colors.HexColor('#ac8b54'); L=colors.HexColor('#edf2ef')
s=getSampleStyleSheet()
for name,font,size,lead,after in [('BodyX','Segoe',10,15,9),('HeadX','SegoeBold',14,19,10),('TitleX','Georgia',27,33,18),('SmallX','Segoe',8,12,7),('CellX','Segoe',9,13,0),('WhiteX','SegoeBold',9,13,0)]:
 s.add(ParagraphStyle(name=name,fontName=font,fontSize=size,leading=lead,spaceAfter=after,textColor=colors.white if name=='WhiteX' else G,keepWithNext=name in ['HeadX','TitleX']))
s['HeadX'].spaceBefore=12
text=(root/'output/projeto-geral-odonto-personnallite.md').read_text(encoding='utf-8-sig')
parts=re.split(r'^## ',text,flags=re.M)
sections={}
for part in parts[1:]:
 lines=part.strip().splitlines(); number=int(lines[0].split('.')[0]);sections[number]=(lines[0],lines[1:])
story=[]
def p(t,style='BodyX'):story.append(Paragraph(escape(t),s[style]))
def title(k,t):
 if story:story.append(PageBreak())
 p('ODONTO PERSONNALLITE / '+k,'SmallX');p(t,'TitleX')
def section(n):
 h,lines=sections[n];p(h,'HeadX')
 for line in lines:
  if line.strip():p(line)
def table(headers,rows,widths):
 data=[[Paragraph(escape(str(c)),s['WhiteX']) for c in headers]]+[[Paragraph(escape(str(c)),s['CellX']) for c in row] for row in rows]
 t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),G),('VALIGN',(0,0),(-1,-1),'TOP'),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,L]),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),('LINEBELOW',(0,0),(-1,0),2,A)]));story.append(t);story.append(Spacer(1,14))
title('PROPOSTA COMERCIAL','Presença digital com clareza, cuidado e propósito.')
p('Clínica Odonto Personnallite','HeadX');p('Site institucional • Landing pages • Instagram • WhatsApp • Divulgação paga')
story.append(Spacer(1,25));p('Três opções para começar e evoluir','HeadX')
table(['Plano','Serviços mensais','Mídia sugerida','Total mensal'],[['Presença Essencial','R$ 300','R$ 0','R$ 300'],['Divulgação Local','R$ 500','R$ 300','R$ 800'],['Presença Ampliada','R$ 800','R$ 600','R$ 1.400']],[168,105,105,129])
p('Criação inicial comum aos planos: R$ 900, em 3 parcelas de R$ 300. Domínios e outros terceiros são separados. As opções não são cumulativas.')
p('Condição especial inicial por 3 meses. Documento para avaliação e negociação. Valores dependem de aceite; anúncios não estão ativados.','SmallX')
p('Emissão: 12 de outubro de 2026 | Versão comercial detalhada','SmallX')
title('01 / VISÃO GERAL','O projeto e a jornada do paciente')
for n in [1,2,3]:section(n)
title('02 / ENTREGAS DIGITAIS','Identidade, site e páginas de tratamento')
for n in [4,5,6]:section(n)
title('03 / CANAIS E ESTRUTURA','Instagram, atendimento e domínios')
for n in [7,8,9]:section(n)
title('04 / INVESTIMENTO INICIAL','Criação e entrega do projeto')
table(['Entrega','Pagamento único'],[['Site institucional','R$ 450'],['Landing de próteses','R$ 150'],['Landing de urgência em prótese','R$ 100'],['Landing de urgência odontológica','R$ 100'],['Organização inicial de bio, links e capas','R$ 100'],['TOTAL DA CRIAÇÃO','R$ 900']],[365,142])
p('Pagamento proposto: 3 parcelas de R$ 300, com a primeira na aprovação. Este valor é comum às três opções e é cobrado uma única vez.','HeadX')
section(10)
plans=[(11,'OPÇÃO 1','Presença Essencial',[['Instagram: 4 publicações e até 4 stories adaptados','R$ 200'],['Manutenção: até 1 hora/mês','R$ 100'],['TOTAL DOS SERVIÇOS MENSAIS','R$ 300'],['Verba de anúncios','R$ 0'],['TOTAL OPERACIONAL MENSAL','R$ 300']], 'R$ 600','R$ 1.800'),(12,'OPÇÃO 2','Divulgação Local',[['Instagram: 4 publicações e até 4 stories adaptados','R$ 200'],['Manutenção: até 1 hora/mês','R$ 100'],['Gestão Meta: 1 campanha e até 2 peças/mês','R$ 200'],['TOTAL DOS SERVIÇOS MENSAIS','R$ 500'],['Verba Meta sugerida, paga diretamente','R$ 300'],['TOTAL OPERACIONAL MENSAL','R$ 800']], 'R$ 1.100','R$ 3.300'),(13,'OPÇÃO 3','Presença Ampliada',[['Instagram: 8 publicações e até 8 stories adaptados','R$ 350'],['Manutenção: até 2 horas/mês','R$ 150'],['Gestão Meta: até 2 campanhas e 4 peças/mês','R$ 300'],['TOTAL DOS SERVIÇOS MENSAIS','R$ 800'],['Verba Meta sugerida, paga diretamente','R$ 600'],['TOTAL OPERACIONAL MENSAL','R$ 1.400']], 'R$ 1.700','R$ 5.100')]
for n,label,name,rows,monthly,total in plans:
 title(label,name);table(['Composição mensal','Valor'],rows,[365,142]);section(n)
 p('Durante as 3 parcelas da criação: '+monthly+'/mês. Total dos primeiros 3 meses: '+total+'. Inclui criação, serviços e mídia prevista. Domínios e terceiros adicionais ficam fora.','SmallX')
title('05 / COMPARATIVO','Quanto será investido em cada etapa')
table(['Investimento','Essencial','Local','Ampliada'],[['Criação (única)','R$ 900','R$ 900','R$ 900'],['Serviços/mês','R$ 300','R$ 500','R$ 800'],['Mídia sugerida/mês','R$ 0','R$ 300','R$ 600'],['Operação após criação','R$ 300/mês','R$ 800/mês','R$ 1.400/mês'],['Meses 1 a 3, com parcela','R$ 600/mês','R$ 1.100/mês','R$ 1.700/mês'],['Total dos 3 primeiros meses','R$ 1.800','R$ 3.300','R$ 5.100']],[195,104,104,104])
p('Os cálculos consideram início imediato dos serviços e da mídia sugerida. A verba acompanha a data de ativação acordada. Escolhe-se uma opção; não se somam os planos.')
table(['Despesa externa','Referência / condição'],[['Domínio .com.br','R$ 40/ano como referência; confirmar no Registro.br'],['Domínio .com','US$ 10,46/ano como referência; câmbio e encargos à parte'],['Hospedagem estática','R$ 0 adicionais previstos, dentro do plano gratuito atual'],['WhatsApp básico','Sem licença adicional prevista; API não incluída'],['Fotos, e-mail, marca e ferramentas','Sob cotação e aprovação; não incluídos']],[195,312])
p('Disponibilidade dos domínios não confirmada. Não há orçamento fechado em reais para o .com. Valores de terceiros não são receita do prestador.','SmallX')
title('06 / OPERAÇÃO','Campanhas, conteúdo e acompanhamento')
for n in [15,16,17]:section(n)
title('07 / RESPONSABILIDADES','O que falta e os limites da contratação')
for n in [18,19,20]:section(n)
title('08 / ENTREGA','Cronograma, titularidade e continuidade')
for n in [21,22]:section(n)
title('09 / ACEITE','Referências e aprovação comercial')
for n in [23,24]:section(n)
def footer(c,d):
 c.setFillColor(G);c.rect(0,824,595,18,fill=1,stroke=0)
 c.setFont('Segoe',8);c.setFillColor(colors.HexColor('#738073'));c.drawString(44,28,'ODONTO PERSONNALLITE | PROPOSTA COMERCIAL | 12/10/2026');c.drawRightString(550,28,str(d.page))
pdf=root/'output/pdf/projeto-geral-odonto-personnallite.pdf'
SimpleDocTemplate(str(pdf),rightMargin=44,leftMargin=44,topMargin=42,bottomMargin=48,title='Proposta comercial detalhada - Clínica Odonto Personnallite',author='Projeto Odonto Personnallite').build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(pdf);alltext=''.join(p.extract_text() for p in r.pages)
assert all(v in alltext for v in ['5.100','3.300','1.800','Presença Ampliada'])
print(len(r.pages),'paginas')
