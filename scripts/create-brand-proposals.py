from pathlib import Path
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,Image,Table,TableStyle
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
root=Path(__file__).resolve().parents[1]
pdfmetrics.registerFont(TTFont('S','C:/Windows/Fonts/segoeui.ttf'));pdfmetrics.registerFont(TTFont('SB','C:/Windows/Fonts/segoeuib.ttf'))
s=getSampleStyleSheet();s.add(ParagraphStyle(name='B',fontName='S',fontSize=11,leading=17,spaceAfter=12,textColor=colors.HexColor('#17383b')));s.add(ParagraphStyle(name='H',fontName='SB',fontSize=24,leading=30,spaceAfter=20,textColor=colors.HexColor('#17383b')))
story=[]
def p(t,style='B'):story.append(Paragraph(t,s[style]))
for i,name,desc,filename in [(1,'Essência Clássica','Evolução conceitual da identidade atual: dente e monograma P, verde profundo, marfim e dourado suave. Direção que preserva familiaridade e comunica cuidado e elegância. Não é reprodução exata da logo atual.','proposta-01-essencia-classica.png'),(2,'Cuidado Contemporâneo','Alternativa nova: monograma P com arco de sorriso, verde floresta, creme, sálvia e champagne. Direção mais simples e atual, pensada para boa leitura em telas e aplicações pequenas.','proposta-02-cuidado-contemporaneo.png')]:
 if story:story.append(PageBreak())
 p(f'Proposta visual 0{i}<br/>{name}','H');p('Clínica Odonto Personnallite');story.append(Image(str(root/'output/identidade-visual'/filename),width=507,height=338));story.append(Spacer(1,20));p(desc);p('Conceito gerado com IA para apresentação. Fachada, ambientes, cartões e posts são aplicações ilustrativas. Não representam instalações, materiais impressos ou arquivos finais já produzidos.')
story.append(PageBreak());p('Duas opções de contratação','H');p('A direção visual e o pacote são escolhas independentes. A cliente pode escolher qualquer uma das duas propostas e contratar o pacote adequado. Valores sugeridos, adicionais à criação do site e à gestão mensal.')
for title,price,lines in [('Identidade Digital Essencial','R$ 600',['Refinamento de uma direção escolhida e até 2 rodadas consolidadas de ajustes.','Logo principal, horizontal, símbolo e versões clara/escura. Entrega final prevista em SVG, PDF e PNG transparente após aprovação.','Paleta, orientação de tipografia com verificação de licença e guia resumido de uso.','Foto de perfil, 6 capas dos destaques existentes e 3 modelos estáticos de post. Arquivos editáveis dos modelos em formato acordado.','Pagamento sugerido: 2 parcelas de R$ 300.']),('Identidade e Aplicações','R$ 1.000',['Inclui todas as entregas do pacote essencial.','Manual ampliado: cores, tipografia, área de proteção, redução e usos incorretos.','Cartão de visita frente/verso e papel timbrado, com dados fornecidos e aprovados.','6 modelos estáticos de post no total, exemplo de aplicação no site e simulações de fachada e uniforme.','Pagamento sugerido: 2 parcelas de R$ 500.'])]:
 p(title+' - '+price,'H')
 for line in lines:p('• '+line)
story.append(PageBreak());p('Entrega e condições','H');p('Etapas: escolha da direção e pacote; conferência dos dados e referências; refinamento técnico; revisões; aprovação; preparação dos arquivos e guia. Prazo estimado de 7 a 10 dias úteis após escolha, primeira parcela e recebimento dos dados, sujeito a acordo e retorno da cliente.')
p('Os painéis atuais são imagens de conceito. Vetorização, consistência entre versões, revisão da grafia e testes de legibilidade serão realizados na finalização. Pequenos detalhes dos mockups podem variar em relação à marca final aprovada.')
p('Impressão, execução de fachada, compra de uniforme, fotografia, fontes pagas e registro de marca no INPI não estão incluídos. Simulação visual não é projeto técnico de fachada. Não foi verificada a exclusividade jurídica dos símbolos.')
p('A aplicação definitiva da identidade no site deve ser combinada antes da contratação: o pacote inclui exemplo de aplicação, não uma reformulação completa do site. Gestão mensal de Instagram e anúncios permanece separada.')
p('Revisões incluem ajustes da direção escolhida; criação de uma terceira direção ou alteração integral após aprovação exige novo orçamento. Após quitação, entregar os arquivos finais contratados. Produção física exige orçamento próprio.')
p('Escolha da direção: 01 / 02<br/>Pacote: Essencial / Identidade e Aplicações<br/>Representante: ____________________<br/>Data e aceite: ____________________')
def foot(c,d):
 c.setFont('S',8);c.setFillColor(colors.HexColor('#63776b'));c.drawString(44,28,'ODONTO PERSONNALLITE | CONCEITOS PARA APROVAÇÃO | 12/10/2026');c.drawRightString(550,28,str(d.page))
SimpleDocTemplate(str(root/'output/pdf/propostas-identidade-visual-odonto-personnallite.pdf'),leftMargin=44,rightMargin=44,topMargin=44,bottomMargin=48).build(story,onFirstPage=foot,onLaterPages=foot)
