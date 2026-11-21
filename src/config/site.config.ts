import { campaignOriginText } from '../utils/campaignOrigin'

export const siteConfig = {
  name: 'Clínica Odonto Personnallite',
  shortName: 'Odonto Personnallite',
  tagline: 'Odontologia com técnica, cuidado e leveza.',
  description:
    'Uma experiência odontológica contemporânea, humana e cuidadosamente planejada para cada paciente.',
  demoMode: true,
  addressConfirmed: true,
  contact: {
    phoneDisplay: '(91) 98188-8353',
    phoneE164: '5591981888353',
    whatsappMessage:
      'Olá! Conheci a clínica pelo site e gostaria de informações sobre atendimento e horários disponíveis.',
    email: '',
  },
  address: {
    street: 'Travessa Almirante Wandenkolk, 1243',
    district: '',
    city: 'Belém',
    state: 'PA',
    zipCode: '',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Travessa%20Almirante%20Wandenkolk%2C%201243%2C%20Bel%C3%A9m%20-%20PA',
  },
  social: {
    instagram: 'https://www.instagram.com/odontopersonnallite/',
    facebook: '',
    tiktok: '',
  },
  hours: 'Atendimento mediante agendamento. Consulte dias, horários e disponibilidade pelo WhatsApp.',
  technicalResponsible: 'Dra. Sônia Almeida - CRO-PA 2638',
} as const

export function getWhatsAppUrl(message: string = siteConfig.contact.whatsappMessage) {
  const origin = campaignOriginText()
  const text = origin ? `${message}\n\n${origin}` : message
  return `https://wa.me/${siteConfig.contact.phoneE164}?text=${encodeURIComponent(text)}`
}
