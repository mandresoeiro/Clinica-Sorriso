import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../config/routes.config'
import { Button } from '../ui/Button'
import { whatsappUrl } from '../../config/site.config'
import './Header.css'

const nav = [
  ['Clínica', ROUTES.clinic],
  ['Tratamentos', ROUTES.treatments],
  ['Equipe', ROUTES.team],
  ['Contato', ROUTES.contact],
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to={ROUTES.home} className="brand" aria-label="Clínica Sorriso — início" onClick={closeMenu}>
          <span className="brand__mark" aria-hidden="true">S</span>
          <span className="brand__name">Clínica Sorriso</span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path}>{label}</NavLink>
          ))}
        </nav>

        <div className="site-header__cta">
          <Button href={whatsappUrl} target="_blank" rel="noreferrer">Agendar consulta</Button>
        </div>

        <button
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

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} id="mobile-navigation">
        <nav className="container" aria-label="Navegação móvel">
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} onClick={closeMenu}>{label}</NavLink>
          ))}
          <Button href={whatsappUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
            Agendar consulta
          </Button>
        </nav>
      </div>
    </header>
  )
}
