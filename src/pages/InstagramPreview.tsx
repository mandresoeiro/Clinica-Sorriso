import { Link } from 'react-router-dom'
import { siteConfig, getWhatsAppUrl } from '../config/site.config'
import './InstagramPreview.css'
import { useState } from 'react'
import { highlightCovers } from '../content/highlightCovers'
import receptionDemo from '../assets/demo/recepcao-ia.webp'
import treatmentRoomDemo from '../assets/demo/consultorio-ia.webp'
import { CampaignDemo } from '../components/sections/CampaignDemo'

const highlights = [
  { label: 'Clínica', href: '/clinica', icon: 'clinic' },
  { label: 'Equipe', href: '/equipe', icon: 'team' },
  { label: 'Cuidados', href: '/tratamentos', icon: 'care' },
  { label: 'Próteses', href: '/proteses', icon: 'tooth' },
  { label: 'Atendimento', href: '/urgencia-odontologica', icon: 'chat' },
  { label: 'Localização', href: '/contato', icon: 'pin' },
] as const

function HighlightIcon({ kind }: { kind: typeof highlights[number]['icon'] }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'clinic' && <><path d="M10 40V13a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v27M7 40h34M20 40V29h8v11M24 15v8M20 19h8M15 29h1M32 29h1" /></>}
    {kind === 'team' && <><circle cx="24" cy="15" r="5" /><path d="M14 38v-5a10 10 0 0 1 20 0v5M12 12a4 4 0 0 0 0 8M36 12a4 4 0 0 1 0 8M7 34v-4a7 7 0 0 1 6-7M41 34v-4a7 7 0 0 0-6-7" /></>}
    {kind === 'care' && <><path d="M24 40S7 30 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 22-17 22Z" /><path d="M24 18v12M18 24h12" /></>}
    {kind === 'tooth' && <><path d="M24 11c-5-4-14-4-15 4-1 7 3 11 4 17 1 5 2 9 5 9 4 0 2-13 6-13s2 13 6 13c3 0 4-4 5-9 1-6 5-10 4-17-1-8-10-8-15-4Z" /><path d="M19 11c3 2 6 3 10 3M11 23c8 3 18 3 26 0" /></>}
    {kind === 'chat' && <><path d="M40 23c0 9-7 15-16 15-3 0-6-.7-8-2L7 40l3-10a15 15 0 0 1-2-7C8 14 15 8 24 8s16 6 16 15Z" /><path d="M16 20h16M16 26h11" /></>}
    {kind === 'pin' && <><path d="M37 20c0 10-13 22-13 22S11 30 11 20a13 13 0 0 1 26 0Z" /><circle cx="24" cy="20" r="5" /></>}
  </svg>
}

const posts = [
  ['Cuidado', 'Seu sorriso, nossa atenção.', 'Conheça uma proposta de cuidado com escuta e planejamento individual. Explore as especialidades no site e converse com a equipe.'],
  ['Próteses', 'Sua prótese precisa de atenção?', 'Próteses soltas, quebradas ou desconfortáveis precisam de avaliação profissional. Consulte a equipe sobre os serviços oferecidos e a disponibilidade.'],
  ['Atendimento', 'Informação para o próximo passo.', 'Para solicitar atendimento odontológico, fale com a equipe pelo WhatsApp. Disponibilidade e horários são confirmados durante a conversa.'],
  ['Equipe', 'Pessoas que cuidam de pessoas.', 'Espaço reservado para apresentar os profissionais, suas áreas de atuação e registros, após validação pela clínica.'],
  ['Estrutura', 'Conheça antes de chegar.', 'Explore o tour demonstrativo no site. As fotografias oficiais do espaço serão apresentadas após autorização da clínica.'],
  ['Primeira visita', 'Uma conversa para começar.', 'Consulte horários, localização e orientações para sua primeira visita. Evite enviar dados clínicos sensíveis pelo formulário do site.'],
] as const

const highlightStories = [
  { title: 'Conheça a Odonto Personnallite', text: 'Um primeiro contato com nossa proposta de cuidado, escuta e planejamento individual.', action: 'Conhecer a clínica', note: 'Na publicação: usar fotos reais e autorizadas do espaço.' },
  { title: 'Quem cuida do seu sorriso', text: 'Conheça os profissionais e suas áreas de atuação antes de solicitar sua avaliação.', action: 'Conhecer a equipe', note: 'Na publicação: incluir nome, foto e registro profissional confirmados.' },
  { title: 'Informação para cuidar melhor', text: 'Conheça os tratamentos oferecidos. A indicação de cada procedimento depende de avaliação profissional.', action: 'Explorar tratamentos', note: 'Na publicação: apresentar somente serviços confirmados pela clínica.' },
  { title: 'Vamos conversar sobre próteses?', text: 'Conheça a proposta de avaliação e planejamento. Converse com a equipe sobre suas necessidades e consulte os horários.', action: 'Ver informações sobre próteses', note: 'Sem promessa de reparo imediato: cada caso precisa ser avaliado.' },
  { title: 'Vamos conversar?', text: 'Solicite informações e consulte os horários pelo WhatsApp. A equipe confirma a disponibilidade e o agendamento.', action: 'Solicitar atendimento', note: 'O contato inicia uma conversa; não confirma automaticamente uma consulta.' },
  { title: 'Planeje sua visita', text: `${siteConfig.address.street} · Belém, PA. Consulte a equipe para confirmar os horários antes de sair.`, action: 'Ver localização e contato', note: 'Endereço e horários devem ser validados antes da publicação.' },
] as const

