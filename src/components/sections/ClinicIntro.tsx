import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import './ClinicIntro.css'

export function ClinicIntro() {
  return (
    <section className="section clinic-intro">
      <div className="container clinic-intro__grid">
        <div className="clinic-intro__visual">
          <img
            src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1400&q=82"
            alt="Imagem demonstrativa de consultório odontológico contemporâneo"
            loading="lazy"
          />
          <span className="clinic-intro__tag">Imagem demonstrativa</span>
        </div>

        <div className="clinic-intro__copy">
          <span className="eyebrow">A clínica</span>
          <h2 className="title">Um ambiente pensado para reduzir pressa e aumentar confiança.</h2>
          <p className="lead">
            A experiência começa antes do atendimento: comunicação clara,
            organização, conforto e uma atmosfera tranquila em cada detalhe.
          </p>

          <div className="clinic-intro__numbers" aria-label="Diferenciais demonstrativos">
            <div><strong>01</strong><span>Atendimento personalizado</span></div>
            <div><strong>02</strong><span>Ambiente contemporâneo</span></div>
            <div><strong>03</strong><span>Cuidado em cada etapa</span></div>
          </div>

          <Button href={ROUTES.clinic} variant="ghost">Conhecer nosso espaço</Button>
        </div>
      </div>
    </section>
  )
}
