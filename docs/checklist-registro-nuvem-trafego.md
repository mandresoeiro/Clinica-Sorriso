# Checklist de lançamento — Odonto Personnallite

Preparado em 14/10/2026. Este documento é um roteiro; não significa contratação, publicação ou ativação de anúncios. Marcar cada item somente após verificar a conclusão.

Meta Ads anuncia no Instagram/Facebook; Google Ads anuncia no Google. São contas, cobranças e campanhas diferentes. Registro.br registra o endereço; a hospedagem disponibiliza o site. E-mail profissional é uma contratação separada, quando desejado.

## 1. Dados, titularidade e acesso

- [ ] Confirmar grafia oficial: Odonto Personnallite.
- [ ] Confirmar nome empresarial, CNPJ e responsável autorizado.
- [ ] Confirmar WhatsApp completo; o número informado no projeto é (91) 8188-8353 e precisa ser testado antes do lançamento.
- [ ] Confirmar endereço, bairro, CEP, dias e horários.
- [ ] Confirmar nomes completos, registros profissionais e tratamentos com a clínica.
- [ ] Usar contas da clínica para domínio, hospedagem e anúncios; prestador recebe acesso individual delegado.
- [ ] Ativar autenticação de dois fatores e guardar recuperação com a titular.
- [ ] Definir responsável por aprovar conteúdo, pagar serviços e responder aos contatos.
- [ ] Aprovar escopo e separar implantação, manutenção, gestão de anúncios e verba de mídia.

## 2. Registrar o .com.br

Link: https://registro.br/

- [ ] Escolher o endereço e pesquisar disponibilidade. Exemplo a consultar: odontopersonnallite.com.br. Disponibilidade não verificada.
- [ ] Criar ou acessar o cadastro do responsável; registrar sob titularidade da clínica/entidade autorizada.
- [ ] Conferir os dados de titular, contato e cobrança.
- [ ] Conferir valor e período de registro no checkout oficial.
- [ ] Pagar e aguardar a confirmação.
- [ ] Registrar data de renovação e responsável pelo pagamento.
- [ ] Delegar o contato técnico ao prestador, quando apropriado, sem compartilhar senha.

Concluído quando o domínio aparece ativo no painel e a titularidade está correta. Não comprar outro domínio parecido sem aprovação da clínica.

## 3. Publicar o site na nuvem

Painel: https://dash.cloudflare.com/
Documentação: https://developers.cloudflare.com/workers/static-assets/

O projeto já possui configuração Cloudflare Workers para servir a pasta dist. O endereço anteriormente informado foi https://clinica-sorriso.mandre-soeiro.workers.dev/ ; o estado público atual não foi conferido nesta preparação.

- [ ] Confirmar quem administra a conta Cloudflare e conceder os acessos necessários.
- [ ] Manter uma cópia do projeto e das alterações existentes antes de publicar.
- [ ] Instalar as dependências e executar build e verificações do projeto.
- [ ] Publicar primeiro em ambiente de demonstração e revisar no celular e computador.
- [ ] Conferir formulários, links, WhatsApp, tour, menu e páginas internas.
- [ ] Configurar atualização automática pelo GitHub com credenciais restritas e ambiente de demonstração separado.
- [ ] Verificar os limites, plano e eventuais cobranças da hospedagem antes de ativar serviços pagos.

## 4. Conectar Registro.br à Cloudflare

Documentação: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/

- [ ] Adicionar o domínio à conta Cloudflare e revisar os registros DNS existentes.
- [ ] Preservar registros de e-mail, se já existir serviço de e-mail.
- [ ] Copiar os servidores DNS atribuídos especificamente pela Cloudflare ao domínio.
- [ ] No Registro.br, alterar os servidores DNS para os fornecidos pela Cloudflare. Não usar servidores de exemplo.
- [ ] Aguardar a zona ficar ativa.
- [ ] No Worker do site, adicionar o domínio personalizado.
- [ ] Definir o endereço principal e configurar o comportamento de www e sem www.
- [ ] Conferir HTTPS, certificado, redirecionamentos e páginas internas pelo domínio final.
- [ ] Atualizar o endereço oficial no Instagram, WhatsApp e materiais da clínica.

