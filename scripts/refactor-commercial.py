from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1]
p=root/'src/pages/ProposalBuilder.tsx'
s=p.read_text(encoding='utf-8').replace("import { useState }", "import { useRef, useState }")
s=s.replace('export function ProposalBuilder() {', '''const draftKey = 'personnallite-proposal-v1'
const goalOptions = ['Apresentar melhor a clínica','Divulgar um tratamento','Organizar o Instagram','Facilitar o atendimento','Preparar materiais da marca']
function readDraft() {
  try {
    const data = JSON.parse(localStorage.getItem(draftKey) || 'null')
    const selected: ServiceId[] = Array.isArray(data?.selected) ? services.filter(s=>data.selected.includes(s.id)).map(s=>s.id) : []
    if(selected.includes('landings') && !selected.includes('site')) selected.push('site')
    return { selected, goals: goalOptions.filter(g=>Array.isArray(data?.goals)&&data.goals.includes(g)), media: [300,450,600,900].includes(data?.media)?Number(data.media):300, robot: data?.robot===true }
  } catch { return { selected: [] as ServiceId[], goals: [] as string[], media: 300, robot: false } }
}
export function ProposalBuilder() {
  const [draft] = useState(readDraft)
  const [step,setStep] = useState(0)
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const stages = ['Objetivos','Serviços','Anúncios e extras','Revisar proposta']
  function goTo(next:number) { setStep(next); requestAnimationFrame(()=>stepHeading.current?.focus()) }
  function saveDraft() {
    try { localStorage.setItem(draftKey,JSON.stringify({selected,goals,media,robot}));setNotice('Rascunho salvo somente neste navegador. Você pode continuar depois.') }
    catch { setNotice('Não foi possível salvar neste navegador. Baixe o resumo para guardar as escolhas.') }
  }''')
s=s.replace('useState<ServiceId[]>([])','useState<ServiceId[]>(draft.selected)').replace('useState<string[]>([])','useState<string[]>(draft.goals)').replace('useState(300)','useState(draft.media)').replace('useState(false)','useState(draft.robot)')
s=s.replace('Nada é enviado automaticamente ou salvo ao sair da página.','Nada é enviado automaticamente. Você pode salvar um rascunho neste navegador para continuar depois.')
s=s.replace("setSelected([...localPlan]);setMedia(300);setRobot(false);setNotice", "setSelected([...localPlan]);setMedia(300);setRobot(false);goTo(1);setNotice")
s=s.replace('Preencher com a opção 04</button>','Preencher com a opção 04</button>')
s=s.replace('<div className="container proposal-builder__layout"><div>', '''<div className="container proposal-builder__steps"><nav aria-label="Etapas da proposta">{stages.map((label,index)=><button key={label} aria-current={step===index?'step':undefined} onClick={()=>goTo(index)}><span>{index+1}</span>{label}</button>)}</nav><div className="proposal-builder__progress" role="progressbar" aria-label="Etapa atual" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step+1}><span style={{width:`${(step+1)*25}%`}} /></div></div>
  <div className="container proposal-builder__layout"><div><h2 className="proposal-builder__step-title" ref={stepHeading} tabIndex={-1}>Etapa {step+1} de 4 · {stages[step]}</h2>''')
for title,step in [('1. O que a clínica quer melhorar?',0),('2. Escolha as entregas',1),('3. Orçamento dos anúncios',2),('4. Interesse no assistente virtual?',2)]:
    s=s.replace(f'<fieldset className="proposal-builder__panel"><legend>{title}',f'<fieldset className="proposal-builder__panel" hidden={{step!=={step}}}><legend>{title}')
s=s.replace("['Apresentar melhor a clínica','Divulgar um tratamento','Organizar o Instagram','Facilitar o atendimento','Preparar materiais da marca'].map",'goalOptions.map')
s=s.replace('</fieldset>\n  </div><aside', '''</fieldset>
    {step===3&&<section className="proposal-builder__panel proposal-builder__review"><h3>Confira as entregas escolhidas</h3>{chosen.length?<ul>{chosen.map(s=><li key={s.id}><strong>{s.title}</strong><span>{money(s.price)} {s.cycle==='once'?'únicos':'/mês'}</span><p>{s.text}</p></li>)}</ul>:<p>Nenhum serviço marcado. Volte à etapa 2 para escolher ou use a opção recomendada.</p>}<h3>O que falta para iniciar</h3><p>Confirmar dados da clínica, fotos autorizadas, acessos, cadastro das partes e datas de pagamento. A publicação e os anúncios dependem de aprovação.</p><p><strong>Condições a formalizar:</strong> validade comercial, vencimentos, cancelamento e prazo de atendimento. Nenhum aceite é registrado por este questionário.</p><a href="/propostas/projeto-comercial-odonto-personnallite.pdf" target="_blank" rel="noopener noreferrer">Ler o projeto completo em PDF ↗</a></section>}
    <div className="proposal-builder__navigation">{step>0&&<button onClick={()=>goTo(step-1)}>← Voltar</button>}{step<3&&<button onClick={()=>goTo(step+1)}>Continuar →</button>}</div>
  </div><aside''')
