const launchChecklistPdf = '/propostas/checklist-registro-nuvem-trafego-odonto-personnallite.pdf'

export function LaunchChecklist() {
  return (
    <section className="section--tight project-journey" id="checklist-lancamento" aria-labelledby="launch-checklist-title">
      <div className="container">
        <span className="eyebrow">Checklist de lançamento</span>
        <h2 className="title" id="launch-checklist-title">Do domínio à primeira campanha.</h2>
        <p className="lead">O roteiro completo para registrar o endereço da clínica, publicar o site na nuvem e preparar a divulgação no Google e no Instagram.</p>
        <ol className="project-plan">
          <li><strong>Organizar dados e contas</strong><span>Confirmar informações oficiais, titularidade e responsáveis pelos acessos.</span></li>
          <li><strong>Registrar o domínio e publicar</strong><span>Registro.br, hospedagem, conexão do domínio, HTTPS e revisão do site no celular.</span></li>
          <li><strong>Preparar o atendimento</strong><span>WhatsApp, privacidade e, quando contratado, formulário e painel na nuvem.</span></li>
          <li><strong>Configurar Google e Meta</strong><span>Perfil da Empresa, Google Ads e Meta Ads, com orçamento e cobrança separados.</span></li>
          <li><strong>Acompanhar os resultados</strong><span>Verificar contatos recebidos, atendimento e consultas confirmadas.</span></li>
        </ol>
        <div className="page-actions">
          <a className="button button--primary" href={launchChecklistPdf} target="_blank" rel="noopener noreferrer">Abrir checklist em PDF ↗</a>
          <a className="button button--ghost" href={launchChecklistPdf} download>Baixar checklist</a>
        </div>
        <p className="project-caption">5 páginas, 92 caixas marcáveis e links clicáveis. Baixe e salve uma cópia para manter suas marcações. O checklist é um roteiro; não ativa contratações ou anúncios.</p>
      </div>
    </section>
  )
}

