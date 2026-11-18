// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProjectFilm } from './ProjectFilm'

afterEach(() => { cleanup(); vi.useRealTimers() })
it('lets the client navigate to costs and open the recommended proposal', () => {
  render(<MemoryRouter><ProjectFilm /></MemoryRouter>)
  fireEvent.click(screen.getByRole('button', { name: '07 · Investimento' }))
  expect(screen.getByText('R$ 900')).toBeTruthy()
  expect(screen.getByText('R$ 300/mês')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: '09 · Próximo passo' }))
  expect(screen.getByRole('link', { name: /Revisar a proposta recomendada/ }).getAttribute('href')).toBe('/montar-proposta?plano=04')
})
it('starts only on request, advances after 15 seconds and respects pause', () => {
  vi.useFakeTimers()
  render(<MemoryRouter><ProjectFilm /></MemoryRouter>)
  act(() => vi.advanceTimersByTime(16000))
  expect(screen.getByRole('heading', { name: 'Uma presença que transmite cuidado.' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Reproduzir/ }))
  act(() => vi.advanceTimersByTime(15000))
  expect(screen.getByRole('heading', { name: 'A clínica tem um endereço digital.' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Pausar/ }))
  act(() => vi.advanceTimersByTime(20000))
  expect(screen.getByRole('heading', { name: 'A clínica tem um endereço digital.' })).toBeTruthy()
})
