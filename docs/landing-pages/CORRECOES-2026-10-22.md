# Correções de fechamento - 22/10/2026

## Implementado

- Telefone confirmado no site principal e landing pages: (91) 98188-8353.
- Atendimento mediante agendamento, sem horário fixo; responsável técnica Sônia Almeida, CRO-PA 2638.
- Equipe pública sem registros inventados; outras profissionais preservadas na lista interna de pendências.
- Aviso de privacidade atualizado: distingue WhatsApp do site principal e cadastros no D1 das duas landing pages, explica painel, consentimento, armazenamento local e fornecedores. A recepção é contato para encaminhamento, não foi designada formalmente como encarregada. Não atribuir função de controlador à responsável técnica por inferência.
- Dialogs das landing pages incluem link para o aviso completo e informação de que arquivar não elimina dados.
- Rodapé aponta para as duas landing pages atuais. A antiga /urgencia-protese redireciona para /urgencia-protese-implante/ por regra 301; confirmado no navegador. A página de urgência odontológica geral não foi redirecionada para atendimento específico em prótese, para não alterar seu significado.
- Imagens ilustrativas de recepção/consultório convertidas para WebP, preservando originais: 4.758.967 bytes antes; 329.598 bytes depois (redução aproximada de 93%). Não são novas fotos reais da clínica.
- Páginas comerciais carregadas sob demanda. Build inicial: JS 401,99 kB (123,87 kB gzip), CSS 75,66 kB (14,86 kB gzip), contra aproximadamente 480 kB e 121 kB anteriores. Não representa medição de Core Web Vitals em usuários reais.
- Página de acompanhamento atualizada para o formulário/painel reais e pendências de Analytics/Ads. Apresentação corrigida quanto ao painel já hospedado. Preços comerciais anteriores não foram renegociados ou alterados.
- Roteiro de operação/recuperação criado em ROTINA-OPERACAO-E-RECUPERACAO.md. Não foi feita cópia de dados de pacientes nem restauração.

## Verificações

Suíte das landing pages, 30 testes React e build aprovados. Navegador confirmou aviso de privacidade, link do diálogo de urgência, redirecionamento antigo, acompanhamento carregado sob demanda e apresentação. A prévia local não ficou acessível ao Chrome nesta execução; a conferência visual foi realizada após publicação.

Worker das landing pages publicado: dd02f2ee-5b73-4885-a5d4-908fc4ce01a6. Site principal publicado, incluindo complementação de imagens estáticas leves e informação do painel na apresentação: 1af3cbcb-de28-4f0c-ad79-75c79b39f38b. Conferência final no navegador confirmou apresentação corrigida, redirecionamento e privacidade. Prova visual: output/google-ads/privacidade-atualizada.png.

## Ainda depende de informação ou autorização

- Fotos reais autorizadas da clínica, que o titular informou que serão produzidas depois.
- CRO/UF das demais profissionais, nome completo de Faustina e registros de especialidade antes de usar títulos de especialista.
- Razão social/CNPJ, responsável pelo tratamento dos dados e política de conservação/eliminação. Não foi inventado prazo, base legal ou certificação LGPD.
- Recuperação D1 em ambiente separado: roteiro não substitui teste e backup efetivos.
- Validar proposta comercial antiga (há referências a três páginas e Meta), comparando com o escopo atual de duas landing pages e preparação de Google Ads, antes de apresentar preços como acordo final.
- Concluir faturamento, conversões/atribuição, orçamento, datas, região e aprovação do cliente antes de ativar publicidade. Nenhum pagamento ou campanha foi alterado nestas correções.
- Manter bloqueio de indexação enquanto o conteúdo demonstrativo não for aprovado; preparar liberação/sitemap quando apropriado.

## Fontes consultadas

- https://developers.cloudflare.com/workers/static-assets/redirects/
- https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares
