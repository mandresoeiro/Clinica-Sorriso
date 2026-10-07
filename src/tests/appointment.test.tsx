// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { AppointmentForm } from '../components/sections/AppointmentForm'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

describe('appointment form', () => {
  it('rejects whitespace names without opening WhatsApp', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const { container } = render(<AppointmentForm />)
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: '  ' } })
    fireEvent.submit(container.querySelector('form')!)
    expect(screen.getByRole('alert').textContent).toContain('nome')
    expect(open).not.toHaveBeenCalled()
  })

  it('rejects an incomplete telephone', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const { container } = render(<AppointmentForm />)
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria' } })
    fireEvent.change(screen.getByLabelText('WhatsApp'), { target: { value: '123' } })
    fireEvent.submit(container.querySelector('form')!)
    expect(screen.getByRole('alert').textContent).toContain('DDD')
    expect(open).not.toHaveBeenCalled()
  })

  it('opens a prepared message with trimmed name and normalized phone', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const { container } = render(<AppointmentForm />)
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: '  Maria  ' } })
    fireEvent.change(screen.getByLabelText('WhatsApp'), { target: { value: '+55 (91) 99999-9999' } })
    fireEvent.submit(container.querySelector('form')!)
    expect(open).toHaveBeenCalledTimes(1)
    const message = new URL(String(open.mock.calls[0][0])).searchParams.get('text')
    expect(message).toContain('Nome: Maria\n')
    expect(message).toContain('WhatsApp: 5591999999999')
  })
})

it('preserves treatment context and allows changing it before WhatsApp', () => {
  const open = vi.spyOn(window, 'open').mockReturnValue(null)
  const { container } = render(<AppointmentForm initialInterest="Clareamento" />)
  const interest = screen.getByLabelText('O que você procura?') as HTMLSelectElement
  expect(interest.value).toBe('Clareamento')
  fireEvent.change(interest, { target: { value: 'Próteses' } })
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria' } })
  fireEvent.change(screen.getByLabelText('WhatsApp'), { target: { value: '91999999999' } })
  fireEvent.submit(container.querySelector('form')!)
  const message = new URL(String(open.mock.calls[0][0])).searchParams.get('text')
  expect(message).toContain('Interesse: Próteses')
  expect(message).not.toContain('Interesse: Clareamento')
})
