import { useState } from 'react'
import { Link } from 'react-router-dom'
import reception from '../../assets/demo/recepcao-ia.webp'
import room from '../../assets/demo/consultorio-ia.webp'
import './CampaignDemo.css'

const stories = [
  ['Vamos conversar sobre próteses?', 'Conheça a proposta de avaliação e converse sobre suas necessidades com a equipe.'],
  ['Cada caso merece uma avaliação.', 'O planejamento, as etapas e os prazos são definidos conforme a avaliação profissional.'],
  ['Vamos conversar?', 'Conheça o serviço e solicite informações pelo WhatsApp. A equipe confirma a disponibilidade.'],
] as const

export function CampaignDemo() {
  const [story, setStory] = useState(0)
  return <section className="campaign-demo" aria-labelledby="campaign-demo-title"><span className="eyebrow">Demonstração interativa · Sem anúncios ativos</span><h2 id="campaign-demo-title">Do primeiro contato à conversa.</h2><p>Experimente: abra o serviço pelo post ou navegue pelos três stories do destaque.</p><div className="campaign-demo__grid">
    <article className="campaign-post"><header><strong>@odontopersonallite_</strong><span>Exemplo de anúncio</span></header><div className="campaign-post__visual"><img src={reception} alt="Recepção fictícia gerada por IA" width="1122" height="1402" /><div><span>CLÍNICA ODONTO PERSONNALLITE</span><h3>Vamos conversar sobre próteses?</h3><p>Conheça as possibilidades de avaliação profissional.</p><small>Imagem ilustrativa · IA</small></div></div><Link className="campaign-demo__cta" to="/proteses?utm_source=instagram&utm_medium=demo&utm_campaign=protese">Saiba mais sobre próteses →</Link><p className="campaign-post__caption">Solicite informações e consulte a disponibilidade com a equipe.</p></article>
    <article className="campaign-story"><div className="campaign-story__progress" aria-label={`Story ${story + 1} de 3`}>{stories.map((_, index) => <button key={index} aria-label={`Ver story ${index + 1}`} aria-pressed={story === index} onClick={() => setStory(index)} />)}</div><p>Destaque · Próteses</p><img src={room} alt="Consultório fictício gerado por IA" width="1122" height="1402" /><div className="campaign-story__copy" aria-live="polite"><span>0{story + 1} / 03</span><h3>{stories[story][0]}</h3><p>{stories[story][1]}</p></div><Link className="campaign-demo__cta" to="/proteses?utm_source=instagram&utm_medium=demo_story&utm_campaign=protese">Solicitar avaliação no site →</Link><div className="campaign-story__controls"><button disabled={story === 0} onClick={() => setStory(story - 1)}>← Anterior</button><button disabled={story === 2} onClick={() => setStory(story + 1)}>Próximo →</button></div><small>Conteúdo proposto · Ambiente fictício / IA</small></article>
  </div><p>Conteúdo de exemplo → página do serviço → WhatsApp. Você revisa a mensagem antes de enviar.</p></section>
}


