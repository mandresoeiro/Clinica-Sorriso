import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { WhatsAppButton } from '../components/layout/WhatsAppButton'

export function AppLayout() {
  const { pathname, hash } = useLocation()
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
      '/': ['Odontologia contemporânea', 'Conheça a Clínica Sorriso e explore cuidados, equipe e formas de contato.'],
      '/clinica': ['Nossa clínica e tour virtual', 'Explore o tour demonstrativo da Clínica Sorriso e prepare sua primeira visita.'],
      '/tratamentos': ['Especialidades', 'Conheça os cuidados odontológicos apresentados pela Clínica Sorriso.'],
      '/equipe': ['Nossa equipe', 'Conheça a apresentação da equipe da Clínica Sorriso.'],
      '/duvidas': ['Dúvidas frequentes', 'Encontre respostas para dúvidas sobre atendimento e primeira consulta.'],
      '/contato': ['Contato e agendamento', 'Converse com a Clínica Sorriso sobre atendimento e horários pelo WhatsApp.'],
      '/privacidade': ['Privacidade e LGPD', 'Entenda como funciona o formulário, o WhatsApp e o uso de dados na demonstração da Clínica Sorriso.'],
    }
    const page = pages[pathname] ?? (pathname.startsWith('/tratamentos/')
      ? ['Conheça o tratamento', 'Saiba mais sobre as etapas de cuidado e converse com a equipe da Clínica Sorriso.']
      : ['Página não encontrada', 'Navegue pelas páginas da Clínica Sorriso.'])
    document.title = `${page[0]} | Clínica Sorriso`
    document.querySelector('meta[name="description"]')?.setAttribute('content', page[1])
  }, [pathname])
  return (
    <>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <Header />
      <main id="main-content">
        <div className="page-transition" key={pathname}><Outlet /></div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
