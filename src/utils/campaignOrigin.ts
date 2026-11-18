type Origin = { source: string; medium: string; campaign: string }
let visitOrigin: Origin | undefined
const sources = new Set(['instagram', 'facebook', 'meta', 'google'])
function campaignCode(value: string | null): string {
  return value && /^[a-z][a-z0-9_-]{0,59}$/i.test(value) && !/\d{8}/.test(value) ? value : ''
}
export function campaignOriginData(): Origin | undefined {
  if (typeof window === 'undefined') return undefined
  const params = new URLSearchParams(window.location.search)
  const source = (params.get('utm_source') ?? '').toLowerCase()
  if (sources.has(source)) {
    visitOrigin = { source, medium: campaignCode(params.get('utm_medium')), campaign: campaignCode(params.get('utm_campaign')) }
  }
  return visitOrigin
}
export function campaignOriginText(): string {
  const visitOrigin = campaignOriginData()
  if (!visitOrigin) return ''
  return `Origem informada no link: ${[visitOrigin.source, visitOrigin.medium, visitOrigin.campaign].filter(Boolean).join(' / ')}`
}
