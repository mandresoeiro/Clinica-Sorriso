// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { matchesSearch } from '../utils/search'
import { ShareButton } from '../components/ui/ShareButton'
import { VisitChecklist } from '../components/sections/VisitChecklist'
import { AppointmentForm } from '../components/sections/AppointmentForm'
afterEach(() => { cleanup(); vi.restoreAllMocks() })
it('matches aliases and small errors but rejects unrelated searches', () => {
  expect(matchesSearch('Implantodontia', 'implante')).toBe(true)
  expect(matchesSearch('Clareamento', 'clareamnto')).toBe(true)
  expect(matchesSearch('Estética do sorriso', 'estetica sorriso')).toBe(true)
  expect(matchesSearch('Prevenção', 'limpeza')).toBe(true)
  expect(matchesSearch('Clareamento', 'zzzzzz')).toBe(false)
})
it('counts checklist progress and resets it', () => {
  render(<VisitChecklist />)
  fireEvent.click(screen.getAllByRole('checkbox')[0])
  expect(screen.getByRole('status').textContent).toContain('1 de 4')
  fireEvent.click(screen.getByRole('button', { name: 'Recomeçar checklist' }))
  expect(screen.getByRole('status').textContent).toContain('0 de 4')
})
it('offers a continuation link when the popup cannot open', () => {
  vi.spyOn(window, 'open').mockReturnValue(null)
  const { container } = render(<AppointmentForm />)
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria' } })
  fireEvent.change(screen.getByLabelText('WhatsApp'), { target: { value: '91999999999' } })
  fireEvent.submit(container.querySelector('form')!)
  expect(screen.getByRole('status').textContent).toContain('ainda precisa ser confirmada')
  expect(screen.getByRole('link', { name: /Se não abriu/ }).getAttribute('href')).toContain('https://wa.me/')
})
it('copies the share link when native sharing is unavailable', async () => {
  const copy = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } })
  render(<ShareButton title="Tour" path="/clinica#tour-virtual" />)
  fireEvent.click(screen.getByRole('button', { name: /Compartilhar/ }))
  expect(await screen.findByText('Link copiado. Cole na conversa que preferir.')).toBeTruthy()
  expect(copy).toHaveBeenCalledWith(window.location.origin + '/clinica#tour-virtual')
})
