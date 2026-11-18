// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {ClientProgress} from './ClientProgress'
afterEach(cleanup)
const show=()=>render(<MemoryRouter><ClientProgress /></MemoryRouter>)
it('presents the verified delivery without credentials or document collection',()=>{
 show();expect(screen.getByRole('heading',{level:1}).textContent).toContain('O que já está pronto.')
 expect(screen.getByRole('heading',{name:'Fotos reais — etapa posterior'})).toBeTruthy()
 expect(screen.getByText('Autorizar e ativar o backup')).toBeTruthy()
 expect(screen.getByRole('link',{name:/Atendimento Humanizado/}).getAttribute('href')).toBe('/tratamento-humanizado/')
 expect(screen.getByRole('link',{name:/Urgência em Prótese e Implante/}).getAttribute('href')).toBe('/urgencia-protese-implante/')
 expect(screen.getByRole('link',{name:/Central de atendimento/}).textContent).toContain('Requer e-mail autorizado')
 expect(screen.queryByRole('textbox')).toBeNull();expect(document.body.textContent).not.toMatch(/@gmail\.com|refresh_token|BACKUP_KEY|2bc93c263/)
})
it('filters the checklist without changing recorded delivery statuses',()=>{
 show();fireEvent.click(screen.getByRole('button',{name:'Pendências'}))
 expect(screen.getByText('Domínio e site publicados').closest('li')?.hidden).toBe(true)
 expect(screen.getByText('Autorizar e ativar o backup').closest('li')?.hidden).toBe(false)
 fireEvent.click(screen.getByRole('button',{name:'Para depois'}));expect(screen.getByText('Fachada, recepção e consultórios').closest('li')?.hidden).toBe(false)
 expect(screen.getByText('Autorizar e ativar o backup').closest('li')?.hidden).toBe(true)
 fireEvent.click(screen.getByRole('button',{name:'Tudo'}));expect(screen.getByText('Domínio e site publicados').closest('li')?.hidden).toBe(false)
})
it('prints only on request',()=>{const print=vi.spyOn(window,'print').mockImplementation(()=>{});show();expect(print).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Imprimir checklist'}));expect(print).toHaveBeenCalledOnce();print.mockRestore()})
