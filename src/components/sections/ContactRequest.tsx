import { useRef, useState, type FormEvent } from 'react'
import { sendContactRequest } from '../../services/contactRequest'
import { getWhatsAppUrl } from '../../config/site.config'
import { campaignOriginData } from '../../utils/campaignOrigin'
import './AppointmentForm.css'

export function ContactRequest() {
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
  const [accepted,setAccepted] = useState(false)
  const [busy,setBusy] = useState(false)
  const [sent,setSent] = useState(false)
  const [error,setError] = useState('')
  const requestId = useRef<string | null>(null)
  const pending = useRef(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current || sent) return
    setError('')
    const digits = phone.replace(/\D/g,'')
    const local = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits
    if (name.trim().length < 2 || !/^[1-9][0-9]{9,10}$/.test(local) || !accepted) {
      setError('Confira nome, telefone completo com DDD e a confirmação de contato.')
      return
    }
    pending.current = true; setBusy(true)
    try {
      requestId.current ??= crypto.randomUUID()
      const origin = campaignOriginData()
      const source = origin && ['instagram','facebook','google'].includes(origin.source) ? origin.source : origin?.source === 'meta' ? 'facebook' : 'site'
      await sendContactRequest({name: name.trim(), phone: digits, acknowledged: accepted,
        request_id: requestId.current, source, campaign: origin?.campaign ?? ''})
      setSent(true)
    } catch (failure) {
      setError(failure instanceof Error && /^(Não|Muitas)/.test(failure.message) ? failure.message : 'Falha no envio. Tente novamente ou use o WhatsApp.')
    } finally { pending.current = false; setBusy(false) }
  }
  return <section className="section appointment-form" id="agendamento"><div className="container appointment-form__grid">
    <div className="appointment-form__copy"><span className="eyebrow">Solicite um retorno</span><h2 className="title">Peça um retorno da recepção.</h2><p className="lead">Sua solicitação ficará no painel interno. A equipe entra em contato para confirmar a disponibilidade.</p><div className="appointment-form__note"><strong>Agendamento sujeito à confirmação</strong><span>Informe apenas nome e telefone. Não envie informações clínicas. Este formulário não reserva uma consulta.</span></div></div>
    <form className="appointment-form__card" onSubmit={submit}>
      {sent ? <div className="appointment-form__success"><p role="status">Solicitação recebida no painel. A consulta ainda depende de confirmação da recepção.</p><a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">Se preferir, continue pelo WhatsApp ↗</a></div> : <>
        <fieldset disabled={busy} style={{border:0,padding:0,margin:0}}>
          <label><span>Nome</span><input name="name" autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={e=>{requestId.current=null;setName(e.target.value)}} /></label>
          <label><span>WhatsApp com DDD</span><input name="phone" type="tel" autoComplete="tel" required maxLength={22} value={phone} onChange={e=>{requestId.current=null;setPhone(e.target.value)}} placeholder="(91) 99999-9999" /></label>
          <label style={{display:'flex',alignItems:'flex-start',gap:'.6rem',marginBlock:'1rem'}}><input style={{width:'auto',marginTop:'.3rem'}} type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} required /><span>Li as informações de privacidade e quero receber um retorno sobre este pedido.</span></label>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        <button className="appointment-form__submit" disabled={busy} type="submit">{busy ? 'Enviando…' : 'Enviar pedido à recepção'}</button>
        {error && <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">Continuar pelo WhatsApp ↗</a>}
      </>}
      <p className="appointment-form__privacy">Nome, telefone e origem informada são registrados para retorno da equipe autorizada. Os dados não são publicados no site. <a href="/privacidade">Leia o aviso de privacidade.</a></p>
    </form>
  </div></section>
}
