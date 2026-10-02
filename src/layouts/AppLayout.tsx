import { Outlet } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { WhatsAppButton } from '../components/layout/WhatsAppButton'

export function AppLayout(){return <><Header/><main><Outlet/></main><Footer/><WhatsAppButton/></>}
