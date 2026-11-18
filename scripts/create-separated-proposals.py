from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
import subprocess, zipfile

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/propostas-separadas'; OUT.mkdir(parents=True,exist_ok=True)
QA=ROOT/'tmp/pdfs/propostas-separadas'; QA.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Segoe','C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold','C:/Windows/Fonts/segoeuib.ttf'))
pdfmetrics.registerFont(TTFont('Georgia','C:/Windows/Fonts/georgia.ttf'))
G=colors.HexColor('#17383b'); GOLD=colors.HexColor('#b2a184'); LIGHT=colors.HexColor('#edf2ef')
S=getSampleStyleSheet()
for name,font,size,lead in [('Body','Segoe',10,15),('Title','Georgia',27,33),('Head','SegoeBold',14,19),('Small','Segoe',8,12),('Cell','Segoe',9,13)]:
 S.add(ParagraphStyle(name=name+'P',fontName=font,fontSize=size,leading=lead,textColor=G,spaceAfter=9,keepWithNext=name in ['Title','Head']))

def p(text,style='Body'): return Paragraph(escape(text),S[style+'P'])
def table(rows):
 t=Table([[p(a,'Cell'),p(b,'Cell')] for a,b in rows],colWidths=[350,157],hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),LIGHT),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,0),1,GOLD)]))
 return t
def footer(c,d):
 c.setFillColor(G);c.rect(0,824,595,18,fill=1,stroke=0)
 c.setFont('Segoe',8);c.drawString(44,27,'CLÍNICA ODONTO PERSONNALLITE | PROPOSTA PARA APROVAÇÃO | 12/10/2026');c.drawRightString(550,27,str(d.page))
def page(st,label,title,lines):
 if st:st.append(PageBreak())
 st.extend([p(label,'Small'),p(title,'Title')])
 for h,body in lines:
  st.append(p(h,'Head'))
  st.extend(p(x) for x in body)

