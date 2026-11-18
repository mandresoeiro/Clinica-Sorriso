import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '../layouts/AppLayout'
import { Home } from '../pages/Home'
import { Clinic } from '../pages/Clinic'
import { Treatments } from '../pages/Treatments'
import { TreatmentDetails } from '../pages/TreatmentDetails'
import { Team } from '../pages/Team'
import { Faq } from '../pages/Faq'
import { Contact } from '../pages/Contact'
import { NotFound } from '../pages/NotFound'
import { Privacy } from '../pages/Privacy'
import { PriorityService } from '../pages/PriorityService'
import { Prostheses } from '../pages/Prostheses'
const FacialHarmonization = lazy(() => import('../pages/FacialHarmonization').then(m => ({ default: m.FacialHarmonization })))
const ProjectOverview = lazy(() => import('../pages/ProjectOverview').then(m => ({ default: m.ProjectOverview })))
const InstagramPreview = lazy(() => import('../pages/InstagramPreview').then(m => ({ default: m.InstagramPreview })))
const AssistantDemo = lazy(() => import('../pages/AssistantDemo').then(m => ({ default: m.AssistantDemo })))
const ProposalBuilder = lazy(() => import('../pages/ProposalBuilder').then(m => ({ default: m.ProposalBuilder })))
const ClientProgress = lazy(() => import('../pages/ClientProgress').then(m => ({ default: m.ClientProgress })))

export const router = createBrowserRouter([
  { path: '/acompanhamento', element: <Suspense fallback={<p role="status">Carregando página…</p>}><ClientProgress /></Suspense> },
  {
    element: <AppLayout />,
    children: [
      { path: '/montar-proposta', element: <ProposalBuilder /> },
      { path: '/demonstracao-assistente', element: <AssistantDemo /> },
      { path: '/proteses', element: <Prostheses /> },
      { path: '/harmonizacao-facial', element: <FacialHarmonization /> },
      { path: '/urgencia-protese', element: <PriorityService kind="protese" /> },
      { path: '/urgencia-odontologica', element: <PriorityService kind="odontologica" /> },
      { path: '/projeto', element: <ProjectOverview /> },
      { path: '/apresentacao-cliente', element: <ProjectOverview /> },
      { path: '/previa-instagram', element: <InstagramPreview /> },
      { path: '/', element: <Home /> },
      { path: '/clinica', element: <Clinic /> },
      { path: '/tratamentos', element: <Treatments /> },
      { path: '/tratamentos/:slug', element: <TreatmentDetails /> },
      { path: '/equipe', element: <Team /> },
      { path: '/duvidas', element: <Faq /> },
      { path: '/contato', element: <Contact /> },
      { path: '/privacidade', element: <Privacy /> },
      { path: '/404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
