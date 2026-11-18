import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './ProjectFilm.css'

const scenes = [
  { label: 'A proposta', title: 'Uma presença que transmite cuidado.', text: 'Site, Instagram e divulgação local trabalhando juntos para facilitar o contato com a Clínica Odonto Personnallite.', image: '/images/brand/logo.svg', kind: 'brand', caption: 'A identidade atual da clínica, preservada.', items: ['Informação clara', 'Marca consistente', 'Contato acessível'] },
  { label: '01 · Site institucional', title: 'A clínica tem um endereço digital.', text: 'Um espaço para apresentar tratamentos, equipe, localização e contatos, com leitura confortável no celular e no computador.', image: '/images/demo/consultorio-ia.webp', kind: 'photo', caption: 'Imagem ilustrativa gerada por IA. Substituir por foto real autorizada.', items: ['Tratamentos e equipe', 'Localização e dúvidas', 'Contato com a recepção'], link: '/', action: 'Conhecer o site' },
  { label: '02 · Landing pages', title: 'Cada necessidade encontra seu caminho.', text: 'Três páginas no mesmo site. O anúncio leva à página do tratamento correspondente, com informações e chamada para atendimento.', kind: 'pages', items: ['Próteses', 'Urgência em prótese', 'Urgência odontológica'], link: '/proteses', action: 'Explorar a página de próteses' },
  { label: '03 · Instagram', title: 'Um perfil organizado para receber visitas.', text: 'Bio objetiva, links, destaques e conteúdo com a identidade da clínica. Na proposta mensal: quatro posts e até quatro adaptações de Stories.', image: '/images/kit/11-post-modelo.svg', kind: 'art', caption: 'Modelo demonstrativo com a identidade existente.', items: ['Bio e links', 'Capas dos destaques', 'Conteúdo mensal'], link: '/previa-instagram', action: 'Ver a prévia do Instagram' },
  { label: '04 · Kit opcional', title: 'A mesma marca em cada contato.', text: 'Cartão, papelaria e modelos digitais com a logo atual. Finalização do kit: R$ 300 únicos, em duas parcelas de R$ 150.', image: '/images/kit/01-cartao-frente.svg', kind: 'card', caption: 'Aplicação da identidade atual. Impressão contratada à parte.', items: ['Cartão frente e verso', 'Papel timbrado', 'Modelos de posts e Stories'] },
  { label: '05 · Divulgação local', title: 'Do anúncio à conversa.', text: 'Uma campanha local na Meta, com até duas peças mensais, conferência semanal, ajustes e relatório simples. A recepção confirma os horários.', kind: 'flow', items: ['Anúncio', 'Página do tratamento', 'WhatsApp', 'Recepção'], caption: 'Campanhas ainda não ativadas. Agendamentos e resultados não são garantidos.' },
  { label: '06 · Assistente opcional', title: 'Uma recepção digital para orientar.', text: 'Menu de agendamento, tratamentos, localização e recepção. Referência: R$ 600 de implantação + R$ 150/mês; plataforma e mensagens à parte, após cotação.', kind: 'bot', items: ['Pedido de agendamento', 'Informações aprovadas', 'Encaminhamento humano'], caption: 'Simulação sem conexão ao WhatsApp. Não inclui IA ou agenda automática.', link: '/demonstracao-assistente', action: 'Experimentar a simulação' },
  { label: '07 · Investimento', title: 'Serviços e anúncios separados.', text: 'Opção 04 · Divulgação Local. Implantação: site R$ 450 + três landing pages R$ 350 + organização inicial do Instagram R$ 100.', kind: 'money', items: ['R$ 900|Implantação única · 3 × R$ 300', 'R$ 500/mês|Serviços ao prestador', 'R$ 300/mês|Mídia sugerida · paga à Meta'], caption: 'Mensalidade: Instagram R$ 200 + gestão de anúncios R$ 200 + manutenção R$ 100. Até 1 hora mensal de manutenção.' },
  { label: '08 · Operação', title: 'Clareza também na entrega.', text: 'Meses 1 a 3: R$ 1.100/mês com a parcela da implantação. Depois: R$ 800/mês. Total inicial de três meses: R$ 3.300, considerando início conjunto.', kind: 'roles', items: ['Prestador|Finaliza o site, produz conteúdo e acompanha a campanha.', 'Clínica|Aprova materiais, atende interessados e paga fornecedores.'], caption: 'Kit, robô, domínios, impressão e demais fornecedores não entram nesses totais. Contas e domínios em nome da clínica.' },
  { label: '09 · Próximo passo', title: 'Conhecer. Revisar. Começar.', text: 'Confira as demonstrações, ajuste o escopo e revise a proposta. A implantação começa após aceite, materiais e acessos completos.', kind: 'brand', image: '/images/brand/logo.svg', items: ['Validar fotos e dados', 'Definir datas e condições', 'Aprovar a publicação'], caption: 'Previsão inicial: 10 a 15 dias úteis. Revisar a proposta não significa contratar.', link: '/montar-proposta?plano=04', action: 'Revisar a proposta recomendada' },
]

