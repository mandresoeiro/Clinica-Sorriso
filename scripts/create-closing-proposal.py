
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pypdfium2 as pdfium
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/proposta-final-clinica-odonto-personnallite.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
for n,f in [('S','segoeui.ttf'),('B','segoeuib.ttf')]:
 pdfmetrics.registerFont(TTFont(n,'C:/Windows/Fonts/'+f))
pdfmetrics.registerFontFamily('S',normal='S',bold='B',italic='S',boldItalic='B')
ink=colors.HexColor('#17383b')
styles={k:ParagraphStyle(k,fontName=font,fontSize=size,leading=lead,textColor=ink,spaceAfter=space) for k,font,size,lead,space in [('body','S',10.5,15.5,9),('title','B',25,31,15),('head','B',14,19,10),('small','S',9,13,7)]}
story=[]
def p(t,style='body'): return Paragraph(t,styles[style])
def add(t): story.append(p(t))
def h(t): story.append(Spacer(1,9));story.append(p(t,'head'))
def page(num,title):
 if story: story.append(PageBreak())
 story.append(p('PROPOSTA COMERCIAL | '+num,'small'));story.append(p(title,'title'))
def table(rows,widths):
 t=Table([[p(c,'small') for c in r] for r in rows],colWidths=widths,repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9efed')),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#d6dfdc')),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9)]))
 story.append(t);story.append(Spacer(1,12))
