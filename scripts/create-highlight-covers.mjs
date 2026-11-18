import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const source = readFileSync(new URL('../src/pages/InstagramPreview.tsx', import.meta.url), 'utf8')
const names = { clinic: 'clinica', team: 'equipe', care: 'cuidados', tooth: 'proteses', chat: 'atendimento', pin: 'localizacao' }
const directory = new URL('../public/images/highlights/', import.meta.url)
mkdirSync(directory, { recursive: true })
const covers = {}
for (const [kind, name] of Object.entries(names)) {
  const match = source.match(new RegExp(`kind === '${kind}' && <>(.*?)</>`))
  if (!match) throw new Error(`Missing icon: ${kind}`)
  const shapes = match[1].replaceAll('className=', 'class=')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="1080" height="1080" fill="#17383b"/><circle cx="540" cy="540" r="460" fill="none" stroke="#c7a77a" stroke-width="2"/><circle cx="540" cy="540" r="438" fill="none" stroke="#c7a77a" stroke-opacity=".35"/><svg x="170" y="170" width="740" height="740" viewBox="0 0 48 48" fill="none" stroke="#e5c99e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${shapes}</svg></svg>`
  writeFileSync(new URL(`${name}.svg`, directory), svg)
  covers[name] = svg
}
writeFileSync(new URL('../src/content/highlightCovers.ts', import.meta.url), `export const highlightCovers: Record<string, string> = ${JSON.stringify(covers, null, 2)}\n`)

