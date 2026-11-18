# Fechamento técnico — conversões e backup

## Medição existente
Tag GA4: G-LLJLL8E1PH. Propriedade informada: 560007026. Conta Ads informada: 894-487-8349 (conferir no serviço antes de salvar).
Eventos das duas landing pages: page_view, generate_lead após confirmação de gravação e whatsapp_click para abertura do canal. Sem campos do formulário, mensagem, IDs de contato ou parâmetros da URL na análise. Sem tag no admin. Coleta começa somente após aceitar análise; publicidade e personalização permanecem negadas.

## Parte que exige conta autenticada
1. Conferir o vínculo da propriedade correta ao Ads e a configuração de métricas autorizada, sem importar públicos.
2. Conferir generate_lead entre os eventos; marcá-lo como evento principal e importar para Ads conforme a tela da conta.
3. Revisar duplicatas e definição da ação. Proposta: formulário concluído como objetivo de aquisição; clique de WhatsApp como observação secundária. Clique não prova conversa, consulta nem pagamento.
4. Confirmar configuração antes de qualquer campanha. Não ativar anúncio, orçamento, cobrança, públicos ou sinais do Google nesta etapa.
5. As conversões do Ads não foram declaradas concluídas só porque o código emite eventos. Não foi criado cadastro real para teste.

Referências oficiais consultadas em 24/10/2026:
- https://support.google.com/google-ads/answer/2375435?hl=pt-BR
- https://support.google.com/google-ads/answer/10632359?hl=pt-BR

## Backup externo
Código e testes sintéticos preparados. Configuração permanece desativada: faltam integração OAuth persistente da conta da clínica, custódia da chave e primeira cópia autorizada com verificação de recuperação. Detalhes em ../landing-pages/BACKUP-PROTEGIDO.md.
Não ler tokens do navegador, copiar segredos ao repositório ou exportar contatos sem concluir o fluxo autorizado. Não declarar que uma pasta vazia é um backup ativo.

## Limite de verificação desta revisão
A sessão de navegador precisa ser conferida novamente antes de validar contas externas. O último monitor de cotas ficou bloqueado por falta de Chrome conectado/login na Cloudflare. Isso não é prova de cota disponível ou consumo zero.
