# Backend - arquitetura inicial
13/10/2026. Django modular com accounts e core, API /api/v1/, PostgreSQL e usuário próprio desde a primeira migração.
Configurações de desenvolvimento, testes e produção separadas. Sessões e CSRF do Django; API fechada por padrão. Health e ready públicos, sem detalhes de banco.
Recepção e administrador têm acessos distintos. O painel Django é uma ferramenta administrativa, não um CRM finalizado.
O frontend atual permanece independente. Sem compra de nuvem, publicação de API ou conexão ao site nesta entrega.
SQLite em memória somente para testes; CI adicional preparado para PostgreSQL. Sem microserviços, Redis ou tarefas assíncronas antes de necessidade real.
Ver backend/README.md para execução, configuração e limites. Dados clínicos e agenda são módulos futuros.

## Evolução comercial em 13/10/2026
Módulo leads adicionado com contatos, acompanhamento e horários registrados manualmente. API protegida e painel Django. Sem prontuário, captura pública ou reserva automática. Ver controle-comercial.md e seu relatório de validação.
