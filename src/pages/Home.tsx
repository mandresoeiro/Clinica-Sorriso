import { Link } from 'react-router-dom'
import { Hero } from '../components/sections/Hero'
import { TreatmentsSection } from '../components/sections/TreatmentsSection'
import { ClinicIntro } from '../components/sections/ClinicIntro'
import { useEffect, useRef } from 'react'
import './Home.css'
import { siteConfig, getWhatsAppUrl } from '../config/site.config'
import '../components/sections/CampaignDemo.css'

export function Home() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('home-section-entered')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: .08 })
    root.current?.querySelectorAll('section:not(.hero)').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return (
    <div className="home-page" ref={root}>
      <div className="home-reading-progress" aria-hidden="true" />
      <Hero />
      <TreatmentsSection />
      <section className="section--tight" aria-labelledby="home-care-title"><div className="container">
        <span className="eyebrow">Como podemos ajudar?</span>
        <h2 className="title" id="home-care-title">Encontre o atendimento que procura.</h2>
        <p className="lead">Conheça as opções e solicite contato da recepção. A equipe confirma a disponibilidade.</p>
        <div className="home-contact__actions">
          <a className="button button--primary" href="/tratamento-humanizado/">Atendimento humanizado →</a>
          <a className="button button--ghost" href="/urgencia-protese-implante/">Urgência em prótese e implante →</a>
        </div>
      </div></section>
      <ClinicIntro />
      <section className="section--tight home-questions" aria-labelledby="home-questions-title">
        <div className="container">
          <span className="eyebrow">Antes de entrar em contato</span>
          <h2 className="title" id="home-questions-title">Mais clareza para começar.</h2>
          <div className="home-questions__list">
            <details><summary>Como solicito um horário?</summary><p>Entre em contato pelo WhatsApp. A recepção informa a disponibilidade e confirma o agendamento com você.</p></details>
            <details><summary>As imagens mostram a clínica real?</summary><p>As imagens identificadas como ilustrativas não representam as instalações, a equipe ou os pacientes da clínica. Para conhecer o espaço, combine uma visita com a recepção.</p><Link to="/contato">Combinar uma visita →</Link></details>
            <details><summary>Preciso enviar exames ou dados de saúde?</summary><p>Não. Informe apenas contato e preferências de atendimento. Não envie exames ou diagnósticos pelo formulário. A avaliação acontece diretamente com a equipe profissional.</p></details>
          </div>
          <a className="button button--ghost" href="/duvidas">Ver todas as dúvidas →</a>
        </div>
      </section>
      <section className="section home-contact" aria-labelledby="home-contact-title"><div className="container home-contact__grid">
        <div><span className="eyebrow">Seu próximo passo</span><h2 className="title" id="home-contact-title">Converse com a nossa recepção.</h2><p className="lead">Tire suas dúvidas e consulte os horários disponíveis. O agendamento é confirmado pela equipe.</p><div className="home-contact__actions"><a className="button button--primary" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">Solicitar atendimento no WhatsApp ↗</a><Link className="button button--ghost" to="/contato">Ver localização e contato →</Link></div></div>
        <div className="home-contact__details"><h3>Planeje sua visita</h3><p>{siteConfig.address.street}<br/>{siteConfig.address.city} · {siteConfig.address.state}</p><p><strong>Horários informados</strong><br/>{siteConfig.hours}</p><p className="home-contact__note">Confirme a disponibilidade com a recepção antes de se deslocar.</p></div>
      </div></section>
    </div>
  )
}
