import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="eyebrow">Erro 404</span>
        <h1 className="title">Esta página não foi encontrada.</h1>
        <p className="lead">O endereço pode ter mudado ou não existir mais.</p>
        <div className="page-actions">
          <Link className="button button--primary" to="/">Voltar para o início</Link>
        </div>
      </div>
    </section>
  )
}
