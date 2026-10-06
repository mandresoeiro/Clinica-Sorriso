import { Link } from 'react-router-dom'
import { ShareButton } from '../ui/ShareButton'
import { TourExplorer } from './TourExplorer'
import { useRef, useState } from 'react'
import './VirtualTour.css'

const rooms = [
  {
    name: 'Recepção', image: '/images/tour/recepcao.webp',
    alt: 'Recepção fictícia com balcão de madeira e poltronas claras',
    description: 'Imagine o primeiro contato em um espaço tranquilo e acolhedor.',
    points: [
      { name: 'Boas-vindas', text: 'Um ponto de chegada para conversar sobre horários e tirar dúvidas.', x: 38, y: 48 },
      { name: 'Área de espera', text: 'Uma proposta de ambiente confortável enquanto você aguarda.', x: 73, y: 66 },
    ],
  },
  {
    name: 'Consultório', image: '/images/tour/consultorio.webp',
    alt: 'Consultório odontológico fictício com cadeira e iluminação natural',
    description: 'Explore uma proposta de espaço para avaliação e conversa com o profissional.',
    points: [
      { name: 'Atendimento', text: 'A consulta é o momento de compartilhar dúvidas e entender a avaliação.', x: 48, y: 62 },
      { name: 'Conversa e planejamento', text: 'Pergunte sobre as etapas e possibilidades antes de decidir um tratamento.', x: 78, y: 40 },
    ],
  },
] as const

