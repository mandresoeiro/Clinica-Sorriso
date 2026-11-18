# Preparação da operação — Clínica Odonto Personnallite

## Estado atual

Formulário e painel conectados apenas no ambiente local. O site público continua com WhatsApp. O envio cria um contato comercial e não reserva consulta. O assistente é demonstrativo. Não há campanha ativa ou hospedagem de backend contratada nesta etapa.

## 01. Contas e responsabilidades

Clínica: titular dos domínios, hospedagem, Meta e WhatsApp; pagamento direto dos serviços externos; aprovação de conteúdo, orçamento e dados de atendimento; responsável por responder aos contatos e confirmar consultas.

Prestador: configuração técnica, manutenção contratada, publicação aprovada e acompanhamento das campanhas. Usar acesso delegado e conta individual. Não colocar as contas da clínica em nome pessoal do prestador.

## 02. Recepção

No administrador local, criar uma conta individual com perfil Recepção, ativa e sem superusuário. Não compartilhar a conta administrativa. Aplicar o comando existente, substituindo USUARIO pelo nome criado:

```sh
docker compose -f backend/compose.yaml exec api python manage.py setup_commercial_roles --reception-user USUARIO
```

Validar login: pode visualizar, adicionar e atualizar contatos; não pode excluir contatos nem administrar usuários. Fluxo diário: Novo → Contatado → Aguardando ou Agendado → Compareceu ou Encerrado. Agendado exige data e horário confirmados. Não registrar prontuário ou diagnóstico nesse cadastro.

## 03. Backup

Script preparado: scripts/backup-backend.py. Executar com Python 3 e Docker disponível, escolhendo uma pasta privada fora do repositório:

```sh
python scripts/backup-backend.py --output-dir CAMINHO_PRIVADO
```

Se a descoberta do plugin Compose falhar, informar --compose-executable com o caminho do docker-compose standalone. O script grava dump PostgreSQL em formato custom, valida o catálogo e não modifica o banco. Essa validação não substitui restauração de teste.

Para operação real: agendar backup diário com o mecanismo do provedor; manter cópia criptografada fora do servidor e acesso restrito; definir prazo de retenção com a clínica. Registrar data, resultado e responsável. Testar restauração em um PostgreSQL isolado, nunca sobre o banco ativo; comparar migrações, quantidade de contatos e login de teste. Ainda não foi configurado agendamento nem executado teste de restauração nesta etapa.

## 04. Publicação

Escolher hospedagem para Django e PostgreSQL, com HTTPS e backup. Confirmar domínio antes de configurar. Manter desenvolvimento e produção separados, inclusive banco, credenciais e arquivos de ambiente. Não publicar compose.yaml de desenvolvimento: contém credenciais locais e DEBUG.

Configurar settings.production, segredo exclusivo, senha do banco, hosts oficiais, CSRF e proxy confiável. Executar migrações e check --deploy no ambiente final. A captura pública está deliberadamente bloqueada fora de DEBUG: preparar primeiro limite distribuído de tentativas, proteção antiautomação, comportamento de falhas e integração frontend/API. Não resolver isso ativando DEBUG em produção.

Definir uma origem para site e API ou configurar explicitamente cookies/CSRF e origem cruzada. Publicar em homologação, testar envio, reenvio sem duplicação, acesso anônimo negado, conta da recepção, backup e recuperação. Só então conectar o site público. A hospedagem e suas tarifas serão definidas após escolher o fornecedor; nenhum custo estimado aqui é contratação.

## 05. Aviso de novo contato

Hoje a recepção precisa consultar o painel. Próxima implementação: notificação interna com fila, retentativas e monitoramento, por canal aprovado pela clínica. Evitar enviar dados pessoais completos na notificação; encaminhar para o painel autenticado. Falha na notificação não pode impedir o cadastro do pedido. WhatsApp automático depende de integração oficial e contratação própria; não foi ativado.

## 06. Conteúdo e dados

Confirmar WhatsApp completo, dias e horários, endereço, tratamentos, equipe e registros profissionais. Substituir imagens demonstrativas por material aprovado. Definir responsável e canal de privacidade, acesso, prazo de retenção e procedimento de exclusão dos contatos. Separar demonstração comercial da navegação dos pacientes; proteção por login é necessária se houver conteúdo confidencial.

## 07. Tráfego pago

Após testar produção e obter aceite, criar campanha na conta da clínica. Separar honorários de gestão e verba de mídia. Link do anúncio leva à landing page com origem/campanha reconhecidas. Acompanhar contatos válidos, contatos atendidos, agendamentos confirmados, comparecimentos e custo por contato. Clique em WhatsApp não comprova mensagem enviada nem venda. Não enviar nome, telefone ou informação de saúde para ferramentas de publicidade. Analytics e Pixel dependem de desenho e revisão próprios; não estão ativados.

## 08. Critério de entrega

- [ ] Contas e domínio sob titularidade da clínica.
- [ ] Conteúdo e dados oficiais aprovados.
- [ ] HTTPS e backend de produção, sem DEBUG.
- [ ] Formulário público testado e antiautomação verificada.
- [ ] Recepção individual com permissões restritas testadas.
- [ ] Backup automático e restauração isolada comprovados.
- [ ] Monitoramento de indisponibilidade e rotina de atendimento definidos.
- [ ] Aviso de novo pedido testado ou rotina manual aceita.
- [ ] Privacidade e retenção definidas.
- [ ] Aceite da entrega e autorização separada para anúncios.

Não há cobrança ou ativação automática decorrente desta preparação.
