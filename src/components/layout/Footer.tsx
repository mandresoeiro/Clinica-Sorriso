import { Link } from 'react-router-dom'
import { ROUTES } from '../../config/routes.config'
import { siteConfig } from '../../config/site.config'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img className="footer__logo" src="/images/brand/logo.svg" alt={siteConfig.name} width="220" height="165" />
          <p>{siteConfig.tagline}</p>
          {siteConfig.demoMode && <span className="footer__demo">Versão demonstrativa</span>}
        </div>

        <div>
          <strong>Navegação</strong>
          <nav className="footer__links" aria-label="Navegação do rodapé">
            <Link to={ROUTES.clinic}>Clínica</Link>
            <a href={`${ROUTES.clinic}#tour-virtual`}>Tour virtual</a>
            <Link to={ROUTES.treatments}>Especialidades</Link>
            <Link to={ROUTES.team}>Equipe</Link>
            <Link to={ROUTES.faq}>Dúvidas</Link>
            <Link to={ROUTES.contact}>Contato</Link>
            <Link to={ROUTES.privacy}>Privacidade e LGPD</Link>
          </nav>
        </div>

        <div>
          <strong>Contato</strong>
          <p>{siteConfig.contact.phoneDisplay}<br />{siteConfig.contact.email}</p>
          <p>{siteConfig.hours}</p>
        </div>

        <div>
          <strong>Localização</strong>
          <p>{siteConfig.address.street}</p>
          <nav className="footer__links" aria-label="Redes sociais">
            {Object.entries(siteConfig.social).filter(([, url]) => url).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name === 'instagram' ? 'Instagram' : name === 'facebook' ? 'Facebook' : 'TikTok'} ↗</a>)}
          </nav>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}.</span>
        <span>Conteúdo sujeito à validação da clínica.</span>
        <a className="footer__credit" href="https://soeirotech.com.br" target="_blank" rel="noopener noreferrer" aria-label="Desenvolvido por SoeiroTech — visitar site em nova aba">
          <span>Desenvolvido por</span>
          <strong>SoeiroTech</strong>
          <span className="footer__credit-domain">soeirotech.com.br <span aria-hidden="true">↗</span></span>
        </a>
      </div>
    </footer>
  )
}
