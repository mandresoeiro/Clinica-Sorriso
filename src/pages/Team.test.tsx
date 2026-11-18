// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Team } from './Team'
import { teamPhotos } from '../content/teamPhotos'
vi.mock('../content/teamPhotos', () => ({ teamPhotos: [
  { src: '/first.png', alt: 'Primeira foto', width: 1122, height: 1402 },
  { src: '/second.png', alt: 'Segunda foto', width: 1122, height: 1402 },
] }))
afterEach(cleanup)
it('keeps loop copies decorative and allows pausing and resuming', () => {
  render(<Team />)
  expect(screen.getAllByRole('img')).toHaveLength(2)
  fireEvent.click(screen.getByRole('button', { name: 'Pausar movimento' }))
  expect(screen.getByRole('button', { name: 'Continuar movimento' }).getAttribute('aria-pressed')).toBe('true')
  expect(screen.getByRole('region', { name: 'Fotos da equipe' }).classList.contains('is-paused')).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Continuar movimento' }))
  expect(screen.getByRole('button', { name: 'Pausar movimento' }).getAttribute('aria-pressed')).toBe('false')
})
it('keeps a single photo still without controls', () => {
  const removed=teamPhotos.splice(1)
  try { render(<Team />); expect(screen.getAllByRole('img')).toHaveLength(1); expect(screen.queryByRole('button')).toBeNull() }
  finally { teamPhotos.push(...removed) }
})