site=['Site institucional existente: apresentação da clínica, tratamentos, localização, horários e contatos; adaptação para celular e computador; links para WhatsApp e Instagram.', 'Finalização com dados e fotos aprovados pela clínica, uma rodada consolidada de revisão, teste dos links e publicação. Configuração dos domínios adquiridos no projeto existente incluída.']
land=['Três landing pages existentes: próteses (R$ 150), urgência em prótese (R$ 100) e urgência odontológica (R$ 100). Total: R$ 350.', 'Páginas no mesmo site, com informações específicas e botão de WhatsApp. Podem receber visitantes de anúncios. Novas páginas e novos tratamentos são orçados à parte.']
ig=['Organização inicial: nome de apresentação, bio, links e destaques com as capas existentes. Valor único: R$ 100. Preserva a logo atual.', 'Gestão essencial: quatro posts estáticos ou carrosséis de até cinco telas e até quatro adaptações para Stories por mês; legendas, calendário e programação quando houver acesso; uma rodada consolidada por peça. R$ 200/mês.']
third=['Domínio odontopersonnallite.com.br: referência de planejamento R$ 40/ano no Registro.br. Domínio odontopersonnallite.com: referência US$ 10,46/ano na Cloudflare Registrar; câmbio, impostos e tarifas separados. Preços e disponibilidade precisam ser confirmados na compra; não são cotações vigentes garantidas.', 'Hospedagem estática: R$ 0 adicionais previstos enquanto o projeto atender às condições do plano gratuito da Cloudflare. Plano pago ou migração depende de aprovação.', 'Meta Ads: verba paga diretamente pela clínica à Meta, separada dos honorários. Não será cobrada novamente como custo extra se já aparecer no total mensal da opção.', 'E-mail profissional, fotos e filmagens, impressão, fachada, uniformes, fontes pagas, API, CRM e registro de marca: sob cotação e aprovação; não incluídos. Registro de domínio não registra a marca.']
conditions=['Condição especial sugerida para avaliação. Escolher uma opção: os cinco pacotes não são cumulativos. Valores ainda dependem de aceite; não representam cobrança efetuada.', 'Início mediante aceite por escrito e primeira parcela. Prazo sugerido para finalização: 10 a 15 dias úteis após recebimento de todos os dados e materiais. Atrasos nas aprovações alteram o cronograma.', 'Serviços mensais: ciclo inicial proposto de três meses, com revisão ao final. Cobrança mensal antecipada; cancelamento com aviso de 30 dias, sem eliminar parcelas da implantação já contratada. Datas exatas serão definidas no aceite.', 'A clínica fornece materiais autorizados, dados profissionais e CRO, valida tratamentos e textos e responde aos pacientes. Confirmar o número completo do WhatsApp antes do lançamento. Fotos demonstrativas devem ser substituídas ou claramente identificadas.', 'Domínios e contas devem pertencer à clínica, com recuperação e autenticação em duas etapas. Na quitação da implantação, entregar os arquivos do site e orientar os acessos; hospedagem e contratos externos seguem as condições de cada fornecedor.', 'Não inclui agendamento automático, sistema de pacientes, desenvolvimento de CRM, atendimento diário, cobertura de eventos, alterações ilimitadas ou suporte 24 horas. Alterações fora do escopo exigem orçamento prévio.']
plans=[
 ('01-site-institucional','01 / SITE AVULSO','Site institucional',450,0,0,[('Site institucional - pagamento único','R$ 450')], [('Entrega do site',site),('Continuidade opcional',['Manutenção: R$ 100/mês por até uma hora não acumulativa de pequenas alterações em textos, imagens, horários e links. Não incluída no preço desta opção.','Landing pages, organização do Instagram e tráfego pago não estão incluídos.'])]),
 ('02-site-landing-pages','02 / ESTRUTURA DIGITAL','Site + landing pages',800,0,0,[('Site institucional','R$ 450'),('Landing pages - três existentes','R$ 350'),('Total - pagamento único','R$ 800')],[('Site institucional',site),('Páginas de tratamento',land),('Continuidade opcional',['Manutenção: R$ 100/mês, até uma hora não acumulativa. Instagram e gestão de anúncios não estão incluídos nesta opção.'])]),
 ('03-presenca-essencial','03 / PRESENÇA ESSENCIAL','Site e Instagram organizados',900,300,0,[('Implantação: site 450 + páginas 350 + Instagram 100','R$ 900'),('Instagram - mensal','R$ 200'),('Manutenção - mensal','R$ 100'),('Total mensal de serviços','R$ 300')],[('Implantação',site+land+[ig[0]]),('Operação mensal',[ig[1],'Manutenção: até uma hora mensal não acumulativa para pequenos ajustes e conferência dos links. Não inclui anúncios nem verba de mídia.'])]),
 ('04-divulgacao-local','04 / DIVULGAÇÃO LOCAL','Presença digital + anúncios',900,500,300,[('Implantação: site 450 + páginas 350 + Instagram 100','R$ 900'),('Instagram - mensal','R$ 200'),('Manutenção - mensal','R$ 100'),('Gestão de tráfego Meta - mensal','R$ 200'),('Subtotal de serviços mensais','R$ 500'),('Verba Meta sugerida - paga diretamente','R$ 300/mês'),('Total mensal com mídia','R$ 800')],[('Implantação',site+land+[ig[0]]),('Gestão mensal',[ig[1],'Manutenção: até uma hora por mês não acumulativa. Tráfego: uma campanha Meta, até duas peças ou adaptações por mês, definição de região, acompanhamento, ajustes e relatório mensal simples.'])]),
 ('05-gestao-ampliada','05 / GESTÃO AMPLIADA','Conteúdo e divulgação ampliados',900,800,600,[('Implantação: site 450 + páginas 350 + Instagram 100','R$ 900'),('Instagram ampliado - mensal','R$ 350'),('Manutenção ampliada - mensal','R$ 150'),('Gestão de tráfego ampliada - mensal','R$ 300'),('Subtotal de serviços mensais','R$ 800'),('Verba Meta sugerida - paga diretamente','R$ 600/mês'),('Total mensal com mídia','R$ 1.400')],[('Implantação',site+land+[ig[0]]),('Gestão mensal',['Instagram: oito publicações por mês, incluindo até dois vídeos simples de até 30 segundos editados a partir de gravações fornecidas pela clínica; até oito adaptações para Stories; calendário, legendas e uma rodada de revisão por peça.','Manutenção: até duas horas mensais não acumulativas. Meta: até duas campanhas e quatro peças/adaptações mensais, conferência semanal, relatório e reunião mensal de até 30 minutos.'])])
]
files=[]
for slug,label,title,initial,monthly,media,rows,details in plans:
 st=[];page(st,label,title,[('Indicação',['Uma contratação com escopo definido para a Clínica Odonto Personnallite. A identidade visual é opcional e possui proposta própria.'])]);st.append(table([('Composição financeira','Valor')]+rows))
 installments=3 if initial==900 else 2
 st.extend([Spacer(1,14),p(f'Implantação em {installments} parcelas de R$ {initial/installments:,.0f}. Primeira parcela no aceite.'),p(f'Total dos três primeiros meses: R$ {initial+3*(monthly+media):,.0f}, considerando implantação integral e três ciclos mensais de serviços e mídia previstos. Domínios e opcionais separados.'.replace(',','.'))])
 if monthly:st.append(p(f'Durante as três parcelas: R$ {initial//3+monthly+media:,.0f}/mês. Após a implantação: R$ {monthly+media:,.0f}/mês, incluindo a mídia indicada.'.replace(',','.')))
 page(st,'ESCOPO E EXECUÇÃO','O que será entregue',details)
 if media:st.append(p('Os anúncios direcionam para a página do tratamento ou WhatsApp. Ativação somente após aprovação e validação dos dados. Não há garantia de pacientes ou vendas; Google Ads e atendimento das mensagens não estão incluídos.'))
 page(st,'CONDIÇÕES E TERCEIROS','Como contratar e operar',[('Pagamentos externos',third),('Responsabilidades e condições',conditions)])
 st.append(p('Aceite: opção escolhida __________________  Responsável __________________  Data __________','Small'))
 path=OUT/(slug+'.pdf');SimpleDocTemplate(str(path),leftMargin=44,rightMargin=44,topMargin=43,bottomMargin=48,title=title+' - Odonto Personnallite',author='Projeto Odonto Personnallite').build(st,onFirstPage=footer,onLaterPages=footer);files.append(path)

