> Atualização em 21/10/2026: a landing foi publicada no domínio com Worker + D1. Consulte D1-CLOUDFLARE.md. O plano Django abaixo permanece como alternativa, sem implantação em produção.

# Tratamento Odontológico Humanizado — implantação

Preparado em 20/10/2026. URL planejada: https://odontopersonnallite.com.br/tratamento-humanizado/

## Situação real
- Página pronta no projeto principal, em public/tratamento-humanizado/.
- Django recebe os dados em /api/v1/contact/requests/ e salva no modelo Lead existente.
- Novos campos: tratamento, período para retorno, autorização com data e chave para evitar duplicidade. Migração 0003.
- A gravação é confirmada antes de abrir o WhatsApp. Falhas mostram uma alternativa sem dizer que o registro foi salvo.
- Origem e campanha por UTM são códigos validados; não incluir pacientes nesses códigos.
- A prévia Sites existente continua privada, com D1 separado. Nenhum registro desse banco foi copiado para o PostgreSQL.
- NÃO publicado no domínio da clínica nesta entrega: ainda não foi informado ou provisionado um servidor Django. Não houve compra nem alteração de DNS.

## Arquivos principais
- public/tratamento-humanizado/: página, visual aprovado, formulário Django e medição.
- scripts/prepare-humanized-landing.mjs: atualiza a página a partir do visual aprovado sem remover as configurações de medição. Executado por prebuild.
- backend/compose.production.yaml: PostgreSQL interno, Gunicorn interno, Nginx com HTTPS.
- backend/.env.production.example: nomes das configurações, sem senhas reais.
- infra/nginx/personnallite-production.conf: domínio, landing page, API e administração na mesma origem.

## O que falta para publicar
1. Escolher um servidor/VPS com Docker e acesso administrativo; confirmar domínio e conta de hospedagem com o responsável. O domínio sozinho não fornece execução do Django.
2. Preparar certificado válido para odontopersonnallite.com.br e www.odontopersonnallite.com.br. Manter apenas Nginx exposto; não publicar PostgreSQL nem Gunicorn.
3. No servidor, criar backend/.env.production a partir do exemplo, com chave e senha exclusivas, hosts e origens HTTPS. TLS_CERT_DIR deve conter fullchain.pem e privkey.pem. Não enviar senhas por chat.
4. Compilar o site com npm ci e npm run build. O código deve ser implantado como uma unidade, mantendo landing page e /api na mesma origem.
5. Dentro de backend, usar docker compose --env-file .env.production -f compose.production.yaml build e depois up -d db api.
6. Executar docker compose --env-file .env.production -f compose.production.yaml exec api python manage.py migrate --noinput.
7. Executar check --deploy com a mesma composição. Criar o administrador interativamente com createsuperuser e conceder à recepção somente as permissões necessárias com setup_commercial_roles.
8. Iniciar o serviço web após os certificados estarem montados. Validar HTTPS e /api/v1/ready/.
9. Preparar backup PostgreSQL fora do volume e testar restauração em banco separado. Definir acesso da equipe, retenção e atendimento dos contatos.
10. Somente então alterar CONTACT_INTAKE_PRODUCTION_READY=true e recriar api. CONTACT_INTAKE_ENABLED também precisa estar true.
11. Usar um contato fictício para testar: enviar formulário, confirmar no painel, conferir os campos, repetir sem duplicar e abrir WhatsApp sem enviar mensagem de teste à recepção. Remover o registro de teste pelo responsável.
12. Planejar a troca de DNS/rota. O Worker Cloudflare atual serve somente arquivos: não recebe Django automaticamente. Não apontar anúncios para a nova URL antes de testar a API nesse mesmo domínio.

## Comandos de verificação no projeto
- Backend: backend/.venv/bin/python manage.py test --settings=config.settings.test (a partir de backend, usar .venv/bin/python).
- Migrações: .venv/bin/python manage.py makemigrations --check --dry-run --settings=config.settings.test.
- Frontend: npm run typecheck; npm test; npm run build.
- Contrato da landing page: node scripts/test-humanized-landing.mjs.

## Verificado nesta sessão
25 testes Django, migrações sem pendências, 30 testes frontend, TypeScript e build. O teste de contrato confirmou o endpoint Django, CSRF, mapeamento dos campos, abertura do WhatsApp somente depois da resposta e ausência de conversão quando a gravação falha. Docker Desktop não estava ativo; não foi possível verificar PostgreSQL nem Nginx em execução. Nenhuma migração foi aplicada a um banco de produção.

## Medição
Consulte GOOGLE-ADS-ANALYTICS.md. Os IDs estão vazios; nenhuma tag Google é carregada agora. Não se criou campanha ou gasto. Cliques e solicitações são eventos distintos; nenhum deles prova consulta realizada.
