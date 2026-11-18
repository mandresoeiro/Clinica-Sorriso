// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'
import { ProjectHeader } from './ProjectHeader'

afterEach(cleanup)
it('keeps patient navigation focused and without commercial links', () => {
  render(<MemoryRouter><Header /></MemoryRouter>)
  const main = within(screen.getByRole('navigation', { name: 'Navegação principal' }))
  expect(main.getAllByRole('link').map(link => link.textContent)).toEqual(['Clínica', 'Tratamentos', 'Equipe', 'Contato'])
  expect(screen.queryByRole('link', { name: /Apresentação do projeto/ })).toBeNull()
  expect(screen.queryByRole('link', { name: /Montar proposta/ })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
  const mobile = within(screen.getByRole('navigation', { name: 'Navegação móvel' }))
  fireEvent.click(mobile.getByRole('link', { name: 'Tratamentos' }))
  expect(screen.getByRole('button', { name: 'Abrir menu' }).getAttribute('aria-expanded')).toBe('false')
})
it('provides commercial navigation with a clear path to the patient site', () => {
  render(<MemoryRouter initialEntries={['/apresentacao-cliente']}><ProjectHeader /></MemoryRouter>)
  const nav = within(screen.getByRole('navigation', { name: 'Apresentação comercial' }))
  expect(nav.getByRole('link', { name: 'Projeto' }).getAttribute('href')).toBe('/apresentacao-cliente')
  expect(nav.getByRole('link', { name: 'Montar proposta' }).getAttribute('href')).toBe('/montar-proposta')
  expect(screen.getByRole('link', { name: /Ver site dos pacientes/ }).getAttribute('href')).toBe('/')
  expect(screen.queryByRole('link', { name: 'Solicitar agendamento' })).toBeNull()
})