## 5. Painel e formulário na nuvem — se incluídos no contrato

O backend Django/PostgreSQL encontrado no projeto está preparado para uso local. Publicar o site estático não publica automaticamente esse backend. Referência interna: docs/plano-operacao-e-publicacao.md.

- [ ] Decidir se o lançamento inicial usará somente WhatsApp ou também formulário/painel hospedados.
- [ ] Escolher hospedagem compatível com Django e PostgreSQL; aprovar a cobrança recorrente.
- [ ] Criar ambiente de produção separado, credenciais exclusivas e HTTPS.
- [ ] Configurar DEBUG desativado, hosts, origens, cookies/CSRF e integração site/API.
- [ ] Implementar e verificar proteção antiautomação e limites de tentativas antes de liberar captura pública.
- [ ] Testar cadastro, duplicação, falha de rede e acesso anônimo negado.
- [ ] Criar usuário individual de recepção com permissões restritas.
- [ ] Configurar backup e comprovar restauração em ambiente isolado.
- [ ] Definir quem acompanha novos pedidos e como será avisado.
- [ ] Confirmar que pedido de contato não é consulta automaticamente agendada.

Se o backend não estiver pronto, manter o fluxo aprovado pelo WhatsApp e não anunciar um formulário que não funciona.

## 6. Revisão antes de divulgar

- [ ] Substituir conteúdo demonstrativo por informações e imagens aprovadas, ou manter indicação clara de demonstração.
- [ ] Revisar política de privacidade e explicar o destino dos dados do formulário e WhatsApp.
- [ ] Definir canal de privacidade e acesso aos contatos.
- [ ] Revisar as regras aplicáveis de publicidade odontológica com a responsável técnica.
- [ ] Confirmar direitos de imagens, depoimentos e músicas usados nos anúncios.
- [ ] Revisar no celular: textos, contraste, velocidade, imagens e botões.
- [ ] Separar páginas comerciais internas do fluxo de pacientes e proteger conteúdo confidencial.
- [ ] Revisar demoMode/noindex antes de permitir indexação; retirar somente após aprovação do conteúdo oficial.
- [ ] Testar uma conversa real pelo botão de WhatsApp e simular o atendimento pela recepção.

## 7. Google Pesquisa e Maps

Perfil da Empresa: https://business.google.com/
Ajuda oficial: https://support.google.com/business/answer/2911778?hl=pt-BR
Search Console: https://search.google.com/search-console/

- [ ] Procurar se a clínica já tem um perfil no Maps, evitando duplicação.
- [ ] Criar ou reivindicar o perfil e concluir a verificação indicada pelo Google.
- [ ] Preencher nome real, categoria adequada, endereço, telefone, horários, fotos e site final.
- [ ] Garantir que os dados sejam iguais no site e nas redes sociais.
- [ ] Adicionar o domínio ao Search Console e verificar propriedade.
- [ ] Preparar/enviar sitemap e conferir páginas indexáveis.
- [ ] Criar rotina de atualização e resposta a avaliações sem expor dados de pacientes.

Adicionar/reivindicar o Perfil da Empresa não tem custo financeiro. Não confundir esse perfil com anúncios pagos.

## 8. Preparar Google Ads

Painel: https://ads.google.com/
Guia oficial: https://support.google.com/google-ads/answer/6366720?hl=pt-BR

- [ ] Criar a conta em nome da clínica e conferir moeda, fuso e dados de cobrança.
- [ ] Concluir verificações solicitadas e conceder acesso delegado ao gestor.
- [ ] Definir objetivo de contatos/agendamentos, serviço prioritário e página de destino.
- [ ] Começar com uma campanha de pesquisa de escopo pequeno, se aprovada.
- [ ] Escolher a região realmente atendida e revisar a opção de presença geográfica.
- [ ] Selecionar buscas relevantes e palavras negativas adequadas.
- [ ] Escrever anúncios factuais, sem promessas de resultado.
- [ ] Definir orçamento aprovado e data de revisão; conferir as regras de cobrança da plataforma.
- [ ] Configurar medição de ações com privacidade e testar antes de lançar.
- [ ] Não usar dados de saúde ou listas de pacientes para personalização publicitária.
- [ ] Revisar tudo e ativar somente com autorização de gasto.

