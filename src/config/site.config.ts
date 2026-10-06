export const siteConfig = {
  name: 'Clínica Sorriso',
  shortName: 'Sorriso',
  tagline: 'Odontologia com técnica, cuidado e leveza.',
  description:
    'Uma experiência odontológica contemporânea, humana e cuidadosamente planejada para cada paciente.',
  demoMode: true,
  contact: {
    phoneDisplay: '(91) 99999-9999',
    phoneE164: '5591999999999',
    whatsappMessage:
      'Olá! Conheci a clínica pelo site e gostaria de informações sobre atendimento e horários disponíveis.',
    email: 'contato@clinicasorriso.com.br',
  },
  address: {
    street: 'Endereço da clínica',
    district: 'Umarizal',
    city: 'Belém',
    state: 'PA',
    zipCode: '00000-000',
    mapsUrl: 'https://maps.google.com',
  },
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  hours: 'Seg–Sex • 08h às 18h | Sáb • sob agendamento',
} as const

export const whatsappUrl = `https://wa.me/${siteConfig.contact.phoneE164}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`
