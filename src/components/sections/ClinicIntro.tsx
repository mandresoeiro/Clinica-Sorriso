import { Button } from '../ui/Button'
import { ROUTES } from '../../config/routes.config'
import './ClinicIntro.css'
export function ClinicIntro(){return <section className="section clinic-intro"><div className="container clinic-intro__grid"><div className="clinic-intro__visual"><div className="clinic-intro__panel">ESPAÇO<br/>ACOLHEDOR</div></div><div><span className="eyebrow">A clínica</span><h2 className="title">Um ambiente pensado para reduzir pressa e aumentar confiança.</h2><p className="lead">A experiência começa antes do atendimento: comunicação clara, organização, conforto e uma identidade visual que transmite calma.</p><Button href={ROUTES.clinic} variant="ghost">Conhecer nosso espaço</Button></div></div></section>}
