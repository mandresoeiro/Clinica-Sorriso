# Rotina de atendimento e recuperação

## Operação da recepção

1. Acessar o painel com um dos e-mails autorizados e verificar novos contatos nos dias de atendimento combinados com a clínica.
2. Conferir a origem (humanizado ou urgência), retornar pelo canal adequado e atualizar a situação. Abertura de WhatsApp não comprova mensagem enviada.
3. Marcar agendado somente após confirmar o horário com o paciente. Não coletar exames ou documentos nos campos do site.
4. Arquivar para organização; arquivamento não é exclusão. Encaminhar solicitações sobre dados ao responsável definido pela clínica, validando identidade por canal adequado, sem compartilhar dados com terceiros.

## Recuperação D1 - procedimento a validar

O banco ativo é odonto-personnallite-contatos, ID f5de2b47-0d43-4248-925f-62139c5634cd. Não usar o antigo roteiro PostgreSQL para restaurar os cadastros dessas landing pages.

Antes de qualquer recuperação: identificar incidente, pausar alterações concorrentes, registrar horário e escopo; confirmar a janela de recuperação disponível no plano atual e exportar uma cópia protegida do estado existente por ferramenta oficial. Não salvar dados de pacientes no repositório, em pastas públicas ou anexos deste chat.

Testar primeiro em banco separado e acesso restrito, com dados sintéticos quando possível. Conferir schema, índices, integridade, contagem agregada e fluxo completo de formulário/painel. Obter aprovação antes de substituir o banco de produção. Planejar reversão e conferir vínculos, autenticação e logs após a mudança. Não executar restauração ou exclusão como teste diretamente na produção.

## Pendências que exigem decisão da clínica

- Responsável pela rotina e frequência de retorno.
- Identificação jurídica, canal formal de privacidade, base legal e prazo de conservação.
- Responsável pela recuperação e destino protegido de cópias, com acesso e prazo definidos.
- Verificação do plano/janela de recuperação D1 e simulação de restauração. Este roteiro não significa backup ou restauração já executados.

## Publicidade

Campanhas somente após aprovação de região, orçamento, datas e textos, cadastro do pagador e validação da conversão. Não contar cliques de WhatsApp como consultas confirmadas. O monitor de cotas só avisa e não limita cobranças.
