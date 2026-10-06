// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Discovery } from '../components/sections/Discovery'
import { TreatmentJourney } from '../components/sections/TreatmentJourney'
import { TourExplorer } from '../components/sections/TourExplorer'

afterEach(() => { cleanup(); vi.restoreAllMocks() })
describe('interactive discovery', () => {
  it('reveals the selected goal and matching destination', () => {
    render(<MemoryRouter><Discovery /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Conversar com a equipe' }))
    expect(screen.getByRole('link', { name: 'Preparar minha mensagem →' }).getAttribute('href')).toBe('/contato#agendamento')
  })
  it('finds accented treatment names and handles no results', () => {
    render(<MemoryRouter><Discovery /></MemoryRouter>)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'estetica' } })
    expect(screen.getByRole('link', { name: /Estética do sorriso/ }).getAttribute('href')).toBe('/tratamentos/estetica')
    fireEvent.change(input, { target: { value: 'zzzzzz' } })
    expect(screen.getByRole('status').textContent).toContain('Não encontramos')
    expect(screen.getByRole('link', { name: /Tirar uma dúvida/ })).toBeTruthy()
  })
})
it('changes treatment stages and their related question', () => {
  render(<MemoryRouter><TreatmentJourney title="Clareamento" /></MemoryRouter>)
  fireEvent.click(screen.getByRole('button', { name: '2 · Planejamento' }))
  expect(screen.getByRole('heading', { name: 'Planejamento' })).toBeTruthy()
  expect(screen.getByText('Posso tirar dúvidas sobre tratamentos pelo WhatsApp?')).toBeTruthy()
})
it('keeps keyboard exploration inside image bounds and resets the view', () => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 1000, height: 500, x: 0, y: 0, top: 0, left: 0, bottom: 500, right: 1000, toJSON: () => ({}) })
  const { container } = render(<TourExplorer label="Recepção"><img alt="Recepção fictícia" /></TourExplorer>)
  fireEvent.click(screen.getByRole('button', { name: 'Ampliar e explorar +' }))
  const viewport = screen.getByRole('group', { name: /Recepção/ })
  for (let count = 0; count < 20; count++) fireEvent.keyDown(viewport, { key: 'ArrowLeft' })
  expect((container.querySelector('.tour-explorer__canvas') as HTMLElement).style.transform).toContain('translate(300px,0px)')
  fireEvent.click(screen.getByRole('button', { name: 'Voltar à visão completa' }))
  expect((container.querySelector('.tour-explorer__canvas') as HTMLElement).style.transform).toBe('')
})
