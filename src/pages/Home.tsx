import { Hero } from '../components/sections/Hero'
import { TreatmentsSection } from '../components/sections/TreatmentsSection'
import { ClinicIntro } from '../components/sections/ClinicIntro'
import { TeamPreview } from '../components/sections/TeamPreview'
import { AppointmentForm } from '../components/sections/AppointmentForm'
import { LocationSection } from '../components/sections/LocationSection'
import './Home.css'

export function Home() {
  return (
    <div className="home-page">
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
      <AppointmentForm />
      <LocationSection />
    </div>
  )
}
