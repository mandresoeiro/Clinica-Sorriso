import { Link } from 'react-router-dom'
import { CommunicationKit } from '../components/sections/CommunicationKit'
import './ProjectPresentation.css'


const existing = [
  { title: 'Uma clínica para conhecer', text: 'Apresentação institucional, especialidades, equipe e dúvidas em uma experiência navegável.', path: '/tratamentos', action: 'Explorar especialidades' },
  { title: 'O espaço em detalhes', text: 'Um tour interativo demonstra como apresentar os ambientes. As imagens atuais são demonstrativas.', path: '/clinica#tour-virtual', action: 'Conhecer o tour' },
  { title: 'Uma conversa para começar', text: 'Botões de WhatsApp e formulário preparam uma solicitação. O agendamento é confirmado pela equipe.', path: '/contato', action: 'Conhecer o contato' },
]

export function ProjectPresentation() {
  return <div className="project-presentation">
    <section className="project-cover">
      <div className="container">
        <span className="project-label">SoeiroTech · Apresentação do projeto</span>
        <p className="project-cover__brand">Clínica Odonto Personnallite</p>
        <h1>Uma presença digital.<br /><em>Todo o cuidado conectado.</em></h1>
        <p>Instagram, site e WhatsApp trabalhando juntos para apresentar a clínica e facilitar solicitações de atendimento.</p>
        <div className="page-actions"><a className="button button--primary" href="#projeto-existente">Ver o que já existe ↓</a><button className="button button--ghost" onClick={() => window.print()}>Imprimir proposta</button></div>
        <div className="project-cover__note">Proposta para revisão · Estrutura existente em demonstração · Campanhas ainda não ativadas</div>
      </div>
    </section>
    <section className="section--tight" aria-labelledby="client-materials-title"><div className="container">
      <span className="eyebrow">Apresentação para a cliente</span><h2 className="title" id="client-materials-title">Veja o projeto e escolha o próximo passo.</h2>
      <p className="lead">Materiais de demonstração e propostas para avaliação. Escolha um pacote; as cinco opções não se somam. Esta página não aparece no menu dos pacientes e pode ser aberta por qualquer pessoa que tenha o link.</p>
      <div className="page-actions"><Link className="button button--primary" to="/previa-instagram">Ver Instagram e destaques</Link><Link className="button button--ghost" to="/proteses">Testar landing page de próteses</Link></div>
      <p className="page-actions"><a className="button button--primary" href="#kit-comunicacao">Ver kit de comunicação ↓</a><Link className="button button--ghost" to="/demonstracao-assistente">Experimentar o assistente virtual →</Link></p>
      <div className="project-cards">{[
        ['01-site-institucional','Site institucional','R$ 450, pagamento único'],
        ['02-site-landing-pages','Site + landing pages','R$ 800, pagamento único'],
        ['03-presenca-essencial','Presença essencial','R$ 900 iniciais + R$ 300/mês'],
        ['04-divulgacao-local','Divulgação local','R$ 900 iniciais + R$ 500/mês de serviços + R$ 300/mês de mídia'],
        ['05-gestao-ampliada','Gestão ampliada','R$ 900 iniciais + R$ 800/mês de serviços + R$ 600/mês de mídia'],
      ].map(([file,title,price])=><article className="card" key={file}><h3>{title}</h3><p>{price}</p><a href={`/propostas/${file}.pdf`} target="_blank" rel="noopener noreferrer">Abrir proposta detalhada em PDF ↗</a></article>)}</div>
      <p className="project-caption">Valores sugeridos, sujeitos ao aceite. Domínios e terceiros separados. Anúncios ainda não ativados; imagens demonstrativas não representam instalações reais.</p>
    </div></section>
    <CommunicationKit />
    <section className="section" id="projeto-existente">
      <div className="container">
        <span className="eyebrow">01 · Base existente</span>
        <h2 className="title">Um projeto que já começou.</h2>
        <p className="lead">Aproveitamos o site atual e sua identidade visual para evoluir com consistência.</p>
        <div className="project-cards">{existing.map(item => <article className="card" key={item.title}><span className="project-status">Disponível para demonstração</span><h3>{item.title}</h3><p>{item.text}</p><Link to={item.path}>{item.action} →</Link></article>)}</div>
      </div>
    </section>
    <section className="section--tight project-journey">
      <div className="container">
        <span className="eyebrow">02 · Integração proposta</span><h2 className="title">Da descoberta ao atendimento.</h2>
        <ol className="project-flow">{[
          ['Instagram e anúncios', 'Apresentam a clínica e os serviços à região atendida.'],
          ['Página do serviço', 'Explica o atendimento e esclarece dúvidas.'],
          ['WhatsApp', 'Facilita a solicitação e a conversa com a equipe.'],
          ['Agendamento', 'A equipe verifica horários e confirma a consulta.'],
        ].map(([title, text], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
        <p className="project-caption">Visita, clique no WhatsApp e consulta confirmada serão acompanhados como etapas diferentes.</p>
      </div>
    </section>
    <section className="section">
      <div className="container"><span className="eyebrow">03 · Próximas entregas</span><h2 className="title">Duas frentes de atenção.</h2><p className="lead">Páginas específicas dentro do site, com conteúdo validado pela clínica e contato contextual.</p>
        <div className="project-cards project-cards--two">
          <article className="card"><span className="project-status project-status--planned">Prévia implementada · a validar</span><h3>Urgência em prótese</h3><p>Informações sobre próteses quebradas, soltas e desconforto, dúvidas frequentes e solicitação de avaliação.</p><Link className="project-path" to="/urgencia-protese">Abrir página de prótese →</Link><strong>Chamada proposta: Solicitar avaliação</strong></article>
          <article className="card"><span className="project-status project-status--planned">Prévia implementada · a validar</span><h3>Urgência odontológica</h3><p>Apresentação do atendimento prioritário, orientações iniciais e consulta à disponibilidade da equipe.</p><Link className="project-path" to="/urgencia-odontologica">Abrir página odontológica →</Link><strong>Chamada proposta: Ver disponibilidade</strong></article>
        </div><p className="project-caption">Serviços, prazos e disponibilidade precisam ser confirmados. As páginas não substituem avaliação profissional.</p>
      </div>
    </section>
    <section className="section--tight project-journey"><div className="container"><span className="eyebrow">04 · Plano de implantação</span><h2 className="title">Cada etapa, uma entrega clara.</h2><ol className="project-plan">
      <li><strong>Validar a base</strong><span>Nome, serviços, contatos, horários, registros profissionais e fotografias autorizadas.</span></li>
      <li><strong>Integrar o site</strong><span>Páginas de serviço, cards na inicial, mensagens de WhatsApp e preparação de SEO.</span></li>
      <li><strong>Preparar os canais</strong><span>Bio e destaques do Instagram, roteiro de atendimento e propostas de anúncios.</span></li>
      <li><strong>Testar e lançar</strong><span>Revisão em celular, testes, domínio e publicação após aprovação.</span></li>
      <li><strong>Acompanhar e melhorar</strong><span>Investimento, contatos qualificados e agendamentos registrados pela clínica.</span></li>
    </ol></div></section>
    <section className="section"><div className="container project-cards project-cards--two">
      <article className="card"><span className="eyebrow">Antes do lançamento</span><h2>O que precisamos confirmar</h2><ul><li>Dados oficiais e responsável técnico.</li><li>Serviços oferecidos, dias e capacidade de atendimento.</li><li>Fotos autorizadas e acesso às contas de negócio.</li><li>Registro dos domínios e orçamento das campanhas.</li></ul><p>Endereços pretendidos: <strong>odontopersonnallite.com.br</strong> e <strong>odontopersonnallite.com</strong>. Registro ainda não confirmado.</p></article>
      <article className="card"><span className="eyebrow">Escopo comercial</span><h2>Investimento transparente</h2><p>Implantação, manutenção, gestão de campanhas e verba de anúncios serão apresentados separadamente. Valores e cronograma a definir.</p><p>A SoeiroTech executa o escopo contratado. A clínica valida os materiais, atende os contatos e confirma agendamentos.</p><p>Produção recorrente de conteúdo depende de contratação específica. Não há garantia de quantidade de pacientes ou retorno financeiro.</p></article>
    </div></section>
    <section className="project-closing"><div className="container"><span className="project-label">Clínica Odonto Personnallite · SoeiroTech</span><h2>Uma base pronta para evoluir.</h2><p>Próxima entrega: conteúdo validado e prévia das duas páginas de serviço.</p><Link className="button button--primary" to="/">Explorar o site existente →</Link></div></section>
  </div>
}

