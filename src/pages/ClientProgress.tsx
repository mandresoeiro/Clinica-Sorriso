import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './ClientProgress.css'

type Status = 'done' | 'ready' | 'pending' | 'later'
type Task = { title: string; status: Status; note?: string; owner?: string }
type Group = { id: string; title: string; description: string; items: Task[] }
const labels: Record<Status, string> = { done: 'Concluído', ready: 'Preparado', pending: 'Pendente', later: 'Para depois' }
const groups: Group[] = [
  { id: 'site', title: 'Site e páginas de atendimento', description: 'A presença digital já está disponível para revisão da clínica.', items: [
    { title: 'Domínio e site publicados', status: 'done', note: 'Site principal em odontopersonnallite.com.br, com conexão HTTPS.' },
    { title: 'Duas landing pages publicadas', status: 'done', note: 'Atendimento Humanizado e Urgência em Prótese e Implante.' },
    { title: 'Contato e localização revisados', status: 'done', note: 'WhatsApp (91) 98188-8353 e Travessa Almirante Wandenkolk, 1243, Belém/PA.' },
    { title: 'Informações e textos atualizados', status: 'done', note: 'Responsável técnica informada: Dra. Sônia Almeida — CRO-PA 2638. Atendimento mediante agendamento; sem horários fixos inventados.' },
    { title: 'Aprovação final do conteúdo', status: 'pending', owner: 'Clínica', note: 'Reunir as observações e validar textos e demais dados profissionais antes de ampliar a apresentação da equipe.' },
  ] },
  { id: 'atendimento', title: 'Central de atendimento', description: 'Uma fila organizada para a equipe acompanhar cada próximo passo.', items: [
    { title: 'Painel com acesso protegido', status: 'done', note: 'O painel exige acesso autorizado. Esta página de acompanhamento é pública.' },
    { title: 'Perfis e visual personalizados', status: 'done', note: 'Rosiane, Nayra e Apoio da clínica, com cores suaves, foto cadastrada ou iniciais e botão Trocar pessoa.' },
    { title: 'Divisão dos contatos', status: 'done', note: 'Minha fila, Contatos livres e Assumir contato. Duas tentativas simultâneas não atribuem o mesmo contato livre a duas pessoas.' },
    { title: 'Cadastro, busca e acompanhamento', status: 'done', note: 'Cadastro manual, filtros, situação do contato, responsável, retornos e lembretes.' },
    { title: 'Agenda com verificação de conflitos', status: 'done', note: 'Profissional, data, horário e duração; bloqueio de sobreposição do mesmo profissional.' },
    { title: 'Histórico e proteção das alterações', status: 'done', note: 'Histórico, aviso antes de descartar alterações e lixeira reversível. Restaurar um contato não reativa uma reserva cancelada.' },
    { title: 'Relatórios e uso no celular', status: 'done', note: 'Relatórios disponíveis ao acesso administrativo e visual adaptado a telas menores.' },
  ] },
  { id: 'equipe', title: 'Treinamento e rotina', description: 'O sistema está preparado; a equipe precisa praticar o fluxo combinado.', items: [
    { title: 'Guia e roteiro de ligação preparados', status: 'done', note: 'Passo a passo disponível no Guia rápido do painel e material de apoio para o treinamento.' },
    { title: 'Treinar Rosiane, Nayra e apoio', status: 'pending', owner: 'Equipe + clínica', note: 'Praticar assumir contato, retorno, agendamento, cancelamento e transferência, em demonstração com dados fictícios.' },
    { title: 'Combinar responsabilidades da operação', status: 'pending', owner: 'Clínica', note: 'Definir quem recebe os códigos de acesso, coordena transferências e organiza novas tentativas de contato.' },
  ] },
  { id: 'privacidade', title: 'Privacidade e dados oficiais', description: 'O aviso técnico foi revisado. As definições da clínica continuam necessárias.', items: [
    { title: 'Aviso de privacidade revisado', status: 'done', note: 'Explica os formulários, o encaminhamento de solicitações e a diferença entre lixeira e eliminação definitiva.' },
    { title: 'Medição com consentimento', status: 'done', note: 'Análise opcional nas landing pages; os campos pessoais do formulário não são enviados à ferramenta de análise.' },
    { title: 'Confirmar razão social e CNPJ', status: 'pending', owner: 'Clínica', note: 'Enviar os dados oficiais pelo canal combinado com o responsável pelo projeto; esta página não coleta documentos.' },
    { title: 'Definir responsável e conservação', status: 'pending', owner: 'Clínica', note: 'Confirmar o responsável por solicitações de privacidade e aprovar prazo e critérios de conservação dos contatos.' },
    { title: 'Completar os registros profissionais', status: 'pending', owner: 'Clínica', note: 'Confirmar a UF do registro informado da ASB e os dados completos dos profissionais que serão apresentados publicamente.' },
  ] },
  { id: 'backup', title: 'Cópias protegidas', description: 'Preparação concluída não significa que a cópia automática já esteja ativa.', items: [
    { title: 'Destino privado preparado', status: 'done', note: 'Pasta privada criada no Drive da clínica.' },
    { title: 'Criptografia e recuperação testadas', status: 'done', note: 'Testes realizados com dados fictícios, sem exportar contatos reais.' },
    { title: 'Rotina diária preparada', status: 'ready', note: 'Cópia diária e janela de 30 dias preparadas no código. Ainda sem agendamento ativo.' },
    { title: 'Autorizar e ativar o backup', status: 'pending', owner: 'Clínica + integração', note: 'Autorizar o acesso persistente, guardar a chave com segurança e verificar a primeira cópia real e sua recuperação.' },
  ] },
  { id: 'anuncios', title: 'Medição e divulgação', description: 'A campanha depende de configuração final e aprovação antes da ativação.', items: [
    { title: 'Eventos de medição preparados e testados', status: 'done', note: 'Visita, cadastro concluído e abertura do WhatsApp nas duas landing pages. Clique não comprova conversa ou consulta.' },
    { title: 'Configuração inicial dos anúncios', status: 'ready', note: 'Preparação realizada. Nenhum anúncio foi ativado nesta entrega.' },
    { title: 'Concluir as conversões do Google Ads', status: 'pending', owner: 'Integração', note: 'Conferir vínculo, importar os eventos e validar as ações na conta autenticada.' },
    { title: 'Concluir pagamento e aprovação da campanha', status: 'pending', owner: 'Clínica', note: 'Confirmar responsável pelo pagamento, anúncio, região, investimento e período. Não enviar dados de cartão por esta página.' },
    { title: 'Retomar a verificação das cotas', status: 'pending', owner: 'Integração', note: 'O monitor foi configurado, mas a última tentativa ficou sem sessão autenticada para medir o consumo atual.' },
  ] },
  { id: 'fotos', title: 'Fotos reais — etapa posterior', description: 'Adiado por decisão da clínica. As imagens atuais continuam identificadas como ilustrativas.', items: [
    { title: 'Fachada, recepção e consultórios', status: 'later', owner: 'Clínica', note: 'Produzir e autorizar o material real.' },
    { title: 'Fotos dos profissionais e do atendimento', status: 'later', owner: 'Clínica', note: 'Reunir fotos autorizadas da equipe.' },
    { title: 'Substituição das imagens ilustrativas', status: 'later', owner: 'Projeto', note: 'Atualizar quando o material real estiver disponível e aprovado.' },
  ] },
]
const tasks = groups.flatMap(group => group.items)
type Filter = 'all' | 'done' | 'pending' | 'later'
const filters: [Filter, string][] = [['all', 'Tudo'], ['done', 'Concluído'], ['pending', 'Pendências'], ['later', 'Para depois']]
const matches = (task: Task, filter: Filter) => filter === 'all' || (filter === 'pending' ? ['ready', 'pending'].includes(task.status) : task.status === filter)
const destinations = [
  { title: 'Site da clínica', note: 'Informações, tratamentos e contato.', href: '/', number: '01' },
  { title: 'Atendimento Humanizado', note: 'Página de captação e solicitação de retorno.', href: '/tratamento-humanizado/', number: '02' },
  { title: 'Urgência em Prótese e Implante', note: 'Página de atendimento com disponibilidade a confirmar.', href: '/urgencia-protese-implante/', number: '03' },
  { title: 'Central de atendimento', note: 'Requer e-mail autorizado para entrar.', href: '/tratamento-humanizado/painel/', number: '04' },
]

