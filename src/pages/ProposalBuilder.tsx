import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './ProposalBuilder.css'
import { ProposalComparison } from './ProposalComparison'
import { proposalPlans } from '../content/proposalPlans'

const services = [
  {id:'site',title:'Site institucional',price:450,cycle:'once',text:'Finalização do site existente, adaptação para celular, contatos e uma revisão consolidada.',example:'A pessoa conhece a clínica e encontra os canais de atendimento.',link:'/'},
  {id:'landings',title:'Três landing pages',price:350,cycle:'once',text:'Próteses, urgência em prótese e urgência odontológica. Usa a estrutura do site, incluída ao marcar esta opção.',example:'Anúncio de próteses direcionado à página desse tratamento.',link:'/proteses'},
  {id:'setup',title:'Organização inicial dos canais',price:100,cycle:'once',text:'Bio, links e destaques existentes do Instagram, com orientação básica do WhatsApp.',example:'Perfil organizado com chamada para solicitar atendimento.',link:'/previa-instagram'},
  {id:'instagram',title:'Gestão do Instagram',price:200,cycle:'monthly',text:'Quatro posts e até quatro adaptações para Stories por mês. Uma rodada de ajustes por peça.',example:'Calendário mensal com conteúdos aprovados pela clínica.',link:'/previa-instagram'},
  {id:'ads',title:'Gestão de uma campanha Meta',price:200,cycle:'monthly',text:'Até duas peças/adaptações mensais, conferência semanal, ajustes e relatório simples. A verba da Meta é separada.',example:'Campanha local levando à landing page ou ao WhatsApp.',link:'/apresentacao-cliente#trafego'},
  {id:'maintenance',title:'Manutenção do site',price:100,cycle:'monthly',text:'Até uma hora mensal não acumulativa para pequenas mudanças de textos, fotos, horários e links.',example:'Atualizar o horário de atendimento e conferir o contato.',link:'/'},
  {id:'kit',title:'Kit de comunicação',price:300,cycle:'once',text:'Papelaria, três modelos de posts, Stories e boas-vindas. Preserva a logo atual; impressão separada.',example:'Cartão e modelos reutilizáveis para a mesma marca.',link:'/apresentacao-cliente#kit-comunicacao'},
] as const
type ServiceId = typeof services[number]['id']
const localPlan: ServiceId[] = ['site','landings','setup','instagram','ads','maintenance']
const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value)

