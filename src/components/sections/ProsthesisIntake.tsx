import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getWhatsAppUrl } from '../../config/site.config'

export function ProsthesisIntake() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [period, setPeriod] = useState('')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const url = getWhatsAppUrl(`Olá! Gostaria de consultar horários para uma avaliação de próteses dentárias. Meu nome é ${name.trim()}. Meu WhatsApp é ${phone.trim()}.${period ? ` Prefiro conversar no período da ${period}.` : ''}`)
  return <div className="prosthesis-form-card" id="contato"><h2>Vamos conversar?</h2><p>Preencha e continue no WhatsApp.</p><form onChange={() => setReady(false)} onSubmit={e => {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    const local = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits
    if (name.trim().length < 2 || !/^[1-9][0-9]{9,10}$/.test(local)) { setError('Confira seu nome e WhatsApp completo com DDD.'); setReady(false); return }
    setError(''); setReady(true)
  }}>
    <label htmlFor="lead-name">Seu nome</label><input id="lead-name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="Como podemos chamar você?" />
    <label htmlFor="lead-phone">WhatsApp com DDD</label><input id="lead-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={22} value={phone} onChange={e => setPhone(e.target.value)} placeholder="(91) 99999-9999" />
    <label htmlFor="lead-period">Melhor período <span>(opcional)</span></label><select id="lead-period" value={period} onChange={e => setPeriod(e.target.value)}><option value="">Sem preferência</option><option value="manhã">Manhã</option><option value="tarde">Tarde</option></select>
    <p className="prosthesis-note">Os dados serão incluídos na mensagem e só chegam à recepção quando você enviar no WhatsApp. <Link to="/privacidade">Privacidade</Link>.</p>
    {error && <p role="alert">{error}</p>}
    <button className="prosthesis-button" type="submit">Preparar solicitação →</button>
    {ready && <div className="prosthesis-form-ready" role="status"><strong>Mensagem pronta. Falta enviar!</strong><p>Continue no WhatsApp, revise os dados e toque em enviar.</p><a className="prosthesis-button" href={url} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp ↗</a></div>}
  </form><p className="prosthesis-note">O agendamento depende da confirmação da recepção. Não há cadastro automático nesta versão.</p></div>
}
