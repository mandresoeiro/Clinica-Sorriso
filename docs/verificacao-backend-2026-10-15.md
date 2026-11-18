# Verificação do backend — 15/10/2026

## Resultado
Base Django com PostgreSQL preparada para desenvolvimento; ainda não pronta para captura pública em produção.

19 testes passaram usando `config.settings.test` e SQLite em memória. Isso não comprova operação de um PostgreSQL de produção. Docker Desktop não respondeu nesta sessão; não foi possível verificar o banco local em execução.

## O que existe
- Contatos: nome, telefone, origem, campanha, situação, próximo retorno e horário confirmado pela recepção.
- Datas automáticas e registro do usuário responsável por alterações no painel.
- Painel Django com login e permissões de recepção para visualizar, adicionar e alterar contatos.
- API de captura local com validação, CSRF, identificador de pedido para evitar reenvio duplicado e limitação local de tentativas.
- Captura explicitamente desativada quando DEBUG está desligado.

## Como salvar hoje
A landing page publicada prepara uma mensagem no WhatsApp e não grava no banco. O painel local pode receber cadastro manual quando o Docker estiver funcionando e houver uma conta autorizada. Não há confirmação automática de consulta.

## Fluxo a colocar em produção
Formulário → API validada → PostgreSQL → painel privado da recepção. A página só deve informar recebimento depois de o servidor confirmar a gravação. O WhatsApp permanece como alternativa.

## Pendências
- Escolher e provisionar hospedagem para Django e PostgreSQL; o Worker atual serve os arquivos do site.
- Configurar segredos, HTTPS, proxy, sessões, origens e acesso privado ao painel.
- Preparar proteção distribuída contra abuso e proteção de login antes de liberar captura pública.
- Adicionar período preferido ao modelo, à API e ao formulário integrado.
- Se houver novidades por marketing, criar autorização opcional separada e seu registro; não existe campo persistente para isso hoje.
- Definir retenção, responsáveis, backups e testar restauração.
- Integrar o formulário publicado e testar o fluxo completo com dados fictícios.

Não publicar o Compose de desenvolvimento nem ativar DEBUG em produção para liberar o formulário.
