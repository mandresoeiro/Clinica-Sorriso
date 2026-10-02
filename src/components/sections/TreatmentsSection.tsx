import { Link } from 'react-router-dom'
import { treatments } from '../../content/treatments'
import './TreatmentsSection.css'

const treatmentImages = [
  'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1581585099402-5b7a9d1d35f8?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1000&q=80',
]

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
            Uma prévia visual para apresentar a estrutura do site. Os serviços,
            imagens e informações finais serão validados com a clínica.
          </p>
        </div>

        <div className="treatment-grid">
          {featured.map((t, i) => (
            <Link key={t.slug} to={`/tratamentos/${t.slug}`} className="treatment-card">
              <div className="treatment-card__image">
                <img src={treatmentImages[i % treatmentImages.length]} alt="" loading="lazy" />
                <span>0{i + 1}</span>
              </div>
              <div className="treatment-card__body">
                <span className="eyebrow">{t.eyebrow}</span>
                <h3>{t.title}</h3>
                <p>{t.shortDescription}</p>
                <span className="treatment-card__link">Conhecer tratamento →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
