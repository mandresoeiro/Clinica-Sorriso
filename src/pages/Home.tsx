import { Hero } from '../components/sections/Hero'
import { TreatmentsSection } from '../components/sections/TreatmentsSection'
import { ClinicIntro } from '../components/sections/ClinicIntro'
import { TeamPreview } from '../components/sections/TeamPreview'
import { AppointmentForm } from '../components/sections/AppointmentForm'
import { LocationSection } from '../components/sections/LocationSection'
import { useEffect, useRef } from 'react'
import './Home.css'
import { SocialSection } from '../components/sections/SocialSection'

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
      <section className="home-start section--tight" aria-labelledby="home-start-title">
        <div className="container">
          <span className="eyebrow">Comece por aqui</span>
          <h2 id="home-start-title">O próximo passo, no seu ritmo.</h2>
          <div className="home-start__grid">
            <a href="/clinica#tour-virtual"><span className="eyebrow">01 · Explore</span><h3>Entre no tour virtual <span aria-hidden="true">↗</span></h3><p>Conheça os ambientes fictícios e descubra a proposta do espaço.</p></a>
            <a href="/clinica#primeira-visita"><span className="eyebrow">02 · Prepare-se</span><h3>Planeje sua primeira visita <span aria-hidden="true">↗</span></h3><p>Escolha o que importa para você e prepare uma conversa com a equipe.</p></a>
            <a href="#agendamento"><span className="eyebrow">03 · Converse</span><h3>Fale sobre seus horários <span aria-hidden="true">↗</span></h3><p>Prepare sua mensagem e continue o contato pelo WhatsApp.</p></a>
          </div>
        </div>
      </section>
      <TreatmentsSection />
      <ClinicIntro />
      <TeamPreview />
      <SocialSection />
      <section className="section--tight home-questions" aria-labelledby="home-questions-title">
        <div className="container">
          <span className="eyebrow">Antes de entrar em contato</span>
          <h2 className="title" id="home-questions-title">Mais clareza para começar.</h2>
          <div className="home-questions__list">
            <details><summary>O formulário confirma uma consulta?</summary><p>Ele prepara uma mensagem para o WhatsApp. Horário e atendimento precisam ser confirmados diretamente pela equipe.</p></details>
            <details><summary>Posso conhecer o espaço pelo site?</summary><p>Sim. O tour permite explorar imagens fictícias e seguir um passeio guiado. As fotos oficiais serão incluídas após confirmação da clínica.</p><a href="/clinica#tour-virtual">Explorar o tour →</a></details>
            <details><summary>Preciso enviar exames ou dados de saúde?</summary><p>Não. Informe apenas contato e preferências. Na versão demonstrativa, use dados fictícios. A avaliação deve acontecer com a equipe profissional.</p></details>
          </div>
          <a className="button button--ghost" href="/duvidas">Ver todas as dúvidas →</a>
        </div>
      </section>
      <AppointmentForm />
      <LocationSection />
    </div>
  )
}
