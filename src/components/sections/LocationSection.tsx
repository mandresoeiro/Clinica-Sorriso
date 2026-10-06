import { siteConfig, whatsappUrl } from '../../config/site.config'
import { Button } from '../ui/Button'
import './LocationSection.css'

export function LocationSection() {
  return (
    <section className="section">
      <div className="container location">
        <div className="location__copy">
          <span className="eyebrow">Localização</span>
          <h2 className="title">Fácil de encontrar. Simples de agendar.</h2>
          <p className="lead">
            {siteConfig.address.street}<br />
            {siteConfig.address.district} • {siteConfig.address.city}/{siteConfig.address.state}
          </p>
          <p className="muted">{siteConfig.hours}</p>

          <div className="page-actions">
            {!siteConfig.demoMode && <Button href={siteConfig.address.mapsUrl} target="_blank" rel="noreferrer" variant="ghost">
              Como chegar
            </Button>}
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="location__map" aria-label="Espaço reservado para mapa da clínica">
          <span className="location__pin" aria-hidden="true">⌖</span>
          <strong>Mapa da clínica</strong>
          <small>
            O mapa real será ativado quando o endereço oficial for confirmado.
            Assim evitamos publicar localização incorreta durante a fase de demonstração.
          </small>
        </div>
      </div>
    </section>
  )
}
