# Publicar a demo no Cloudflare Workers

A demonstração atual do projeto está publicada no **Cloudflare Workers** com assets estáticos gerados pelo Vite.

## URL atual da demo

```text
https://clinica-sorriso.mandre-soeiro.workers.dev
```

> Esta URL é de demonstração. Antes da publicação oficial, revise domínio, conteúdo, dados da clínica e indexação.

## Branch usada para a demo

```text
feat/home-demo-images
```

O fluxo atual é:

```text
Computador → GitHub → CI → Cloudflare Workers → Demo
```

## Build e deploy

No Cloudflare, use:

```text
Build command: npm run build
Deploy command: npx wrangler deploy
Root directory: /
```

## Configuração Wrangler

Arquivo:

```text
wrangler.jsonc
```

Configuração atual:

```json
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "clinica-sorriso",
  "compatibility_date": "2026-10-02",
  "assets": {
    "directory": "./dist/",
    "not_found_handling": "single-page-application"
  }
}
```

A opção `single-page-application` mantém as rotas do React funcionando quando a pessoa acessa uma URL interna diretamente.

## Atualização automática

Cada novo push na branch configurada no Cloudflare pode gerar um novo build e um novo deployment automaticamente.

Antes de enviar a demo ao cliente, confirme:

- CI do GitHub concluído com sucesso.
- deployment do Cloudflare concluído.
- versão mais recente recebendo 100% do tráfego.
- navegação funcionando no celular e desktop.
- imagens carregando.
- WhatsApp abrindo corretamente.
- conteúdo demonstrativo claramente identificado.
