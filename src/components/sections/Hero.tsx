import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import { whatsappUrl } from '../../config/site.config'
import './Hero.css'

type HeroSlide = {
  src: string
  alt: string
  position: string
}

const heroSlides: HeroSlide[] = [
  {
    src: '/images/hero/hero-01.jpg',
    alt: 'Paciente sorrindo durante atendimento odontológico',
    position: 'center 42%',
  },
  {
    src: '/images/hero/hero-02.jpg',
    alt: 'Atendimento odontológico com foco em precisão e cuidado',
    position: 'center 44%',
  },
  {
    src: '/images/hero/hero-03.jpg',
    alt: 'Paciente sorrindo durante avaliação odontológica',
    position: 'center 40%',
  },
]

const SLIDE_DURATION = 5500

export function Hero() {
  const hero = useRef<HTMLElement>(null)
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
    <section ref={hero} className="hero" aria-label="Apresentação da Clínica Sorriso" onPointerMove={(event) => {
      if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const bounds = event.currentTarget.getBoundingClientRect()
      hero.current?.style.setProperty('--hero-pointer-x', `${event.clientX - bounds.left}px`)
      hero.current?.style.setProperty('--hero-pointer-y', `${event.clientY - bounds.top}px`)
    }}>
      <div className="hero__slides">
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
          />
        ))}
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__content">
        <div className="hero__copy">
          <div className="hero__meta">
            <span className="hero__eyebrow">Odontologia contemporânea • Belém</span>
            <span className="hero__demo-label">Imagens demonstrativas</span>
          </div>

          <h1>
            Seu sorriso merece
            <span> cuidado e tranquilidade.</span>
          </h1>

          <p>
            Atendimento humanizado, planejamento individual e uma experiência
            pensada para tornar cada etapa mais tranquila.
          </p>

          <div className="hero__actions">
            <Button href={whatsappUrl} target="_blank" rel="noreferrer">
              Solicitar agendamento
            </Button>
            <Button variant="ghost" href={`${ROUTES.clinic}#tour-virtual`}>
              Conhecer a clínica e o tour
            </Button>
          </div>
        </div>

        <a className="hero__tour-peek" href={`${ROUTES.clinic}#tour-virtual`}>
          <div className="hero__tour-peek-image"><img src="/images/tour/recepcao.webp" alt="" width="1672" height="941" /><span aria-hidden="true">↗</span></div>
          <span className="eyebrow">Tour demonstrativo</span>
          <strong>Conheça por dentro.</strong>
          <span>Explore os ambientes, no seu ritmo.</span>
        </a>

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