s=s.replace('<h2 id="selection-title">Sua seleção</h2>','<span className="eyebrow">Investimento transparente</span><h2 id="selection-title">Sua seleção</h2>')
s=s.replace('<dt>Serviços mensais</dt>','<dt>Seu prestador · serviços/mês</dt>').replace('<dt>Meta, diretamente</dt>','<dt>Meta · pagamento direto</dt>')
s=s.replace('<div className="proposal-builder__actions">','<div className="proposal-builder__actions"><button onClick={saveDraft}>Salvar rascunho neste navegador</button>')
s=s.replace("setNotice('Seleção limpa.')", "try { localStorage.removeItem(draftKey) } catch { /* Storage may be unavailable. */ } setNotice('Seleção e rascunho limpos.');goTo(0)")
s=s.replace('Este questionário não envia dados, não realiza pagamento e não garante resultados.','O rascunho contém apenas escolhas de serviços e objetivos, salvo localmente ao clicar em salvar. Não há envio, pagamento ou contratação automática.')
p.write_text(s,encoding='utf-8')
p=root/'src/components/layout/Header.tsx';s=p.read_text(encoding='utf-8').replace("{ NavLink }","{ NavLink, useLocation }")
s=s.replace('export function Header() {',"export function Header() {\n  const { pathname } = useLocation()\n  const isProject = ['/apresentacao-cliente','/montar-proposta','/projeto','/previa-instagram'].includes(pathname)")
s=s.replace('      <nav className="project-menu container"','      {isProject ? <nav className="project-menu container"')
s=s.replace('Montar proposta · questionário →</NavLink></nav>','Montar proposta · questionário →</NavLink><a href="/propostas/projeto-comercial-odonto-personnallite.pdf" target="_blank" rel="noopener noreferrer">Projeto em PDF ↗</a></nav> : <div className="project-entry container"><NavLink to="/apresentacao-cliente">Apresentação do projeto ↗</NavLink></div>}')
p.write_text(s,encoding='utf-8')
p=root/'src/pages/ProjectOverview.tsx';s=p.read_text(encoding='utf-8')
s=s.replace('<a className="button button--ghost" href="#investimento">Ver investimento</a>','<Link className="button button--ghost" to="/montar-proposta">Escolher serviços e ver valores →</Link>')
s=s.replace('    <section className="section--tight" id="visao-geral">','''    <section className="section--tight project-recommendation"><div className="container"><span className="eyebrow">Recomendação para começar · Opção 04</span><h2 className="title">Divulgação Local</h2><p>Site e três landing pages, organização inicial dos canais, Instagram mensal, uma campanha Meta e manutenção. Um escopo definido para testar a divulgação e acompanhar o atendimento.</p><div className="project-financial-cards"><article><span>Uma vez · implantação</span><strong>R$ 900</strong><p>3 parcelas de R$ 300 ao prestador.</p></article><article><span>Por mês · seus serviços</span><strong>R$ 500</strong><p>Instagram R$ 200 + anúncios R$ 200 + manutenção R$ 100.</p></article><article><span>Por mês · à Meta</span><strong>R$ 300</strong><p>Verba sugerida de teste, paga pela clínica.</p></article></div><p><strong>R$ 800/mês de operação.</strong> Meses 1 a 3: R$ 1.100/mês com a parcela da implantação. Kit, robô e fornecedores separados.</p><Link className="button button--primary" to="/montar-proposta">Personalizar minha seleção →</Link><p className="project-caption">Escopo e valores propostos para aprovação. Contas e domínios ficam em nome da clínica.</p></div></section>
    <section className="section--tight" id="visao-geral">''')
s=s.replace('/propostas/opcao-04-divulgacao-local-proposta-final.pdf','/propostas/projeto-comercial-odonto-personnallite.pdf').replace('Abrir proposta principal em PDF','Abrir projeto completo · 5 opções em PDF')
s=s.replace('    <section className="project-closing">','''    <section className="section--tight"><div className="container"><span className="eyebrow">Acompanhamento mensal</span><h2 className="title">O relatório conecta divulgação e atendimento.</h2><p>O prestador acompanha os anúncios. A recepção informa o que aconteceu depois do contato. Sem esses retornos, não é possível atribuir agendamentos aos anúncios com confiança.</p><div className="project-overview__table"><table><caption>Modelo de relatório · sem resultados fictícios</caption><thead><tr><th>Indicador</th><th>Origem</th><th>Registro</th></tr></thead><tbody>{[['Investimento em mídia','Conta Meta da clínica','Valor efetivamente veiculado'],['Cliques e contatos mensuráveis','Relatório da plataforma','Somente dados disponíveis'],['Consultas marcadas','Retorno da recepção','Total informado pela clínica'],['Comparecimentos','Retorno da recepção','Total informado pela clínica'],['Próximo ajuste','Análise conjunta','Ação e responsável']].map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th key={i} scope="row">{cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div><p className="project-caption">A apresentação é comercial e pública; não é uma área restrita. Para dados de pacientes ou contratos privados, será necessário outro ambiente com controle de acesso.</p></div></section>
    <section className="project-closing">''')
p.write_text(s,encoding='utf-8')
pdf=root/'output/pdf/projeto-comercial-odonto-personnallite.pdf'
shutil.copyfile(pdf,root/'public/propostas/projeto-comercial-odonto-personnallite.pdf')
