// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'
vi.mock('../components/sections/Hero', () => ({ Hero: () => <section aria-label="Apresentação da clínica">Apresentação</section> }))
afterEach(cleanup)
it('presents treatments, clinic and a direct contact path without competing forms', () => {
  render(<MemoryRouter><Home /></MemoryRouter>)
  expect(screen.getByRole('link', { name: /Ver todos os tratamentos/ }).getAttribute('href')).toBe('/tratamentos')
  expect(screen.getByRole('link', { name: /Informações sobre próteses/ }).getAttribute('href')).toBe('/proteses')
  expect(screen.getByRole('link', { name: /Solicitar atendimento no WhatsApp/ }).getAttribute('href')).toMatch(/^https:\/\/wa.me\//)
  expect(screen.getByRole('link', { name: /Ver localização e contato/ }).getAttribute('href')).toBe('/contato')
  expect(screen.queryByRole('search')).toBeNull()
  expect(screen.queryByRole('textbox', { name: 'Nome' })).toBeNull()
  expect(screen.getByText(/não representam as instalações/)).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Atendimento humanizado →' }).getAttribute('href')).toBe('/tratamento-humanizado/')
  expect(screen.getByRole('link', { name: 'Urgência em prótese e implante →' }).getAttribute('href')).toBe('/urgencia-protese-implante/')
})
