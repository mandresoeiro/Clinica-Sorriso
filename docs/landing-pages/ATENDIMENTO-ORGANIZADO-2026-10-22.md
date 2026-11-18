# Organização dos atendimentos — publicado

## Implementado e publicado em 22/10/2026

- Responsáveis provisórios: Atendente 1, Atendente 2 e Atendente 3. São identificações de organização; não criam usuários ou novos acessos.
- Ficha com responsável, próximo retorno, data/hora combinada e profissional confirmado. Datas exibidas e digitadas no horário de Belém.
- Gravação no D1 com validação, CSRF, autenticação existente, controle de versão e registro do autor/horário. Conflitos entre edições retornam 409.
- Até 30 retornos vencidos mais antigos na fila ativa. Não são enviados avisos externos.
- Aviso no painel quando a quantidade de novos contatos aumenta entre atualizações. Requer painel aberto e atualização manual ou automática opcional. Não é notificação por WhatsApp, e-mail ou aplicativo fechado.
- Formulário principal salva dados de contato no mesmo D1 antes de oferecer WhatsApp. Origem própria `site-principal`. Mensagem livre somente no link do WhatsApp; não é gravada no D1.
- Consulta combinada não é agenda clínica: não verifica conflitos de horário, capacidade, disponibilidade ou bloqueios. O status continua sendo alterado manualmente.

## Publicação concluída

1. Aplicar `infra/cloudflare/panel/workflow.sql` no D1 existente. Somente CREATE TABLE IF NOT EXISTS; sem alteração ou exclusão dos cadastros existentes.
2. Publicar Worker das landing pages com API e painel atualizados.
3. Publicar site principal e aviso de privacidade juntos.
4. Conferir sessão autenticada e interface. Testes funcionais usam dados fictícios, sem modificar contatos reais.

O CLI não possuía d1:write. Após o usuário concluir o login, as duas tabelas foram criadas pelo Console oficial do D1 com confirmação de sucesso. Nenhum cadastro foi alterado.

- Worker das landing pages: `77d6e30b-9460-4956-8fbe-65415d80c505`.
- Worker do site principal: `d135d8ed-978a-47e7-96e0-ac677a53bf15`.
- Painel publicado autenticado conferido: carregamento concluído, sem erro, filtro Site principal e lembretes consultados sem erro.
- Formulário publicado conferido: consentimento e botão Registrar e continuar presentes.
- Prévia local com dados fictícios: seleção Atendente 1, lembrete e salvamento confirmados visualmente. Nenhum teste alterou contatos reais.
- Captura da ficha fictícia: output/painel-profissional/organizacao-ficticia.png.


## Recuperação e privacidade

`scripts/test-recovery-synthetic.py` ensaia cópia/recuperação SQLite local com dados fictícios, verifica integridade e relacionamentos. Não valida Time Travel do D1 nem cria backup da produção.

A clínica ainda precisa definir identificação jurídica completa, responsável por privacidade, prazo de conservação, destino protegido dos backups e responsável pela recuperação. Nenhum prazo é inventado e nenhum dado é excluído automaticamente.

## Anúncios

Nenhum pagamento, anúncio ou configuração de conversão foi alterado nesta etapa. Finalizar conversões do Ads exige acesso à conta e validação do evento antes da aprovação da campanha. A aprovação de orçamento, região, período e anúncio permanece com o cliente.

## Validação executada

- API e painel com SQLite/D1 simulado: gravação, autenticação, CSRF, conflitos de versão, 3 responsáveis, auditoria e lembretes.
- Interface JSDOM: campos de organização, envio, filtros e proteções existentes.
- Testes React: 30 testes passaram na execução geral; o teste de proposta que excedeu 5 segundos passou na repetição isolada (6 testes do arquivo).
- Build de produção aprovado.
- Cópia/recuperação sintética aprovada.
- Nenhuma edição de contatos reais. Migração aditiva e as duas publicações confirmadas.
