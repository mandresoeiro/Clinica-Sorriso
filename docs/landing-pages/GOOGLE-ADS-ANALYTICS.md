# Onde encontrar os IDs do Google

## Analytics
Acesse https://analytics.google.com com a conta da clínica. Se ainda não houver conta, crie a conta e uma propriedade GA4 para a clínica, com fuso de Belém/Fortaleza e país Brasil. Em Administrador > Coleta e modificação de dados > Fluxos de dados, adicione ou selecione Web para https://odontopersonnallite.com.br. Copie o ID da tag iniciado por G-. O ID numérico do fluxo não substitui esse código.

Antes de ativar, desative a medição otimizada de formulários e cliques externos nesse fluxo: os eventos desta página já são enviados explicitamente. Não ativar captura automática de dados pessoais, conversões otimizadas ou remarketing nesta implantação.
Fonte: https://support.google.com/analytics/answer/14183469?hl=pt-BR

## Google Ads
Acesse https://ads.google.com com a conta da clínica. Em Metas > Conversões > Resumo, escolha Criar ação de conversão > Conversões em um site e informe o domínio. Na instalação manual/gerenciador de tags, copie o ID AW- e o rótulo da ação. Não confundir o número de cliente da conta com o ID AW-. Não precisa iniciar campanha ou pagar anúncios para informar os códigos da configuração.

Sugestão de ações distintas:
- Solicitação recebida: principal, disparada somente após confirmação de gravação pelo Django. Se também importar generate_lead do GA4, escolha apenas uma ação como principal para não contar em dobro.
- Clique no WhatsApp: secundária. O clique não confirma mensagem enviada, consulta ou venda.
Fonte: https://support.google.com/google-ads/answer/16560108?hl=pt-BR
Instalação da tag: https://support.google.com/google-ads/answer/7548399?hl=pt-BR

## Onde configurar no projeto
public/tratamento-humanizado/measurement-config.js:
- ga4Id: G-…
- adsId: AW-…
- leadLabel: rótulo da conversão de solicitação
- whatsappLabel: rótulo da conversão de clique

Esses são códigos públicos. Não inserir senhas, tokens de API ou dados de pacientes. Sem IDs válidos, o código não carrega a tag Google. Com IDs, a tag só carrega após o visitante permitir medição. A preferência de medição é a única informação salva localmente por essa camada.

O código envia apenas eventos genéricos generate_lead e whatsapp_click e uma URL canônica sem parâmetros. Não envia nome, telefone, tratamento ou campos do formulário como parâmetros dos eventos. Verificar as configurações da propriedade e o Tag Assistant antes de ativar anúncios; configurações externas de tags podem coletar dados além do código desta página.

## Teste depois de publicar
1. Sem permitir medição, confirmar que não há chamadas à tag Google.
2. Permitir medição e confirmar page_view no relatório em tempo real do Analytics.
3. Em ambiente de teste, enviar um formulário fictício e conferir generate_lead só após a gravação.
4. Simular falha de API: não deve haver generate_lead.
5. Conferir clique no WhatsApp como evento separado e sem parâmetros pessoais.
6. Não divulgar a prévia privada Sites em anúncios; usar a URL pública do domínio após validar a implantação.
