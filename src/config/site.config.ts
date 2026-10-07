export const siteConfig = {
  name: 'Clínica Odontopersonnalite',
  shortName: 'Odontopersonnalite',
  tagline: 'Odontologia com técnica, cuidado e leveza.',
  description:
    'Uma experiência odontológica contemporânea, humana e cuidadosamente planejada para cada paciente.',
  demoMode: true,
  addressConfirmed: true,
  contact: {
    phoneDisplay: '(91) 8188-8353',
    phoneE164: '559181888353',
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
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Travessa%20Almirante%20Wandenkolk%2C%201243',
  },
  social: {
    instagram: 'https://www.instagram.com/odontopersonnalite_/',
    facebook: '',
    tiktok: '',
  },
  hours: '08h30 às 12h e 14h às 18h · consulte os dias de atendimento',
} as const

export const whatsappUrl = `https://wa.me/${siteConfig.contact.phoneE164}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`