function Mark({ status }: { status: Status }) {
  return <span className={`cp-mark cp-mark-${status}`} aria-hidden="true">{status === 'done' ? <svg viewBox="0 0 24 24" fill="none"><path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : status === 'later' ? '↗' : '·'}</span>
}

export function ClientProgress() {
  const [filter, setFilter] = useState<Filter>('all')
  const [message, setMessage] = useState('')
  const done = tasks.filter(task => task.status === 'done').length
  const later = tasks.filter(task => task.status === 'later').length
  const pending = tasks.length - done - later
  const visible = tasks.filter(task => matches(task, filter)).length
  useEffect(() => { const previous = document.title; document.title = 'Entrega do projeto | Odonto Personnallite'; return () => { document.title = previous } }, [])
  async function copyLink() {
    const url = new URL('/acompanhamento', window.location.origin).href
    try { await navigator.clipboard.writeText(url); setMessage('Link copiado. Você já pode compartilhar.') }
    catch { setMessage('Copie este endereço: ' + url) }
  }
  return <main className="client-progress">
    <a className="cp-skip" href="#checklist">Pular para o checklist</a>
    <header className="cp-header"><Link to="/" className="cp-brand"><img src="/images/brand/symbol.svg" alt="" width="34" height="42" /><span>Odonto Personnallite<small>ACOMPANHAMENTO DA ENTREGA</small></span></Link><div className="cp-header-end"><span className="cp-updated">Atualizado em <strong>24/10/2026</strong></span><button type="button" onClick={() => window.print()}>Imprimir checklist</button></div></header>
    <div className="cp-body">
      <section className="cp-intro"><div><p className="cp-eyebrow">Clareza em cada etapa</p><h1>O que já está pronto.<br /><em>O que falta decidir.</em></h1><p className="cp-lead">Site, páginas de atendimento e central da equipe: acompanhe a entrega e os próximos passos da clínica em um só lugar.</p><div className="cp-hero-actions"><a href="#links" className="cp-primary">Conhecer as páginas <span aria-hidden="true">↗</span></a><button type="button" onClick={copyLink}>Copiar este link</button></div><p className="cp-copy-feedback" role="status">{message}</p></div><aside className="cp-summary" aria-label="Resumo dos itens"><span className="cp-summary-label">SITUAÇÃO DO CHECKLIST</span><div className="cp-summary-main"><strong>{done}</strong><span>itens<br />concluídos</span></div><div className="cp-summary-pair"><div><strong>{pending}</strong><span>para concluir</span></div><div><strong>{later}</strong><span>para depois</span></div></div><p>O site está publicado. Backup automático e ativação de campanha ainda dependem das etapas abaixo.</p></aside></section>
      <nav className="cp-nav" aria-label="Navegação do acompanhamento"><a href="#proximos-passos">Próximos passos</a><a href="#checklist">Checklist completo</a><a href="#links">Páginas do projeto</a></nav>
      <section className="cp-next" id="proximos-passos" aria-labelledby="cp-next-title"><div><p className="cp-eyebrow">A próxima etapa</p><h2 id="cp-next-title">Preparar a equipe.<br />Concluir as autorizações.</h2><p>As fotos reais ficam para uma etapa posterior, conforme combinado.</p></div><ol className="cp-next-list"><li><span>01</span><div><strong>Treinar o atendimento</strong><p>Praticar a fila, as ligações, os retornos e os agendamentos.</p></div></li><li><span>02</span><div><strong>Completar os dados oficiais</strong><p>Razão social, CNPJ, responsável por privacidade e conservação.</p></div></li><li><span>03</span><div><strong>Autorizar as integrações</strong><p>Ativar e verificar o backup; concluir as conversões na conta do Google.</p></div></li><li><span>04</span><div><strong>Aprovar a divulgação</strong><p>Revisar conteúdo, pagamento, região, investimento e período antes de ativar.</p></div></li></ol></section>
      <section className="cp-checklist" id="checklist" aria-labelledby="cp-list-title"><div className="cp-section-heading"><div><p className="cp-eyebrow">Entrega e responsabilidades</p><h2 id="cp-list-title">Checklist do projeto</h2></div><span>{tasks.length} itens acompanhados</span></div><div className="cp-filter-row"><div className="cp-filters" aria-label="Filtrar checklist">{filters.map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div><p className="cp-filter-result" role="status">{visible} {visible === 1 ? 'item exibido' : 'itens exibidos'}</p></div><p className="cp-reading-note"><strong>Preparado</strong> indica trabalho técnico pronto que ainda exige autorização ou verificação para entrar em operação.</p>
        {groups.map((group, index) => <section className="cp-group" key={group.id} hidden={!group.items.some(task => matches(task, filter))} aria-labelledby={`cp-group-${group.id}`}><div className="cp-group-heading"><span className="cp-group-number">{String(index + 1).padStart(2, '0')}</span><div><h3 id={`cp-group-${group.id}`}>{group.title}</h3><p>{group.description}</p></div></div><ul>{group.items.map(task => <li className="cp-task" key={task.title} hidden={!matches(task, filter)} data-status={task.status}><Mark status={task.status} /><div className="cp-task-copy"><strong>{task.title}</strong>{task.note && <p>{task.note}</p>}{task.owner && <span className="cp-owner">Próximo passo: {task.owner}</span>}</div><span className={`cp-status cp-status-${task.status}`}>{labels[task.status]}</span></li>)}</ul></section>)}
      </section>
      <section className="cp-review" id="links" aria-labelledby="cp-links-title"><div className="cp-section-heading"><div><p className="cp-eyebrow">Veja a entrega</p><h2 id="cp-links-title">Páginas do projeto</h2></div></div><div className="cp-link-grid">{destinations.map(item => <a href={item.href} key={item.title} target="_blank" rel="noopener noreferrer"><span className="cp-link-number">{item.number}</span><strong>{item.title}</strong><p>{item.note}</p><span className="cp-link-action">Abrir página <span aria-hidden="true">↗</span></span></a>)}</div></section>
      <section className="cp-final-note"><strong>Como revisar com a clínica</strong><p>Abra as páginas, reúna as observações e combine as decisões com o responsável pelo projeto. Este checklist informa o andamento; não registra aprovação, pagamento ou envio de documentos.</p></section>
      <footer className="cp-footer"><Link to="/">Odonto Personnallite</Link><p>Resumo público da entrega, sem dados de pacientes, credenciais ou informações de pagamento. Os status são atualizados pelo responsável pelo projeto a cada publicação; não são um monitor em tempo real.</p><span>Revisão de 24 de outubro de 2026</span></footer>
    </div>
  </main>
}
