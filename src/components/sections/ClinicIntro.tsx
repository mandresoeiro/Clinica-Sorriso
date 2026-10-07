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
          <span className="clinic-intro__tag">Imagem demonstrativa</span>
        </div>

        <div className="clinic-intro__copy">
          <span className="eyebrow">A clínica</span>
          <h2 className="title">Conheça o espaço antes de chegar.</h2>
          <p className="lead">
            A experiência começa antes do atendimento: comunicação clara,
            organização, conforto e uma atmosfera tranquila em cada detalhe.
          </p>

          <div className="clinic-intro__numbers" aria-label="Diferenciais demonstrativos">
            <div><strong>01</strong><span>Atendimento personalizado</span></div>
            <div><strong>02</strong><span>Ambiente contemporâneo</span></div>
            <div><strong>03</strong><span>Cuidado em cada etapa</span></div>
          </div>

          <Button href={`${ROUTES.clinic}#tour-virtual`} variant="ghost">Explorar o tour virtual →</Button>
          <a className="clinic-intro__instagram" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
            Acompanhe a clínica no Instagram <span aria-hidden="true">↗</span>
            <span className="clinic-intro__instagram-hint">Abre em uma nova aba</span>
          </a>
        </div>
      </div>
    </section>
  )
}
