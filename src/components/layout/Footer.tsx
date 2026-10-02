import { Link } from 'react-router-dom'
import { ROUTES } from '../../config/routes.config'
import { siteConfig } from '../../config/site.config'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <strong>{siteConfig.name}</strong>
          <p>{siteConfig.tagline}</p>
          {siteConfig.demoMode && <span className="footer__demo">Versão demonstrativa</span>}
        </div>

        <div>
          <strong>Navegação</strong>
          <nav className="footer__links" aria-label="Navegação do rodapé">
            <Link to={ROUTES.clinic}>Clínica</Link>
            <Link to={ROUTES.treatments}>Especialidades</Link>
            <Link to={ROUTES.team}>Equipe</Link>
            <Link to={ROUTES.faq}>Dúvidas</Link>
            <Link to={ROUTES.contact}>Contato</Link>
          </nav>
        </div>

        <div>
          <strong>Contato</strong>
          <p>{siteConfig.contact.phoneDisplay}<br />{siteConfig.contact.email}</p>
          <p>{siteConfig.hours}</p>
        </div>

        <div>
          <strong>Localização</strong>
          <p>{siteConfig.address.district} • {siteConfig.address.city}/{siteConfig.address.state}</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}.</span>
        <span>Conteúdo sujeito à validação da clínica.</span>
      </div>
    </footer>
  )
}
