export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const aliases: Record<string, string> = { implante: 'implant', implantes: 'implant', dentadura: 'protes', limpeza: 'prevenc', clarear: 'clareamento', preco: 'valor', agendar: 'horario' }
function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 0; i < a.length; i++) {
    const next = [i + 1]
    for (let j = 0; j < b.length; j++) next.push(Math.min(next[j] + 1, row[j + 1] + 1, row[j] + (a[i] === b[j] ? 0 : 1)))
    row = next
  }
  return row[b.length]
}
export function matchesSearch(text: string, query: string) {
  const words = normalizeSearch(text).split(/[^a-z0-9]+/).filter(Boolean)
  return normalizeSearch(query).trim().split(/\s+/).every(term => {
    const key = aliases[term] ?? term
    return words.some(word => word.includes(key) || (key.length >= 5 && Math.abs(word.length - key.length) <= 1 && distance(word, key) <= 1))
  })
}
