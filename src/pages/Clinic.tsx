import { Button } from '../components/ui/Button'
import { whatsappUrl } from '../config/site.config'
import { FirstVisit } from '../components/sections/FirstVisit'
import { VirtualTour } from '../components/sections/VirtualTour'

export function Clinic() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Clínica</span>
          <h1 className="title">Um espaço pensado para acolher com calma e confiança.</h1>
          <p className="lead">
            A versão final desta página receberá a história, estrutura, tecnologias
            e fotografias reais da clínica após validação do briefing.
          </p>
          <div className="page-actions">
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">Agendar consulta</Button>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container grid grid-3">
          <article className="card">
            <span className="eyebrow">01</span>
            <h2>Atendimento humano</h2>
            <p className="muted">
              Comunicação clara, escuta e uma experiência organizada do primeiro contato ao acompanhamento.
            </p>
          </article>

          <article className="card">
            <span className="eyebrow">02</span>
            <h2>Ambiente acolhedor</h2>
            <p className="muted">
              Uma linguagem visual tranquila e espaços pensados para conforto, privacidade e bem-estar.
            </p>
          </article>

          <article className="card">
            <span className="eyebrow">03</span>
            <h2>Planejamento individual</h2>
            <p className="muted">
              Cada necessidade deve ser avaliada profissionalmente antes da definição de qualquer tratamento.
            </p>
          </article>
        </div>
      </section>

      <VirtualTour />
      <FirstVisit />

      <section className="section">
        <div className="container card">
          <span className="eyebrow">Visite a clínica</span>
          <h2 className="title">Conheça o espaço pessoalmente.</h2>
          <p className="lead">Converse com a equipe e tire suas dúvidas antes de decidir qualquer tratamento.</p>
          <div className="page-actions">
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">Conversar pelo WhatsApp</Button>
          </div>
        </div>
      </section>
    </>
  )
}