## 9. Preparar Meta Ads

Business Suite: https://business.facebook.com/
Gerenciador de Anúncios: https://www.facebook.com/adsmanager/
Formação oficial: https://www.facebookblueprint.com/

- [ ] Criar ou organizar o portfólio empresarial da clínica.
- [ ] Conectar Instagram profissional, Página do Facebook e WhatsApp Business conforme o fluxo disponível.
- [ ] Criar/confirmar conta de anúncios com moeda, fuso e cobrança corretos.
- [ ] Conferir permissões, autenticação de dois fatores e verificações solicitadas.
- [ ] Escolher atendimento no WhatsApp ou página do site como destino.
- [ ] Criar anúncio próprio para apresentação/serviço aprovado, com chamada clara para contato.
- [ ] Preparar peças 9:16 para Reels/Stories e peças adequadas ao Feed, com margens para a interface.
- [ ] Selecionar região, orçamento e calendário aprovados.
- [ ] Se a clínica quiser somente Instagram, revisar posicionamentos para não veicular no Facebook.
- [ ] Conferir licença de áudio para uso comercial/anúncios; não presumir autorização por ser instrumental ou trecho curto.
- [ ] Testar botão e mensagem de destino no celular.
- [ ] Revisar conteúdo, conta, orçamento e link antes de ativar.

## 10. Medição, atendimento e melhoria

- [ ] Definir orçamento total de mídia e quanto irá para cada plataforma; os limites não são compartilhados automaticamente.
- [ ] Usar links com origem/campanha para distinguir Google, Instagram e outras fontes.
- [ ] Definir o que é clique, contato recebido, contato qualificado e agendamento confirmado.
- [ ] Não contar clique no WhatsApp como mensagem recebida ou consulta marcada.
- [ ] Definir responsável e horário de resposta da recepção.
- [ ] Acompanhar gastos, contatos válidos, agendamentos e comparecimentos.
- [ ] Pausar anúncio se o destino estiver quebrado ou a recepção não puder atender.
- [ ] Rever buscas/posicionamentos e qualidade dos contatos em rotina combinada.
- [ ] Não enviar nome, telefone ou informações clínicas nos URLs ou eventos de publicidade.
- [ ] Só ativar Analytics/Pixel e integrações após revisar finalidade, dados, consentimento quando aplicável e configuração.
- [ ] Entregar relatório simples com gasto, resultado comercial e ajustes feitos.

## Custos separados para aprovação

| Item | Como contratar/pagar | Situação |
|---|---|---|
| Domínio .com.br | Registro.br; conferir período, valor e renovação no painel | A definir |
| Hospedagem do site | Cloudflare; conferir plano, limites e cobrança | Configuração existente; produção a conferir |
| Backend e PostgreSQL | Provedor compatível, caso incluídos | Não contratados nesta etapa |
| E-mail profissional | Provedor de e-mail, se desejado | Opcional |
| Implantação do prestador | Contrato de escopo e entrega | A combinar |
| Manutenção/site | Mensalidade e escopo próprios | A combinar |
| Gestão de anúncios | Honorários separados da verba de mídia | A combinar |
| Verba Google Ads | Paga pela clínica ao Google | Só ativar após aprovação |
| Verba Meta Ads | Paga pela clínica à Meta | Só ativar após aprovação |

## Ordem recomendada de execução

Dados e contas → domínio → nuvem → domínio/HTTPS → revisão do atendimento → Maps → medição → primeira plataforma de anúncios → revisão dos contatos → segunda plataforma.

Com orçamento inicial pequeno, minha sugestão é testar uma plataforma primeiro e escolher a segunda a partir do resultado. Isso é uma decisão de planejamento, não promessa de retorno.

## Links de referência

- Registro.br: https://registro.br/
- Cloudflare Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Cloudflare Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- Google Perfil da Empresa: https://support.google.com/business/answer/2911778?hl=pt-BR
- Google Ads: https://support.google.com/google-ads/answer/6366720?hl=pt-BR
- Meta Blueprint: https://www.facebookblueprint.com/

Informações específicas de conta, preços, verificações e botões devem ser conferidas no painel no momento da execução.
