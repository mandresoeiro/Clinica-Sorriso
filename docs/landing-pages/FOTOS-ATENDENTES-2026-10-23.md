# Fotos da recepção

- Painel → Equipe de atendimento · fotos.
- Rosiane Oliveira Santiago, Atendente 2 e Atendente 3 recebem avatar vetorial ilustrativo enquanto não houver foto real.
- Apenas administração cadastra/substitui fotos; recepção visualiza.
- No navegador, JPG/PNG/WebP de até 5 MB são reduzidos a até 256 pixels, reexportados como JPEG e enviados sem os metadados originais. O servidor limita a imagem a 80 KB, valida assinatura/tipo, CSRF, origem, autenticação, administrador e versão.
- Foto gravada no D1 em reception_staff_photos, com autor/horário/versão; imagem servida somente por rota autenticada, sem cache. Não é publicada nas landing pages.
- Antes do envio, a interface solicita confirmação de autorização de uso da foto. Nenhuma foto real foi fornecida ou enviada pelo agente.
- Tabela criada de forma aditiva pelo Console oficial da Cloudflare; cadastros existentes preservados.

Publicado: personnallite-atendimento, versão 81fb1b12-6b50-4a8a-9ccb-0bad9ef75c8c. Suíte aprovada, incluindo envio restrito ao admin, CSRF, tipo/assinatura, conflito de versão e leitura autenticada. Em produção: 3 avatares carregados e 3 campos de foto no admin, sem erro. Nenhuma foto real enviada. Captura: output/painel-profissional/fotos-equipe.png.
