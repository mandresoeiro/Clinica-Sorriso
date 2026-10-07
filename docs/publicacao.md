# Publicação automática

O workflow `.github/workflows/deploy.yml` valida e publica o site após pushes em `main` ou `feat/home-demo-images`, ou execução manual no GitHub Actions. As duas branches publicam no mesmo Worker; a última execução concluída prevalece. Ao encerrar a demonstração, remova a branch de demonstração do gatilho.

## Ativação necessária

1. Na Cloudflare, crie um API Token com o modelo **Edit Cloudflare Workers**, limitado à conta da clínica. Não use a chave global nem o token OAuth local do Wrangler.
2. No repositório GitHub, abra Settings → Environments → crie `production` → Environment secrets → adicione `CLOUDFLARE_API_TOKEN`.
3. Abra Actions → Publicar na Cloudflare → Run workflow e selecione `feat/home-demo-images`.
4. Confira o resultado verde e abra https://clinica-sorriso.mandre-soeiro.workers.dev/.

Nunca coloque o token no código, em commits ou em mensagens. O login local do Wrangler não autentica o GitHub Actions.

O workflow interrompe a publicação se lint, tipos, testes ou build falharem. As execuções são serializadas para evitar deploys simultâneos.
