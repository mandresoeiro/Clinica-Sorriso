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
            {!siteConfig.demoMode && <Button href={siteConfig.address.mapsUrl} target="_blank" rel="noreferrer" variant="ghost">
              Como chegar
            </Button>}
            {siteConfig.demoMode && <small className="muted">O mapa será ativado após confirmação do endereço oficial.</small>}
          </article>
        </div>
      </section>

      <AppointmentForm key={interest} initialInterest={interest} />
      <SocialSection />
    </>
  )
}
