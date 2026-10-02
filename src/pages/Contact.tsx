import { AppointmentForm } from '../components/sections/AppointmentForm'
import { Button } from '../components/ui/Button'
import { siteConfig, whatsappUrl } from '../config/site.config'

export function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contato</span>
          <h1 className="title">Vamos conversar?</h1>
          <p className="lead">
            Escolha o canal mais conveniente. Nesta versão demonstrativa,
            os dados de contato ainda precisam ser confirmados pela clínica.
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
            <strong>{siteConfig.address.district} • {siteConfig.address.city}/{siteConfig.address.state}</strong>
            <p className="muted">{siteConfig.address.street}</p>
            <Button href={siteConfig.address.mapsUrl} target="_blank" rel="noreferrer" variant="ghost">
              Como chegar
            </Button>
          </article>
        </div>
      </section>

      <AppointmentForm />
    </>
  )
}
