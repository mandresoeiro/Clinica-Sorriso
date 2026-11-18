# Recepção — Rosiane e Nayra

## Acessos aprovados pelo usuário

- Rosiane Oliveira Santiago (ASB, registro informado 1090, UF a confirmar) e Nayra Almeida (estagiária) usam odontopersonnallite.recepcao@gmail.com.
- O e-mail compartilhado pode executar todas as funções operacionais existentes: contatos, responsável, retornos, agendamento combinado, arquivar/reabrir, cadastrar, enquadrar, ocultar e mostrar fotos.
- Relatórios são exclusivos de odontopersonnallite.admin@gmail.com, com bloqueio na API, além de ocultação na interface da recepção.
- Isso não concede acesso à Cloudflare, ao console D1, Google Ads, pagamentos ou gestão de credenciais.
- O histórico guarda o e-mail autenticado. Com conta compartilhada não é possível atribuir a ação individualmente a Rosiane ou Nayra. O responsável do contato é uma escolha operacional e não comprova quem executou a alteração.

## Rotina rápida

1. Entrar com o e-mail da recepção e verificar a atualização da lista.
2. Conferir os retornos vencidos, de hoje e dos próximos dias. Esses filtros usam Belém e mostram contatos ativos (Novo/Em atendimento).
3. Escolher o responsável e retornar pelo canal combinado. Abrir WhatsApp não envia mensagem automaticamente.
4. Registrar data/profissional apenas após combinar com a pessoa; alterar a situação manualmente.
5. Registrar próximo retorno quando necessário. O histórico da organização passa a guardar os valores salvos desta atualização em diante, até 50 registros recentes por ficha. Não reconstrói mudanças antigas.
6. Arquivar apenas quando apropriado; arquivar não exclui dados. Sair ao terminar em computador compartilhado.

## Fotos

Enquadramento quadrado com zoom e ajuste horizontal/vertical antes do envio. Ocultar mantém a foto guardada e permite restaurar a exibição; não equivale a exclusão por privacidade. Nenhuma foto real foi fornecida pelo agente. As fotos são restritas aos usuários autorizados do painel.

## Relatórios

Administração pode filtrar por período de recebimento, origem e responsável atual. Apresenta cadastros e estado atual por grupo; alterações para Agendado são eventos, não consultas realizadas nem pessoas únicas. Campos de busca, situação da fila e retornos não afetam o relatório. Sem datas, usa o dia atual de Belém.

## Ainda depende da clínica

- Duração, disponibilidade e regras dos profissionais para implementar agenda com bloqueio real de sobreposição. A interface atual registra combinações, sem reservar horários.
- Política de conservação/exclusão, responsável por privacidade e destino protegido de backups.
- O ensaio de recuperação usa dados fictícios locais; não comprova recuperação efetiva do D1 em produção.
- Publicidade continua dependendo de aprovação. Nenhum pagamento ou anúncio é alterado nesta entrega.

## Implantação

Migração aditiva infra/cloudflare/panel/operations.sql confirmada pelo Console oficial do D1. Sem alteração de cadastros existentes. Publicado no Worker personnallite-atendimento, versão 05d001d3-c45d-45f5-986e-1ad9ff6c6594.

Suíte das landing pages aprovada. Testes confirmaram recepção com arquivamento/reabertura, fotos/visibilidade, enquadramento, filtros e histórico; relatório retorna 403 para recepção. Ensaio local de recuperação sintética aprovado. Em produção, painel autenticado sem erro, Nayra nos cartões, 3 campos de foto e filtro de retornos visíveis; guia de permissões conferido. Nenhum contato ou foto real foi alterado durante os testes.