export function ProjectFilm() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(query.matches)
    change(); query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    if (reduced) setPlaying(false)
  }, [reduced])
  useEffect(() => {
    const stop = () => { if (document.hidden) setPlaying(false) }
    document.addEventListener('visibilitychange', stop)
    return () => document.removeEventListener('visibilitychange', stop)
  }, [])
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [playing])
  useEffect(() => {
    if (elapsed < 15) return
    setElapsed(0)
    if (index === scenes.length - 1) setPlaying(false)
    else setIndex(value => value + 1)
  }, [elapsed, index])
  function go(next: number) { setIndex(next); setElapsed(0) }
  const scene = scenes[index]
  return <section className="project-film" id="apresentacao-animada" aria-label="Apresentação animada do projeto">
    <div className="container">
      <div className="project-film__intro"><div><span className="eyebrow">Conheça o projeto em movimento</span><h2>Uma visão completa, cena por cena.</h2></div><p>Você controla o ritmo. Abra os exemplos para conhecer cada entrega.</p></div>
      <div className="project-film__player" onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'ArrowRight') { event.preventDefault(); go(Math.min(index + 1, scenes.length - 1)) }
        if (event.key === 'ArrowLeft') { event.preventDefault(); go(Math.max(index - 1, 0)) }
      }} tabIndex={0} aria-label="Player da apresentação. Use as setas para mudar de cena.">
        <div className="project-film__top"><span>ODONTO PERSONNALLITE</span><span>{String(index + 1).padStart(2, '0')} / {scenes.length}</span></div>
        <article key={index} className={`project-film__scene project-film__scene--${scene.kind}`}>
          <div className="project-film__copy"><span className="project-film__label">{scene.label}</span><h3>{scene.title}</h3><p>{scene.text}</p>{scene.link && <Link className="project-film__link" to={scene.link} target="_blank" rel="noopener noreferrer" onClick={() => setPlaying(false)}>{scene.action} ↗</Link>}</div>
          <div className="project-film__visual">
            {scene.image && <img src={scene.image} alt={scene.kind === 'brand' ? 'Logo da Clínica Odonto Personnallite' : scene.kind === 'photo' ? 'Consultório ilustrativo gerado por IA' : 'Aplicação demonstrativa da marca'} />}
            <ol className="project-film__items">{scene.items.map((item, i) => { const [title, detail] = item.split('|'); return <li key={item} style={{ animationDelay: `${i * 100 + 100}ms` }}><span className="project-film__ordinal">{String(i + 1).padStart(2, '0')}</span><div><strong>{title}</strong>{detail && <span>{detail}</span>}</div></li> })}</ol>
          </div>
          {scene.caption && <p className="project-film__caption">{scene.caption}</p>}
        </article>
        <div className="project-film__track" aria-hidden="true"><span style={{ width: `${((index + elapsed / 15) / scenes.length) * 100}%` }} /></div>
        <div className="project-film__controls"><button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Cena anterior">← <span>Anterior</span></button><button className="project-film__play" onClick={() => { if (!playing && index === scenes.length - 1) go(0); setPlaying(value => !value) }} aria-pressed={playing}>{playing ? 'Ⅱ Pausar' : '▶ Reproduzir'}</button><button onClick={() => go(index + 1)} disabled={index === scenes.length - 1} aria-label="Próxima cena"><span>Próxima</span> →</button></div>
      </div>
      <nav className="project-film__chapters" aria-label="Cenas da apresentação">{scenes.map((item, i) => <button key={item.label} onClick={() => go(i)} aria-current={index === i ? 'step' : undefined}>{item.label}</button>)}</nav>
      <p className="project-film__hint" role="status" aria-live="polite">Cena {index + 1} de {scenes.length}: {scene.label}.{playing ? ' Reprodução automática: 15 segundos por cena.' : ' Apresentação pausada. Navegue no seu ritmo.'}{reduced ? ' Efeitos de movimento reduzidos conforme sua preferência.' : ''}</p>
    </div>
  </section>
}
