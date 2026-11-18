from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Segoe','C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold','C:/Windows/Fonts/segoeuib.ttf'))
pdfmetrics.registerFont(TTFont('Georgia','C:/Windows/Fonts/georgia.ttf'))
pdfmetrics.registerFontFamily('Segoe',normal='Segoe',bold='SegoeBold',italic='Segoe',boldItalic='SegoeBold')
GREEN=colors.HexColor('#17383b'); GOLD=colors.HexColor('#b59661'); LIGHT=colors.HexColor('#edf2f0')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='Body',fontName='Segoe',fontSize=10,leading=15,textColor=GREEN,spaceAfter=9))
styles.add(ParagraphStyle(name='Title2',fontName='Georgia',fontSize=25,leading=30,textColor=GREEN,spaceAfter=17))
styles.add(ParagraphStyle(name='Sub',fontName='SegoeBold',fontSize=12,leading=17,textColor=GREEN,spaceBefore=12,spaceAfter=8))
styles.add(ParagraphStyle(name='Small2',fontName='Segoe',fontSize=8,leading=11,textColor=GREEN,spaceAfter=7))
styles.add(ParagraphStyle(name='Cell',fontName='Segoe',fontSize=8.5,leading=12,textColor=GREEN))
styles.add(ParagraphStyle(name='HeadCell',fontName='SegoeBold',fontSize=8.5,leading=12,textColor=colors.white))
story=[]
def p(text,style='Body'): story.append(Paragraph(text,styles[style]))
def sub(text): p(text,'Sub')
def bullet(text): p('• '+text)
def page(number,title):
    if story: story.append(PageBreak())
    p(f'PROJETO DIGITAL / {number:02d}','Small2'); p(title,'Title2')
def table(headers,rows,widths):
    data=[[Paragraph(str(x),styles['HeadCell']) for x in headers]]+[[Paragraph(str(x),styles['Cell']) for x in row] for row in rows]
    t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),('LINEBELOW',(0,0),(-1,0),1,GOLD)]))
    story.append(t); story.append(Spacer(1,12))
BASE='https://clinica-sorriso.mandre-soeiro.workers.dev'
def link(path,label): return f'<link href="{BASE}{path}" color="#17383b"><u>{label}</u></link>'

page(1,'Clínica Odonto\nPersonnallite')
p('PROPOSTA DE PRESENÇA DIGITAL E CAPTAÇÃO DE SOLICITAÇÕES','Sub')
p('Site institucional • Landing pages • Instagram • WhatsApp • Meta Ads')
story.append(Spacer(1,24))
p('Um projeto integrado, com execução enxuta e investimento acessível.','Title2')
p('A proposta aproveita a estrutura já desenvolvida para organizar a apresentação da clínica, facilitar o contato de interessados e preparar campanhas com acompanhamento de resultados.')
table(['Investimento','Condição proposta'],[
['Organização dos canais','<b>R$ 425,00</b> - pagamento único'],
['Gestão integrada','<b>R$ 350,00/mês</b> - serviços da SoeiroTech'],
['Verba inicial de anúncios','<b>R$ 300,00/mês</b> - pagamento direto à Meta'],
['Total recorrente inicial','<b>R$ 650,00/mês</b> - gestão + mídia, sem opcionais'],
],[190,309])
p('Preparado por SoeiroTech | 11 de outubro de 2026','Small2')
p('Versão 1.2 para apresentação e negociação. Valores são uma proposta comercial acessível, não uma tabela de mercado nem contratação já firmada. Condições dependem de aceite das partes.','Small2')
p('As imagens atuais são demonstrativas e identificadas como geradas por IA. Dados e serviços finais serão aprovados pela clínica antes das campanhas.','Small2')

