import { Link } from 'react-router-dom'
import { treatments } from '../content/treatments'
import './Treatments.css'

const specialtyImages: Record<string, { src: string; position?: string }> = {
  prevencao: {
    src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=84',
    position: 'center 42%',
  },
  estetica: {
    src: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1400&q=84',
    position: 'center',
  },
  'reabilitacao-oral': {
    src: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1400&q=84',
    position: 'center',
  },
  implantes: {
    src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=84',
    position: 'center 45%',
  },
  proteses: {
    src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1400&q=84',
    position: 'center',
  },
  clareamento: {
    src: 'https://images.unsplash.com/photo-1606265752439-1f18756aa376?auto=format&fit=crop&w=1400&q=84',
    position: 'center',
  },
}

export function Treatments() {
  return (
    <main className="specialties-page">
      <section className="specialties-hero">
        <div className="container specialties-hero__grid">
          <div>
            <span className="eyebrow">Especialidades</span>
            <h1>
              Tratamentos pensados
              <em> sob medida </em>
              para o seu sorriso.
            </h1>
          </div>

          <p>
            Cada cuidado começa com avaliação individual. Conheça algumas das
            áreas que podem fazer parte de um planejamento odontológico
            personalizado.
          </p>
        </div>
      </section>

      <section className="specialties-list">
        <div className="container specialties-grid">
          {treatments.map((treatment, index) => {
            const image = specialtyImages[treatment.slug]

            return (
              <Link
                key={treatment.slug}
                to={`/tratamentos/${treatment.slug}`}
                className="specialty-card"
                aria-label={`Conhecer ${treatment.title}`}
              >
                <div className="specialty-card__media">
                  {image && (
                    <img
                      src={image.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: image.position ?? 'center' }}
                    />
                  )}

                  <span className="specialty-card__number">
                    {String(index + 1).padStart(2, '0')} /
                  </span>

                  <span className="specialty-card__tag">
                    {treatment.eyebrow}
                  </span>
                </div>

                <div className="specialty-card__content">
                  <div className="specialty-card__heading">
                    <h2>{treatment.title}</h2>
                    <span aria-hidden="true">↗</span>
                  </div>

                  <p>{treatment.shortDescription}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
