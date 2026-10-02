import { siteConfig } from '../../config/site.config'
import './Footer.css'
export function Footer() {
  return <footer className="footer"><div className="container footer__grid"><div><strong>{siteConfig.name}</strong><p>{siteConfig.tagline}</p></div><div><strong>Contato</strong><p>{siteConfig.contact.phoneDisplay}<br/>{siteConfig.contact.email}</p></div><div><strong>Localização</strong><p>{siteConfig.address.district} • {siteConfig.address.city}/{siteConfig.address.state}</p></div></div><div className="container footer__bottom">© {new Date().getFullYear()} {siteConfig.name}. Conteúdo demonstrativo até validação do briefing.</div></footer>
}
