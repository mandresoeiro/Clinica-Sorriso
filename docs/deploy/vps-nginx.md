# Produção em VPS + Nginx

Use esta etapa apenas depois da demo aprovada.

## Conceito simples

No computador ou CI:

```bash
npm run build
```

A pasta `dist/` é o site final.

No servidor, os arquivos ficam em:

```text
/var/www/clinica-sorriso/current
```

## Nginx

Existe um exemplo em:

```text
infra/nginx/clinica-sorriso.conf
```

Copie para `/etc/nginx/sites-available/`, ajuste o domínio e ative o site.

## SSL

Depois de o DNS apontar para a VPS, instale/configure Certbot para HTTPS.

## Atenção

Não edite o código diretamente no servidor. O código oficial fica no GitHub.
