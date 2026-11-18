# Clínica Sorriso

Site institucional premium em React + Vite + TypeScript, acompanhado de documentação MkDocs.

## Comece aqui

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite.

## Build

```bash
npm run build
```

## Documentação MkDocs

Crie um ambiente virtual opcional e instale:

```bash
python -m pip install -r requirements-docs.txt
mkdocs serve
```

Depois abra:

```text
http://127.0.0.1:8000
```

## Antes de publicar

Os contatos, CROs, fotos e alguns textos são demonstrativos. Substitua somente com dados confirmados pela clínica.

Consulte `docs/` para o guia completo.

## Backend independente

Base Django + API + PostgreSQL em [backend/README.md](backend/README.md). O site React continua independente; nenhum endpoint foi conectado ao frontend ou publicado em produção.

## Landing page de atendimento humanizado

Versão do domínio preparada em public/tratamento-humanizado, com integração ao Django e configuração de medição. Consulte [o guia de implantação](docs/landing-pages/TRATAMENTO-HUMANIZADO-ENTREGA.md). A publicação no domínio depende de servidor Django; a prévia Sites usa um banco separado.
