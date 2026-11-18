# Central de atendimento - melhoria de 22/10/2026

## Recursos implementados

- Cabeçalho compacto e central de atendimento com resumo geral das quatro situações.
- Busca por nome/telefone e filtros por situação, página de origem e intervalo de recebimento. Datas calculadas no horário de Belém; fim do intervalo inclusivo.
- Ordenação por fila (novos, em atendimento, agendados, arquivados; mais antigos dentro de cada grupo), recentes ou antigos. A origem de urgência não é classificação clínica.
- Ficha do contato, preferência de período, origem, situação e até 50 alterações recentes com autor/data.
- WhatsApp com mensagem genérica, cópia de telefone e ações acessíveis por teclado.
- Confirmação antes de qualquer mudança de situação e opção de desfazer a última mudança da sessão. Desfazer usa a mesma API com verificação de concorrência e gera novo histórico.
- Indicador de atualização/conexão, aviso após cinco minutos sem atualização, tratamento de falha e aviso de expiração baseado no prazo real do token validado.
- Atualização automática opcional a cada dois minutos, começando desligada; suspensa quando a aba está oculta, há modal aberto ou alteração em andamento.
- Nenhum contato, preferência ou observação gravado no localStorage. Ficha é limpa ao fechar; dados e contadores são limpos quando o acesso expira ou a consulta falha.
- Layout com cartões em telas pequenas, foco visível, labels, mensagens de estado e guia rápido da recepção.

## API e segurança

Nenhuma migração, exclusão, nova política de acesso ou ampliação da lista de e-mails. A API de detalhes usa os mesmos controles JWT existentes. Não retorna campos técnicos de fingerprint/rate key. A consulta valida UUID e limita o histórico. Filtros são parametrizados, ordenação por lista permitida e contatos técnicos continuam fora da lista. CSRF, transação do histórico/status e conflito 409 preservados.

Histórico é histórico de situação, não prontuário nem comprovação de envio de mensagens. O prazo exibido na fila é contado desde o cadastro, não desde a última conversa.

## Limites desta versão

Não há agenda clínica, horários reserváveis, atribuição individual de responsável, lembretes persistentes, observações clínicas, exportação em massa, novos estados ou permissões distintas entre administração e recepção. Marcar Agendado requer confirmação externa do horário. Arquivar não elimina dados. Esses recursos precisam de modelagem e decisões próprias; não simular funcionamento com dados locais que a equipe não compartilha.

## Validação

Prévia local com contatos fictícios e histórico fictício, isolados do D1. Testes automatizados cobrem filtros de data em limites UTC/BRT, origem, ordenação, validação, histórico e login, confirmação/cancelamento, desfazer, conflitos, cópia, XSS por nome, atualização opcional, falha de conexão e expiração. Revisão visual desktop da fila e ficha. Verificação DOM em tela estreita sem transbordamento horizontal; captura móvel não concluiu, viewport restaurado.

Captura de exemplo: output/painel-profissional/ficha-ficticia.png. Nenhuma alteração de situação em cadastros de produção foi realizada durante a validação.

## Publicação

Worker personnallite-atendimento publicado em 22/10/2026, versão 07fd7d4d-b807-47dd-9509-cac53f7d2ff3. Acesso autenticado de administração verificado no navegador; cabeçalho, filtros e consulta carregados, aria-busy=false e feedback sem erro. Não se alteraram contatos reais. Prévia local encerrada. Suíte completa das landing pages aprovada, incluindo os novos testes de API/interface.
