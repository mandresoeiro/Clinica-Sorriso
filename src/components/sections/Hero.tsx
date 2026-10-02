import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import { whatsappUrl } from '../../config/site.config'
import './Hero.css'

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=85',
    alt: 'Ambiente odontológico moderno e iluminado',
    label: 'Ambiente pensado para acolher',
  },
  {
    src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=85',
    alt: 'Atendimento odontológico em ambiente profissional',
    label: 'Tecnologia com cuidado humano',
  },
  {
    src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=85',
    alt: 'Detalhe de atendimento em clínica odontológica',
    label: 'Planejamento em cada detalhe',
  },
]

export function Hero() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  const active = heroImages[activeImage]

  return (
    <section className="hero">
      <div className="hero__mesh" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy reveal">
          <div className="hero__intro">
            <span className="eyebrow">Odontologia contemporânea • Belém</span>
            <span className="hero__line" aria-hidden="true" />
          </div>

          <h1 className="display">
            Seu sorriso merece
            <span> cuidado com intenção.</span>
          </h1>

          <p className="lead">
            Atendimento humanizado, planejamento individual e uma experiência
            pensada para transmitir segurança do primeiro contato ao acompanhamento.
          </p>

          <div className="hero__actions">
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">
              Agendar consulta
            </Button>
            <Button variant="ghost" href={ROUTES.clinic}>
              Conhecer a clínica
            </Button>
          </div>

          <div className="hero__proof">
            <div>
              <strong>01</strong>
              <span>Atendimento humano</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Planejamento individual</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Ambiente acolhedor</span>
            </div>
          </div>
        </div>

        <div className="hero__art">
          <div className="hero__ring" aria-hidden="true" />
          <div className="hero__accent hero__accent--top" aria-hidden="true" />
          <div className="hero__accent hero__accent--bottom" aria-hidden="true" />

          <div className="hero__photo" aria-live="polite">
            {heroImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={index === activeImage ? 'is-active' : ''}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}

            <div className="hero__photo-scrim" aria-hidden="true" />
            <div className="hero__photo-caption">
              <span>Imagens demonstrativas</span>
              <strong>{active.label}</strong>
            </div>
          </div>

          <div className="hero__floating-card hero__floating-card--care">
            <span className="hero__floating-icon">✦</span>
            <div>
              <small>Experiência</small>
              <strong>Cuidado em cada detalhe</strong>
            </div>
          </div>

          <div className="hero__floating-card hero__floating-card--location">
            <small>Belém • Pará</small>
            <strong>Clínica contemporânea</strong>
          </div>

          <div className="hero__controls" aria-label="Selecionar imagem do destaque">
            {heroImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={index === activeImage ? 'is-active' : ''}
                aria-label={`Mostrar imagem ${index + 1}`}
                aria-pressed={index === activeImage}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>

          <div className="hero__counter" aria-hidden="true">
            <span>{String(activeImage + 1).padStart(2, '0')}</span>
            <i />
            <span>{String(heroImages.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
