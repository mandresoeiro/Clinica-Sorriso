import { getWhatsAppUrl } from '../../config/site.config'
import { useLocation } from 'react-router-dom'
import { priorityServices } from '../../content/priorityServices'
import './WhatsAppButton.css'

export function WhatsAppButton() {
  const { pathname } = useLocation()
  const service = Object.values(priorityServices).find(item => item.path === pathname)
  const message = pathname === '/proteses' ? 'Olá! Conheci a página de próteses dentárias e gostaria de informações para agendar uma avaliação.' : service?.message
  const contactUrl = getWhatsAppUrl(message)
  return (
    <a
      className="wa"
      href={contactUrl}
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

