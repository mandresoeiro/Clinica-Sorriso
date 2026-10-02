import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import { whatsappUrl } from '../../config/site.config'
import './Hero.css'

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=85',
    alt: 'Ambiente odontológico moderno e iluminado',
  },
  {
    src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=85',
    alt: 'Atendimento odontológico em ambiente profissional',
  },
  {
    src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=85',
    alt: 'Detalhe de atendimento em clínica odontológica',
  },
]

export function Hero() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy reveal">
          <span className="eyebrow">Odontologia contemporânea • Belém</span>
          <h1 className="display">Cuidado que transforma a forma de viver o seu sorriso.</h1>
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

          <div className="hero__facts" aria-label="Diferenciais da clínica">
            <span>Atendimento humano</span>
            <span>Planejamento individual</span>
            <span>Ambiente acolhedor</span>
          </div>
        </div>

        <div className="hero__art">
          <div className="hero__orb hero__orb--one" aria-hidden="true" />
          <div className="hero__orb hero__orb--two" aria-hidden="true" />

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

            <div className="hero__photo-overlay">
              <span>Imagens demonstrativas</span>
              <strong>Seu espaço real entrará aqui</strong>
            </div>
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

          <div className="hero__stamp">Cuidado em cada detalhe</div>
        </div>
      </div>
    </section>
  )
}
