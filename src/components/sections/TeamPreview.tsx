import { Link } from 'react-router-dom'
import { professionals } from '../../content/professionals'
import './TeamPreview.css'
export function TeamPreview(){return <section className="section"><div className="container"><span className="eyebrow">Equipe</span><h2 className="title">Profissionais apresentados com clareza e credibilidade.</h2><div className="team-grid">{professionals.map((p,i)=><article className="team-card" key={p.slug}><div className={`team-card__photo team-card__photo--${i+1}`}>FOTO</div><div><h3>{p.name}</h3><strong>{p.specialty}</strong><p>{p.bio}</p><span className="muted">{p.cro}</span></div></article>)}</div><Link className="team-link" to="/equipe">Ver equipe completa →</Link></div></section>}
