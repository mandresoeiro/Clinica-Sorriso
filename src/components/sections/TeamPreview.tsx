import { Link } from 'react-router-dom'
import { professionals } from '../../content/professionals'
import './TeamPreview.css'

const professionalImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=82',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=82',
]

export function TeamPreview() {
  return (
    <section className="section team-preview">
      <div className="container">
        <div className="team-preview__heading">
          <div>
            <span className="eyebrow">Equipe</span>
            <h2 className="title">Profissionais apresentados com clareza e proximidade.</h2>
          </div>
          <p className="lead">
            Conheça os nomes da equipe. As fotos são ilustrativas; retratos reais,
            registros profissionais e especialidades serão adicionados após confirmação.
          </p>
        </div>

        <div className="team-grid">
          {professionals.map((p, i) => (
            <article className="team-card" key={p.slug}>
              <div className="team-card__photo">
                <img
                  src={professionalImages[i % professionalImages.length]}
                  alt="Retrato profissional demonstrativo"
                  loading="lazy"
                />
                <span>Foto demonstrativa</span>
              </div>
              <div className="team-card__content">
                <span className="eyebrow">Profissional</span>
                <h3>{p.name}</h3>
                <strong>{p.specialty}</strong>
                <p>{p.bio}</p>
                <span className="muted">{p.cro}</span>
              </div>
            </article>
          ))}
        </div>

        <Link className="team-link" to="/equipe">Ver equipe completa →</Link>
      </div>
    </section>
  )
}
