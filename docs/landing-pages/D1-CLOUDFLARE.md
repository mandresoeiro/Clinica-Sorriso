# Landing pública e D1 — 21/10/2026

Publicada e testada: https://odontopersonnallite.com.br/tratamento-humanizado/
Também atende https://www.odontopersonnallite.com.br/tratamento-humanizado/.

## Implantação
- Conta: 2bc93c263c79b06b2a9d2540d4e7e3ee
- Worker: personnallite-atendimento
- Versão publicada: 21c7278c-9c93-4a29-b281-4d9a1cb366e6
- Banco: odonto-personnallite-contatos
- ID: f5de2b47-0d43-4248-925f-62139c5634cd
- Binding: DB
- Configuração: wrangler.landing.jsonc
- Rotas: odontopersonnallite.com.br/tratamento-humanizado* e www.odontopersonnallite.com.br/tratamento-humanizado*
- O Worker principal clinica-sorriso não foi substituído.

## Fluxo
O formulário chama /tratamento-humanizado/api/contact/config para obter o token CSRF e envia a solicitação para /tratamento-humanizado/api/contact/requests. Nome, WhatsApp, tratamento, consentimento e horário são gravados na tabela contact_requests. Após confirmação, o navegador abre a mensagem no WhatsApp; o visitante confirma o envio. A gravação não confirma consulta agendada.

O ID da solicitação evita duplicidade em reenvios. O limite de oito gravações por IP/hora é aplicado atomicamente no INSERT SQL. O banco recebe somente um hash do IP com a janela de tempo, sem IP em texto. Há validação de origem, CSRF, campos permitidos e corpo limitado a 4096 bytes.

Não existe API pública para listar contatos, mesmo com um cabeçalho de identidade forjado. Acesso administrativo atual: painel autenticado Cloudflare → D1 → odonto-personnallite-contatos → Explorar dados. O painel próprio foi implementado em /tratamento-humanizado/painel/, com acesso bloqueado até ativação do Cloudflare Access. Consulte PAINEL-RECEPCAO.md.

## Verificação
- Página e recursos: HTTP 200.
- /tratamento-humanizado/api/health: database ready.
- Solicitação fictícia: 201; repetição: 200, sem nova linha.
- Consulta pública inexistente: 404.
- Página principal e variante www: HTTP 200.
- Testes locais de persistência, concorrência do limite, duplicidade, CSRF, validação e navegação do formulário passaram.
- Registro fictício de verificação: 40954e6b-dce6-46a1-a641-33cc83e32ba6, identificado TESTE TECNICO - IGNORAR, status teste_tecnico. Nenhum paciente real usado.
- Evidência: output/cloudflare-landing/live-verification.json.

## Manutenção
Executar npm run deploy:landing:cloudflare com a conta Cloudflare autorizada. Esse comando recompila, testa e publica somente o Worker da landing. Não publicar o artefato desta landing pelo comando de publicação do Worker principal.

A prévia privada chatgpt.site usa outro D1 e não foi alterada. Django/PostgreSQL continua preparado como alternativa e não recebe estes contatos. Os IDs de anúncios não foram configurados; nenhuma campanha foi criada.