page(2,'Objetivo e funcionamento')
sub('O que o projeto pretende resolver')
p('Organizar uma presença digital que permita ao visitante conhecer a clínica, encontrar informações sobre o serviço de seu interesse e iniciar uma conversa com a equipe. O projeto também cria uma rotina simples para avaliar quais contatos se transformam em consultas.')
table(['Etapa','Papel na jornada'],[
['Instagram e anúncio','Apresentar a clínica e o assunto de interesse com conteúdo coerente com a página de destino.'],
['Site institucional','Reunir equipe, tratamentos, localização, dúvidas e formas de contato.'],
['Landing específica','Concentrar informações e chamada para avaliação de um serviço.'],
['WhatsApp','Abrir a solicitação e permitir que a equipe confirme disponibilidade.'],
['Atendimento e registro','Confirmar agenda e registrar o desfecho para acompanhamento.'],
],[135,364])
sub('Como começar com orçamento pequeno')
p('O piloto será concentrado em próteses, com uma campanha de Meta Ads por vez. A verba de R$ 300,00 em um período de 30 dias equivale a R$ 10,00 por dia em média para planejamento; a distribuição efetiva depende da plataforma e da configuração. Não dividir inicialmente essa verba entre vários tratamentos e plataformas.')
sub('O que caracteriza resultado')
p('Cliques e mensagens são etapas intermediárias. O resultado comercial depende também de tempo de resposta, agenda, avaliação, comparecimento e decisão do paciente. Não há garantia de quantidade de contatos, pacientes, faturamento, posição no Google ou retorno financeiro.')

page(3,'Diagnóstico: o que já existe')
p('Inventário baseado na versão publicada e no projeto local em 11/10/2026. Uma demonstração pública não significa que todos os dados clínicos e comerciais estejam validados.')
table(['Item','Situação atual','Próxima ação'],[
['Site institucional','Publicado na Cloudflare; código em React, TypeScript e Vite.','Finalizar dados, revisar conteúdo e conectar domínio.'],
['Próteses','Landing /proteses publicada.','Aprovar escopo clínico e conteúdo final.'],
['Problemas com prótese','/urgencia-protese publicada.','Confirmar disponibilidade real de atendimento.'],
['Urgência odontológica','/urgencia-odontologica publicada.','Confirmar serviços e horários.'],
['WhatsApp','Links e formulário preparam mensagem para o número informado.','Validar número completo e organizar Business após aceite.'],
['Instagram','Perfil @odontopersonallite_ identificado; prévia e seis capas preparadas.','Conferir aplicação real de capas, stories, bio e links.'],
['Mensuração e anúncios','Campanhas não ativadas; eventos ainda não implantados.','Configurar contas, eventos e piloto aprovado.'],
['Domínio e identificação','Domínios pretendidos; registro e CRO final pendentes.','Receber dados oficiais e confirmar titularidade.'],
],[102,199,198])
p('Publicação direta via Cloudflare já realizada. A sincronização do código atualizado com o GitHub e a revisão da rotina de publicação ainda integram a finalização. Não serão cobradas duas implantações: o valor desta proposta engloba a base demonstrativa e sua conclusão.','Small2')

page(4,'Site institucional e landing pages')
sub('Site: base permanente da clínica')
bullet('Preservar a identidade em verde profundo, dourado suave e fundos claros; padronizar nome, links e informações nos componentes existentes.')
bullet('Revisar início, clínica, tratamentos, equipe, dúvidas, contato e privacidade. Substituir campos demonstrativos pelos materiais aprovados.')
bullet('Manter formulário que prepara mensagem para o WhatsApp, botão flutuante, localização e navegação por celular. Sem sistema de agenda automática.')
sub('Três páginas específicas incluídas')
table(['Página','Finalidade','Ação principal'],[
['/proteses','Apresentar a proposta de avaliação e planejamento de próteses.','Solicitar avaliação.'],
['/urgencia-protese','Organizar solicitações sobre prótese quebrada, solta ou desconfortável.','Consultar atendimento.'],
['/urgencia-odontologica','Orientar consulta de disponibilidade para avaliação prioritária.','Verificar disponibilidade.'],
],[130,246,123])
sub('Entregas de finalização')
bullet('Revisar título, descrição, perguntas frequentes, mensagens contextuais e coerência entre anúncio, página e WhatsApp.')
bullet('Conectar um domínio principal e um redirecionamento adicional, se ambos forem adquiridos; configurar HTTPS e testar links diretos.')
bullet('Preparar metadados de compartilhamento, canonical e sitemap quando houver domínio e conteúdo aprovados. A demonstração permanece fora de indexação até essa liberação.')
bullet('Duas rodadas consolidadas de ajustes no escopo. Novas páginas de tratamentos serão opcionais, sem prometer serviços não confirmados.')

page(5,'Instagram: perfil, destaques e conteúdo')
sub('Organização inicial incluída')
p('Responsável inicial pelo Instagram: você, como prestador da SoeiroTech. A clínica valida o conteúdo e fornece fotos, vídeos e informações. Esta proposta não inclui contratação de uma agência externa de redes sociais.')
bullet('Revisão do nome, bio, chamada para contato e link. Na bio, priorizar o site ou a lista de tratamentos; em stories específicos, usar a landing correspondente.')
bullet('Seis destaques: Clínica, Equipe, Cuidados, Próteses, Atendimento e Localização. Nenhum destaque adicional previsto nesta etapa.')
bullet('Seis capas em PNG 1080 x 1080, ícones dourados ampliados e recorte circular seguro. As capas já foram preparadas; será conferida a aplicação.')
bullet('Até seis stories iniciais, um por destaque, com conteúdo aprovado. Destaques precisam de stories; a capa sozinha não cria conteúdo.')
sub('Rotina mensal da gestão integrada')
table(['Material','Quantidade','Limite do escopo'],[
['Publicações de feed','2 por mês','Arte estática + legenda; até uma adaptação de formato por peça.'],
['Stories','4 por mês','Artes simples; podem ser distribuídas em sequências.'],
['Variações de anúncio','Até 2 por mês','Adaptações das peças previstas, sem sessão de fotos ou filmagem.'],
['Revisões','1 rodada por lote','Alterações consolidadas antes da programação.'],
],[140,100,259])
p('A clínica fornece fotos e vídeos autorizados. Vídeos de festas, rotina e bastidores podem aparecer em Stories ou Reels sem criar novos destaques. Edição recorrente de Reels, gravação, cobertura de eventos, respostas a comentários e mensagens não estão incluídas.')
p('Publicação/programação depende de acesso delegado e recursos disponíveis. Se não houver acesso, a entrega será feita em arquivos com legenda e instruções. Não solicitar compartilhamento de senha como método de trabalho.','Small2')

page(6,'WhatsApp e rotina de atendimento')
sub('Preparação incluída na implantação')
bullet('Orientar instalação e organização do WhatsApp Business no celular da clínica, somente após aceite. O atendimento continuará sob responsabilidade da clínica.')
bullet('Preparar descrição, horários, mensagem de saudação, mensagem de ausência e até cinco respostas rápidas.')
bullet('Sugerir cinco etiquetas: Novo contato, Aguardando resposta, Avaliação solicitada, Agendado e Concluído. Adaptar à rotina real da recepção.')
bullet('Realizar uma orientação remota de até 60 minutos para uso dos links, materiais e registro de contatos.')
sub('Roteiro sugerido para a recepção')
table(['Passo','Exemplo de abordagem'],[
['Acolher','Olá! Você está falando com a equipe da Clínica Odonto Personnallite. Como podemos ajudar?'],
['Identificar o interesse','Você deseja informações sobre uma avaliação de próteses ou outro atendimento?'],
['Consultar a agenda','Vou verificar os horários disponíveis e confirmar as opções com você.'],
['Confirmar','Informar data, horário, endereço e orientações aprovadas pela clínica.'],
['Registrar','Anotar origem e resultado do contato, sem enviar dados clínicos para ferramentas de anúncios.'],
],[105,394])
sub('Limites técnicos e operacionais')
p('O site abre uma mensagem; não envia automaticamente, não faz diagnóstico e não confirma agenda. Não há chatbot, API do WhatsApp, CRM pago, prontuário, pagamento online ou integração com agenda clínica neste pacote. Automatizações e múltiplos atendentes exigem avaliação separada.')
p('Antes de conectar o número, confirmar a numeração completa com a clínica e testar no aparelho. Meta operacional sugerida: responder durante o expediente o mais cedo possível, com rotina definida pela recepção.','Small2')

