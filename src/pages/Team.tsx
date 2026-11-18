import { useState } from 'react'
import { teamPhotos } from '../content/teamPhotos'
import './Team.css'

export function Team() {
  const [paused, setPaused] = useState(false)
  const multiple = teamPhotos.length > 1
  function photoGroup(duplicate: boolean) {
    return <div className="team-ribbon__group" aria-hidden={duplicate || undefined} inert={duplicate || undefined}>
      {teamPhotos.map(photo => <figure className="card team-ribbon__card" key={photo.src}>
        <img className="team-portrait" src={photo.src} alt={duplicate ? '' : photo.alt} width={photo.width} height={photo.height} decoding="async" />
        {photo.caption && <figcaption>{photo.caption}</figcaption>}
      </figure>)}
    </div>
  }
  return <>
    <section className="page-hero"><div className="container">
      <span className="eyebrow">Equipe</span>
      <h1 className="title">Conheça quem vai cuidar do seu sorriso.</h1>
      <p className="lead">Conheça a equipe da clínica. Converse com a recepção para consultar o profissional e a disponibilidade para cada atendimento.</p>
    </div></section>
    <section className="section--tight"><div className="container team-list">
      {teamPhotos.length > 0 && <div className={`team-ribbon${paused ? ' is-paused' : ''}${multiple ? '' : ' is-single'}`} role="region" aria-label="Fotos da equipe" aria-roledescription={multiple ? 'carrossel' : undefined}>
        <div className="team-ribbon__viewport" tabIndex={0} aria-label="Fotos da equipe; o movimento pausa ao usar o teclado">
          <div className="team-ribbon__track">{photoGroup(false)}{multiple && photoGroup(true)}</div>
        </div>
        {multiple && <button className="team-carousel__play" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Continuar movimento' : 'Pausar movimento'}</button>}
      </div>}
    </div></section>
  </>
}