G='<font color="#247448"><b>SEU SERVIÇO</b></font>'
B='<font color="#2464a1"><b>TERCEIROS</b></font>'
Y='<font color="#966000"><b>OPCIONAL</b></font>'
P='<font color="#75469b"><b>CLÍNICA</b></font>'
page('01 / 06','Clínica Odonto<br/>Personnallite')
logo=ROOT/'public/images/brand/logo.png'
if logo.exists(): story.append(Image(str(logo),width=75,height=75,kind='proportional'));story.append(Spacer(1,15))
add('<b>Presença digital, divulgação local e organização do atendimento</b>')
add('Proposta emitida em 13/10/2026. Validade: até 28/10/2026. Condições sujeitas ao aceite das partes.')
h('Objetivo')
add('Apresentar a clínica com clareza, facilitar o contato de novos interessados e organizar a divulgação. Aproveitar o site e as páginas já desenvolvidas, mantendo a logo e a identidade visual atuais.')
h('O que a cliente poderá conhecer')
add('Site institucional, páginas por tratamento, organização do Instagram e demonstração local do painel da recepção. Demonstrações não representam campanhas ativas, pacientes reais ou resultados já obtidos.')
table([['Cor / identificação','Como interpretar'],[G,'Implantação e gestão: pagamento ao prestador.'],[B,'Mídia, domínio e infraestrutura: pagamento ao fornecedor.'],[Y,'Contratação separada; não aumenta o pacote principal automaticamente.'],[P,'Informações, aprovações e atendimento sob responsabilidade da clínica.']],[150,349])
add('A hospedagem será escolhida após aprovação da proposta. Não é necessário contratá-la para conhecer a demonstração.')
page('02 / 06','Implantação do projeto')
h(G+' | R$ 900, pagamento único')
add('Pagamento em 3 parcelas de R$ 300: no aceite e início dos trabalhos; na aprovação da versão final; na publicação e entrega. Custos de terceiros separados.')
table([['Entrega','Escopo'],['Site institucional','Finalização da estrutura existente: apresentação, tratamentos, equipe, localização e contato.'],['Até 3 landing pages existentes','Ajustes de conteúdo, apresentação e chamadas para contato nas páginas já desenvolvidas.'],['Instagram inicial','Organização da bio, links e destaques; aplicação dos materiais existentes.'],['Revisão técnica','Conferência de links, navegação no celular e caminho até o WhatsApp.'],['Identidade atual','Aplicação da logo, cores e estilo existentes; sem criação de nova marca.']],[150,349])
h('Revisões e prazo')
add('Até 2 rodadas de revisão, com os pedidos reunidos em uma lista por rodada. Prazo proposto: até 15 dias úteis após aceite, pagamento inicial e recebimento dos materiais e acessos. Atrasos na aprovação ou no envio dos materiais deslocam a entrega.')
h('Ajustes finais previstos')
add('Deixar claras as opções de formulário e WhatsApp; melhorar mensagens de validação; conferir dados oficiais e material ilustrativo; testar a experiência móvel. O formulário conectado ao painel somente será publicado se o opcional correspondente for contratado e preparado.')
add('<b>Não inclui:</b> novas páginas além do escopo, nova logo, prontuário, painel online, automação, gravação ou edição de vídeos.')
page('03 / 06','Gestão e tráfego pago')
h(G+' | R$ 500 por mês')
table([['Serviço','Limite mensal'],['Instagram','4 posts estáticos com legendas e 4 adaptações desses posts para Stories.'],['Gestão de anúncios','1 campanha ativa na Meta e até 2 peças adaptadas dos materiais do mês.'],['Manutenção do site','Até 1 hora de pequenos ajustes em textos, imagens e links.'],['Acompanhamento','Resumo mensal dos indicadores disponíveis e ajustes realizados.']],[150,349])
add('Inclui 1 rodada de revisão por lote, antes de publicar. Publicação após aprovação da clínica. Horas e entregas não utilizadas não acumulam. Novas páginas, funcionalidades, vídeos, atendimento de mensagens e demandas extras recebem orçamento prévio.')
add('Início da gestão definido por escrito. Pagamento antecipado no início de cada ciclo mensal; vencimento acordado no aceite. A gestão só começa quando os acessos e materiais necessários estiverem disponíveis.')
h(B+' | Verba inicial de R$ 300 por mês')
add('Orçamento total mensal de teste, pago diretamente à Meta na conta da clínica. Não é honorário do prestador. Aumento de orçamento exige autorização. Configuração e acompanhamento da campanha estão incluídos na gestão mensal.')
add('Fluxo: anúncio → landing page → WhatsApp ou formulário conectado, quando contratado → atendimento da recepção. Clique não comprova mensagem enviada, agendamento ou faturamento.')
add('Acompanhar alcance, cliques e custo por resultado disponível; agendamentos e comparecimentos dependem do registro pela clínica. Não há garantia de quantidade de pacientes ou vendas. Analytics, Pixel e integrações adicionais não estão incluídos automaticamente.')
page('04 / 06','Opcionais com valores')
table([['Opcional','Implantação ao prestador','Mensalidade adicional'],['Kit de comunicação','R$ 300<br/>2× de R$ 150','Sem mensalidade'],['Painel da recepção','R$ 600<br/>2× de R$ 300','R$ 100/mês'],['Assistente básico no WhatsApp','R$ 600<br/>2× de R$ 300','R$ 150/mês']],[179,160,160])
h(Y+' | Kit de comunicação')
add('Cartão de visita frente e verso, 6 capas de destaques e 2 modelos de posts reutilizáveis. Logo e identidade atuais; arquivos digitais finais e 1 rodada de revisão. Impressão e editáveis não incluídos. Não há cobrança duplicada: o pacote inicial organiza os destaques com materiais existentes; o kit produz as peças personalizadas.')
h(Y+' | Painel da recepção')
add('Publicação da estrutura existente, conexão ao formulário, usuários com acesso restrito, status dos contatos e treinamento básico. Manutenção: verificação da rotina de backup e até 1 hora mensal de ajustes. Hospedagem, banco e backup pagos à parte. Não inclui agenda integrada, prontuário ou respostas automáticas.')
h(Y+' | Assistente básico no WhatsApp')
add('Menu de atendimento, informações aprovadas e encaminhamento à recepção. Até 1 hora mensal de ajustes. Não inclui IA, diagnóstico ou confirmação automática de consulta. Plataforma e uso pagos à parte. Viabilidade e custo total serão confirmados antes da contratação; se a solução exigir escopo diferente, novo orçamento será apresentado.')
add('Opcionais independentes. Mensalidades adicionais aos R$ 500 da gestão, iniciadas após ativação do respectivo serviço. Não estão ativos automaticamente. Para painel e assistente: 50% no aceite do opcional e 50% na entrega; prazo definido após escolha da infraestrutura e validação do escopo.')
page('05 / 06','Prontuário e infraestrutura')
h(Y+' | Prontuário odontológico: segunda etapa')
add('Sistema separado do site, com acesso restrito à doutora e aos profissionais autorizados. Levantar as necessidades antes de escolher a solução: cadastro de pacientes, anamnese, odontograma, plano de tratamento, evolução clínica, exames, documentos e exportação.')
add('Priorizar avaliação de sistema odontológico existente. Seu serviço será levantamento, configuração, organização de acessos e treinamento. <b>Orçamento após definição do sistema e escopo.</b> Licença e recursos do fornecedor pagos diretamente pela clínica.')
add('Não incluído no painel de R$ 600 ou nos demais pacotes. Desenvolvimento próprio, integração, digitalização e migração de arquivos antigos serão orçados separadamente. Uma integração com o painel não é presumida.')
add('Antes do uso real, avaliar requisitos de segurança, integridade, autoria, assinaturas, acesso e guarda dos registros. Preenchimento e validação clínica são responsabilidade da profissional.')
add('Referência técnica: <link href="https://website.cfo.org.br/modelos-de-prontuarios/" color="#2464a1">Manual do Prontuário do CFO</link>. A proposta não certifica um sistema clínico.')
h(B+' | Domínios e hospedagem')
add('Valores conforme fornecedor, apresentados após aceite e antes da contratação. Contas em nome da clínica; domínio pode ter renovação anual e hospedagem cobrança mensal. Nenhuma despesa externa será contratada automaticamente.')
add('O backend demonstrado hoje é local. Para uso público serão necessários hospedagem, HTTPS, proteção contra abuso, backup e teste de recuperação. Não publicar a configuração de desenvolvimento como produção.')
h(P+' | Materiais e atendimento')
add('A clínica fornece dados corretos, fotos autorizadas, tratamentos, horários, registros da equipe e acessos; aprova os materiais preferencialmente em 3 dias úteis. Responde aos interessados, confirma consultas e acompanha os contatos. O prestador não faz atendimento clínico ou de recepção.')
page('06 / 06','Investimento e aprovação')
table([['Pacote principal','Valor / destino'],['Implantação','R$ 900, em 3× de R$ 300 - prestador'],['Gestão mensal','R$ 500/mês - prestador'],['Mídia inicial','R$ 300/mês - Meta'],['Domínios e hospedagem','A definir - fornecedores'],['Opcionais','Somente os escolhidos; valores adicionais']],[210,289])
add('<b>Se implantação e gestão começarem juntas:</b> primeiros 3 meses = R$ 1.100/mês (R$ 300 + R$ 500 + R$ 300). Depois = R$ 800/mês. Totais excluem infraestrutura e opcionais. Total nos primeiros 3 ciclos: R$ 3.300, nas mesmas condições.')
h('Condições e próximas etapas')
add('1. Aprovar escopo, valores e opcionais.<br/>2. Fornecer materiais e acessos individuais.<br/>3. Revisar e aprovar a versão final.<br/>4. Escolher e autorizar os custos dos fornecedores.<br/>5. Publicar, testar o atendimento e iniciar a gestão e os anúncios na data combinada.')
add('Mudanças de escopo exigem orçamento prévio. Gestão cancelável com aviso de 30 dias; não cobrar ciclos futuros após encerramento. Etapas de implantação já executadas permanecem devidas. Incidentes e solicitações serão tratados em horário comercial, pelo canal acordado, sem suporte 24 horas contratado.')
add('O site e a marca utilizam os materiais aprovados da clínica. Contas e conteúdos da clínica permanecem sob sua titularidade. Arquivos finais e acessos serão organizados na entrega; formatos editáveis e transferência do código-fonte serão definidos no aceite.')
h('Registro da escolha')
add('Pacote principal: ___________________________<br/>Opcionais escolhidos: _______________________<br/>Data de início / vencimento: __________________<br/>Nome do prestador e contato: _________________<br/>Responsável pela clínica: ____________________')
add('Esta proposta apresenta condições para aprovação. Nenhuma contratação de fornecedor ou ativação de anúncio decorre apenas do recebimento deste documento.')
def footer(c,d):
 c.setStrokeColor(colors.HexColor('#b2a184'));c.line(48,43,547,43)
 c.setFont('S',8);c.setFillColor(ink);c.drawString(48,29,'Odonto Personnallite | Proposta comercial | 13/10/2026');c.drawRightString(547,29,str(d.page))
SimpleDocTemplate(str(OUT),pagesize=(595.28,841.89),leftMargin=48,rightMargin=48,topMargin=43,bottomMargin=59,title='Proposta final - Clínica Odonto Personnallite',author='Proposta comercial').build(story,onFirstPage=footer,onLaterPages=footer)
doc=pdfium.PdfDocument(str(OUT))
assert len(doc)==6, len(doc)
pre=ROOT/'tmp/pdfs/proposta-final';pre.mkdir(parents=True,exist_ok=True)
for i,page in enumerate(doc):
 page.render(scale=1).to_pil().save(pre/f'pagina-{i+1}.png')
assert all(len(page.extract_text())>200 for page in PdfReader(str(OUT)).pages)
print(str(OUT));print('6 páginas geradas e renderizadas.')