page(7,'Tráfego pago: piloto controlado')
sub('Implantação de Meta Ads')
bullet('Conferir acesso delegado ao portfólio de negócios, perfil, página vinculada e conta de anúncios. Criar somente o que estiver ausente, com titularidade da clínica.')
bullet('Definir serviço prioritário, área geográfica e mensagem conforme capacidade de atendimento. O piloto parte da landing /proteses.')
bullet('Preparar uma campanha inicial, um conjunto de anúncios e até dois anúncios. Objetivo e formato serão definidos conforme os eventos disponíveis e as políticas da plataforma.')
bullet('Configurar período, verba aprovada, URLs identificadas e checagem final. Pagamento e aprovação do orçamento pertencem à clínica.')
sub('Gestão mensal incluída')
bullet('Uma verificação por semana útil: entrega, gastos, links, contatos informados pela clínica e desempenho dos materiais.')
bullet('Ajustes de orçamento dentro do teto aprovado, público, texto e criativos existentes. Aumento de verba somente após aprovação.')
bullet('Uma campanha ativa no escopo mensal, para não fragmentar os R$ 300,00 de mídia. Campanhas adicionais exigem novo orçamento.')
sub('O que não está ativo nem incluído automaticamente')
p('Google Ads não integra a mensalidade proposta. Impulsionamentos extras, ferramentas pagas e compra de audiência também não. A aprovação do anúncio depende da Meta; análise, restrições e bloqueios podem alterar prazos. A clínica deve aprovar serviços, identificação profissional e materiais antes do início.')
p('A verba compra distribuição publicitária; os R$ 350,00 remuneram trabalho de gestão, conteúdo e manutenção. Um valor não substitui o outro.','Small2')

page(8,'Mensuração e relatório')
sub('Configuração prevista')
bullet('Padronizar links com origem, meio e campanha para diferenciar bio, story e anúncio. Parâmetros não devem conter nome, telefone, diagnóstico ou dados do paciente.')
bullet('Configurar uma ferramenta de análise e os eventos necessários, após revisão das preferências de privacidade e do conteúdo informado ao visitante.')
bullet('Verificar viabilidade de pixel da Meta e eventos permitidos. Não presumir que ferramentas de publicidade podem receber informação de saúde, nem ativar coleta avançada indiscriminadamente.')
bullet('Criar planilha simples para a recepção registrar origem e resultado agregado dos contatos. Sem prontuário ou detalhes de tratamento nessa planilha de marketing.')
table(['Indicador','Como interpretar'],[
['Investimento em mídia','Valor efetivamente registrado pela plataforma.'],
['Visitas e cliques','Sinais de interesse; não equivalem a pacientes.'],
['Cliques no WhatsApp','Tentativas de abrir uma conversa; não comprovam envio.'],
['Contatos e agendamentos','Dependem de registro e confirmação da recepção.'],
['Comparecimentos','Quantidade informada pela clínica, de forma agregada.'],
['Custo por contato confirmado','Mídia dividida pelos contatos atribuídos e confirmados; se a atribuição for incompleta, registrar a limitação.'],
],[157,342])
sub('Entrega mensal')
p('Um resumo mensal por mensagem ou PDF com gastos, indicadores disponíveis, resultados informados, limitações e próximos ajustes. Reuniões extras ficam fora desta condição acessível. Não está incluído painel personalizado, integração com CRM ou atribuição automática de faturamento.')

