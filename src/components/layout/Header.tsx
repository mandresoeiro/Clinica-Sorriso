import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../config/routes.config'
import { Button } from '../ui/Button'
import { siteConfig, getWhatsAppUrl } from '../../config/site.config'
import './Header.css'

const menuTypography = { fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontStyle: 'normal', fontSize: '.92rem', letterSpacing: 'normal' } as const

const nav = [
  ['Clínica', ROUTES.clinic],
  ['Tratamentos', ROUTES.treatments],
  ['Profissionais', ROUTES.team],
  ['Contato', ROUTES.contact],
] as const

export function Header() {
  const toggle = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header" onKeyDown={event => { if (event.key === 'Escape' && menuOpen) { closeMenu(); toggle.current?.focus() } }}>
      <div className="container site-header__inner">
        <NavLink to={ROUTES.home} className="brand" aria-label="Clínica Odonto Personnallite — início" onClick={closeMenu}>
          <img className="brand__logo" src="/images/brand/symbol.svg" alt="" width="48" height="52" />
          <span className="brand__name">Clínica Odonto Personnallite</span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} style={menuTypography}>{label}</NavLink>
          ))}
        </nav>

        <a className="site-header__instagram" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da clínica (abre em nova aba)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg><span>Instagram</span>
        </a>
        <div className="site-header__cta">
          <Button href={getWhatsAppUrl()} target="_blank" rel="noreferrer">Solicitar agendamento</Button>
        </div>

        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} id="mobile-navigation" inert={!menuOpen}>
        <nav className="container" aria-label="Navegação móvel">
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} style={menuTypography} onClick={closeMenu}>{label}</NavLink>
          ))}
          <Button href={getWhatsAppUrl()} target="_blank" rel="noreferrer" onClick={closeMenu}>
            Solicitar agendamento
          </Button>
        </nav>
      </div>
    </header>
  )
}
