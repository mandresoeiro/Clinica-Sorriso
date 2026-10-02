import { useState, type FormEvent } from 'react'
import { siteConfig } from '../../config/site.config'
import './AppointmentForm.css'

type FormState = {
  name: string
  phone: string
  interest: string
  period: string
  message: string
}

const initialState: FormState = {
  name: '',
  phone: '',
  interest: '',
  period: '',
  message: '',
}

export function AppointmentForm() {
  const [form, setForm] = useState<FormState>(initialState)

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = [
      'Olá! Vim pelo site da Clínica Sorriso.',
      '',
      `Nome: ${form.name}`,
      `WhatsApp: ${form.phone}`,
      form.interest ? `Interesse: ${form.interest}` : '',
      form.period ? `Melhor período: ${form.period}` : '',
      form.message ? `Mensagem: ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    const url = `https://wa.me/${siteConfig.contact.phoneE164}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="section appointment-form" id="agendamento">
      <div className="container appointment-form__grid">
        <div className="appointment-form__copy">
          <span className="eyebrow">Contato rápido</span>
          <h2 className="title">Comece sua conversa com a clínica.</h2>
          <p className="lead">
            Preencha apenas dados de contato e preferência de atendimento.
            Ao enviar, uma mensagem pronta será aberta no WhatsApp.
          </p>

          <div className="appointment-form__note">
            <strong>Importante</strong>
            <span>
              Não envie informações clínicas sensíveis por este formulário.
              Diagnóstico e avaliação devem acontecer diretamente com a equipe.
            </span>
          </div>
        </div>

        <form className="appointment-form__card" onSubmit={handleSubmit}>
          <div className="appointment-form__row">
            <label>
              <span>Nome</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                autoComplete="name"
                required
                placeholder="Seu nome"
              />
            </label>

            <label>
              <span>WhatsApp</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                required
                placeholder="(91) 99999-9999"
              />
            </label>
          </div>

          <div className="appointment-form__row">
            <label>
              <span>O que você procura?</span>
              <select
                name="interest"
                value={form.interest}
                onChange={(event) => updateField('interest', event.target.value)}
              >
                <option value="">Selecione</option>
                <option>Consulta de avaliação</option>
                <option>Prevenção</option>
                <option>Estética do sorriso</option>
                <option>Implantes</option>
                <option>Reabilitação oral</option>
                <option>Clareamento</option>
                <option>Outros</option>
              </select>
            </label>

            <label>
              <span>Melhor período</span>
              <select
                name="period"
                value={form.period}
                onChange={(event) => updateField('period', event.target.value)}
              >
                <option value="">Indiferente</option>
                <option>Manhã</option>
                <option>Tarde</option>
                <option>Fim do dia</option>
              </select>
            </label>
          </div>

          <label>
            <span>Mensagem opcional</span>
            <textarea
              name="message"
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              rows={4}
              maxLength={300}
              placeholder="Ex.: gostaria de saber os horários disponíveis."
            />
          </label>

          <button type="submit" className="appointment-form__submit">
            Continuar no WhatsApp
            <span aria-hidden="true">→</span>
          </button>

          <p className="appointment-form__privacy">
            Este formulário não salva dados no site nesta versão.
          </p>
        </form>
      </div>
    </section>
  )
}