page(9,'Cronograma e responsabilidades')
p('Prazo proposto: até 15 dias úteis para concluir a implantação, contados após aceite, entrada, acessos e recebimento dos materiais mínimos. A estrutura demonstrativa já existe; não é um prazo de reconstrução do zero.')
table(['Período','Entrega','Dependência'],[
['Dias 1 a 3','Validar dados, serviços, acessos, fotos e prioridade da campanha.','Clínica envia informações e define aprovador.'],
['Dias 4 a 7','Finalizar site, três landings e materiais iniciais do Instagram.','Conteúdo clínico e identificação recebidos.'],
['Dias 8 a 10','Preparar WhatsApp, domínio, links e mensuração viável.','Acesso às contas e domínio adquirido.'],
['Dias 11 a 13','Executar testes, revisar celular e coletar ajustes consolidados.','Retorno da clínica dentro do prazo combinado.'],
['Dias 14 a 15','Entregar, orientar recepção e preparar/ativar piloto autorizado.','Aprovação final, pagamento de mídia e análise da Meta.'],
],[85,237,177])
sub('SoeiroTech')
p('Executar os itens contratados, apresentar prévias, registrar alterações, publicar a versão aprovada, entregar arquivos e instruções, configurar campanhas autorizadas e comunicar problemas identificados.')
sub('Clínica')
p('Fornecer responsável técnico e registros aplicáveis, validar informações e imagens, autorizar uso de materiais, disponibilizar acessos delegados, pagar terceiros, aprovar peças e atender contatos. Indicar um aprovador para consolidar comentários.')
sub('Aprovação e mudanças')
p('Sugerir retorno em até dois dias úteis por lote. Atrasos no envio ou aprovação deslocam o cronograma. Pedidos fora do escopo recebem orçamento antes da execução. Nenhuma campanha inicia só porque o site foi publicado.')

page(10,'Implantação: valores discriminados')
p('Site e três landing pages entregues gratuitamente nesta parceria. Os demais itens abaixo são serviços de organização dos canais, sujeitos a aprovação; não representam cobrança pelo desenvolvimento do site. Os valores abaixo compõem um único pacote; não são cobranças adicionais sobre os R$ 425,00.')
table(['Entrega','Composição do serviço','Valor'],[
['Organização do projeto','Diagnóstico, checklist e coordenação da finalização.','R$ 100,00'],
['Site institucional','Site já desenvolvido. Entrega sem cobrança nesta parceria.','R$ 0,00'],
['Três landing pages','Três páginas já desenvolvidas, entregues sem cobrança.','R$ 0,00'],
['Instagram inicial','Bio, links, seis capas e até seis stories iniciais.','R$ 100,00'],
['WhatsApp Business','Roteiros, respostas rápidas, etiquetas e orientação.','R$ 50,00'],
['Preparação de Meta Ads','Acessos, uma campanha, um conjunto e até dois anúncios.','R$ 75,00'],
['Links e mensuração','UTMs, análise/eventos viáveis e planilha simples.','R$ 50,00'],
['Entrega técnica','Domínio/DNS, publicação, testes e instruções; taxas externas à parte.','R$ 50,00'],
['TOTAL DA IMPLANTAÇÃO','Pagamento único.','<b>R$ 425,00</b>'],
],[123,281,95])
sub('Pagamento proposto')
p('<b>2 parcelas de R$ 212,50:</b> no aceite e na entrega da organização dos canais. Parcelamento proposto sem juros por transferência/PIX; se houver meio de pagamento com tarifa, combinar antes. Dados de pagamento serão informados pelo prestador.')
p('Até duas rodadas consolidadas de revisão na implantação. Mensalidade não substitui parcelas de implantação. Como ainda não houve contrato comercial, datas e condições serão confirmadas por escrito no aceite.','Small2')

