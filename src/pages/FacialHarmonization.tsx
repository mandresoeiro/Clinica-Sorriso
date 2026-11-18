import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWhatsAppUrl, siteConfig } from '../config/site.config'
import './FacialHarmonization.css'

const interests = ['Quero uma avaliação', 'Quero tirar dúvidas', 'Quero consultar horários']
const steps = [
  ['Converse com a recepção', 'Conte que deseja uma avaliação de harmonização facial e consulte a disponibilidade.'],
  ['Conheça as possibilidades', 'Na avaliação, converse sobre suas expectativas e receba orientações para o seu caso.'],
  ['Decida com clareza', 'Entenda a indicação, os cuidados, as etapas e o orçamento antes de decidir.'],
]
const questions = [
  ['Como saber o que é indicado para mim?', 'A indicação depende de uma avaliação individual. A conversa com a recepção serve para orientar o agendamento; a definição de qualquer procedimento acontece com a profissional.'],
  ['Posso consultar os valores pelo WhatsApp?', 'A recepção pode explicar como funciona o atendimento. O orçamento do tratamento depende da avaliação e do planejamento proposto para você.'],
  ['A conversa pelo WhatsApp já confirma a consulta?', 'Não. A recepção precisa verificar a disponibilidade e combinar a data e o horário com você. Confirme antes de se deslocar.'],
  ['Preciso enviar fotos ou exames no primeiro contato?', 'Para consultar horários, basta iniciar a conversa com a recepção. Não é necessário enviar fotos, exames ou informações clínicas pelo site.'],
]

export function FacialHarmonization() {
  const [interest, setInterest] = useState(interests[0])
  const contact = getWhatsAppUrl(`Olá! Conheci a página de Harmonização Facial da Odonto Personnallite em Belém. ${interest}. Gostaria de conversar com a recepção.`)

  useEffect(() => {
    const existing = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const canonical = existing ?? document.createElement('link')
    const previous = existing?.href
    canonical.rel = 'canonical'
    canonical.href = 'https://odontopersonnallite.com.br/harmonizacao-facial'
    if (!existing) document.head.append(canonical)
    return () => {
      if (!existing) canonical.remove()
      else if (previous) canonical.href = previous
    }
  }, [])

  return <div className="facial-landing">
    <header className="facial-header facial-wrap">
      <Link className="facial-brand" to="/" aria-label="Odonto Personnallite, página inicial">
        <img src="/images/brand/symbol.svg" alt="" width="42" height="48" />
        <span>Odonto Personnallite<small>CLÍNICA ODONTOLÓGICA</small></span>
      </Link>
      <a className="facial-location-link" href="#localizacao">Belém, PA <span aria-hidden="true">↗</span></a>
    </header>

    <section className="facial-hero facial-wrap" aria-labelledby="facial-title">
      <div className="facial-copy">
        <p className="facial-eyebrow">Avaliação e planejamento individual</p>
        <h1 id="facial-title">Harmonização<br />facial <em>em Belém.</em></h1>
        <p className="facial-lead">Suas características, suas expectativas e uma conversa com tempo para escutar. Comece por uma avaliação individual.</p>
        <fieldset className="facial-interests">
          <legend>Como podemos ajudar?</legend>
          <div>{interests.map(item => <button key={item} type="button" aria-pressed={interest === item} onClick={() => setInterest(item)}>{item}</button>)}</div>
        </fieldset>
        <a className="facial-button" href={contact} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <span aria-hidden="true">↗</span></a>
        <p className="facial-note">Você pode revisar a mensagem antes de enviar.<br />Horário sujeito à confirmação da recepção.</p>
        <a className="facial-text-link" href="#avaliacao">Entenda como funciona <span aria-hidden="true">↓</span></a>
      </div>
      <figure className="facial-photo">
        <img src="/images/landing/consultorio-proteses.webp" alt="Ambiente de consultório ilustrativo gerado por IA; não representa as instalações da clínica" width="960" height="1200" fetchPriority="high" />
        <figcaption>Imagem ilustrativa gerada por IA</figcaption>
      </figure>
    </section>

    <section className="facial-intro" id="avaliacao" aria-labelledby="facial-evaluation-title">
      <div className="facial-wrap facial-intro-grid">
        <div><p className="facial-eyebrow">Antes de qualquer decisão</p><h2 id="facial-evaluation-title">O primeiro passo<br />é entender você.</h2></div>
        <div className="facial-intro-copy"><p>O atendimento começa com uma conversa sobre o que você procura. A avaliação ajuda a esclarecer as possibilidades e a construir um planejamento individual.</p><p>Indicações, cuidados e resultados variam de pessoa para pessoa. Tire suas dúvidas e conheça as etapas antes de decidir por um tratamento.</p></div>
      </div>
    </section>

    <section className="facial-section facial-wrap" aria-labelledby="facial-steps-title">
      <p className="facial-eyebrow">Seu caminho até a avaliação</p><h2 id="facial-steps-title">Clareza em cada etapa.</h2>
      <ol className="facial-steps">{steps.map(([title, body], index) => <li key={title}><span className="facial-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
    </section>

    <section className="facial-section facial-wrap facial-faq-grid" aria-labelledby="facial-faq-title">
      <div><p className="facial-eyebrow">Para começar com tranquilidade</p><h2 id="facial-faq-title">Suas dúvidas<br />têm espaço aqui.</h2><a className="facial-text-link" href={contact} target="_blank" rel="noopener noreferrer">Falar com a recepção <span aria-hidden="true">↗</span></a></div>
      <div className="facial-faq">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>

    <section className="facial-contact" id="localizacao" aria-labelledby="facial-contact-title">
      <div className="facial-wrap facial-contact-grid">
        <div><p className="facial-eyebrow">Odonto Personnallite · Belém</p><h2 id="facial-contact-title">Vamos conversar<br />sobre seu cuidado?</h2><a className="facial-button facial-button-light" href={contact} target="_blank" rel="noopener noreferrer">Solicitar uma avaliação <span aria-hidden="true">↗</span></a><p className="facial-note">A recepção confirma os horários disponíveis.</p></div>
        <address><span className="facial-eyebrow">Onde estamos</span><p>{siteConfig.address.street}<br />{siteConfig.address.city} · {siteConfig.address.state}</p><a className="facial-text-link" href={siteConfig.address.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir no Google Maps <span aria-hidden="true">↗</span></a><p className="facial-hours">{siteConfig.hours}</p><a className="facial-phone" href={`tel:+${siteConfig.contact.phoneE164}`}>{siteConfig.contact.phoneDisplay}</a></address>
      </div>
    </section>

    <footer className="facial-footer facial-wrap"><div><p>{siteConfig.name}</p><p>Responsável técnica: {siteConfig.technicalResponsible}</p></div><nav aria-label="Links da clínica"><Link to="/equipe">Equipe</Link><Link to="/privacidade">Privacidade</Link><Link to="/">Site da clínica</Link></nav></footer>
    <aside className="facial-mobile-contact" aria-label="Contato rápido"><a className="facial-button" href={contact} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <span aria-hidden="true">↗</span></a></aside>
  </div>
}
