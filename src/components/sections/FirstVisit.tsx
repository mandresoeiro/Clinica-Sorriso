import { VisitChecklist } from './VisitChecklist'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { siteConfig } from '../../config/site.config'
import './FirstVisit.css'

const preferences = [
  {
    id: 'comfort',
    label: 'Tenho receio do dentista',
    description: 'Quero conversar sobre como me sentir mais à vontade.',
    steps: ['Conte à equipe o que pode ajudar você a se sentir confortável.', 'Pergunte como a avaliação funciona e combine como comunicar uma pausa.', 'Converse sobre as possibilidades antes de decidir os próximos passos.'],
  },
  {
    id: 'steps',
    label: 'Quero entender as etapas',
    description: 'Prefiro conhecer o caminho antes de começar.',
    steps: ['Compartilhe suas dúvidas e o que espera da primeira consulta.', 'Peça explicações sobre a avaliação e sobre eventuais exames.', 'Converse sobre opções, etapas e valores antes de decidir.'],
  },
  {
    id: 'schedule',
    label: 'Preciso organizar meus horários',
    description: 'Quero planejar a visita com tranquilidade.',
    steps: ['Informe à equipe os dias e períodos mais convenientes.', 'Confirme a disponibilidade e pergunte a duração prevista da visita.', 'Combine o horário e confira as orientações para chegar à clínica.'],
  },
] as const

export function FirstVisit() {
  const [selected, setSelected] = useState<string>('steps')
  const preference = preferences.find((item) => item.id === selected) ?? preferences[1]
  const message = `Olá! Conheci a Clínica Sorriso pelo site e quero saber sobre minha primeira visita.\nMinha preferência: ${preference.label}.\n${preference.description}\nPodem me orientar sobre atendimento e horários?`
  const url = `https://wa.me/${siteConfig.contact.phoneE164}?text=${encodeURIComponent(message)}`

  return (
    <section className="section first-visit" id="primeira-visita" aria-labelledby="first-visit-title">
      <div className="container">
        <span className="eyebrow">Sua visita, do seu jeito</span>
        <h2 className="title" id="first-visit-title">Minha primeira visita.</h2>
        <p className="lead">O que é mais importante para você? Escolha uma opção e veja um roteiro para conversar com a equipe.</p>
        <div className="first-visit__grid">
          <fieldset className="first-visit__choices">
            <legend>Quero começar por…</legend>
            {preferences.map((item) => (
              <label key={item.id} className={`first-visit__choice ${selected === item.id ? 'is-selected' : ''}`}>
                <input type="radio" name="first-visit-preference" value={item.id} checked={selected === item.id} onChange={() => setSelected(item.id)} />
                <span><strong>{item.label}</strong><span>{item.description}</span></span>
              </label>
            ))}
          </fieldset>
          <div className="card first-visit__result">
            <div aria-live="polite" aria-atomic="true">
              <span className="eyebrow">Seu roteiro de conversa</span>
              <h3>{preference.label}</h3>
              <ol className="first-visit__steps">
                {preference.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <Button href={url} target="_blank" rel="noopener noreferrer">Levar minha preferência ao WhatsApp ↗</Button>
            <p className="first-visit__note">Sua escolha fica apenas nesta página. O botão abre uma mensagem pronta; você decide se quer enviá-la.</p>
            {siteConfig.demoMode && <p className="first-visit__note">Demonstração: o contato da clínica ainda será confirmado.</p>}
          </div>
        </div>
        <VisitChecklist />
      </div>
    </section>
  )
}
