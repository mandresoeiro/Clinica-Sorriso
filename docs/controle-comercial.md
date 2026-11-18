# Controle comercial - primeira versão
13/10/2026. Disponível no painel local, em Atendimento comercial > Contatos comerciais.

Campos: nome, telefone, origem informada, código da campanha, situação, próximo retorno e horário confirmado manualmente. Não há campos para prontuário, exames ou diagnóstico.
Fluxo sugerido: Novo contato -> Em atendimento -> Aguardando horário -> Agendado pela recepção -> Compareceu ou Encerrado.
Agendado e Compareceu exigem horário informado. O sistema não consulta disponibilidade, não reserva vagas nem envia mensagens. A recepção faz essas confirmações fora do sistema.
O painel oferece pesquisa por nome/telefone/campanha e filtros por origem e situação. Criado/alterado por e datas são automáticos. Isso não equivale a um histórico completo de auditoria da API.
Não foram inseridos contatos reais ou inventados no banco de uso. Os dados demonstrativos dos testes ficam no banco de testes e são removidos ao final.

## Acessos
Administrador com permissões usa o painel existente.
Para uma conta de recepção já criada, com perfil Recepção:
```bash
docker.exe compose -f C:/dev/projects/ativos/clinica-odonto-personnallite/backend/compose.yaml exec api python manage.py setup_commercial_roles --reception-user NOME_DO_USUARIO
```
Esse comando concede staff e permissões apenas para visualizar, criar e alterar contatos comerciais. Não concede exclusão, superusuário ou edição de contas.
A API /api/v1/leads/ exige sessão e permissões, tem paginação e filtros status/source/search. No site publicado não há captura pública automática; a versão local conectada está descrita em integracao-local-formulario.md, integração WhatsApp ou API de exclusão. Exclusão e retenção devem ser administradas pelo responsável autorizado.
Não cadastrar informações clínicas em nomes ou códigos de campanha. Antes de dados reais, definir finalidade, acessos, retenção e processo operacional com a clínica.
