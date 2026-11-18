# Localização das duas landing pages

Endereço fornecido pelo titular: Travessa Almirante Wandenkolk, 1243, Belém, PA.

Publicado e conferido visualmente no domínio da clínica em 21/10/2026. Worker a0968e2a-c060-4164-b14b-10c26dd91c81. Prova: output/localizacao/mapa-oficial.png. O código mínimo por consulta ficava em branco; foi substituído pelo código completo oficial obtido na interface do Maps, com pino e endereço visíveis.

As páginas tratamento-humanizado e urgencia-protese-implante possuem bloco de mapa na seção Localização. O mapa externo é carregado somente após clique em Exibir mapa do Google, com título acessível. Usa a URL de embed retornada pelo Google para a pesquisa do endereço, carregamento imediato após o clique e referrer strict-origin-when-cross-origin (sem caminho ou parâmetros da página). O aviso de privacidade explica a conexão externa.

Ver como chegar e Abrir rota até a clínica apontam a Maps Directions com destination igual ao endereço completo. Nenhuma origem fixa ou localização do visitante é configurada pelo site: a pessoa escolhe a origem no Google Maps.

O mapa usa o código oficial obtido em Compartilhar > Incorporar um mapa do Google Maps para Tv. Alm. Wandenkolk, 1243 - Umarizal, Belém - PA, 66055-045. As coordenadas e o identificador do edifício vêm desse código, sem chave de API ou coordenadas inventadas. Não é uma ficha de empresa validada da clínica. O painel permanece sem conteúdo de mapa ou scripts externos.

Fontes: infra/cloudflare/landing/location.js, location.css e scripts/build-cloudflare-landing.mjs. Teste: scripts/test-landing-location.mjs.
