import { Link } from 'react-router-dom'
import { treatments } from '../../content/treatments'
import './TreatmentsSection.css'

export function TreatmentsSection(){const featured=treatments.filter(t=>t.featured);return <section className="section"><div className="container"><span className="eyebrow">Tratamentos</span><h2 className="title">Cuidado pensado por etapas.</h2><p className="lead">A apresentação abaixo é demonstrativa. Os serviços finais serão validados com a clínica.</p><div className="treatment-grid">{featured.map((t,i)=><Link key={t.slug} to={`/tratamentos/${t.slug}`} className="treatment-card"><span className="treatment-card__num">0{i+1}</span><span className="eyebrow">{t.eyebrow}</span><h3>{t.title}</h3><p>{t.shortDescription}</p><span className="treatment-card__link">Conhecer tratamento →</span></Link>)}</div></div></section>}
