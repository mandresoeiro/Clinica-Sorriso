# Checklist de release

Use esta página antes de publicar uma nova versão da demo ou da produção.

## Código

- [ ] Working tree limpa.
- [ ] Branch correta selecionada.
- [ ] Alterações commitadas.
- [ ] Push concluído.
- [ ] CI do GitHub concluído com sucesso.
- [ ] Sem conflitos de merge/rebase pendentes.

## Interface

- [ ] Home revisada no desktop.
- [ ] Home revisada no celular.
- [ ] Hero com imagens corretas.
- [ ] CTA principal com texto correto.
- [ ] Menu mobile funcionando.
- [ ] Página Clínica revisada.
- [ ] Página Especialidades revisada.
- [ ] Página Equipe revisada.
- [ ] FAQ funcionando.
- [ ] Página Contato revisada.
- [ ] Botão flutuante do WhatsApp sem cobrir controles.

## Conteúdo

- [ ] Conteúdo demonstrativo identificado.
- [ ] Nenhum profissional, CRO ou depoimento inventado.
- [ ] Dados da clínica aprovados antes da publicação oficial.
- [ ] Imagens autorizadas para uso.
- [ ] Especialidades confirmadas pela clínica.

## Cloudflare Workers

- [ ] Build concluído.
- [ ] Deployment mais recente concluído.
- [ ] Versão correta recebendo 100% do tráfego.
- [ ] Demo pública acessível.
- [ ] Rotas internas funcionando diretamente.
- [ ] Assets do diretório `dist` publicados.

## Demo

URL atual:

```text
https://clinica-sorriso.mandre-soeiro.workers.dev
```

Branch atual da demo:

```text
feat/home-demo-images
```

## Produção

Antes da produção definitiva:

- [ ] remover ou revisar `noindex,nofollow`;
- [ ] revisar `robots.txt`;
- [ ] configurar domínio oficial;
- [ ] confirmar WhatsApp real;
- [ ] confirmar endereço real;
- [ ] revisar política de privacidade/LGPD;
- [ ] confirmar conteúdo final com a clínica.
