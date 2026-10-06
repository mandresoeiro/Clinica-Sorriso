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

  function selectRoom(index: number) {
    setRoomIndex(index)
    setPointIndex(null)
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
        </div>
        <div className="virtual-tour__viewer">
          <img src={room.image} alt={room.alt} loading="lazy" width="1672" height="941" />
          <span className="virtual-tour__image-label">Ambiente ilustrativo · {room.name}</span>
          {room.points.map((point, index) => (
            <button key={`${room.name}-${point.name}`} type="button" className="virtual-tour__point" style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-label={`Explorar: ${point.name}`} aria-expanded={pointIndex === index} aria-controls="tour-detail" onClick={() => setPointIndex(pointIndex === index ? null : index)}>{index + 1}</button>
          ))}
        </div>
        <div className="virtual-tour__detail" id="tour-detail" aria-live="polite" aria-atomic="true">
          <strong>{pointIndex === null ? room.name : room.points[pointIndex].name}</strong>
          <p>{pointIndex === null ? room.description : room.points[pointIndex].text}</p>
        </div>
        <div className="virtual-tour__navigation">
          <button type="button" onClick={() => selectRoom((roomIndex + rooms.length - 1) % rooms.length)}>← Ambiente anterior</button>
          <span>{roomIndex + 1} / {rooms.length}</span>
          <button type="button" onClick={() => selectRoom((roomIndex + 1) % rooms.length)}>Próximo ambiente →</button>
        </div>
        <dialog ref={dialog} className="virtual-tour__dialog" aria-labelledby="tour-dialog-title">
          <div className="virtual-tour__dialog-header">
            <h3 id="tour-dialog-title">{room.name} · Tour demonstrativo</h3>
            <button type="button" onClick={() => dialog.current?.close()} autoFocus>Fechar ×</button>
          </div>
          <img src={room.image} alt={room.alt} width="1672" height="941" />
          <p>Imagens fictícias geradas por IA. Não representam a estrutura real da clínica.</p>
          <div className="virtual-tour__navigation">
            <button type="button" onClick={() => selectRoom((roomIndex + rooms.length - 1) % rooms.length)}>← Anterior</button>
            <span aria-live="polite">{roomIndex + 1} / {rooms.length}</span>
            <button type="button" onClick={() => selectRoom((roomIndex + 1) % rooms.length)}>Próximo →</button>
          </div>
        </dialog>
      </div>
    </section>
  )
}
