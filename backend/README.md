# Backend - Odonto Personnallite
Base Django separada do site React. O site publicado não foi conectado nem alterado.

## Executar localmente
Com Docker Desktop ativo em modo Linux, dentro de backend:
```bash
docker compose up --build -d
docker compose exec api python manage.py createsuperuser
```
Abra http://127.0.0.1:8001/admin/. Crie usuário e senha interativamente. Não existe conta automática.
Compose apenas para desenvolvimento: banco sem porta externa, API no loopback, credenciais locais fictícias. Para parar preservando os dados: docker compose down. Não remova o volume se precisar dos dados.

## Testes sem Docker (WSL/Linux)
```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python manage.py test --settings=config.settings.test
.venv/bin/python manage.py makemigrations --check --dry-run --settings=config.settings.test
```
SQLite em memória é exclusivo dos testes. Desenvolvimento normal e produção usam PostgreSQL.
No Windows, crie o venv pelo Python do Windows e use .venv/Scripts/python.exe, sem reutilizar o venv WSL.
Variáveis são lidas do ambiente. O Django não carrega .env automaticamente; .env.example é referência.

## API
- GET /api/v1/health/: público, processo responde.
- GET /api/v1/ready/: público, banco responde; erro genérico 503.
- GET /api/v1/me/: login, perfil da própria conta.
- GET /api/v1/administration/: login e perfil administrador.
- /admin/: painel Django, exige staff e permissões.
- /api-auth/login/: login pelo navegador somente em desenvolvimento.

API fechada por padrão, autenticação por sessão, sem cadastro público nem alteração do próprio perfil. Recepção não tem acesso administrativo por padrão. Superusuário recebe perfil administrador.
Há um controle comercial inicial de contatos e agendamentos registrados manualmente no painel Django. Consulte ../docs/controle-comercial.md. Não há agenda com disponibilidade, prontuário, cadastro clínico, captura pública automática ou conexão real com WhatsApp.

## Produção
Usar config.settings.production. Definir chave exclusiva com pelo menos 50 caracteres, hosts explícitos, senha real de PostgreSQL, origens CSRF HTTPS, domínio/proxy e certificado.
Configurar backups com teste de recuperação, monitoramento e proteção contra tentativas de login. Não confiar em cabeçalhos de proxy sem sanitização.
Executar migrate, collectstatic e check --deploy com as variáveis reais. O Compose local não deve ser publicado como produção.
Definir login, sessões, CSRF e origens antes de integrar o frontend. CORS e login do frontend em produção ainda não implementados.
A administração Django não equivale a um sistema clínico pronto.

Referências: https://docs.djangoproject.com/en/5.2/releases/5.2/ e https://www.django-rest-framework.org/api-guide/permissions/

## Controle comercial
Contatos comerciais ficam em /admin/leads/lead/. A API /api/v1/leads/ exige permissões de modelo, inclusive para leitura. Para preparar o grupo após as migrações: docker compose exec api python manage.py setup_commercial_roles. Atribuir recepção a uma conta exige --reception-user NOME_DO_USUARIO.

## Integração local do formulário
A versão de teste em http://127.0.0.1:8001/contato recebe solicitações com dados fictícios no painel. Veja ../docs/integracao-local-formulario.md. A captura permanece desativada na configuração de produção.

## Integração da landing page — 20/10/2026

A landing page de atendimento humanizado usa a mesma API de captura, com tratamento de interesse e período preferido. A migração 0003 adiciona esses campos e a limitação compartilhada no banco. Produção permanece desligada por padrão: requer CONTACT_INTAKE_ENABLED e CONTACT_INTAKE_PRODUCTION_READY, HTTPS e infraestrutura conforme ../docs/landing-pages/TRATAMENTO-HUMANIZADO-ENTREGA.md. Esta preparação não comprova operação de PostgreSQL em produção.