page(11,'Mensalidade e custos de terceiros')
table(['Serviço da SoeiroTech','Incluído por mês','Valor'],[
['Gestão de Meta Ads','Acompanhamento de uma campanha e ajustes no escopo da página 7.','R$ 200,00'],
['Conteúdo enxuto','2 posts, 4 stories e até 2 adaptações para anúncios.','R$ 100,00'],
['Manutenção e relatório','Até 30 minutos de ajustes simples, checagem técnica e resumo mensal.','R$ 50,00'],
['TOTAL MENSAL','Pacote integrado, sem verba de anúncios.','<b>R$ 350,00</b>'],
],[130,274,95])
sub('Pagamento separado a fornecedores')
table(['Terceiro / item','Valor de referência','Observação'],[
['Meta Ads','R$ 300,00/mês propostos','Verba piloto paga à Meta. Conferir total e tributos/taxas no faturamento. Nenhuma taxa adicional de mídia cobrada pela SoeiroTech.'],
['Domínio .com.br','R$ 40,00/ano [1]','Tarifa pública do Registro.br consultada em 11/10/2026; sujeito à disponibilidade e condição do registro.'],
['Domínio .com','A cotar; opcional','Preço, câmbio, impostos e renovação dependem do registrador. Não incluído nos totais. Pode começar somente com .com.br.'],
['Hospedagem estática','R$ 0 previsto no modelo atual [2]','Entrega estática na Cloudflare; recursos pagos ou mudanças de arquitetura exigem nova avaliação.'],
['WhatsApp Business app','Download gratuito [3]','Não inclui API, automações pagas, telefonia ou internet.'],
],[119,128,252])
p('Fotografia, filmagem, e-mail profissional, CRM, banco de imagens e ferramentas adicionais: não contratados; somente mediante cotação e aprovação. A clínica paga diretamente ao fornecedor sempre que possível.','Small2')

page(12,'Cenários de investimento')
p('Os cenários abaixo não somam parcelas e preço total da implantação duas vezes. São visões do custo do projeto, independentemente do calendário de pagamento das duas parcelas.')
table(['Componente','1 mês completo','90 dias / 3 meses','12 meses'],[
['Implantação única','R$ 425,00','R$ 425,00','R$ 425,00'],
['Gestão integrada','R$ 350,00','R$ 1.050,00','R$ 4.200,00'],
['Verba Meta proposta','R$ 300,00','R$ 900,00','R$ 3.600,00'],
['Total base','<b>R$ 1.075,00</b>','<b>R$ 2.375,00</b>','<b>R$ 8.225,00</b>'],
['Com 1 ano de .com.br','<b>R$ 1.115,00</b>','<b>R$ 2.415,00</b>','<b>R$ 8.265,00</b>'],
],[158,111,119,111])
p('Pressupostos: mesma verba e mensalidade durante o período; implantação cobrada uma única vez; um registro .com.br de um ano. Não inclui .com, terceiros opcionais, taxas de cartão/câmbio nem eventual acréscimo tributário no faturamento de anúncios. O valor final de mídia deve ser conferido no checkout/faturamento da plataforma.','Small2')
sub('Fluxo de caixa do primeiro mês')
p('Se o aceite, a entrega e o início da gestão ocorrerem no mesmo mês, são R$ 425,00 de implantação + R$ 350,00 de gestão + R$ 300,00 de mídia. Se os marcos caírem em meses diferentes, o pagamento acompanha o cronograma; o preço total da implantação permanece igual.')
sub('Para começar com menos custo fixo')
p('Alternativa: implantação de R$ 425,00 + manutenção técnica de <b>R$ 100,00/mês</b>, sem gestão de anúncios, sem conteúdo recorrente e sem mídia. Inclui checagem e até 30 minutos de ajustes simples por mês. Essa alternativa <b>substitui</b> a gestão de R$ 350,00; não é adicionada a ela.')
p('Quando a clínica estiver pronta, poderá migrar para a gestão integrada mediante novo aceite. Não é necessário comprar o .com nem contratar ferramentas pagas para iniciar o site.')

