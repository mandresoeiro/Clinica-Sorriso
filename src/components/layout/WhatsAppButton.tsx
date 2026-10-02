import { whatsappUrl } from '../../config/site.config'
import './WhatsAppButton.css'

export function WhatsAppButton() {
  return (
    <a
      className="wa"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar com a clínica pelo WhatsApp"
      title="Conversar pelo WhatsApp"
    >
      <span className="wa__icon" aria-hidden="true">✆</span>
      <span className="wa__label">WhatsApp</span>
    </a>
  )
}
