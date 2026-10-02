import type { Treatment } from '../types/content'

export const treatments: Treatment[] = [
  {
    slug: 'prevencao',
    title: 'Prevenção',
    eyebrow: 'Cuidado contínuo',
    shortDescription: 'Acompanhamento para preservar saúde, conforto e confiança ao sorrir.',
    description:
      'Consultas preventivas ajudam a acompanhar a saúde bucal ao longo do tempo, com orientação individualizada e atenção aos sinais iniciais de alterações.',
    benefits: ['Acompanhamento periódico', 'Orientação personalizada', 'Cuidado antes do problema avançar'],
    indications: ['Pacientes de todas as idades', 'Rotina de manutenção', 'Quem deseja acompanhar a saúde bucal'],
    featured: true,
  },
  {
    slug: 'estetica',
    title: 'Estética do sorriso',
    eyebrow: 'Naturalidade primeiro',
    shortDescription: 'Planejamento estético com equilíbrio, função e respeito às características de cada pessoa.',
    description:
      'A estética odontológica busca harmonizar o sorriso com planejamento cuidadoso e indicação individual. Cada caso deve ser avaliado clinicamente antes da definição do tratamento.',
    benefits: ['Planejamento individual', 'Foco em naturalidade', 'Integração entre estética e função'],
    indications: ['Alterações de cor', 'Forma e proporção', 'Planejamento estético individual'],
    featured: true,
  },
  {
    slug: 'reabilitacao-oral',
    title: 'Reabilitação oral',
    eyebrow: 'Função e segurança',
    shortDescription: 'Planejamento integrado para recuperar conforto, mastigação e estética.',
    description:
      'A reabilitação oral reúne estratégias de diferentes áreas da odontologia para recuperar função e estética de forma planejada, conforme as necessidades de cada paciente.',
    benefits: ['Visão integrada', 'Planejamento por etapas', 'Foco em função e conforto'],
    indications: ['Perda de função', 'Desgastes', 'Casos que exigem planejamento multidisciplinar'],
    featured: true,
  },
  {
    slug: 'implantes',
    title: 'Implantodontia',
    eyebrow: 'Planejamento e precisão',
    shortDescription: 'Soluções para reposição de dentes com avaliação individual e planejamento cuidadoso.',
    description:
      'Implantes podem ser indicados em situações específicas para reposição de dentes ausentes. A indicação depende de avaliação clínica, exames e condições individuais.',
    benefits: ['Planejamento individual', 'Recuperação de função', 'Possibilidade de solução fixa em casos indicados'],
    indications: ['Ausência de um ou mais dentes', 'Avaliação para próteses sobre implantes', 'Casos com indicação clínica'],
  },
  {
    slug: 'proteses',
    title: 'Próteses',
    eyebrow: 'Reconstrução funcional',
    shortDescription: 'Alternativas personalizadas para recuperar forma, função e conforto.',
    description:
      'As próteses odontológicas podem ajudar a reconstruir dentes comprometidos ou substituir dentes ausentes. O tipo mais adequado depende da avaliação profissional.',
    benefits: ['Recuperação funcional', 'Planejamento personalizado', 'Integração estética'],
    indications: ['Dentes comprometidos', 'Ausências dentárias', 'Reabilitações planejadas'],
  },
  {
    slug: 'clareamento',
    title: 'Clareamento',
    eyebrow: 'Estética consciente',
    shortDescription: 'Clareamento com avaliação prévia e acompanhamento profissional.',
    description:
      'O clareamento dental deve ser indicado após avaliação da saúde bucal. A técnica e o tempo de tratamento variam conforme cada caso.',
    benefits: ['Acompanhamento profissional', 'Planejamento individual', 'Controle da evolução do tratamento'],
    indications: ['Alterações de cor compatíveis com clareamento', 'Pacientes com avaliação clínica favorável'],
  },
]
