import { Link, NavLink } from 'react-router-dom'
import './ProjectHeader.css'

export function ProjectHeader() {
  return <header className="client-header">
    <div className="container client-header__inner">
      <Link to="/apresentacao-cliente" className="client-header__brand"><img src="/images/brand/symbol.svg" alt="" width="38" height="42" /><span>Odonto Personnallite<small>Apresentação comercial para a clínica</small></span></Link>
      <Link className="client-header__site" to="/" target="_blank" rel="noopener noreferrer">Ver site dos pacientes ↗</Link>
    </div>
    <nav className="container client-header__nav" aria-label="Apresentação comercial">
      <NavLink to="/apresentacao-cliente">Projeto</NavLink>
      <NavLink to="/montar-proposta">Montar proposta</NavLink>
      <a href="/propostas/projeto-comercial-odonto-personnallite.pdf" target="_blank" rel="noopener noreferrer">Baixar PDF ↗</a>
    </nav>
  </header>
}
