import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import { whatsappUrl } from '../../config/site.config'
import './Hero.css'

type HeroSlide = {
  src: string
  fallbackSrc: string
  alt: string
  position: string
}

const heroSlides: HeroSlide[] = [
  {
    src: '/images/hero/hero-01.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1800&q=88',
    alt: 'Paciente sorrindo durante atendimento odontológico',
    position: 'center 42%',
  },
  {
    src: '/images/hero/hero-02.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1777331903190-341a3dd0441b?auto=format&fit=crop&w=1800&q=88',
    alt: 'Paciente em consulta odontológica com atendimento acolhedor',
    position: 'center 44%',
  },
  {
    src: '/images/hero/hero-03.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1800&q=88',
    alt: 'Atendimento odontológico com foco em precisão e cuidado',
    position: 'center 42%',
  },
]

const SLIDE_DURATION = 5500

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || isPaused) return

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, SLIDE_DURATION)

    return () => window.clearInterval(interval)
  }, [isPaused])

  return (
    <section className="hero" aria-label="Apresentação da Clínica Sorriso">
      <div className="hero__slides" aria-live="polite">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={index === activeSlide ? slide.alt : ''}
            aria-hidden={index !== activeSlide}
            className={index === activeSlide ? 'is-active' : ''}
            style={{ objectPosition: slide.position }}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            onError={(event) => {
              const image = event.currentTarget
              if (image.src !== slide.fallbackSrc) image.src = slide.fallbackSrc
            }}
          />
        ))}
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__content">
        <div className="hero__copy reveal">
          <div className="hero__meta">
            <span className="hero__eyebrow">Odontologia contemporânea • Belém</span>
            <span className="hero__demo-label">Imagens demonstrativas</span>
          </div>

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

          <div className="hero__slider-ui">
            <span className="hero__slide-number" aria-hidden="true">
              {String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
            </span>

            <div className="hero__controls" aria-label="Selecionar imagem do destaque">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  className={index === activeSlide ? 'is-active' : ''}
                  aria-label={`Mostrar imagem ${index + 1}`}
                  aria-pressed={index === activeSlide}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>

            <button
              className="hero__pause"
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              aria-pressed={isPaused}
            >
              {isPaused ? 'Continuar' : 'Pausar'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
