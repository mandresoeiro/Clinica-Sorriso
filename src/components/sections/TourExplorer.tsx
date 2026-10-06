import { useRef, useState, type ReactNode } from 'react'
import './TourExplorer.css'

export function TourExplorer({ children, label }: { children: ReactNode; label: string }) {
  const [zoom, setZoom] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ id: number; x: number; y: number; startX: number; startY: number } | null>(null)
  const viewport = useRef<HTMLDivElement>(null)
  function move(x: number, y: number) {
    const rect = viewport.current?.getBoundingClientRect()
    if (!rect) return
    setOffset({ x: Math.max(-rect.width * .3, Math.min(rect.width * .3, x)), y: Math.max(-rect.height * .3, Math.min(rect.height * .3, y)) })
  }
  function reset() { setZoom(false); setOffset({ x: 0, y: 0 }); drag.current = null }
  return <div className="tour-explorer">
    <div ref={viewport} className={'tour-explorer__viewport' + (zoom ? ' is-zoomed' : '')} tabIndex={0} role="group" aria-label={label + '. Amplie e arraste, ou use as setas do teclado.'}
      onPointerDown={event => {
        if (!zoom || (event.target as HTMLElement).closest('button') || event.button !== 0) return
        drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: offset.x, startY: offset.y }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={event => {
        const start = drag.current
        if (start?.id === event.pointerId) move(start.startX + event.clientX - start.x, start.startY + event.clientY - start.y)
      }}
      onPointerUp={() => { drag.current = null }}
      onPointerCancel={() => { drag.current = null }}
      onLostPointerCapture={() => { drag.current = null }}
      onKeyDown={event => {
        if (!zoom || event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
        event.preventDefault(); event.stopPropagation()
        move(offset.x + (event.key === 'ArrowLeft' ? 40 : event.key === 'ArrowRight' ? -40 : 0), offset.y + (event.key === 'ArrowUp' ? 40 : event.key === 'ArrowDown' ? -40 : 0))
      }}>
      <div className="tour-explorer__canvas" style={{ transform: zoom ? 'translate(' + offset.x + 'px,' + offset.y + 'px) scale(1.6)' : undefined }}>{children}</div>
    </div>
    <div className="tour-explorer__controls" role="group" aria-label="Controles de exploração">
      <button type="button" aria-pressed={zoom} onClick={() => { if (zoom) reset(); else setZoom(true) }}>{zoom ? 'Voltar à visão completa' : 'Ampliar e explorar +'}</button>
      {zoom && <><button type="button" aria-label="Explorar à esquerda" onClick={() => move(offset.x + 60, offset.y)}>←</button><button type="button" aria-label="Explorar à direita" onClick={() => move(offset.x - 60, offset.y)}>→</button><button type="button" aria-label="Explorar acima" onClick={() => move(offset.x, offset.y + 40)}>↑</button><button type="button" aria-label="Explorar abaixo" onClick={() => move(offset.x, offset.y - 40)}>↓</button><button type="button" onClick={() => setOffset({ x: 0, y: 0 })}>Centralizar</button></>}
    </div>
    <p className="tour-explorer__hint">{zoom ? 'Arraste para explorar. No celular, deslize na horizontal ou use os botões para ver todos os detalhes.' : 'Amplie para explorar os detalhes. Este passeio usa imagens ilustrativas, sem visão 360°.'}</p>
  </div>
}
