# Painel da recepção — 21/10/2026

Endereço preparado: https://odontopersonnallite.com.br/tratamento-humanizado/painel/

## Estado
Teste integrado real concluído em 21/10/2026 às 11:57: formulário público criou o cadastro fictício TESTE TECNICO - IGNORAR 21OUT, exibido no painel autenticado; situação alterada para Em atendimento e depois Arquivado, com confirmação visual e contadores atualizados. Nenhuma mensagem foi enviada. Fixture arquivada, não excluída. Prova: output/cloudflare-panel/teste-completo.png.

Conferência final: login real com admin e listagem D1 verificados em 21/10/2026 às 11:54, sem contatos de produção (registros técnicos excluídos). Screenshot output/cloudflare-panel/painel-autenticado.png. Corrigida incompatibilidade da consulta JWKS no runtime Workers: AbortController com prazo de 5 segundos e redirect manual (respostas de redirecionamento recusadas). Assinatura, emissor, público-alvo, expiração e lista exata continuam obrigatórios. Versão final 8afadf9e-cfce-489c-ba40-d41d376e1959. Alteração de situação/auditoria passaram em testes locais; não se alteraram registros reais nem se testou saída da sessão do titular.

Atualização: Access ativado em 21/10/2026, autorizado pelo titular para os e-mails admin e recepcao da clínica. Aplicativo 4f290c61-a585-4a5a-b552-3471e1f10d4b protege apenas tratamento-humanizado/painel nos dois hostnames. Política Allow com os dois endereços exatos, One-time PIN exclusivo e sessão de 6 horas. Worker 39f35c6a-4c8c-4ad5-9bd6-3cead7fbac96 publicado com emissor, AUD e lista permitida. Redirecionamento real ao login confirmado; código solicitado para recepcao. A conferência autenticada de listagem/atualização/saída aguarda o titular concluir o código e a reconexão do navegador. Os parágrafos de implantação inicial abaixo são histórico, superados quanto às pendências de checkout e e-mails.

Interface e API implementadas, testadas e publicadas com bloqueio de acesso. Versão do Worker: 21c7278c-9c93-4a29-b281-4d9a1cb366e6.

A tabela contact_request_events e seu índice foram aplicados e verificados no D1 pelo painel autenticado Cloudflare. A tentativa por CLI não possuía escopo d1:write e não realizou a migração. Login ainda não ativado: Cloudflare Zero Trust não estava habilitado na conta e seu checkout de plano gratuito exige cartão, aceite dos termos e autorização para possíveis cobranças excedentes. O agente não preencheu dados de pagamento nem concluiu aceites/contratação. O e-mail autorizado ainda não foi informado.

O Worker bloqueia todas as páginas, arquivos e APIs do painel enquanto a configuração de Access estiver ausente. A landing pública continua recebendo contatos.

## Recursos
- Lista paginada de solicitações com nome, telefone, interesse, recebimento e situação.
- Busca por nome ou telefone e filtros de situação.
- Novo, Em atendimento, Agendado e Arquivado.
- Botão de WhatsApp com mensagem genérica; o usuário confirma o envio.
- Mudanças de situação condicionais à situação anterior, com conflito 409 quando outra pessoa já alterou.
- Histórico em contact_request_events: usuário autenticado, antes/depois e data.
- Registros técnicos de teste não aparecem.
- Não há exclusão de contatos nem exportação em massa nesta versão.

## Ativação pendente
1. O titular conclui o checkout Zero Trust Free no painel Cloudflare. Essa etapa pede cartão, termos e autorização para excedentes; o titular deve revisar e decidir.
2. Informar os e-mails que terão acesso. Nunca cadastrar uma regra Everyone ou domínios de e-mail inteiros.
3. Criar um aplicativo Access self-hosted para o hostname odontopersonnallite.com.br, caminho tratamento-humanizado/painel e seus subcaminhos. Incluir www.odontopersonnallite.com.br com o mesmo caminho se mantida essa variante.
4. Usar login One-time PIN e política Allow apenas para os e-mails aprovados; duração de sessão sugerida de 8 horas.
5. Obter o team domain e o AUD desse aplicativo.
6. Configurar no Worker personnallite-atendimento:
   - PANEL_ACCESS_ISSUER: https://<team>.cloudflareaccess.com
   - PANEL_ACCESS_AUD: audience tag do aplicativo
   - PANEL_ALLOWED_EMAILS: lista exata de e-mails separados por vírgulas.
   Preferir secret para a lista de e-mails e não versionar endereços privados.
7. Preservar essas variáveis nas futuras publicações (usar configuração de ambiente restrita/segredos, sem expor valores no código).
8. Conferir login com o titular, recusa de e-mail não autorizado, listagem e atualização de um registro fictício, histórico e saída.
9. Publicar o acesso da recepção somente depois dessa conferência.

## Segurança
O servidor valida assinatura RS256 do JWT Access, chave pública do team domain configurado, emissor, audiência, expiração e e-mail permitido. Cabeçalhos de e-mail e identidade avulsos não autorizam acesso. O painel não usa o cabeçalho da prévia Sites.

POST de situação exige origem igual, CSRF e campos permitidos. Listas usam paginação e consultas parametrizadas. A interface usa textContent para os dados, sem HTML de contatos. Respostas e arquivos do painel têm Cache-Control no-store. Não há dados pessoais em localStorage nem analytics no painel.

## Arquivos e testes
- infra/cloudflare/panel/: layout, JS, autenticação, API e schema.
- scripts/test-cloudflare-panel.mjs: JWT válido/inválido, emissor, audiência, expiração, e-mail, bloqueio, filtros, atualização, conflito e auditoria.
- scripts/preview-cloudflare-panel.mjs: prévia local exclusivamente com dados fictícios, fora do Worker publicado.
- npm run test:landing:cloudflare: recompila e testa a landing e o painel.
- npm run deploy:landing:cloudflare: testa e publica o Worker isolado.

A tabela de histórico deve existir no D1 antes de ativar as mudanças de situação. Nunca ativar um bypass de autenticação para mostrar dados reais.
