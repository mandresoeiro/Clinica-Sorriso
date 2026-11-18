import { useState } from 'react'
import { getWhatsAppUrl } from '../../config/site.config'
import { ProsthesisIntake } from './ProsthesisIntake'

const options = ['Quero uma nova prótese', 'Já uso prótese', 'Quero tirar dúvidas']

export function ProsthesisHero() {
  const [selected, setSelected] = useState('')
  const [showForm, setShowForm] = useState(false)
  const message = `Olá! Conheci a página de próteses dentárias em Belém. ${selected ? `${selected}. ` : ''}Gostaria de conversar com a recepção sobre uma avaliação.`
  return <section className="prosthesis-hero prosthesis-wrap prosthesis-interactive" aria-labelledby="prosthesis-title">
    <div className="prosthesis-hero__copy">
      <span className="prosthesis-eyebrow">Próteses dentárias · Belém</span>
      <h1 id="prosthesis-title">Vamos conversar<br />sobre <em>seu sorriso?</em></h1>
      <p className="prosthesis-lead">O primeiro passo é uma avaliação individual. Conte à recepção como podemos ajudar.</p>
      <fieldset className="prosthesis-choices"><legend>Por onde você quer começar?</legend><div>{options.map(option => <button type="button" key={option} aria-pressed={selected === option} onClick={() => setSelected(option)}><span aria-hidden="true">{selected === option ? '✓' : '+'}</span>{option}</button>)}</div></fieldset>
      <a className="prosthesis-button prosthesis-whatsapp" href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.14-1.35A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.36-.21-3.04.8.81-2.96-.23-.38A8 8 0 1 1 12 20Zm4.39-5.55c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49l.36-.42c.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" /></svg>Conversar com a recepção <span className="prosthesis-arrow" aria-hidden="true">↗</span></a>
      <p className="prosthesis-note" aria-live="polite">{selected ? `Sua mensagem incluirá: “${selected}”.` : 'Escolha uma opção ou converse diretamente.'} Você revisa antes de enviar.</p>
      <button className="prosthesis-form-toggle" type="button" aria-expanded={showForm} aria-controls="prosthesis-return-form" onClick={() => setShowForm(!showForm)}>{showForm ? 'Fechar formulário' : 'Prefiro receber um retorno'} <span aria-hidden="true">{showForm ? '−' : '+'}</span></button>
    </div>
    <figure className="prosthesis-editorial-image prosthesis-feature-image"><img src="/images/landing/consultorio-proteses.webp" alt="Consultório ilustrativo gerado por IA; não representa as instalações da clínica" width="960" height="1200" fetchPriority="high" /><figcaption><span>Cuidado que começa pela conversa.</span><small>Imagem ilustrativa gerada por IA</small></figcaption><a className="prosthesis-location-badge" href="#localizacao"><span className="prosthesis-location-dot" aria-hidden="true" /><span>Atendimento em Belém<small>Veja a localização ↗</small></span></a></figure>
    <div id="prosthesis-return-form" className="prosthesis-return-panel" hidden={!showForm}>{showForm && <ProsthesisIntake />}</div>
  </section>
}
