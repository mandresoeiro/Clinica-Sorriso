// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FacialHarmonization } from './FacialHarmonization'
import { siteConfig } from '../config/site.config'

afterEach(cleanup)

it('opens the clinic WhatsApp with the selected reason and the landing context', () => {
  render(<MemoryRouter><FacialHarmonization /></MemoryRouter>)
  fireEvent.click(screen.getByRole('button', { name: 'Quero tirar dúvidas' }))
  const link = screen.getByRole('link', { name: 'Solicitar uma avaliação' })
  const target = new URL(link.getAttribute('href')!)
  expect(target.hostname).toBe('wa.me')
  expect(target.pathname).toBe(`/${siteConfig.contact.phoneE164}`)
  expect(target.searchParams.get('text')).toContain('Harmonização Facial')
  expect(target.searchParams.get('text')).toContain('Quero tirar dúvidas')
  expect(target.searchParams.get('text')).not.toContain('Quero uma avaliação')
  expect(link.getAttribute('rel')).toContain('noopener')
})

it('provides a canonical URL without leaving it on other pages and discloses the illustration', () => {
  const { unmount } = render(<MemoryRouter><FacialHarmonization /></MemoryRouter>)
  expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://odontopersonnallite.com.br/harmonizacao-facial')
  expect(screen.getByRole('img', { name: /não representa as instalações/ })).toBeTruthy()
  expect(screen.getByRole('link', { name: /Abrir no Google Maps/ }).getAttribute('href')).toBe(siteConfig.address.mapsUrl)
  unmount()
  expect(document.querySelector('link[rel="canonical"]')).toBeNull()
})
