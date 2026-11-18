import { Link } from 'react-router-dom'
import { siteConfig, getWhatsAppUrl } from '../../config/site.config'
import './ConnectedChannels.css'

function ChannelIcon({ kind }: { kind: 'instagram' | 'whatsapp' | 'site' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'instagram' ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" /></> : kind === 'whatsapp' ? <><path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z" /><path d="M8 7.5c0 4.5 4 8 8 8l1-2.3-2.7-1.2-1 1c-1.6-.7-2.7-1.8-3.4-3.4l1-1L9.8 6Z" /></> : <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6.5h14M5 17.5h14" /></>}
  </svg>
}

export function ConnectedChannels() {
  return <section className="section--tight connected-channels" aria-labelledby="channels-title">
    <div className="container">
      <div className="connected-channels__heading"><div><span className="eyebrow">Mais perto, em cada canal</span><h2 id="channels-title">Conheça. Explore. Converse.</h2></div><p>Escolha como começar. Nosso espaço, nossos cuidados e uma conversa com a equipe estão a um toque.</p></div>
      <div className="connected-channels__grid">
        {siteConfig.social.instagram && <a className="channel-card channel-card--instagram" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"><span className="channel-card__icon"><ChannelIcon kind="instagram" /></span><span className="channel-card__step">01 · Nosso dia a dia</span><h3>Instagram</h3><p>Acompanhe conteúdos, novidades e conheça melhor a clínica.</p><span className="channel-card__handle">@odontopersonallite_</span><strong>Ver perfil <span aria-hidden="true">↗</span></strong><small>Abre o Instagram em uma nova aba</small></a>}
        <Link className="channel-card channel-card--site" to="/tratamentos"><span className="channel-card__icon"><ChannelIcon kind="site" /></span><span className="channel-card__step">02 · Informações para você</span><h3>Nosso site</h3><p>Explore especialidades, conheça a equipe e tire suas dúvidas antes do contato.</p><span className="channel-card__handle">Você já está aqui</span><strong>Explorar especialidades <span aria-hidden="true">→</span></strong><small>Continue navegando pelo site</small></Link>
        <a className="channel-card channel-card--whatsapp" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"><span className="channel-card__icon"><ChannelIcon kind="whatsapp" /></span><span className="channel-card__step">03 · Vamos conversar</span><h3>WhatsApp</h3><p>Solicite informações e consulte a disponibilidade de atendimento com a equipe.</p><span className="channel-card__handle">{siteConfig.contact.phoneDisplay}</span><strong>Conversar com a equipe <span aria-hidden="true">↗</span></strong><small>Você revisa a mensagem antes de enviar</small></a>
      </div>
      <p className="connected-channels__note">O atendimento e o horário da consulta precisam ser confirmados pela equipe.</p>
    </div>
  </section>
}
