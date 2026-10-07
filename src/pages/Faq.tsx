import { useLocation } from 'react-router-dom'
import { faqs } from '../content/faqs'
import { Button } from '../components/ui/Button'
import { whatsappUrl } from '../config/site.config'
import './Faq.css'


export function Faq() {
  const { hash } = useLocation()
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
            <details className="faq-item" id={String(index)} key={item.question} open={hash === "#" + index || undefined}>
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
