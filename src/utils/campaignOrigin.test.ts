// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
afterEach(() => { window.history.replaceState({}, '', '/'); vi.resetModules() })
it('preserves campaign origin when navigating to contact and keeps the chosen message', async () => {
  window.history.replaceState({}, '', '/proteses?utm_source=instagram&utm_medium=paid_social&utm_campaign=proteses_01')
  const { getWhatsAppUrl } = await import('../config/site.config')
  const first = new URL(getWhatsAppUrl('Quero consultar horários.')).searchParams.get('text')!
  expect(first).toContain('Quero consultar horários.')
  expect(first).toContain('instagram / paid_social / proteses_01')
  window.history.replaceState({}, '', '/contato')
  expect(new URL(getWhatsAppUrl()).searchParams.get('text')).toContain('proteses_01')
})
it('ignores unrecognized sources and unsafe campaign data', async () => {
  window.history.replaceState({}, '', '/?utm_source=unknown&utm_campaign=private')
  const { getWhatsAppUrl } = await import('../config/site.config')
  expect(new URL(getWhatsAppUrl()).searchParams.get('text')).not.toContain('Origem informada')
  window.history.replaceState({}, '', '/?utm_source=google&utm_campaign=email%40example.com&utm_medium=phone999999999')
  const text=new URL(getWhatsAppUrl()).searchParams.get('text')!
  expect(text).toContain('Origem informada no link: google')
  expect(text).not.toContain('email@example.com')
  expect(text).not.toContain('999999999')
})