const draftKey = 'personnallite-proposal-v1'
const goalOptions = ['Apresentar melhor a clínica','Divulgar um tratamento','Organizar o Instagram','Facilitar o atendimento','Preparar materiais da marca']
function readDraft() {
  if(new URLSearchParams(window.location.search).get('plano')==='04') return {selected:[...localPlan],goals:[] as string[],media:300,robot:false,expanded:false}
  try {
    const data = JSON.parse(localStorage.getItem(draftKey) || 'null')
    const selected: ServiceId[] = Array.isArray(data?.selected) ? services.filter(s=>data.selected.includes(s.id)).map(s=>s.id) : []
    if(selected.includes('landings') && !selected.includes('site')) selected.push('site')
    return { selected, goals: goalOptions.filter(g=>Array.isArray(data?.goals)&&data.goals.includes(g)), media: [300,450,600,900].includes(data?.media)?Number(data.media):300, robot: data?.robot===true, expanded: data?.expanded===true }
  } catch { return { selected: [] as ServiceId[], goals: [] as string[], media: 300, robot: false, expanded: false } }
}
export function ProposalBuilder() {
  const [draft] = useState(readDraft)
  const [step,setStep] = useState(()=>new URLSearchParams(window.location.search).get('plano')==='04'?3:0)
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const stages = ['Objetivos','Serviços','Anúncios e extras','Revisar proposta']
  function goTo(next:number) { setStep(next); requestAnimationFrame(()=>stepHeading.current?.focus()) }
  function saveDraft() {
    try { localStorage.setItem(draftKey,JSON.stringify({selected,goals,media,robot,expanded}));setNotice('Rascunho salvo somente neste navegador. Você pode continuar depois.') }
    catch { setNotice('Não foi possível salvar neste navegador. Baixe o resumo para guardar as escolhas.') }
  }
  const [selected,setSelected]=useState<ServiceId[]>(draft.selected)
  const [goals,setGoals]=useState<string[]>(draft.goals)
  const [media,setMedia]=useState(draft.media)
  const [robot,setRobot]=useState(draft.robot)
  const [expanded,setExpanded]=useState(draft.expanded)
  const catalog=services.map(s=>expanded&&s.id==='instagram'?{...s,title:'Gestão ampliada do Instagram',price:350,text:'Oito posts e até oito adaptações para Stories por mês. Uma rodada de ajustes por peça.'}:expanded&&s.id==='ads'?{...s,title:'Gestão de até duas campanhas Meta',price:350,text:'Até quatro peças/adaptações mensais, conferência semanal, ajustes e relatório simples. Verba da Meta separada.'}:s)
  function choosePlan(number:string) {
    const plan=proposalPlans.find(p=>p.number===number)
    if(!plan) return
    setSelected([...plan.services]);setExpanded(number==='05');setMedia(plan.media||300);setRobot(false);goTo(1)
    setNotice(`Opção ${number} aplicada. Revise as entregas; kit e assistente continuam separados.`)
  }
  const [notice,setNotice]=useState('')
  const chosen=catalog.filter(s=>selected.includes(s.id))
  const initial=chosen.filter(s=>s.cycle==='once'&&s.id!=='kit').reduce((sum,s)=>sum+s.price,0)
  const kit=selected.includes('kit')?300:0
  const monthly=chosen.filter(s=>s.cycle==='monthly').reduce((sum,s)=>sum+s.price,0)
  const ads=selected.includes('ads')
  const budget=ads?media:0
  const firstMonths=monthly+budget+initial/3
  function toggle(id:ServiceId) {
    setNotice('')
    setSelected(current=>{
      if(current.includes(id)) return id==='site'?current.filter(s=>s!=='site'&&s!=='landings'):current.filter(s=>s!==id)
      return id==='landings'?Array.from(new Set<ServiceId>([...current,'site','landings'])):[...current,id]
    })
  }
  function summary() {
    return ['CLÍNICA ODONTO PERSONNALLITE - SELEÇÃO PRELIMINAR','Não é contratação, pagamento ou agendamento.',`Objetivos: ${goals.join('; ')||'Não informados'}`,'',...chosen.map(s=>`${s.title}: ${money(s.price)} ${s.cycle==='once'?'únicos':'por mês'}`),'',`Implantação: ${money(initial)}. Sugestão: 3 parcelas de aproximadamente ${money(initial/3)}; ajustar centavos no aceite.`,`Kit opcional: ${money(kit)} únicos; se marcado, sugestão de 2 parcelas de ${money(kit/2)}.`,`Serviços mensais: ${money(monthly)}.`,`Verba Meta: ${money(budget)}/mês, paga diretamente pela clínica.`,`Operação após implantação: ${money(monthly+budget)}/mês.`,`Meses 1 a 3 com parcela da implantação, sem kit/robô/terceiros: aproximadamente ${money(firstMonths)}/mês.`,`Total de 3 meses com implantação, serviços, mídia e kit selecionado: ${money(initial+3*(monthly+budget)+kit)}.`,robot?'Assistente: interesse em cotação. Referência R$ 600 únicos + R$ 150/mês, mais plataforma e mensagens. NÃO incluído nos totais.':'Assistente: não selecionado.','Domínios, hospedagem paga se necessária, impressão e demais fornecedores não incluídos.','A clínica aprova materiais, atende interessados e confirma consultas.','Serviços sujeitos ao aceite, acessos e validação. Sem garantia de pacientes.'].join('\n')
  }
  function download() {
    const url=URL.createObjectURL(new Blob([summary()],{type:'text/plain;charset=utf-8'}))
    const a=document.createElement('a');a.href=url;a.download='minha-selecao-odonto-personnallite.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Resumo baixado. Envie ao prestador pelo canal combinado, se desejar.')
  }
  return <div className="proposal-builder"><section className="proposal-builder__hero"><div className="container"><span className="eyebrow">Questionário da proposta</span><h1>Escolha. Compare.<br/>Monte seu próximo passo.</h1><p>Marque os serviços e acompanhe o investimento. As escolhas são uma simulação, não uma contratação. Nada é enviado automaticamente. Você pode salvar um rascunho neste navegador para continuar depois.</p><div className="page-actions"><button className="button button--primary" onClick={()=>{setSelected([...localPlan]);setExpanded(false);setMedia(300);setRobot(false);goTo(1);setNotice('Opção 04 aplicada. O kit não está incluído; pode ser marcado à parte.')}}>Preencher com a opção 04</button><Link className="button button--ghost" to="/apresentacao-cliente">Apresentação do projeto ↗</Link></div></div></section>
  <div className="container"><ProposalComparison onChoose={choosePlan}/></div>
  <div className="container proposal-builder__steps"><nav aria-label="Etapas da proposta">{stages.map((label,index)=><button key={label} aria-current={step===index?'step':undefined} onClick={()=>goTo(index)}><span>{index+1}</span>{label}</button>)}</nav><div className="proposal-builder__progress" role="progressbar" aria-label="Etapa atual" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step+1}><span style={{width:`${(step+1)*25}%`}} /></div></div>
  <div className="container proposal-builder__layout"><div><h2 className="proposal-builder__step-title" ref={stepHeading} tabIndex={-1}>Etapa {step+1} de 4 · {stages[step]}</h2>
    <fieldset className="proposal-builder__panel" hidden={step!==0}><legend>1. O que a clínica quer melhorar?</legend><p>As respostas ajudam na conversa; não alteram os preços.</p>{goalOptions.map(goal=><label className="proposal-builder__goal" key={goal}><input type="checkbox" checked={goals.includes(goal)} onChange={()=>setGoals(current=>current.includes(goal)?current.filter(g=>g!==goal):[...current,goal])}/>{goal}</label>)}</fieldset>
    <fieldset className="proposal-builder__panel" hidden={step!==1}><legend>2. Escolha as entregas</legend><p>Você pode abrir os exemplos antes de marcar. Landing pages usam o site: ao selecioná-las, o site também será incluído.</p>{catalog.map(s=><article className={`proposal-builder__service ${selected.includes(s.id)?'is-selected':''}`} key={s.id}><label><input type="checkbox" checked={selected.includes(s.id)} onChange={()=>toggle(s.id)}/><span><strong>{s.title}</strong><small className="proposal-builder__selected-label">{selected.includes(s.id)?'✓ Incluído na seleção':'Adicionar à proposta'}</small><b>{money(s.price)} {s.cycle==='once'?'· pagamento único':'/ mês'}</b></span></label><p>{s.text}</p><small>{s.example}</small><Link to={s.link} target="_blank" rel="noopener noreferrer">Ver exemplo em nova aba ↗</Link></article>)}</fieldset>
    <fieldset className="proposal-builder__panel" hidden={step!==2}><legend>3. Orçamento dos anúncios</legend>{ads?<><label htmlFor="media-budget">Verba mensal paga diretamente à Meta</label><select id="media-budget" value={media} onChange={e=>setMedia(Number(e.target.value))}>{[300,450,600,900].map(v=><option value={v} key={v}>{money(v)}/mês</option>)}</select><p>Essa verba não é remuneração do prestador. Aumentar o orçamento não aumenta automaticamente o número de campanhas ou peças. Ativação depende de aprovação e conta da clínica.</p></>:<p>Marque a gestão de anúncios na etapa Serviços para incluir verba de anúncios nesta simulação. Nenhuma verba está sendo somada agora.</p>}</fieldset>
    <fieldset className="proposal-builder__panel" hidden={step!==2}><legend>4. Interesse no assistente virtual?</legend><label className="proposal-builder__goal"><input type="checkbox" checked={robot} onChange={e=>setRobot(e.target.checked)}/>Quero receber uma cotação do assistente</label><p>Referência preliminar: R$ 600 de implantação + R$ 150/mês, além de plataforma e mensagens a cotar. <strong>Não entra nos totais</strong> até validar a tecnologia e aprovar orçamento próprio.</p><Link to="/demonstracao-assistente" target="_blank" rel="noopener noreferrer">Experimentar a demonstração ↗</Link></fieldset>
    {step===3&&<section className="proposal-builder__panel proposal-builder__review"><span className="eyebrow">Revisão final · sem contratação automática</span><h3>Confira as entregas escolhidas</h3>{chosen.length?<ul>{chosen.map(s=><li key={s.id}><strong>{s.title}</strong><span>{money(s.price)} {s.cycle==='once'?'únicos':'/mês'}</span><p>{s.text}</p></li>)}</ul>:<p>Nenhum serviço marcado. Volte à etapa 2 para escolher ou use a opção recomendada.</p>}<h3>O que falta para iniciar</h3><p>Confirmar dados da clínica, fotos autorizadas, acessos, cadastro das partes e datas de pagamento. A publicação e os anúncios dependem de aprovação.</p><p><strong>Condições a formalizar:</strong> validade comercial, vencimentos, cancelamento e prazo de atendimento. Nenhum aceite é registrado por este questionário.</p><a href="/propostas/projeto-comercial-odonto-personnallite.pdf" target="_blank" rel="noopener noreferrer">Ler o projeto completo em PDF ↗</a></section>}
    <div className="proposal-builder__navigation">{step>0&&<button onClick={()=>goTo(step-1)}>← Voltar</button>}{step<3&&<button onClick={()=>goTo(step+1)}>Continuar →</button>}</div>
  </div><aside className="proposal-builder__summary" aria-labelledby="selection-title"><span className="eyebrow">Investimento transparente</span><h2 id="selection-title" tabIndex={-1}>Sua seleção</h2><div aria-live="polite" aria-atomic="true"><p>{chosen.length} serviços selecionados</p><dl><div><dt>Implantação, única</dt><dd>{money(initial)}</dd></div><div><dt>Kit opcional, único</dt><dd>{money(kit)}</dd></div><div><dt>Seu prestador · serviços/mês</dt><dd>{money(monthly)}</dd></div><div><dt>Meta · pagamento direto</dt><dd>{money(budget)}/mês</dd></div><div className="proposal-builder__total"><dt>Operação mensal</dt><dd>{money(monthly+budget)}</dd></div></dl><p>Meses 1 a 3 com a implantação em três parcelas: <strong>aprox. {money(firstMonths)}/mês</strong>, sem parcelas do kit, robô ou terceiros.</p>{kit>0&&<p>Kit: +2 parcelas de R$ 150, separadas.</p>}<p>Total de três meses com implantação e kit selecionados, serviços e mídia: <strong>{money(initial+kit+3*(monthly+budget))}</strong>.</p>{robot&&<p className="proposal-builder__warning">Assistente marcado para cotação, fora dos totais.</p>}</div><p className="proposal-builder__fine">Considera início conjunto dos serviços. Ajustar parcelas e datas no aceite. Domínios, outros fornecedores e impostos/retenções aplicáveis devem ser esclarecidos à parte. Capas já preparadas não são cobradas duas vezes.</p><div className="proposal-builder__actions"><button onClick={saveDraft}>Salvar rascunho neste navegador</button><button disabled={!chosen.length&&!robot} onClick={download}>Baixar resumo das escolhas</button><button disabled={!chosen.length&&!robot} onClick={()=>window.print()}>Imprimir / salvar em PDF</button><button onClick={()=>{setSelected([]);setGoals([]);setRobot(false);setExpanded(false);setMedia(300);try { localStorage.removeItem(draftKey) } catch { /* Storage may be unavailable. */ } setNotice('Seleção e rascunho limpos.');goTo(0)}}>Limpar seleção</button></div><p className="proposal-builder__notice" role="status">{notice}</p><p className="proposal-builder__fine">Depois, compartilhe o resumo com o prestador para revisar e formalizar. O rascunho contém apenas escolhas de serviços e objetivos, salvo localmente ao clicar em salvar. Não há envio, pagamento ou contratação automática.</p></aside></div><div className="proposal-builder__mobile-summary"><div><span>Operação mensal</span><strong>{money(monthly+budget)}</strong><small>Implantação: {money(initial)} à parte</small></div><a href="#selection-title">Ver resumo ↑</a></div></div>
}