st=[];page(st,'06 / CONTRATAÇÃO OPCIONAL','Padronização visual com a logo atual',[('Direção',['Manter a logo atual e organizar cores, tipografia e aplicações para transmitir cuidado e elegância. Esta contratação é separada dos cinco pacotes digitais; não inclui redesenho da marca.'])])
st.append(table([('Essencial - pagamento único','R$ 600'),('Cores e tipografia','R$ 100'),('Adaptação de formatos da logo','R$ 100'),('Seis capas de destaques','R$ 100'),('Três modelos de posts','R$ 200'),('Guia e arquivos finais','R$ 100')]))
st.append(Spacer(1,14));st.append(p('Pagamento: 2 parcelas de R$ 300. A logo será preservada; os modelos são bases reutilizáveis, não uma mensalidade de produção.'))
page(st,'ALTERNATIVA AMPLIADA','Mais aplicações da marca',[('Composição',['A alternativa ampliada substitui a essencial; não se somam os dois totais.'])])
st.append(table([('Ampliada - pagamento único','R$ 1.000'),('Todo o pacote essencial','R$ 600'),('Manual ampliado','R$ 100'),('Três modelos adicionais de posts - seis no total','R$ 100'),('Cartão frente/verso e papel timbrado','R$ 100'),('Simulações de fachada, uniforme e aplicação no site','R$ 100')]))
st.append(Spacer(1,14));st.extend([p('Pagamento: 2 parcelas de R$ 500.'),p('Quando houver cobrança anterior de bio/capas pelo mesmo trabalho, conceder crédito de R$ 100: essencial R$ 500 ou ampliada R$ 900. Registrar o crédito no aceite; não duplicar a cobrança.'),p('Arquivos SVG e PNG para as aplicações compatíveis, guia em PDF e editáveis no formato combinado. Cartão e papel timbrado são arquivos de arte; impressão não incluída.')])
page(st,'ENTREGA E APROVAÇÃO','Condições da padronização',[('Processo',['1. Receber logo original de melhor qualidade e conferir contatos e dados profissionais.','2. Aprovar cores, tipografia e direção das aplicações.','3. Produzir os materiais contratados e realizar até duas rodadas consolidadas de revisão.','4. Entregar arquivos organizados após aprovação e quitação. Prazo estimado: 7 a 10 dias úteis após recebimento dos materiais.']),('Custos externos e limites',['Impressão, fachada, confecção de uniformes, fotografia, fontes pagas e registro de marca são contratados à parte. Simulações são conceituais e não equivalem à execução física.','Os modelos e provas existentes servem para apresentação. Antes de imprimir, validar dados, legibilidade, dimensões, sangria e perfil de cor com a gráfica.','Mudança de logo, criação de novo símbolo ou expansão de aplicações fora do escopo exige outra proposta. A clínica aprova o uso de seus materiais.']),('Aceite',['Alternativa: Essencial / Ampliada. Crédito aplicável: R$ ______. Total: R$ ______.','Responsável: __________________________  Data: ______________'])])
path=OUT/'06-identidade-visual-separada.pdf';SimpleDocTemplate(str(path),leftMargin=44,rightMargin=44,topMargin=43,bottomMargin=48,title='Padronização visual - logo atual',author='Projeto Odonto Personnallite').build(st,onFirstPage=footer,onLaterPages=footer);files.append(path)
poppler='C:/Users/mandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
for f in files:
 r=PdfReader(f); assert all(len(pg.extract_text().strip())>80 for pg in r.pages)
 print(f.name,len(r.pages),'páginas')
 subprocess.run([poppler,'-scale-to','850','-png',str(f),str(QA/f.stem)],check=True)
with zipfile.ZipFile(ROOT/'output/propostas-comerciais-separadas.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in files:z.write(f,f.name)
from PIL import Image, ImageOps, ImageDraw
imgs=[]
for f in sorted(QA.glob('*.png')):
 im=Image.open(f).convert('RGB'); im.thumbnail((298,425)); tile=Image.new('RGB',(320,455),'#dce5e1');tile.paste(im,((320-im.width)//2,5));ImageDraw.Draw(tile).text((8,435),f.name[:43],fill='black');imgs.append(tile)
sheet=Image.new('RGB',(320*4,455*((len(imgs)+3)//4)),'white')
for i,im in enumerate(imgs):sheet.paste(im,((i%4)*320,(i//4)*455))
sheet.save(QA/'review.jpg')
print('ZIP e revisão visual prontos')
