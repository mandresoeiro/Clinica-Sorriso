import { useState } from 'react'
const items = ['Confirmar data, horário e endereço com a equipe', 'Separar documentos e exames que já tenho, se solicitados', 'Anotar perguntas sobre etapas, duração e valores', 'Conferir como chegar e organizar meu deslocamento']
export function VisitChecklist() {
  const [checked, setChecked] = useState<number[]>([])
  return <div className="card visit-checklist"><h3>Prepare sua primeira visita</h3><p>Marque o que já organizou. Suas escolhas ficam apenas nesta página.</p><fieldset><legend>Meu checklist</legend>{items.map((text, index) => <label key={text}><input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index])} />{text}</label>)}</fieldset><p role="status">{checked.length} de {items.length} itens preparados.</p><button type="button" className="button button--ghost" onClick={() => setChecked([])}>Recomeçar checklist</button></div>
}
