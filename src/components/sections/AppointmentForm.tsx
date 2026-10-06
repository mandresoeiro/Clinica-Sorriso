import { useRef, useState, type FormEvent } from 'react'
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
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState<'name' | 'phone' | null>(null)
  const nameInput = useRef<HTMLInputElement>(null)
  const phoneInput = useRef<HTMLInputElement>(null)

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === errorField) { setError(''); setErrorField(null) }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = form.name.trim()
    const phone = form.phone.replace(/\D/g, '')
    const localPhone = phone.startsWith('55') && phone.length > 11 ? phone.slice(2) : phone
    if (name.length < 2) {
      setError('Informe seu nome com pelo menos dois caracteres.')
      setErrorField('name')
      nameInput.current?.focus()
      return
    }
    if (!/^[1-9]{2}\d{8,9}$/.test(localPhone)) {
      setError('Informe um telefone válido com DDD, por exemplo (91) 99999-9999.')
      setErrorField('phone')
      phoneInput.current?.focus()
      return
    }

    const text = [
      'Olá! Vim pelo site da Clínica Sorriso.',
      '',
      `Nome: ${name}`,
      `WhatsApp: ${phone}`,
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
                ref={nameInput}
                aria-invalid={errorField === 'name'}
                aria-describedby={errorField === 'name' ? 'appointment-name-error' : undefined}
                name="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Seu nome"
              />
              {errorField === 'name' && <span id="appointment-name-error" role="alert" className="appointment-form__error">{error}</span>}
            </label>

            <label>
              <span>WhatsApp</span>
              <input
                type="tel"
                ref={phoneInput}
                aria-invalid={errorField === 'phone'}
                aria-describedby={errorField === 'phone' ? 'appointment-phone-error' : undefined}
                name="phone"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                required
                maxLength={22}
                placeholder="(91) 99999-9999"
              />
              {errorField === 'phone' && <span id="appointment-phone-error" role="alert" className="appointment-form__error">{error}</span>}
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
            Os campos não são gravados no site. Ao continuar, eles serão incluídos
            em uma URL enviada ao WhatsApp; você revisa a mensagem antes de enviar à clínica.
            {' '}<a href="/privacidade">Leia o aviso de privacidade.</a>
            {siteConfig.demoMode && ' Demonstração: utilize somente dados fictícios.'}
          </p>
        </form>
      </div>
    </section>
  )
}
