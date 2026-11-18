export const priorityServices = {
  protese: {
    path: '/urgencia-protese', title: 'Urgência em prótese', heading: 'Sua prótese precisa de atenção?',
    description: 'Solicite uma avaliação profissional e conheça as possibilidades de atendimento para sua prótese dentária.', action: 'Solicitar avaliação',
    message: 'Olá! Gostaria de informações sobre avaliação de prótese dentária e disponibilidade de atendimento.',
    situations: ['Prótese quebrada ou danificada', 'Prótese solta ou instável', 'Desconforto ao utilizar a prótese', 'Necessidade de avaliação ou ajuste'],
    questions: [['O reparo é feito na hora?', 'A possibilidade de reparo e o prazo dependem da avaliação, do material e da disponibilidade da clínica.'], ['Posso solicitar informações antes de ir?', 'Sim. Entre em contato para consultar a disponibilidade e receber orientações sobre a avaliação.'], ['A solicitação confirma meu horário?', 'Não. A equipe precisa verificar a agenda e confirmar o horário diretamente com você.']],
  },
  odontologica: {
    path: '/urgencia-odontologica', title: 'Urgência odontológica', heading: 'Atenção para o próximo passo.',
    description: 'Consulte a equipe sobre a disponibilidade de avaliação odontológica prioritária e as orientações para solicitar atendimento.', action: 'Ver disponibilidade',
    message: 'Olá! Gostaria de verificar a disponibilidade para uma avaliação odontológica prioritária.',
    situations: ['Dor ou desconforto odontológico', 'Fratura dentária', 'Restauração quebrada', 'Alterações que precisam de avaliação profissional'],
    questions: [['Existe atendimento 24 horas?', 'Este site não informa atendimento 24 horas. Consulte os dias, horários e a disponibilidade com a equipe.'], ['O contato permite receber um diagnóstico?', 'Não. A avaliação e a indicação de tratamento dependem do atendimento por um profissional.'], ['O horário é confirmado pelo site?', 'Não. O WhatsApp inicia sua solicitação; a confirmação é feita pela equipe.']],
  },
} as const
