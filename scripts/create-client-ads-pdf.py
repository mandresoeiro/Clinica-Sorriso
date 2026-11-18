from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
out = root / 'output/pdf/cadastro-e-orcamento-google-ads-odonto.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(out), pagesize=(595.28, 841.89))
c.setTitle('Odonto Personnallite | Cadastro e aprovação de anúncios')
c.setAuthor('Odonto Personnallite')
green = HexColor('#103F40')
muted = HexColor('#526666')
line = HexColor('#C9D5D2')
style = ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=14, textColor=green)

def text(txt, x, top, width=515, size=10, color=green):
    s = ParagraphStyle('p', parent=style, fontSize=size, leading=size*1.35, textColor=color)
    p = Paragraph(txt, s)
    _, h = p.wrap(width, 1000)
    p.drawOn(c, x, 841.89-top-h)
    return h

def section(num, title, top):
    c.setFillColor(green)
    c.roundRect(40, 841.89-top-19, 23, 19, 5, fill=1, stroke=0)
    text(num, 46, top+3, 20, 9, white)
    text('<b>'+title+'</b>', 72, top+2, 480, 11)

def field(label, top):
    text(label, 40, top, 515, 10)
    c.setStrokeColor(line)
    c.line(40, 841.89-top-30, 555, 841.89-top-30)

c.setFillColor(green)
c.rect(0, 744, 595.28, 98, fill=1, stroke=0)
text('ODONTO PERSONNALLITE',40,25,515,11,white)
text('<b>Cadastro e aprovação dos anúncios</b>',40,47,515,20,white)
text('Google Ads | Proposta para revisão do cliente | 21/10/2026',40,77,515,9,white)

section('01','Dados para faturamento',116)
field('Razão social: __________________________________  CNPJ: ___________________',143)
field('Endereço, número e complemento: __________________________________________',180)
field('Bairro: __________________  Cidade/UF: __________________  CEP: _____________',217)
field('Responsável: __________________  E-mail: __________________  Tel.: ___________',254)

section('02','Proposta de investimento e controle',300)
c.setFillColor(HexColor('#EDF4F0'))
c.roundRect(40, 841.89-330-60, 515, 60, 8, fill=1, stroke=0)
text('<b>R$ 300 no total para um período de 30 dias</b>',54,340,487,13)
text('Início: ____/____/______   Término: ____/____/______',54,365,487,10)
text('<b>Configuração desejada:</b> usar “Orçamento total da campanha”, se disponível, com teto de R$ 300 e datas de início e término. Esse limite vale para a campanha, tanto com cartão quanto com Pix.',40,402)
text('<b>Importante:</b> R$ 10/dia é uma média, não um teto de R$ 300. Para a maioria das campanhas, o limite mensal é R$ 304 com orçamento diário constante de R$ 10; em um dia pode chegar a R$ 20. Não ativar sem confirmar o limite escolhido.',40,451)
text('<b>Duas campanhas:</b> dividir os R$ 300 entre elas (ex.: R$ 150 + R$ 150). Renovação ou aumento somente com nova aprovação do cliente. Se o orçamento total não estiver disponível, revisar outra configuração antes de ativar.',40,513)

section('03','Pagamento e região',574)
text('<b>Pagamento pretendido:</b> cartão (pós-pagamento) / Pix (pré-pagamento, se disponível). No Pix, o saldo é adicionado antes; não garante exatamente 30 dias. No cartão, as cobranças seguem os gastos e as regras da conta.',40,602)
text('<b>Região:</b> cidades/bairros _____________________ ou raio de ____ km da clínica.<br/><b>Excluir locais:</b> ______________________________________________________',40,651)

section('04','Aprovação antes da ativação',699)
text('Aprovar páginas, textos, região, total e datas antes de anunciar. Os dados do cartão devem ser preenchidos diretamente pelo responsável no Google Ads, nunca enviados por mensagem.',40,727,515,9)
text('Responsável pela aprovação: _______________________  Data: ____/____/______',40,760,515,9)
text('Fontes: <link href="https://support.google.com/google-ads/answer/10486938?hl=pt-BR" color="#103F40"><u>Orçamento total</u></link> | <link href="https://support.google.com/google-ads/answer/10486637?hl=pt-BR" color="#103F40"><u>Limites de gastos</u></link> | <link href="https://support.google.com/google-ads/answer/2375433?hl=pt-BR" color="#103F40"><u>Formas de pagamento</u></link>',40,792,515,8)
c.save()
r = PdfReader(str(out))
assert len(r.pages) == 1
assert 'R$ 300' in r.pages[0].extract_text()
print(out)
print('PDF verificado: 1 página; links e texto presentes.')
