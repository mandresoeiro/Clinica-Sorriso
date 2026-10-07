import { useState } from 'react'
export function ShareButton({ title, path }: { title: string; path?: string }) {
  const [status, setStatus] = useState('')
  const [fallback, setFallback] = useState('')
  async function share() {
    const url = new URL(path ?? window.location.pathname, window.location.origin).href
    setStatus(''); setFallback('')
    try {
      if (navigator.share) { await navigator.share({ title, url }); setStatus('Compartilhamento concluído.') }
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); setStatus('Link copiado. Cole na conversa que preferir.') }
      else { setFallback(url); setStatus('Copie o endereço abaixo para compartilhar.') }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setFallback(url); setStatus('Copie o endereço abaixo para compartilhar.')
    }
  }
  return <div className="share-action"><button type="button" className="button button--ghost" onClick={share}>Compartilhar página ↗</button><p role="status">{status}</p>{fallback && <label>Link para compartilhar<input readOnly value={fallback} onFocus={event => event.currentTarget.select()} /></label>}</div>
}
