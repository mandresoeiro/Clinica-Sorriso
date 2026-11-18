// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProposalBuilder } from './ProposalBuilder'
import { ProjectOverview } from './ProjectOverview'

afterEach(cleanup)
beforeEach(()=>{localStorage.clear();window.history.replaceState({},'', '/')})
it('separates service charges and media, and excludes the optional robot from totals', () => {
  render(<MemoryRouter><ProposalBuilder /></MemoryRouter>)
  fireEvent.click(screen.getByRole('button', { name: 'Preencher com a opção 04' }))
  const summary = within(screen.getByRole('complementary'))
  expect(summary.getByText('R$ 900,00')).toBeTruthy()
  expect(summary.getByText('R$ 500,00')).toBeTruthy()
  expect(summary.getByText('R$ 800,00')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Anúncios e extras/ }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Quero receber uma cotação do assistente' }))
  expect(summary.getByText('R$ 800,00')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /2\s*Serviços/ }))
  fireEvent.click(screen.getByRole('checkbox', { name: /Gestão de uma campanha Meta/ }))
  expect(summary.queryByText('R$ 800,00')).toBeNull()
  expect(summary.getAllByText('R$ 300,00').length).toBe(2)
})

it('includes the site for landing pages and removes dependent pages when the site is removed', () => {
  render(<MemoryRouter><ProposalBuilder /></MemoryRouter>)
  fireEvent.click(screen.getByRole('button', { name: /2\s*Serviços/ }))
  fireEvent.click(screen.getByRole('checkbox', { name: /Três landing pages/ }))
  expect((screen.getByRole('checkbox', { name: /Site institucional/ }) as HTMLInputElement).checked).toBe(true)
  fireEvent.click(screen.getByRole('checkbox', { name: /Site institucional/ }))
  expect((screen.getByRole('checkbox', { name: /Três landing pages/ }) as HTMLInputElement).checked).toBe(false)
  expect(screen.getByRole('button', { name: 'Baixar resumo das escolhas' }).hasAttribute('disabled')).toBe(true)
})

it('restores an explicitly saved draft and removes it when cleared',()=>{
  const first=render(<MemoryRouter><ProposalBuilder /></MemoryRouter>)
  fireEvent.click(screen.getByRole('button',{name:'Preencher com a opção 04'}))
  fireEvent.click(screen.getByRole('button',{name:'Salvar rascunho neste navegador'}))
  first.unmount()
  render(<MemoryRouter><ProposalBuilder /></MemoryRouter>)
  expect(within(screen.getByRole('complementary')).getByText('R$ 800,00')).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Limpar seleção'}))
  expect(localStorage.getItem('personnallite-proposal-v1')).toBeNull()
  expect(screen.getByRole('button',{name:'Baixar resumo das escolhas'}).hasAttribute('disabled')).toBe(true)
})

it('applies the expanded package and restores its scope without reverting to basic rates',()=>{
  const first=render(<MemoryRouter><ProposalBuilder /></MemoryRouter>)
  fireEvent.click(screen.getByText('Comparar as cinco opções'))
  fireEvent.click(screen.getByRole('button',{name:'Usar opção 05'}))
  expect(screen.getByRole('checkbox',{name:/Gestão ampliada do Instagram/})).toBeTruthy()
  const summary=within(screen.getByRole('complementary'))
  expect(summary.getByText('R$ 800,00')).toBeTruthy()
  expect(summary.getByText('R$ 1.400,00')).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Salvar rascunho neste navegador'}))
  first.unmount()
  render(<MemoryRouter><ProposalBuilder /></MemoryRouter>)
  expect(within(screen.getByRole('complementary')).getByText('R$ 1.400,00')).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Preencher com a opção 04'}))
  expect(within(screen.getByRole('complementary')).getByText('R$ 800,00')).toBeTruthy()
  expect(screen.queryByRole('checkbox',{name:/Gestão ampliada do Instagram/})).toBeNull()
})

it('opens the recommended proposal at review from the presentation link',()=>{
  window.history.replaceState({},'', '/montar-proposta?plano=04')
  render(<MemoryRouter><ProposalBuilder /></MemoryRouter>)
  expect(screen.getByRole('heading',{name:/Etapa 4 de 4/})).toBeTruthy()
  expect(within(screen.getByRole('complementary')).getByText('R$ 800,00')).toBeTruthy()
})

it('keeps the presentation focused on one recommendation and a clear next step',()=>{
  render(<MemoryRouter><ProjectOverview /></MemoryRouter>)
  expect(screen.getByRole('heading',{name:'Divulgação Local · Opção 04'})).toBeTruthy()
  expect(screen.getByRole('link',{name:'Revisar esta proposta →'}).getAttribute('href')).toBe('/montar-proposta?plano=04')
  expect(screen.queryByRole('heading',{name:'00. Tráfego pago'})).toBeNull()
  expect(screen.getByRole('button',{name:'Ver materiais da marca ↓'})).toBeTruthy()
})
