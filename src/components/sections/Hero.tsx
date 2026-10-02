import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import { whatsappUrl } from '../../config/site.config'
import './Hero.css'

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1800&q=88',
    alt: 'Consultório odontológico moderno, claro e organizado',
    position: 'center',
  },
  {
    src: 'https://images.unsplash.com/photo-1777331903190-341a3dd0441b?auto=format&fit=crop&w=1800&q=88',
    alt: 'Dentista conversando de forma acolhedora com paciente em clínica moderna',
    position: 'center 44%',
  },
  {
    src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1800&q=88',
    alt: 'Atendimento odontológico profissional com foco em precisão e cuidado',
    position: 'center 42%',
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
      <div className="hero__slides" aria-live="polite">
        {heroImages.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={index === activeImage ? image.alt : ''}
            aria-hidden={index !== activeImage}
            className={index === activeImage ? 'is-active' : ''}
            style={{ objectPosition: image.position }}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__content">
        <div className="hero__copy reveal">
          <span className="hero__eyebrow">Odontologia contemporânea • Belém</span>

          <h1>
            Cuidado, estética e confiança
            <span> para viver melhor o seu sorriso.</span>
          </h1>

          <p>
            Atendimento humanizado, planejamento individual e uma experiência
            pensada para tornar cada etapa mais tranquila.
          </p>

          <div className="hero__actions">
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">
              Agendar consulta
            </Button>
            <Button variant="ghost" href={ROUTES.clinic}>
              Conhecer a clínica
            </Button>
          </div>
        </div>

        <div className="hero__footer">
          <div className="hero__proof" aria-label="Diferenciais da clínica">
            <span>Atendimento humano</span>
            <span>Planejamento individual</span>
            <span>Ambiente acolhedor</span>
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
        </div>
      </div>
    </section>
  )
}
