# Publicar a demo no Cloudflare Pages

Esta é a opção mais simples para mostrar o site ao cliente antes do domínio oficial.

## Passo 1 — coloque o projeto no GitHub

Crie um repositório chamado `clinica-sorriso` e envie o código.

## Passo 2 — Cloudflare

No painel Cloudflare:

1. Acesse **Workers & Pages**.
2. Escolha **Create**.
3. Escolha **Pages**.
4. Conecte o GitHub.
5. Selecione o repositório `clinica-sorriso`.

## Passo 3 — build

Use:

```text
Build command: npm run build
Build output directory: dist
```

## Passo 4 — publique

O Cloudflare gerará uma URL parecida com:

```text
clinica-sorriso.pages.dev
```

Cada novo push na branch configurada poderá gerar uma nova versão automaticamente.
