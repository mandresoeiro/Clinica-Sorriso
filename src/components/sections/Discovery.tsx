import { useState } from 'react'
import { Link } from 'react-router-dom'
import { treatments } from '../../content/treatments'
import { faqs } from '../../content/faqs'
import './Discovery.css'

export function Discovery() {
  const [intent, setIntent] = useState('clinic')
  const [query, setQuery] = useState('')
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  const term = normalize(query.trim())
  const results = term ? [
    ...treatments.filter(item => normalize(item.title + ' ' + item.description + ' ' + item.indications.join(' ')).includes(term)).map(item => ({ title: item.title, text: item.shortDescription, href: '/tratamentos/' + item.slug })),
    ...faqs.filter(item => normalize(item.question + ' ' + item.answer).includes(term)).map(item => ({ title: item.question, text: item.answer, href: '/duvidas#' + faqs.findIndex(faq => faq.question === item.question) })),
  ] : []
  const choices = [
    { id: 'clinic', label: 'Conhecer a clínica', title: 'Conheça o espaço no seu ritmo.', text: 'Explore os ambientes demonstrativos e prepare sua primeira visita.', href: '/clinica#tour-virtual', action: 'Entrar no tour' },
    { id: 'treatment', label: 'Entender um tratamento', title: 'Encontre informações para conversar com a equipe.', text: 'Explore as especialidades e as etapas gerais do atendimento.', href: '/tratamentos', action: 'Explorar especialidades' },
    { id: 'contact', label: 'Conversar com a equipe', title: 'Comece com uma mensagem simples.', text: 'Informe seu contato e preferências. A equipe confirma a disponibilidade pelo WhatsApp.', href: '/contato#agendamento', action: 'Preparar minha mensagem' },
  ]
  const selected = choices.find(choice => choice.id === intent)!
  return <section className="section--tight discovery" aria-labelledby="discovery-title">
    <div className="container">
      <span className="eyebrow">Uma experiência feita para você</span>
      <h2 className="title" id="discovery-title">O que você procura hoje?</h2>
      <div className="discovery__choices" role="group" aria-label="Escolha seu objetivo">{choices.map(choice => <button type="button" key={choice.id} aria-pressed={intent === choice.id} aria-controls="discovery-answer" onClick={() => setIntent(choice.id)}>{choice.label}</button>)}</div>
      <div id="discovery-answer" className="discovery__answer" aria-live="polite" aria-atomic="true"><div key={intent}><h3>{selected.title}</h3><p>{selected.text}</p><Link className="button button--primary" to={selected.href}>{selected.action} →</Link></div></div>
      <div className="discovery__search" role="search" aria-label="Pesquisar no site">
        <label htmlFor="site-search">Pesquisar tratamentos e dúvidas</label>
        <div className="discovery__input"><input id="site-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: clareamento, exames, horário" maxLength={100} aria-controls="search-results" />{query && <button type="button" onClick={() => { setQuery(''); document.getElementById('site-search')?.focus() }}>Limpar</button>}</div>
        {!term && <div className="discovery__suggestions"><span>Sugestões:</span>{['Clareamento', 'Primeiro atendimento', 'Horário'].map(word => <button type="button" key={word} onClick={() => setQuery(word)}>{word}</button>)}</div>}
        <p role="status">{term ? results.length ? results.length + ' resultado(s) encontrado(s).' : 'Não encontramos esse termo. Tente outro ou converse com a equipe.' : 'Busque por assunto, sem informar dados pessoais.'}</p>
        <div id="search-results" className="discovery__results">{results.map(result => <Link key={result.href} to={result.href}><strong>{result.title} <span aria-hidden="true">↗</span></strong><p>{result.text}</p></Link>)}</div>
        {term && !results.length && <Link to="/contato">Tirar uma dúvida com a equipe →</Link>}
      </div>
    </div>
  </section>
}
