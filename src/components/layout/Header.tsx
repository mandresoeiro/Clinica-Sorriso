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
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to={ROUTES.home} className="brand" aria-label="Clínica Sorriso — início">
          <span className="brand__mark">S</span>
          <span>Clínica Sorriso</span>
        </NavLink>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {nav.map(([label, path]) => <NavLink key={path} to={path}>{label}</NavLink>)}
        </nav>
        <Button href={whatsappUrl} target="_blank" rel="noreferrer">Agendar consulta</Button>
      </div>
    </header>
  )
}
