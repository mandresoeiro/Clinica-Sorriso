import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { WhatsAppButton } from '../components/layout/WhatsAppButton'
import { ProjectHeader } from '../components/layout/ProjectHeader'

export function AppLayout() {
  const { pathname, hash } = useLocation()
  const campaignLanding = ['/proteses', '/harmonizacao-facial', '/demonstracao-assistente'].includes(pathname.replace(/\/$/, ''))
  const commercial = ['/apresentacao-cliente', '/projeto', '/montar-proposta', '/previa-instagram'].includes(pathname)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  useEffect(() => {
    const pages: Record<string, [string, string]> = {
      '/montar-proposta': ['Monte sua proposta', 'Selecione serviços, veja exemplos e simule o investimento do projeto.'],
      '/demonstracao-assistente': ['Demonstração do assistente virtual', 'Simulação de atendimento sem conexão com WhatsApp ou envio de dados.'],
      '/proteses': ['Próteses dentárias em Belém', 'Conheça a proposta de avaliação e planejamento de próteses dentárias. Consulte horários com a Clínica Odonto Personnallite.'],
      '/harmonizacao-facial': ['Harmonização facial em Belém', 'Converse com a recepção da Odonto Personnallite sobre avaliação individual de harmonização facial em Belém. Consulte horários pelo WhatsApp.'],
      '/urgencia-protese': ['Urgência em prótese dentária', 'Solicite informações sobre avaliação de próteses dentárias e disponibilidade de atendimento.'],
      '/urgencia-odontologica': ['Urgência odontológica', 'Consulte a disponibilidade de avaliação odontológica prioritária com a equipe.'],
      '/projeto': ['Projeto de integração digital', 'Apresentação da estrutura existente e das próximas entregas para a Clínica Odonto Personnallite.'],
      '/apresentacao-cliente': ['Apresentação para a clínica', 'Demonstração do projeto e propostas comerciais da Clínica Odonto Personnallite.'],
      '/previa-instagram': ['Prévia do Instagram', 'Proposta de bio, destaques e conteúdos para a Clínica Odonto Personnallite.'],
      '/': ['Odontologia contemporânea', 'Conheça a Clínica Odonto Personnallite e explore cuidados, equipe e formas de contato.'],
      '/clinica': ['Nossa clínica e tour virtual', 'Explore o tour demonstrativo da Clínica Odonto Personnallite e prepare sua primeira visita.'],
      '/tratamentos': ['Especialidades', 'Conheça os cuidados odontológicos apresentados pela Clínica Odonto Personnallite.'],
      '/equipe': ['Nossa equipe', 'Conheça a apresentação da equipe da Clínica Odonto Personnallite.'],
      '/duvidas': ['Dúvidas frequentes', 'Encontre respostas para dúvidas sobre atendimento e primeira consulta.'],
      '/contato': ['Contato e agendamento', 'Converse com a Clínica Odonto Personnallite sobre atendimento e horários pelo WhatsApp.'],
      '/privacidade': ['Privacidade e LGPD', 'Entenda os formulários, o WhatsApp, suas escolhas e o uso de dados na Clínica Odonto Personnallite.'],
    }
    const page = pages[pathname.replace(/\/$/, '') || '/'] ?? (pathname.startsWith('/tratamentos/')
      ? ['Conheça o tratamento', 'Saiba mais sobre as etapas de cuidado e converse com a equipe da Clínica Odonto Personnallite.']
      : ['Página não encontrada', 'Navegue pelas páginas da Clínica Odonto Personnallite.'])
    document.title = `${page[0]} | Clínica Odonto Personnallite`
    document.querySelector('meta[name="description"]')?.setAttribute('content', page[1])
  }, [pathname])
  return (
    <>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      {!campaignLanding && (commercial ? <ProjectHeader /> : <Header />)}
      <main id="main-content">
        <div className={campaignLanding ? undefined : 'page-transition'} key={pathname}><Suspense fallback={<p className="container" role="status">Carregando página…</p>}><Outlet /></Suspense></div>
      </main>
      {!campaignLanding && !commercial && <Footer />}
      {!campaignLanding && !commercial && <WhatsAppButton />}
    </>
  )
}
