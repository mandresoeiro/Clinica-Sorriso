import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site.config'
import { ProsthesisHero } from '../components/sections/ProsthesisHero'
import './Prostheses.css'

export function Prostheses() {
  return <div className="prosthesis-landing prosthesis-short">
    <header className="prosthesis-header prosthesis-wrap">
      <Link className="prosthesis-brand" to="/" aria-label="Odonto Personnallite — página inicial"><img src="/images/brand/symbol.svg" alt="" width="42" height="48" /><span>Odonto Personnallite<small>CLÍNICA ODONTOLÓGICA</small></span></Link>
      <a className="prosthesis-header__link" href="#localizacao">Belém · Como chegar ↗</a>
    </header>

    <ProsthesisHero />

    <section className="prosthesis-section prosthesis-wrap" id="como-funciona" aria-labelledby="steps-title">
      <span className="prosthesis-eyebrow">Clareza em cada etapa</span><h2 id="steps-title">Do primeiro contato ao planejamento.</h2>
      <ol className="prosthesis-steps">{[
        ['Converse com a recepção', 'Envie sua solicitação pelo WhatsApp e tire dúvidas sobre o atendimento.'],
        ['Confirme seu horário', 'A equipe verifica a disponibilidade e combina a avaliação com você.'],
        ['Faça sua avaliação', 'A profissional avalia suas necessidades e esclarece as possibilidades.'],
        ['Conheça o planejamento', 'Receba informações sobre etapas e orçamento antes de decidir.'],
      ].map(([title, text], i) => <li key={title}><span className="prosthesis-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </section>

    <section className="prosthesis-section prosthesis-wrap" id="localizacao"><h2>Odonto Personnallite · Belém</h2><p>{siteConfig.address.street} · {siteConfig.address.city}/{siteConfig.address.state}</p><a className="prosthesis-text-link" href={siteConfig.address.mapsUrl} target="_blank" rel="noopener noreferrer">Ver no Google Maps ↗</a><p className="prosthesis-note">Indicações, etapas e orçamento dependem da avaliação individual. Confirme seu horário antes de se deslocar.</p><Link className="prosthesis-text-link" to="/equipe">Conheça a equipe ↗</Link></section>

    <footer className="prosthesis-footer prosthesis-wrap"><div>{siteConfig.demoMode && <p>Versão demonstrativa. Serviços e identificação profissional aguardam validação pela clínica.</p>}<p>© {new Date().getFullYear()} {siteConfig.name}</p></div><nav aria-label="Links institucionais"><Link to="/">Conhecer a clínica</Link><a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><Link to="/privacidade">Privacidade</Link></nav></footer>
  </div>
}