export function VirtualTour() {
  const [roomIndex, setRoomIndex] = useState(0)
  const [pointIndex, setPointIndex] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const room = rooms[roomIndex]
  const [guided, setGuided] = useState(false)
  const [motion, setMotion] = useState(false)
  const step = roomIndex * 2 + (pointIndex ?? 0)

  function visitStep(index: number) {
    setRoomIndex(Math.floor(index / 2))
    setPointIndex(index % 2)
  }

  function selectRoom(index: number) {
    setGuided(false)
    setRoomIndex(index)
    setPointIndex(null)
  }

  function scene(detailId: string) {
    return <TourExplorer key={room.name} label={room.name}><div className={`virtual-tour__viewer ${motion ? 'has-motion' : ''}`}>
      <div className="virtual-tour__scene" key={room.name}>
        <img src={room.image} alt={room.alt} loading="lazy" draggable={false} width="1672" height="941" />
        <span className="virtual-tour__image-label">Ambiente ilustrativo · {room.name}</span>
        {room.points.map((point, index) => <button key={point.name} type="button" className="virtual-tour__point" style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-label={`Explorar: ${point.name}`} aria-expanded={pointIndex === index} aria-controls={detailId} onClick={() => setPointIndex(guided ? index : pointIndex === index ? null : index)}>{index + 1}<span className="virtual-tour__point-name">{point.name}</span></button>)}
      </div>
    </div></TourExplorer>
  }

  function roomMap() {
    return <nav className="tour-map" aria-label="Mapa esquemático dos ambientes">
      <strong>Mapa do passeio</strong>
      {rooms.map((item, index) => <button type="button" key={item.name} aria-current={roomIndex === index ? 'true' : undefined} onClick={() => selectRoom(index)}>{index + 1} · {item.name}</button>)}
      <small>Esquema de navegação ilustrativo; não representa a planta real da clínica.</small>
    </nav>
  }

  function guideControls() {
    return <div className="virtual-tour__guide">
      <div className="virtual-tour__navigation">
        <button type="button" disabled={step === 0} onClick={() => visitStep(step - 1)}>← Voltar</button>
        <span aria-live="polite">Parada {step + 1} de 4</span>
        <button type="button" onClick={() => { if (step === 3) { setGuided(false); setPointIndex(null) } else visitStep(step + 1) }}>{step === 3 ? 'Concluir passeio ✓' : 'Próxima parada →'}</button>
      </div><progress max={4} value={step + 1} aria-label="Progresso do passeio" />
    </div>
  }

  return (
    <section className="section virtual-tour" id="tour-virtual" aria-labelledby="tour-title">
      <div className="container">
        <div className="virtual-tour__heading">
          <div>
            <span className="eyebrow">Explore os ambientes</span>
            <h2 className="title" id="tour-title">Entre e fique à vontade.</h2>
          </div>
          <span className="virtual-tour__badge">Imagens fictícias geradas por IA</span>
        </div>
        <p className="lead">Um tour demonstrativo: escolha um ambiente e toque nos pontos para descobrir mais. As imagens não representam a estrutura real da clínica.</p>
        <div className="virtual-tour__rooms" role="group" aria-label="Escolher ambiente">
          {rooms.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={roomIndex === index} onClick={() => selectRoom(index)}>{String(index + 1).padStart(2, '0')} · {item.name}</button>
          ))}
          <button type="button" onClick={() => dialog.current?.showModal()}>Ampliar tour ⛶</button>
          <button type="button" aria-pressed={guided} onClick={() => { setGuided(!guided); if (!guided) visitStep(0) }}>{guided ? 'Sair do passeio' : 'Começar passeio →'}</button>
          <button type="button" aria-pressed={motion} onClick={() => setMotion(!motion)}>{motion ? 'Pausar movimento' : 'Ativar movimento suave'}</button>
        </div>
        {scene('tour-detail')}
        {roomMap()}
        {guided && <div className="virtual-tour__guide">
          <div className="virtual-tour__navigation">
            <button type="button" disabled={step === 0} onClick={() => visitStep(step - 1)}>← Voltar</button>
            <span aria-live="polite">Parada {step + 1} de 4</span>
            <button type="button" onClick={() => { if (step === 3) { setGuided(false); setPointIndex(null) } else visitStep(step + 1) }}>{step === 3 ? 'Concluir passeio ✓' : 'Próxima parada →'}</button>
          </div>
          <progress max={4} value={step + 1} aria-label="Progresso do passeio" />
        </div>}
        <div className="virtual-tour__detail" id="tour-detail" aria-live="polite" aria-atomic="true">
          <strong>{pointIndex === null ? room.name : room.points[pointIndex].name}</strong>
          <p>{pointIndex === null ? room.description : room.points[pointIndex].text}</p>
        </div>
        <div className="virtual-tour__navigation">
          <button type="button" onClick={() => selectRoom((roomIndex + rooms.length - 1) % rooms.length)}>← Ambiente anterior</button>
          <span>{roomIndex + 1} / {rooms.length}</span>
          <button type="button" onClick={() => selectRoom((roomIndex + 1) % rooms.length)}>Próximo ambiente →</button>
        </div>
        <div className="page-actions"><Link className="button button--primary" to="/contato#agendamento">Quero conhecer pessoalmente →</Link></div>
        <ShareButton title="Conheça o tour da Clínica Sorriso" path="/clinica#tour-virtual" />
        <dialog ref={dialog} className="virtual-tour__dialog" aria-labelledby="tour-dialog-title" onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          const direction = event.key === 'ArrowRight' ? 1 : -1
          if (guided) visitStep(Math.max(0, Math.min(3, step + direction)))
          else selectRoom((roomIndex + direction + rooms.length) % rooms.length)
        }}>
          <div className="virtual-tour__dialog-header">
            <h3 id="tour-dialog-title">{room.name} · Tour demonstrativo</h3>
            <button type="button" onClick={() => dialog.current?.close()} autoFocus>Fechar ×</button>
          </div>
          <div className="virtual-tour__immersive-grid">
            {scene('tour-immersive-detail')}
            <aside className="virtual-tour__sidebar">
              <span className="eyebrow">Explore no seu ritmo</span>
              <div className="virtual-tour__thumbnails" role="group" aria-label="Ambientes do tour ampliado">
                {rooms.map((item, index) => <button type="button" key={item.name} aria-pressed={roomIndex === index} onClick={() => selectRoom(index)}><img src={item.image} alt="" width="1672" height="941" /><span>{item.name}</span></button>)}
              </div>
              <div className="virtual-tour__rooms">
                <button type="button" aria-pressed={guided} onClick={() => { setGuided(!guided); if (!guided) visitStep(0) }}>{guided ? 'Explorar livremente' : 'Começar passeio →'}</button>
                <button type="button" aria-pressed={motion} onClick={() => setMotion(!motion)}>{motion ? 'Pausar movimento' : 'Movimento suave'}</button>
              </div>
              <div id="tour-immersive-detail" className="virtual-tour__detail" aria-live="polite" aria-atomic="true"><strong>{pointIndex === null ? room.name : room.points[pointIndex].name}</strong><p>{pointIndex === null ? 'Toque nos pontos da imagem para descobrir cada detalhe.' : room.points[pointIndex].text}</p></div>
              {roomMap()}
              {guided && guideControls()}
              <p>Imagens fictícias geradas por IA. Não representam a estrutura real da clínica.</p>
            </aside>
          </div>
        </dialog>
      </div>
    </section>
  )
}
