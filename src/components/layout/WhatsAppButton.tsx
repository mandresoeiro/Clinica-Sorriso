import { whatsappUrl } from '../../config/site.config'
import './WhatsAppButton.css'
export function WhatsAppButton(){return <a className="wa" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Abrir WhatsApp">WhatsApp</a>}