export function InstagramPreview() {
  const [activeHighlight, setActiveHighlight] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState('')
  async function downloadCover(name: string) {
    setDownloadStatus('Preparando capa…')
    try {
      const img = new Image()
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(highlightCovers[name])}`
      await img.decode()
      const canvas = document.createElement('canvas')
      canvas.width = 1080; canvas.height = 1080
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')
      context.drawImage(img, 0, 0)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('Export failed')
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url; anchor.download = `capa-${name}.png`; anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      setDownloadStatus('Capa PNG preparada para download.')
    } catch { setDownloadStatus('Não foi possível baixar a capa. Tente novamente.') }
  }
  return <div className="instagram-preview container">
    <CampaignDemo />
    <div className="instagram-preview__notice"><strong>Prévia para apresentação</strong><span>Proposta de bio, destaques e conteúdo. Nenhum post foi publicado no Instagram.</span></div>
    <header className="instagram-profile"><div className="instagram-profile__avatar"><img src="/images/brand/symbol.svg" alt="Símbolo da clínica" width="80" height="80" /></div><div><span className="eyebrow">Proposta de presença digital</span><h1>Clínica Odonto Personnallite</h1><p className="instagram-profile__handle">Perfil vinculado: @odontopersonallite_</p><p>Odontologia com atenção e planejamento individual.<br />Belém · PA<br />Conheça nossos serviços e consulte a disponibilidade ↓</p><div className="page-actions"><Link className="button button--primary" to="/">Conhecer o site</Link><a className="button button--ghost" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">Conversar no WhatsApp ↗</a><a className="button button--ghost" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">Abrir Instagram real ↗</a></div></div></header>
    <section className="highlight-studio" aria-labelledby="instagram-highlights">
      <div className="highlight-studio__heading"><div><span className="eyebrow">Uma identidade, seis caminhos</span><h2 id="instagram-highlights">Destaques que acolhem e orientam.</h2></div><p>Conheça a clínica, tire dúvidas e encontre o próximo passo. Selecione uma capa para experimentar.</p></div>
      <div className="instagram-highlights" role="group" aria-label="Selecionar prévia de destaque">{highlights.map(({ label, icon }, index) => <button type="button" key={label} aria-pressed={activeHighlight === index} onClick={() => setActiveHighlight(index)}><span className="highlight-cover"><HighlightIcon kind={icon} /></span><span>{label}</span></button>)}</div>
      <div className="highlight-story" aria-live="polite">
        <div className="highlight-story__art"><span className="highlight-story__brand">ODONTO<br />PERSONNALLITE</span><HighlightIcon kind={highlights[activeHighlight].icon} /><span className="highlight-story__label">{highlights[activeHighlight].label}</span><span className="highlight-story__demo">PRÉVIA DE STORY</span></div>
        <div className="highlight-story__content"><span className="eyebrow">{String(activeHighlight + 1).padStart(2, '0')} / 06 · {highlights[activeHighlight].label}</span><h3>{highlightStories[activeHighlight].title}</h3><p>{highlightStories[activeHighlight].text}</p><Link className="button button--primary" to={highlights[activeHighlight].href}>{highlightStories[activeHighlight].action} →</Link><small>{highlightStories[activeHighlight].note}</small></div>
      </div>
      <p className="highlight-studio__footnote">Demonstração interativa no site. No Instagram, cada destaque reúne stories publicados e leva ao site ou WhatsApp pelo adesivo de link.</p>
    </section>
    <section aria-labelledby="cover-downloads"><h2 id="cover-downloads">Capas prontas para usar</h2><p>Formato quadrado, 1080 × 1080 px. Ícones centralizados para o recorte circular dos destaques.</p><div className="cover-downloads">{['clinica', 'equipe', 'cuidados', 'proteses', 'atendimento', 'localizacao'].map((name, index) => <figure key={name}><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(highlightCovers[name])}`} alt={`Capa do destaque ${highlights[index].label}`} width="1080" height="1080" loading="lazy" /><figcaption>{highlights[index].label}</figcaption><button className="button button--ghost" onClick={() => downloadCover(name)}>Baixar PNG</button></figure>)}</div><p role="status">{downloadStatus}</p></section>
    <section aria-labelledby="demo-environments"><h2 id="demo-environments">Ambientes ilustrativos para demonstração</h2><p>Imagens geradas por IA. Não representam a estrutura real da clínica.</p><div className="demo-environments">{[[receptionDemo, 'Recepção fictícia'], [treatmentRoomDemo, 'Consultório fictício']].map(([name, label]) => <figure key={name}><img src={name} alt={`${label}, imagem ilustrativa gerada por IA`} width="1122" height="1402" loading="lazy" /><figcaption>{label} · Demonstração / IA</figcaption><a className="button button--ghost" href={name} download>Baixar imagem</a></figure>)}</div></section>
    <section aria-labelledby="instagram-posts"><div className="instagram-preview__section-heading"><h2 id="instagram-posts">Uma primeira sequência de conteúdos</h2><p>Toque em um post para ler a legenda proposta.</p></div><div className="instagram-posts">{posts.map(([category, title, caption], index) => <details className={`instagram-post instagram-post--${index % 3}`} id={`post-${index}`} key={title}><summary><span className="instagram-post__brand">ODONTO PERSONNALLITE</span><span className="instagram-post__category">{category}</span><span className="instagram-post__title">{title}</span><span className="instagram-post__footer">Ver legenda <span aria-hidden="true">＋</span></span></summary><div className="instagram-post__caption"><strong>Legenda proposta</strong><p>{caption}</p><Link to="/contato">Informações de contato →</Link></div></details>)}</div></section>
    <aside className="instagram-preview__notice"><strong>Antes de publicar</strong><span>Validar os textos, serviços, localização e identificação profissional aplicável. Os posts são propostas editoriais; equipe e fotos oficiais ainda precisam de confirmação.</span></aside>
    <Link className="button button--ghost" to="/">← Voltar ao site</Link>
  </div>
}


