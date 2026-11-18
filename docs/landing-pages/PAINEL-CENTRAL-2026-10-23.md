# Central de atendimento — revisão de 23/10/2026

## Ajustes complementares

Mantido o acesso compartilhado da recepção por escolha da clínica. A seleção de Rosiane/Nayra agora explica a passagem de atendimento entre as duas, sem apresentar isso como autenticação individual. O WhatsApp de contatos cadastrados manualmente usa mensagem de retorno, sem afirmar que vieram do site. Fechar ou sair de um cadastro manual preenchido pede confirmação antes de descartar; dados do rascunho não são guardados no navegador. Orientações de foto informam formato, tamanho, autorização e enquadramento; avatares continuam explicitamente ilustrativos.

Backup externo: preparação e testes em BACKUP-PROTEGIDO.md. Pasta privada criada, mas integração e cópias reais ainda não ativadas. Fotos reais dependem do envio autorizado da clínica.

Suíte completa das landing pages aprovada após os ajustes complementares. Publicação confirmada no Worker personnallite-atendimento, versão `4bf0714d-2410-4653-97aa-e5c5bf2922d7`. Navegador confirmou orientação de acesso compartilhado e os três cartões de fotos com estado pendente, sem criar ou alterar contatos reais.

## Entrega

- Visual responsivo com navegação Hoje / Contatos / Equipe, contrastes, foco visível e alvos de toque.
- Visão Hoje: novos contatos, retornos vencidos, contatos sem responsável, até 50 reservas do dia e até 20 retornos pendentes. Fuso de Belém.
- Cadastro manual de contatos que chegam pelo WhatsApp, telefone ou presencialmente. O formulário registra a confirmação de ciência da pessoa; não recebe informações clínicas.
- Busca de telefone duplicado entre contatos ativos e identificador de repetição para evitar recriação em uma tentativa de envio.
- Fila ativa como padrão. Arquivados, lixeira e os registros legados cujo nome começa exatamente por `TESTE TECNICO - ` possuem visualizações próprias. Esses testes não entram nos indicadores reais.
- Agenda de uma reserva atual por contato: profissional escolhido entre os nomes informados pela clínica, data, hora e duração obrigatória de 5 a 480 minutos. Nenhum expediente ou duração foi inventado.
- Conflitos do mesmo profissional são bloqueados no próprio banco por gatilhos para inserção e atualização. Intervalos adjacentes são permitidos. Versão protege contra sobrescrita concorrente.
- Cancelar reserva mantém histórico e libera horário. Arquivar ou mover o contato à lixeira cancela a reserva atual. Restaurar o contato não reativa uma reserva cancelada.
- Lixeira é reversível; não equivale à eliminação definitiva de dados ou atendimento integral de um pedido de privacidade.
- Histórico autenticado pelo e-mail. A seleção Rosiane/Nayra é identificação **declarada**, acrescentada ao autor das novas operações. E-mail compartilhado não comprova identidade individual.
- Relatórios continuam exclusivos do e-mail administrativo. Não foi concedido acesso à Cloudflare, faturamento ou Google Ads.

## Rotina da recepção

1. Abrir o painel e, se desejar, selecionar quem está atendendo.
2. Consultar Hoje, priorizar retornos vencidos e atribuir responsável na ficha.
3. Cadastrar manualmente pessoas que chegaram por contato direto; cliques no WhatsApp não criam registros automaticamente.
4. Combinar profissional, duração e horário com a equipe e pessoa antes de reservar na ficha.
5. Atualizar a situação do contato separadamente. O painel não envia confirmações automáticas.
6. Cancelamentos: cancelar a reserva ou arquivar/mover à lixeira, conforme o caso.
7. Pedidos de exclusão definitiva: encaminhar à administração, confirmar identidade e analisar obrigações de conservação. Não há purga automática nem prazo jurídico inventado.

## Recuperação e limites

O painel oficial do D1 confirmou Time Travel de **7 dias** em 23/10/2026. A janela disponível começou na criação do banco, em 21/10/2026. A leitura não realizou restauração de produção. Restaurar substitui o banco atual e deve ser executado apenas pelo administrador após avaliação e cópia protegida.

O ensaio `scripts/test-recovery-synthetic.py` usa apenas dados fictícios locais e inclui agenda, relacionamentos e gatilhos. Não confirma recuperação real de produção.

**Pendente:** definir armazenamento privado sob controle da clínica e responsáveis autorizados para cópia externa automática. Nenhum cadastro real foi exportado ao repositório ou pasta pública. Time Travel não substitui uma política externa de cópias, nem evita perda causada por exclusão da conta.

**Também pendentes:** identificação jurídica completa e prazo de conservação aprovados pela clínica; fotos reais autorizadas; contas individuais se a clínica desejar auditoria por pessoa. O funcionamento operacional não depende de inventar esses dados.

## Validação

Testes com banco SQLite isolado e interface JSDOM verificam permissões, CSRF, duplicidade, repetição de envio, duração inválida, conflitos de horário, reagendamento, cancelamento, restauração, ocultação dos testes e integridade. A suíte completa das landing pages verifica a preservação dos formulários e do consentimento de análise.

## Publicação confirmada

Worker `personnallite-atendimento`, versão `46127ec0-8e72-4d55-9082-21d19713fdce`, publicada em 23/10/2026. Duas tabelas, um índice e dois gatilhos da agenda foram verificados por consulta de estrutura no D1. Nenhum contato ou reserva real foi criado para testar.

No navegador publicado: visão Hoje carregada, testes antigos separados da fila real, formulário manual e agenda da ficha conferidos sem gravação. Tela de 390 × 844 sem rolagem lateral; tamanho original restaurado ao final. Capturas em `output/painel-profissional/central-atendimento.png` e `central-mobile.png`.

A prévia em loopback não ficou acessível ao Chrome conectado; a inspeção visual foi feita na versão publicada. O servidor local com dados fictícios foi encerrado.
