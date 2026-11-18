# Revisão profissional - 22/10/2026

## Resultado

As landing pages estão adequadas para apresentação. O conjunto ainda não deve ser anunciado como entrega final de operação: o site principal permanece demonstrativo e há pendências de contato, conteúdo institucional, privacidade e medição publicitária. Nenhum anúncio foi ativado e nenhum pagamento foi alterado nesta revisão.

## Achados por prioridade

1. **Contato corrigido e publicado.** Após autorização do titular em 22/10/2026, publicado o Worker principal clinica-sorriso, versão f8671848-cc4a-4910-90a9-667339b9ee3d. Confirmados em navegador o telefone (91) 98188-8353 e os links wa.me/5591981888353 na página de contato e no domínio www. As duas landing pages continuam acessíveis; canonical e analytics da primeira preservados. Prova: output/google-ads/telefone-site-publicado.png. Nenhum anúncio ou pagamento alterado.
2. **Conteúdo institucional demonstrativo.** A página inicial informa versão demonstrativa; fotos da clínica/tour são ilustrativas. Equipe lista registros profissionais a confirmar. Confirmar com a clínica razão social, responsável técnico, dados profissionais, serviços, horários e autorização das imagens. Não remover avisos de demonstração até validar os conteúdos. Não foi realizada certificação jurídica ou regulatória.
3. **Privacidade incompleta para operação.** O site principal ainda descreve demonstração e, conforme a configuração, backend local/PostgreSQL. Nas landing pages, o formulário realmente grava no D1 e o diálogo informa essa gravação, WhatsApp e Analytics por consentimento. Faltam identificação jurídica do responsável, canal de solicitações e política de conservação/eliminação dos contatos. Não inventar esses dados nem prazos.
4. **Medição e publicidade pendentes.** GA4 das duas páginas registra eventos explícitos sem os campos do formulário. Não há atribuição automática por UTM/origem, por decisão de minimização documentada; isso limita avaliação de campanhas. Conversão principal e atribuição precisam de validação antes de investir. Cliques em WhatsApp não comprovam mensagem ou consulta. Cadastro do Ads e forma de pagamento ainda não concluídos/verificados nesta revisão.
5. **Busca orgânica bloqueada.** O código do site principal tem meta noindex,nofollow e public/robots.txt com Disallow: /. Não há public/sitemap.xml. O bloqueio é coerente com demonstração, mas precisa ser revisto após aprovação do conteúdo, com sitemap e metadados por página. Não liberar automaticamente enquanto houver conteúdo provisório.
6. **Operação e recuperação.** Painel protegido e fluxos de gravação/status possuem testes. A documentação registra validação autenticada anterior em 21/10; não foram lidos contatos reais nesta revisão. Não foi encontrado procedimento de recuperação D1 testado, política de retenção ou rotina de exclusão; arquivar no painel não equivale a excluir. Definir responsáveis, prazo de retorno e rotina de recuperação. Documentação de Django/PostgreSQL é histórica e não descreve o backend atual das landing pages.
7. **Navegação e entrega.** Há páginas antigas de urgência no site principal e nova landing de urgência com outro endereço. Consolidar a navegação pública para destinos aprovados, evitar conteúdo duplicado e separar materiais de proposta/demonstração do percurso dos pacientes. Não ampliar o número de páginas sem necessidade.
8. **Desempenho do site principal.** O build inclui duas imagens PNG ilustrativas de aproximadamente 2,3 MB e 2,5 MB, além de JavaScript de 480 kB (144 kB gzip). Otimizar imagens para WebP/AVIF, carregar conteúdo secundário sob demanda e avaliar divisão do código por rota. São pesos do pacote local; não foi feita medição de Core Web Vitals em tráfego real.

## Verificações realizadas

- Navegador: site principal, equipe, landing de urgência e diálogo de privacidade, landing de atendimento humanizado, imagens e canonical.
- Primeira landing: imagens carregadas; canonical correto; não detectado transbordamento horizontal na verificação DOM a 390 px. Isso não substitui teste completo em celular físico.
- npm run test:landing:cloudflare: passou API/D1 simulada, duplicação, CSRF, limites, painel/JWT, urgência, consentimento/Analytics e mapa por clique.
- npm test -- --reporter=dot: 11 arquivos, 30 testes aprovados.
- npm run build: concluído com sucesso (TypeScript e Vite). As imagens e o JavaScript acima merecem otimização antes de escalar tráfego.
- Sem nova gravação de cadastro em produção, acesso a dados de pacientes, contratação ou alteração de campanhas nesta revisão.

## Ordem sugerida de fechamento

1. Telefone correto publicado e verificado em 22/10/2026.
2. Receber e validar dados oficiais, horários e imagens; finalizar privacidade.
3. Consolidar navegação e testar celular/desktop e recuperação de dados.
4. Validar conversões, orçamento total, região e datas; finalizar faturamento com responsável.
5. Obter aprovação final e só então ativar campanhas e liberar indexação quando apropriado.
