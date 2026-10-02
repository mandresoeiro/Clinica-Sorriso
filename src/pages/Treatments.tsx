import { Link } from 'react-router-dom'
import { treatments } from '../content/treatments'

export function Treatments() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Tratamentos</span>
          <h1 className="title">Cuidado de forma integrada e individual.</h1>
          <p className="lead">
            As informações abaixo são educativas e demonstrativas. A indicação
            adequada depende de avaliação profissional.
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="container grid grid-3">
          {treatments.map((treatment) => (
            <Link
              className="card stack"
              key={treatment.slug}
              to={`/tratamentos/${treatment.slug}`}
              aria-label={`Conhecer ${treatment.title}`}
            >
              <span className="eyebrow">{treatment.eyebrow}</span>
              <h2>{treatment.title}</h2>
              <p className="muted">{treatment.shortDescription}</p>
              <strong>Saiba mais →</strong>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
