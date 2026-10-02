# Clínica Sorriso

Esta documentação acompanha o site e deve ser atualizada junto com o código.

## Status atual

O projeto está em fase de **demo funcional para validação visual e estrutural**.

A versão de demonstração usa a branch:

```text
feat/home-demo-images
```

Demo pública:

```text
https://clinica-sorriso.mandre-soeiro.workers.dev
```

## Regra principal

O mesmo projeto atende **desenvolvimento**, **demo** e **produção**. Não crie cópias como `site-final`, `site-final-2` ou `agora-vai`.

## Fluxo

```text
Computador → GitHub → CI → Cloudflare Workers → Aprovação → Produção
```

## Stack

- React
- TypeScript
- Vite
- React Router
- Zod
- Vitest
- Testing Library
- Cloudflare Workers para demo
- Nginx/VPS planejado para produção

## Estado atual do conteúdo

A versão atual ainda usa conteúdo e imagens demonstrativas em algumas áreas.

Antes da publicação final, devem ser confirmados:

- logo oficial;
- fotos da clínica;
- fotos e dados dos profissionais;
- CRO e especialidades;
- endereço;
- WhatsApp;
- horários;
- textos institucionais;
- tratamentos oferecidos;
- autorização de uso de imagens.

## Atalhos

- Veja **Rodar no computador** para começar.
- Veja **Onde alterar cada coisa** para editar telefone, tratamentos e profissionais.
- Veja **Demo Cloudflare** para entender a publicação atual.
- Veja **VPS + Nginx** para a publicação definitiva.
