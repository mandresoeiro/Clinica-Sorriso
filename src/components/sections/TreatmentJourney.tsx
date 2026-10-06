import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqs } from '../../content/faqs'
import './Discovery.css'

export function TreatmentJourney({ title }: { title: string }) {
  const [step, setStep] = useState(0)
  const steps = [
    { title: 'Avaliação', text: 'Você conversa sobre suas dúvidas e objetivos. O profissional avalia a saúde bucal e verifica se há necessidade de exames.', question: 1 },
    { title: 'Planejamento', text: 'Após a avaliação, a equipe explica as alternativas, etapas e cuidados indicados para o seu caso. Você pode perguntar sobre prazos e valores antes de decidir.', question: 4 },
    { title: 'Acompanhamento', text: 'A equipe orienta os cuidados e organiza os retornos conforme o plano definido. A frequência depende das necessidades individuais.', question: 2 },
  ]
  return <section className="section--tight discovery" aria-labelledby="journey-title"><div className="container">
    <span className="eyebrow">Entenda a jornada</span><h2 className="title" id="journey-title">Como começa o cuidado em {title.toLowerCase()}?</h2>
    <p>Este é um roteiro geral de atendimento. A indicação e as etapas do tratamento dependem da avaliação profissional.</p>
    <div className="discovery__choices" role="group" aria-label="Etapas do atendimento">{steps.map((item, index) => <button type="button" key={item.title} aria-pressed={step === index} aria-controls="journey-detail" onClick={() => setStep(index)}>{index + 1} · {item.title}</button>)}</div>
    <div id="journey-detail" className="discovery__answer" aria-live="polite" aria-atomic="true"><div key={step}><span className="eyebrow">Etapa {step + 1} de 3</span><h3>{steps[step].title}</h3><p>{steps[step].text}</p><details><summary>{faqs[steps[step].question].question}</summary><p>{faqs[steps[step].question].answer}</p></details></div></div>
    <div className="page-actions"><Link className="button button--ghost" to="/contato#agendamento">Conversar sobre este tratamento →</Link></div>
  </div></section>
}