page(13,'Opcionais, limites e condições')
table(['Serviço opcional SoeiroTech','Valor proposto','Condição'],[
['Landing adicional','R$ 300,00/unidade','Modelo existente, um tratamento confirmado, texto e até 2 revisões.'],
['Post estático extra','R$ 50,00/unidade','Arte + legenda, com material disponível e 1 revisão.'],
['Pacote 4 stories extras','R$ 80,00/pacote','Artes simples; não inclui filmagem.'],
['Edição simples de Reel','R$ 120,00/unidade','Até 30 segundos, material enviado, sem captação e 1 revisão.'],
['Ajuste técnico excedente','R$ 80,00/hora','Executado somente após estimativa e aprovação.'],
['Google Ads','Sob orçamento','Gestão, preparação e verba separados.'],
],[152,122,225])
p('Esses opcionais são serviços do prestador, não tarifas de terceiros. Não são cobrados automaticamente nem entram nos totais da página anterior. Fotógrafo, videomaker e fornecedores externos terão cotação própria.')
sub('Condições propostas para formalização')
bullet('Validade comercial sugerida: 15 dias corridos a partir de 11/10/2026, até 26/10/2026. Valores finais dependem de aceite do prestador e cliente.')
bullet('Gestão mensal inicia na data acordada, após entrega e acessos. Vencimento mensal definido no aceite. Avaliar o piloto após 90 dias; isso não implica fidelidade automática.')
bullet('Proposta de encerramento da gestão: aviso escrito de 30 dias, sem multa de fidelidade; serviços executados e terceiros permanecem devidos. Confirmar em contrato.')
bullet('Correções de defeitos da entrega por 30 dias após o aceite técnico; mudanças de conteúdo e de escopo seguem a manutenção ou orçamento adicional.')
bullet('Contas e domínios em nome da clínica. Ao final, entregar materiais e código do projeto contratado após quitação, respeitadas licenças de terceiros.')
p('Este documento é uma proposta de escopo e preço. Identificação das partes, dados fiscais, emissão de documento fiscal e condições contratuais serão preenchidos pelo prestador antes da contratação.','Small2')

page(14,'Aceite, checklist e referências')
sub('Antes de iniciar as campanhas')
bullet('Confirmar serviços, capacidade de agenda, endereço, horários, número de WhatsApp e identificação profissional aplicável.')
bullet('Aprovar fotos e textos. As imagens geradas por IA permanecem identificadas; não apresentar ambientes fictícios como instalações reais.')
bullet('Adquirir domínio aprovado em nome da clínica, testar links no celular e revisar privacidade/mensuração.')
bullet('Conceder acessos delegados, escolher plano, confirmar parcelas, teto de mídia e responsável pela aprovação.')
sub('Páginas para demonstrar ao cliente')
p(link('/','Site institucional')+'<br/>'+link('/proteses','Landing de próteses')+'<br/>'+link('/urgencia-protese','Problemas com próteses')+'<br/>'+link('/urgencia-odontologica','Avaliação odontológica prioritária')+'<br/>'+link('/previa-instagram','Prévia de Instagram e capas'))
sub('Registro do aceite comercial')
p('Plano escolhido: ______________________________________________<br/>Implantação aprovada: __________________________________________<br/>Mensalidade e início: ___________________________________________<br/>Verba de anúncios aprovada: _____________________________________<br/>Aprovador da clínica: ___________________________________________<br/>Data e confirmação por escrito: __________________________________')
p('A assinatura ou confirmação deste orçamento não substitui os dados e condições a serem formalizados entre as partes. Não houve aceite comercial registrado durante a elaboração.','Small2')
sub('Referências de custos externos consultadas em 11/10/2026')
p('[1] Registro.br - Sobre domínios: <link href="https://registro.br/dominio">registro.br/dominio</link><br/>[2] Cloudflare - Workers Static Assets, cobrança: <link href="https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/">documentação oficial de cobrança e limites</link><br/>[3] WhatsApp - Download do aplicativo Business: <link href="https://faq.whatsapp.com/665643701880397/">Central de Ajuda oficial</link>','Small2')
p('Os preços da SoeiroTech são condições comerciais propostas para este escopo. Não foram apresentados como preços médios do mercado. Referências externas não garantem disponibilidade de domínios ou permanência de tarifas.','Small2')


