# Onde alterar cada coisa

## Informações gerais

Arquivos principais:

```text
src/config/site.config.ts
src/config/routes.config.ts
```

Use esses arquivos para manter dados globais centralizados.

## WhatsApp

Arquivo:

```text
src/config/site.config.ts
```

Antes da publicação oficial, substitua o número demonstrativo pelo número confirmado pela clínica.

## Tratamentos / Especialidades

Arquivo:

```text
src/content/treatments.ts
```

A listagem é exibida na página de Especialidades/Tratamentos.

## Profissionais

Arquivo:

```text
src/content/professionals.ts
```

Antes de publicar, confirme:

- nome;
- CRO;
- especialidade;
- formação;
- fotografia;
- autorização de uso da imagem.

## Hero

Componente:

```text
src/components/sections/Hero.tsx
```

Estilos:

```text
src/components/sections/Hero.css
```

Imagens:

```text
public/images/hero/hero-01.jpg
public/images/hero/hero-02.jpg
public/images/hero/hero-03.jpg
```

## FAQ

Página:

```text
src/pages/Faq.tsx
```

Estilos:

```text
src/pages/Faq.css
```

## Navegação

Rotas:

```text
src/config/routes.config.ts
```

O menu atual inclui:

```text
Clínica
Especialidades
Equipe
Dúvidas
Contato
```

## Publicação da demo

Configuração:

```text
wrangler.jsonc
```

A demo atual usa Cloudflare Workers.
