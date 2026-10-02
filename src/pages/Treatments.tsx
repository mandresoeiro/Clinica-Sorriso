import { useState } from 'react'
import { Link } from 'react-router-dom'
import { treatments } from '../content/treatments'
import './Treatments.css'

type SpecialtyImage = {
  src: string
  fallback: string
  position?: string
}

const specialtyImages: Record<string, SpecialtyImage> = {
  prevencao: {
    src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=84',
    fallback: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=84',
    position: 'center 42%',
  },
  estetica: {
    src: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1400&q=84',
    fallback: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1400&q=84',
    position: 'center',
  },
  'reabilitacao-oral': {
    src: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1400&q=84',
    fallback: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=84',
    position: 'center',
  },
  implantes: {
    src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=84',
    fallback: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=84',
    position: 'center 45%',
  },
  proteses: {
    src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1400&q=84',
    fallback: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1400&q=84',
    position: 'center 24%',
  },
  clareamento: {
    src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1400&q=84',
    fallback: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1400&q=84',
    position: 'center 26%',
  },
}

function SpecialtyMedia({
  title,
  image,
  index,
  eyebrow,
}: {
  title: string
  image: SpecialtyImage
  index: number
  eyebrow: string
}) {
  const [src, setSrc] = useState(image.src)
  const [failed, setFailed] = useState(false)

  return (
    <div className={`specialty-card__media ${failed ? 'has-fallback' : ''}`}>
      {!failed ? (
        <img
          src={src}
          alt={`Imagem demonstrativa para ${title}`}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: image.position ?? 'center' }}
          onError={() => {
            if (src !== image.fallback) {
              setSrc(image.fallback)
            } else {
              setFailed(true)
            }
          }}
        />
      ) : (
        <div className="specialty-card__placeholder" aria-hidden="true">
          <span>S</span>
        </div>
      )}

      <span className="specialty-card__number">
        {String(index + 1).padStart(2, '0')} /
      </span>

      <span className="specialty-card__tag">{eyebrow}</span>
    </div>
  )
}

export function Treatments() {
  return (
    <div className="specialties-page">
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

          <div className="specialties-hero__intro">
            <p>
              Cada cuidado começa com avaliação individual. Conheça algumas das
              áreas que podem fazer parte de um planejamento odontológico
              personalizado.
            </p>
            <span>{treatments.length} áreas apresentadas</span>
          </div>
        </div>
      </section>

      <section className="specialties-list">
        <div className="container specialties-grid">
          {treatments.map((treatment, index) => {
            const image = specialtyImages[treatment.slug] ?? specialtyImages.prevencao

            return (
              <Link
                key={treatment.slug}
                to={`/tratamentos/${treatment.slug}`}
                className="specialty-card"
                aria-label={`Conhecer ${treatment.title}`}
              >
                <SpecialtyMedia
                  title={treatment.title}
                  image={image}
                  index={index}
                  eyebrow={treatment.eyebrow}
                />

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
    </div>
  )
}
