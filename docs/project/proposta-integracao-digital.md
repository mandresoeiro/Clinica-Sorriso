# Clínica Odonto Personnallite — Projeto de integração digital

Documento de apresentação e planejamento · SoeiroTech  
Atualizado em 11/10/2026 · Versão inicial para revisão

## Objetivo

Integrar a presença institucional, Instagram, páginas de campanha e WhatsApp Business para facilitar solicitações de atendimento e acompanhar resultados. O projeto aproveita o site existente.

## O que já existe e pode ser apresentado

| Recurso | Evidência atual | Como apresentar ao cliente |
|---|---|---|
| Site institucional | Página inicial e páginas de clínica, tratamentos, equipe, dúvidas, contato e privacidade | Demonstração navegável da estrutura existente |
| Identidade visual | Logo, cores, tipografia e componentes compartilhados | Proposta visual existente, com nome a padronizar |
| Tratamentos | Listagem e páginas de detalhes | Organização das informações dos serviços, sujeitas à validação clínica |
| Tour | Navegação por ambientes com imagens demonstrativas | Exemplo de experiência; não apresentar como fotografia real da clínica |
| WhatsApp | Botão fixo, links e formulário que prepara mensagem | Fluxo de solicitação; não confirma consulta |
| Instagram | Links para o perfil configurado | Ligação do site ao perfil; bio e configurações da conta ainda não verificadas |
| Base técnica | React, TypeScript, Vite, testes e configuração Cloudflare | Base reutilizável, sem necessidade de reconstrução |

Site demonstrativo: https://clinica-sorriso.mandre-soeiro.workers.dev/

## O que ainda falta

| Item | Situação | Próxima ação |
|---|---|---|
| Nome | Código usa “Clínica Odontopersonnalite” | Padronizar para “Clínica Odonto Personnallite” |
| Domínios | Registro e titularidade não confirmados | Registrar odontopersonnallite.com.br e odontopersonnallite.com; definir redirecionamentos |
| Dados oficiais | Contatos e endereço configurados, mas não confirmados nesta etapa pelo cliente | Validar telefone, endereço, dias, horários e área atendida |
| Identificação profissional | Registros pendentes no conteúdo | Receber identificação da clínica e responsável técnico |
| Fotografias | Conteúdo demonstrativo | Receber fotos autorizadas ou manter identificação de demonstração |
| Urgência em prótese | Página ausente | Implementar /urgencia-protese após validação de conteúdo |
| Urgência odontológica | Página ausente | Implementar /urgencia-odontologica após validação de conteúdo |
| Homepage | Sem seção específica de urgências | Acrescentar dois cards sem remover as demais seções |
| Instagram | Perfil externo não auditado | Conferir bio, destaques, links e contas de negócio |
| WhatsApp Business | Configuração da conta não auditada | Preparar mensagens, etiquetas e roteiro de atendimento |
| Campanhas | Configuração externa não verificada | Preparar textos, criativos, região e orçamento para aprovação |
| Mensuração | Não identificada no código | Definir eventos, controles de privacidade e relatório |
| SEO | Indexação bloqueada para demonstração; faltam sitemap, canonical e Open Graph | Preparar recursos e liberar somente com conteúdo oficial validado |
| Qualidade | Checks anteriores não executaram por ausência dos comandos no ambiente Windows | Regularizar ambiente e concluir lint, testes, build e revisão em celular |

## Entregas propostas

1. Padronização do nome aprovado e preservação da identidade existente.
2. Duas páginas de serviço, com dúvidas frequentes e contato contextual.
3. Destaques dos serviços na página inicial.
4. Links de campanha identificados e integração com WhatsApp.
5. Proposta de bio, links e destaques do Instagram.
6. Roteiro e organização do atendimento no WhatsApp Business.
7. Planejamento das campanhas e materiais para aprovação.
8. Mensuração, revisão de privacidade, testes e publicação autorizada.

Produção recorrente de posts e vídeos, atendimento às mensagens, gestão mensal de anúncios e manutenção devem ter escopo e preço próprios. Não estão automaticamente incluídos na implantação.

## Jornada e resultados

Instagram ou anúncio → página do serviço → WhatsApp → atendimento da equipe → agendamento confirmado.

Visita, clique, contato e consulta confirmada são etapas diferentes. A clínica deverá registrar os agendamentos para permitir análise do resultado. Não há garantia de volume de pacientes ou retorno financeiro. Informações clínicas não devem integrar URLs de campanha nem eventos publicitários.

## Ordem de execução

| Etapa | Entrega revisável | Dependências |
|---|---|---|
| 1. Organização | Este diagnóstico e escopo escrito | Revisão com cliente |
| 2. Conteúdo | Textos das duas páginas e nome padronizado | Serviços, disponibilidade e dados oficiais |
| 3. Prévia | Páginas e cards integrados em ambiente de revisão | Conteúdo validado |
| 4. Preparação comercial | Campanhas, criativos, métricas e custos | Contas, região e orçamento |
| 5. Qualidade | Checks técnicos e revisão visual | Ambiente funcional e materiais finais |
| 6. Lançamento | Domínio, site e campanhas aprovadas | Registro, acessos e aprovação final |

## Responsabilidades e investimento

A SoeiroTech executará os serviços contratados. A clínica validará conteúdos, fornecerá materiais autorizados, aprovará investimentos e atenderá as solicitações. Domínios e contas devem permanecer sob titularidade da clínica.

Separar na proposta comercial: implantação, manutenção, gestão mensal, verba paga à Meta, domínios e serviços externos. Valores e cronograma ainda não definidos.

## Próximo trabalho recomendado

Preparar os textos das duas páginas e uma prévia local integrada ao site. A publicação depende da validação dos dados oficiais, capacidade de atendimento, identificação profissional e revisão final. Não é necessário construir um painel administrativo nesta etapa.
