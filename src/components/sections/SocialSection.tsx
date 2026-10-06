import { siteConfig } from '../../config/site.config'
import './SocialSection.css'

export function SocialSection() {
  const channels = [
    { name: 'Instagram', url: siteConfig.social.instagram, description: 'Ambientes, equipe e novidades da clínica.' },
    { name: 'Facebook', url: siteConfig.social.facebook, description: 'Informações e atualizações de atendimento.' },
    { name: 'TikTok', url: siteConfig.social.tiktok, description: 'Vídeos e bastidores para conhecer o espaço.' },
  ].filter((channel) => channel.url)
  return (
    <section className="section--tight social-section" aria-labelledby="social-title">
      <div className="container social-section__panel">
        <div><span className="eyebrow">Mais perto de você</span><h2 id="social-title">Conheça também o nosso dia a dia.</h2><p className="muted">Acompanhe os canais oficiais e conheça melhor a clínica antes da sua visita.</p></div>
        {channels.length ? <div className="social-section__links">{channels.map((channel) => <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer" aria-label={`${channel.name} da clínica — abre em nova aba`}><strong>{channel.name} <span aria-hidden="true">↗</span></strong><span>{channel.description}</span></a>)}</div> : <p className="social-section__pending">Demonstração: os perfis oficiais serão disponibilizados após confirmação da clínica.</p>}
      </div>
    </section>
  )
}
