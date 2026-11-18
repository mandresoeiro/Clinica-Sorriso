// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest'
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react'
import {AppointmentForm} from './AppointmentForm'
import {saveLandingIntake} from '../../services/landingIntake'
vi.mock('../../services/landingIntake',()=>({saveLandingIntake:vi.fn()}))
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.clearAllMocks()})
it('registra antes de abrir WhatsApp e mantém identificador após falha',async()=>{
 const open=vi.spyOn(window,'open').mockReturnValue(null)
 vi.mocked(saveLandingIntake).mockRejectedValueOnce(Error('Falha simulada')).mockResolvedValueOnce(undefined)
 const {container}=render(<AppointmentForm />)
 fireEvent.change(screen.getByPlaceholderText('Seu nome'),{target:{value:'Contato fictício'}})
 fireEvent.change(screen.getByPlaceholderText('(91) 99999-9999'),{target:{value:'91999990000'}})
 fireEvent.click(screen.getByRole('checkbox'))
 fireEvent.submit(container.querySelector('form')!)
 await screen.findByRole('alert');expect(open).not.toHaveBeenCalled()
 fireEvent.submit(container.querySelector('form')!)
 await waitFor(()=>expect(open).toHaveBeenCalledTimes(1))
 const calls=vi.mocked(saveLandingIntake).mock.calls
 expect(calls[0][0].request_id).toBe(calls[1][0].request_id)
 expect(screen.getByRole('status').textContent).toContain('Contato registrado')
})
