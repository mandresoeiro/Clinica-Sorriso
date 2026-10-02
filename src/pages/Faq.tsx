import { Button } from '../components/ui/Button'
import { whatsappUrl } from '../config/site.config'
import './Faq.css'

const faqs = [
  {
    question: 'Como funciona o primeiro atendimento?',
    answer:
      'O primeiro contato serve para entender sua necessidade e orientar os próximos passos. Quando necessário, a equipe poderá indicar uma avaliação presencial antes de qualquer definição de tratamento.',
  },
  {
    question: 'Preciso levar exames ou documentos?',
    answer:
      'Se você já tiver exames, radiografias ou documentos relacionados ao atendimento, pode levá-los. A necessidade de novos exames depende da avaliação profissional.',
  },
  {
    question: 'Como faço para solicitar um horário?',
    answer:
      'Você pode usar o botão de WhatsApp do site. A equipe recebe sua solicitação e confirma disponibilidade, data e horário diretamente com você.',
  },
  {
    question: 'O horário fica confirmado pelo site?',
    answer:
      'Não. Nesta versão, o site envia sua solicitação para o WhatsApp. O agendamento só fica confirmado após o retorno da clínica.',
  },
  {
    question: 'Posso tirar dúvidas sobre tratamentos pelo WhatsApp?',
    answer:
      'Sim, para dúvidas gerais e informações iniciais. Diagnóstico, indicação e definição de tratamento dependem de avaliação profissional.',
  },
  {
    question: 'Posso enviar informações clínicas pelo formulário?',
    answer:
      'Evite enviar informações clínicas sensíveis pelo formulário do site. Use-o apenas para contato, interesse de atendimento e preferência de período.',
  },
]

export function Faq() {
  return (
    <>
      <section className="page-hero faq-hero">
        <div className="container">
          <span className="eyebrow">Dúvidas frequentes</span>
          <h1 className="title">Informações simples antes do primeiro contato.</h1>
          <p className="lead">
            Reunimos as dúvidas mais úteis para quem está conhecendo a clínica
            e deseja solicitar atendimento.
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="container faq-list">
          {faqs.map((item, index) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.question}</strong>
                <i aria-hidden="true">+</i>
              </summary>
              <div className="faq-item__content">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="section faq-cta">
        <div className="container faq-cta__box">
          <div>
            <span className="eyebrow">Ainda ficou com dúvida?</span>
            <h2>Converse diretamente com a clínica.</h2>
          </div>
          <Button href={whatsappUrl} target="_blank" rel="noreferrer">
            Solicitar atendimento
          </Button>
        </div>
      </section>
    </>
  )
}
