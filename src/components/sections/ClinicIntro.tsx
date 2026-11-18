import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import { siteConfig } from '../../config/site.config'
import './ClinicIntro.css'

export function ClinicIntro() {
  return (
    <section className="section clinic-intro">
      <div className="container clinic-intro__grid">
        <div className="clinic-intro__visual">
          <img
            src="/images/tour/recepcao.webp"
            alt="Recepção fictícia da clínica, gerada por IA, com poltronas e balcão de madeira"
            loading="lazy"
            width="1672"
            height="941"
          />
          <span className="clinic-intro__tag">Imagem ilustrativa · ambiente fictício</span>
        </div>

        <div className="clinic-intro__copy">
          <span className="eyebrow">A clínica</span>
          <h2 className="title">Conheça nossa forma de cuidar.</h2>
          <p className="lead">
            Converse com a equipe sobre suas necessidades, entenda as etapas
            do atendimento e prepare sua visita à clínica.
          </p>

          <div className="clinic-intro__numbers" aria-label="Diferenciais demonstrativos">
            <div><strong>01</strong><span>Atendimento personalizado</span></div>
            <div><strong>02</strong><span>Orientação para sua visita</span></div>
            <div><strong>03</strong><span>Cuidado em cada etapa</span></div>
          </div>

          <Button href={ROUTES.clinic} variant="ghost">Saiba mais sobre a clínica →</Button>
          <a className="clinic-intro__instagram" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
            Acompanhe a clínica no Instagram <span aria-hidden="true">↗</span>
            <span className="clinic-intro__instagram-hint">Abre em uma nova aba</span>
          </a>
        </div>
      </div>
    </section>
  )
}
