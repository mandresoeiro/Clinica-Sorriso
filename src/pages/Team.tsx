import { professionals } from '../content/professionals'

export function Team() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Equipe</span>
          <h1 className="title">Conheça quem vai cuidar do seu sorriso.</h1>
          <p className="lead">
            Nome, CRO, especialidade, formação, biografia e fotografia devem ser
            confirmados antes da publicação oficial.
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="container grid grid-2">
          {professionals.map((professional, index) => (
            <article className="card stack" key={professional.slug}>
              <span className="eyebrow">Profissional {String(index + 1).padStart(2, '0')}</span>
              <h2>{professional.name}</h2>
              <strong>{professional.specialty}</strong>
              <p>{professional.formation}</p>
              <p className="muted">{professional.bio}</p>
              <small>{professional.cro}</small>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
