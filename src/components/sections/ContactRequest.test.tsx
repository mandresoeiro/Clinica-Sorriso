// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ContactRequest } from './ContactRequest'
import { sendContactRequest } from '../../services/contactRequest'
vi.mock('../../services/contactRequest',()=>({sendContactRequest:vi.fn()}))
afterEach(()=>{cleanup();vi.clearAllMocks()})
function fill() {
  fireEvent.change(screen.getByLabelText('Nome'),{target:{value:'Contato demonstrativo'}})
  fireEvent.change(screen.getByLabelText('WhatsApp com DDD'),{target:{value:'91999990000'}})
  fireEvent.click(screen.getByRole('checkbox'))
}
it('confirms a saved request without opening WhatsApp or booking an appointment',async()=>{
  vi.mocked(sendContactRequest).mockResolvedValueOnce(undefined)
  const open=vi.spyOn(window,'open').mockReturnValue(null)
  const {container}=render(<ContactRequest/>)
  fill();fireEvent.submit(container.querySelector('form')!)
  await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('Solicitação recebida no painel'))
  expect(sendContactRequest).toHaveBeenCalledTimes(1)
  expect(open).not.toHaveBeenCalled()
  open.mockRestore()
})
it('keeps the request identifier when retrying an unchanged request',async()=>{
  vi.mocked(sendContactRequest).mockRejectedValueOnce(new Error('Não foi possível registrar.')).mockResolvedValueOnce(undefined)
  const {container}=render(<ContactRequest/>)
  fill();fireEvent.submit(container.querySelector('form')!)
  await screen.findByRole('alert')
  fireEvent.submit(container.querySelector('form')!)
  await screen.findByRole('status')
  const calls=vi.mocked(sendContactRequest).mock.calls
  expect(calls[0][0].request_id).toBe(calls[1][0].request_id)
})
