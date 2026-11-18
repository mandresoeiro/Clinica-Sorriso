import './CommunicationKit.css'

const pieces = [
  ['01-cartao-frente', 'Cartão de visita · frente', 'papelaria'],
  ['02-cartao-verso', 'Cartão de visita · verso', 'papelaria'],
  ['03-papel-timbrado', 'Papel timbrado', 'papelaria'],
  ['04-perfil-instagram-whatsapp', 'Perfil do Instagram e WhatsApp', 'perfil'],
  ['05-destaque-clinica', 'Destaque · Clínica', 'destaque'],
  ['06-destaque-equipe', 'Destaque · Equipe', 'destaque'],
  ['07-destaque-cuidados', 'Destaque · Cuidados', 'destaque'],
  ['08-destaque-proteses', 'Destaque · Próteses', 'destaque'],
  ['09-destaque-atendimento', 'Destaque · Atendimento', 'destaque'],
  ['10-destaque-localizacao', 'Destaque · Localização', 'destaque'],
  ['11-post-modelo', 'Publicação · modelo 01', 'conteudo'],
  ['12-post-modelo', 'Publicação · modelo 02', 'conteudo'],
  ['13-post-modelo', 'Publicação · modelo 03', 'conteudo'],
  ['14-story-modelo', 'Modelo de Stories', 'conteudo'],
  ['15-whatsapp-boas-vindas', 'WhatsApp · boas-vindas', 'conteudo'],
] as const

export function CommunicationKit() {
  return <section className="section communication-kit" id="kit-comunicacao" aria-labelledby="kit-title"><div className="container">
    <span className="eyebrow">Aplicações da identidade visual existente</span>
    <h2 className="title" id="kit-title">A mesma marca.<br/>Cuidado em cada detalhe.</h2>
    <p className="lead">Cartões, papelaria e conteúdos demonstrativos com a logo atual da Clínica Odonto Personnallite. Abra cada peça para ver os detalhes.</p>
    <div className="communication-kit__intro"><p><strong>Kit opcional: R$ 300, pagamento único.</strong><br/>Finalização dos cartões e papel timbrado, três modelos de posts, modelo de Stories, boas-vindas e organização dos arquivos. Uma rodada consolidada de ajustes.</p><p>As capas já preparadas entram na implantação do projeto, sem cobrança duplicada. Impressão e produção mensal de novos conteúdos são separadas. Dados e arquivos precisam de aprovação antes do uso.</p></div>
    {[
      ['papelaria', 'Papelaria', 'Cartão frente e verso e papel timbrado. Artes demonstrativas; produção gráfica à parte.'],
      ['perfil', 'Perfil e destaques', 'Aplicações para reconhecer a clínica nos canais digitais.'],
      ['conteudo', 'Modelos para comunicar', 'Bases reutilizáveis para publicações, Stories e WhatsApp.'],
    ].map(([group,title,description])=><div className="communication-kit__group" key={group}><h3>{title}</h3><p>{description}</p><div className={`communication-kit__grid communication-kit__grid--${group}`}>
      {pieces.filter(([, ,kind])=>group==='perfil' ? kind==='perfil'||kind==='destaque' : kind===group).map(([file,label,kind])=><figure className={`communication-kit__piece communication-kit__piece--${kind}`} key={file}>
        <a href={`/images/kit/${file}.svg`} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ampliar imagem em nova aba`}><img src={`/images/kit/${file}.svg`} alt={label} loading="lazy"/><span>Ampliar ↗</span></a><figcaption>{label}</figcaption>
      </figure>)}
    </div></div>)}
    <p className="project-caption">Prévia para aprovação. Não representa nova criação de logo, impressão contratada ou conteúdo já publicado. Valores, contatos e registros profissionais devem ser validados antes da entrega final.</p>
  </div></section>
}
