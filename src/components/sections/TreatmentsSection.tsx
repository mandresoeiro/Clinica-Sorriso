import { Link } from 'react-router-dom'
import { treatments } from '../../content/treatments'
import './TreatmentsSection.css'

const treatmentImages = {
  prevencao: {
    src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=82',
    alt: 'Atendimento odontológico preventivo em ambiente profissional',
  },
  estetica: {
    src: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=82',
    alt: 'Consultório odontológico moderno e iluminado',
  },
  'reabilitacao-oral': {
    src: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=82',
    alt: 'Paciente em atendimento odontológico com foco em conforto e reabilitação',
  },
} as const

export function TreatmentsSection() {
  const featured = treatments.filter((t) => t.featured)

  return (
    <section className="section treatments-showcase">
      <div className="container">
        <div className="treatments-showcase__heading">
          <div>
            <span className="eyebrow">Tratamentos</span>
            <h2 className="title">Cuidado pensado por etapas.</h2>
          </div>

          <p className="lead">
            Uma apresentação visual dos principais cuidados da clínica. As
            imagens são demonstrativas e serão substituídas pelas fotos
            oficiais na versão final.
          </p>
        </div>

        <div className="treatment-grid">
          {featured.map((t, i) => {
            const image =
              treatmentImages[t.slug as keyof typeof treatmentImages] ??
              treatmentImages.prevencao

            return (
              <Link
                key={t.slug}
                to={`/tratamentos/${t.slug}`}
                className="treatment-card"
                aria-label={`Conhecer o tratamento ${t.title}`}
              >
                <div className="treatment-card__image">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className="treatment-card__body">
                  <span className="eyebrow">{t.eyebrow}</span>
                  <h3>{t.title}</h3>
                  <p>{t.shortDescription}</p>
                  <span className="treatment-card__link">
                    Conhecer tratamento →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
