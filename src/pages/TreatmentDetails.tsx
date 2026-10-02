import { Link, Navigate, useParams } from 'react-router-dom'
import { treatments } from '../content/treatments'
import { Button } from '../components/ui/Button'
import { whatsappUrl } from '../config/site.config'

export function TreatmentDetails() {
  const { slug } = useParams()
  const treatment = treatments.find((item) => item.slug === slug)

  if (!treatment) return <Navigate to="/404" replace />

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Link to="/tratamentos" className="eyebrow">← Todos os tratamentos</Link>
          <h1 className="title">{treatment.title}</h1>
          <p className="lead">{treatment.description}</p>
          <div className="page-actions">
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">Conversar com a clínica</Button>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container grid grid-2">
          <article className="card">
            <span className="eyebrow">{treatment.eyebrow}</span>
            <h2>Possíveis benefícios</h2>
            <ul className="list-clean">
              {treatment.benefits.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>

          <article className="card">
            <span className="eyebrow">Avaliação individual</span>
            <h2>Quando pode ser avaliado</h2>
            <ul className="list-clean">
              {treatment.indications.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>
    </>
  )
}
