import { createBrowserRouter } from 'react-router-dom'
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

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
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