page(15,'Como usar: guia da clínica')
sub('1. Configurar os caminhos de entrada')
p('Na bio do Instagram: Editar perfil > Links > Adicionar link externo. Use o site institucional, com título "Conheça a clínica e os tratamentos". Para uma publicação de próteses, o link deve levar diretamente a /proteses.')
sub('2. Usar os destaques e stories')
p('Transfira as seis capas para a galeria do celular. Em cada destaque existente, pressione > Editar destaque > Editar capa > Galeria. Para criar um destaque, selecione primeiro um story publicado ou arquivado. Não é necessário publicar a capa separadamente.')
p('No story sobre próteses, adicione o adesivo Link com a landing /proteses e o texto "Solicitar avaliação". Salve o story em Próteses. Para prótese quebrada, solta ou desconfortável, use /urgencia-protese.')
sub('3. Testar o percurso antes de divulgar')
p('Abra o link no celular, confira a página, toque no botão e verifique se o WhatsApp mostra o número da clínica e a mensagem correta. A pessoa revisa e envia; o site não confirma consulta. Depois repita o teste usando o link da bio e do story.')
sub('4. Organizar o atendimento diário')
p('A recepção acompanha as mensagens durante o expediente, responde, verifica agenda e confirma o horário. Ao final do dia, registra apenas origem e resultado do contato. Se não houver disponibilidade, informar isso antes de aumentar os anúncios.')
sub('5. Usar e pagar os terceiros')
table(['Fornecedor','Como usar e pagar'],[
['Registro.br','A clínica registra o .com.br em seu CPF/CNPJ, paga R$ 40,00/ano na condição consultada e mantém o comprovante. A SoeiroTech configura o endereço; a taxa não é receita do prestador.'],
['Cloudflare','Hospedagem estática com custo previsto de R$ 0 no modelo atual. Não contratar plano pago sem necessidade e aprovação. Manutenção remunera trabalho, não uma taxa de hospedagem.'],
['Meta','Adicionar meio de pagamento da clínica na conta de anúncios. Aprovar R$ 300,00 para o piloto e conferir gastos/faturamento. A SoeiroTech recebe R$ 350,00 pelo pacote mensal; a Meta recebe a mídia.'],
['WhatsApp Business','Instalar no celular da clínica e organizar o perfil. Download gratuito; internet e linha pertencem à clínica. Não contratar API ou robô para esta etapa.'],
],[108,391])
p('Primeiro passo econômico: concluir o site e usar links orgânicos. Se os anúncios forem adiados, optar por manutenção de R$ 100,00/mês; não pagar também a gestão de R$ 350,00. Ao iniciar anúncios, trocar de plano por aceite escrito.','Small2')

def footer(c,doc):
    w,h=doc.pagesize
    c.setStrokeColor(GOLD); c.setLineWidth(.6); c.line(48,h-37,w-48,h-37)
    c.setFont('Segoe',8); c.setFillColor(GREEN)
    c.drawString(48,h-29,'SOEIROTECH  /  CLÍNICA ODONTO PERSONNALLITE')
    c.line(48,42,w-48,42); c.drawString(48,29,'Proposta comercial para revisão • 11/10/2026')
    c.drawRightString(w-48,29,f'{doc.page:02d}')

path=OUT/'projeto-digital-odonto-personnallite.pdf'
doc=SimpleDocTemplate(str(path),pagesize=(595.28,841.89),leftMargin=48,rightMargin=48,topMargin=58,bottomMargin=58,title='Projeto digital - Clínica Odonto Personnallite',author='SoeiroTech')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(path)
assert len(r.pages)==15, f'Unexpected page overflow: {len(r.pages)} pages'
assert sum([100,0,0,100,50,75,50,50])==425
assert 425+350*3+300*3==2375
assert 425+350*12+300*12==8225
print(f'{path}\nPages: {len(r.pages)}')
