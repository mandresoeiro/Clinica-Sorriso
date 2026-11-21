import { useState } from 'react'
import { teamPhotos } from '../content/teamPhotos'
import { professionalProfiles } from '../content/professionalProfiles'
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
      <span className="eyebrow">Odonto Personnallite</span>
      <h1 className="title">Profissionais</h1>
      <p className="lead">Conheça os profissionais da clínica e suas especializações.</p>
    </div></section>
    <section className="section--tight"><div className="container team-list">
      <div className="professional-list">
        {professionalProfiles.map(profile => (
          <article className="card professional-profile" key={profile.slug} id={profile.slug}>
            <img src={profile.photo} alt={profile.name} width={600} height={748} decoding="async" />
            <div>
              <h2>{profile.name}</h2>
              <p><strong>{profile.title}</strong> · {profile.occupation}</p>
              <h3>Especializações</h3>
              <ul>
                {profile.qualifications.map(qualification => <li key={qualification}>{qualification}</li>)}
              </ul>
              <a className="professional-profile__instagram" href={profile.instagram}>Instagram · {profile.instagramHandle}</a>
            </div>
          </article>
        ))}
      </div>
      {teamPhotos.length > 0 && <div className={`team-ribbon${paused ? ' is-paused' : ''}${multiple ? '' : ' is-single'}`} role="region" aria-label="Fotos da equipe" aria-roledescription={multiple ? 'carrossel' : undefined}>
        <div className="team-ribbon__viewport" tabIndex={0} aria-label="Fotos da equipe; o movimento pausa ao usar o teclado">
          <div className="team-ribbon__track">{photoGroup(false)}{multiple && photoGroup(true)}</div>
        </div>
        {multiple && <button className="team-carousel__play" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Continuar movimento' : 'Pausar movimento'}</button>}
      </div>}
    </div></section>
  </>
}
