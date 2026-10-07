import { useSearchParams } from 'react-router-dom'
import { treatments } from '../content/treatments'
import { AppointmentForm } from '../components/sections/AppointmentForm'
import { Button } from '../components/ui/Button'
import { siteConfig, whatsappUrl } from '../config/site.config'
import { SocialSection } from '../components/sections/SocialSection'

export function Contact() {
  const [params] = useSearchParams()
  const interest = treatments.find(item => item.slug === params.get('tratamento'))?.title ?? ''
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contato</span>
          <h1 className="title">Vamos conversar?</h1>
          <p className="lead">
            Conheça nossos canais e solicite informações sobre atendimento.
            A equipe confirma os dias e horários disponíveis diretamente com você.
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="container grid grid-2">
          <article className="card stack">
            <span className="eyebrow">WhatsApp</span>
            <strong>{siteConfig.contact.phoneDisplay}</strong>
            <p className="muted">Para dúvidas gerais, horários e primeiro contato.</p>
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">Abrir WhatsApp</Button>
          </article>

          <article className="card stack">
            <span className="eyebrow">Localização</span>
            <strong>Endereço da clínica</strong>
            <p className="muted">{siteConfig.address.street}</p>
            {siteConfig.addressConfirmed && <Button href={siteConfig.address.mapsUrl} target="_blank" rel="noreferrer" variant="ghost">
              Como chegar
            </Button>}
            <small className="muted">Confirme o trajeto no mapa antes de sair.</small>
          </article>
        </div>
      </section>

      <AppointmentForm key={interest} initialInterest={interest} />
      <SocialSection />
    </>
  )
}
