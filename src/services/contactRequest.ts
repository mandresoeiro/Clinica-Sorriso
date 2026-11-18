export const contactIntakeEnabled = import.meta.env.VITE_CONTACT_API_ENABLED === 'true'

export async function sendContactRequest(payload: {name: string; phone: string; acknowledged: boolean; request_id: string; source: string; campaign: string}) {
  const config = await fetch('/api/v1/contact/config/', {credentials: 'same-origin', cache: 'no-store'})
  if (!config.ok) throw new Error('Não foi possível conectar ao atendimento.')
  const configData = await config.json().catch(()=>null)
  const csrfToken = configData?.csrfToken
  if (typeof csrfToken !== 'string') throw new Error('Não foi possível validar o envio.')
  const response = await fetch('/api/v1/contact/requests/', {
    method: 'POST', credentials: 'same-origin',
    headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrfToken},
    body: JSON.stringify({...payload, website: ''}),
  })
  if (!response.ok) throw new Error(response.status === 429 ? 'Muitas tentativas. Aguarde alguns minutos ou use o WhatsApp.' : 'Não foi possível registrar. Confira os dados ou use o WhatsApp.')
  const result = await response.json().catch(()=>null)
  if (result?.status !== 'received') throw new Error('Não foi possível confirmar o recebimento. Tente novamente.')
}
