import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site.config'
import './AssistantDemo.css'

type Stage = 'menu' | 'period' | 'confirm' | 'human'
type Message = { from: 'bot' | 'visitor'; text: string }
const welcome: Message[] = [{ from: 'bot', text: 'Olá! Sou o assistente virtual da Clínica Odonto Personnallite. Esta é uma simulação. Como posso ajudar?' }]

export function AssistantDemo() {
  const [messages, setMessages] = useState<Message[]>(welcome)
  const [stage, setStage] = useState<Stage>('menu')
  const [period, setPeriod] = useState('')
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' }) }, [messages])
  function reply(choice: string, response: string, next: Stage = 'menu') {
    setMessages(current => [...current, { from: 'visitor', text: choice }, { from: 'bot', text: response }])
    setStage(next)
  }
  function handoff() {
    reply('Falar com a recepção', 'Encaminhamento simulado: a recepção assumiria a conversa aqui. O assistente fica pausado. Nenhuma atendente foi notificada nesta demonstração.', 'human')
  }
  function reset() { setMessages(welcome); setStage('menu'); setPeriod('') }
  return <div className="assistant-demo">
    <header className="assistant-demo__nav"><Link to="/apresentacao-cliente">← Apresentação do projeto</Link><span>Demonstração interativa</span></header>
    <div className="assistant-demo__layout">
      <section className="assistant-demo__intro" aria-labelledby="assistant-title">
        <img src="/images/brand/symbol.svg" width="64" height="70" alt="Logo da clínica" />
        <span className="assistant-demo__eyebrow">Odonto Personnallite · Assistente virtual</span>
        <h1 id="assistant-title">O primeiro contato,<br/><em>com mais cuidado.</em></h1>
        <p>Experimente como um assistente pode orientar o visitante e organizar pedidos para a recepção.</p>
        <ol><li>Escolha uma opção no menu.</li><li>Simule uma solicitação de horário.</li><li>Veja a passagem para atendimento humano.</li></ol>
        <aside><strong>Somente uma amostra</strong><p>Respostas pré-programadas, sem IA ou conexão com o WhatsApp. Nenhuma mensagem é enviada, nenhum agendamento é criado e a conversa desaparece ao recarregar. Use apenas os dados fictícios dos exemplos.</p></aside>
        <p className="assistant-demo__future">Na versão contratada, integração oficial, caixa da recepção e custos de uso serão definidos separadamente. A equipe confirma os horários.</p>
      </section>
      <section className="assistant-demo__phone" aria-label="Simulador de atendimento">
        <header className="assistant-demo__chat-header"><img src="/images/brand/symbol.svg" alt="" width="35" height="40"/><div><strong>Odonto Personnallite</strong><span>{stage === 'human' ? 'Assistente pausado · simulação' : 'Assistente virtual · simulação'}</span></div><span className="assistant-demo__badge">DEMO</span></header>
        <div className="assistant-demo__notice">Ambiente demonstrativo · Sem envio ao WhatsApp</div>
        <div className="assistant-demo__messages" role="log" aria-live="polite" aria-relevant="additions text" tabIndex={0}>
          {messages.map((m,i)=><div key={i} className={`assistant-demo__bubble assistant-demo__bubble--${m.from}`}><small>{m.from === 'bot' ? 'Assistente' : 'Visitante fictício'}</small><p>{m.text}</p></div>)}<div ref={end}/>
        </div>
        <div className="assistant-demo__choices" aria-label="Opções da conversa">
          {stage === 'menu' && <>
            <button onClick={()=>reply('Solicitar agendamento','Vamos simular uma solicitação para uma visitante fictícia chamada Maria. Qual período ela prefere? Não estamos consultando uma agenda real.','period')}>01 · Solicitar agendamento</button>
            <button onClick={()=>reply('Informações sobre próteses','A avaliação profissional permite orientar o planejamento de uma prótese. A recepção pode explicar como solicitar uma avaliação. Indicação, tipo de prótese e valores dependem da avaliação da equipe.')}>02 · Informações sobre próteses</button>
            <button onClick={()=>reply('Endereço e horários',`${siteConfig.address.street}, ${siteConfig.address.city}/${siteConfig.address.state}. Horários informados: ${siteConfig.hours}. Dados em validação pela clínica; esta simulação não confirma disponibilidade.`)}>03 · Endereço e horários</button>
            <button onClick={handoff}>04 · Falar com a recepção</button>
          </>}
          {stage === 'period' && <>{['Manhã','Tarde'].map(value=><button key={value} onClick={()=>{setPeriod(value);reply(value,`Exemplo de solicitação: Maria, preferência pelo período da ${value.toLowerCase()}. Deseja simular o encaminhamento para a recepção? Nenhum horário foi reservado.`,'confirm')}}>{value}</button>)}<button onClick={()=>reply('Voltar ao menu','Tudo bem. Escolha como continuar.')}>Voltar ao menu</button></>}
          {stage === 'confirm' && <><button onClick={()=>reply('Simular encaminhamento',`Solicitação fictícia preparada: Maria, período da ${period.toLowerCase()}. Na versão real, a recepção verificaria a agenda e confirmaria o horário. Aqui nada foi enviado. O assistente ficará pausado.`,'human')}>Simular encaminhamento</button><button onClick={()=>reply('Cancelar solicitação','Simulação cancelada. Nenhum dado foi enviado. Como posso ajudar?')}>Cancelar</button></>}
          {stage === 'human' && <p className="assistant-demo__handoff"><strong>A recepção assumiria daqui.</strong><br/>Na versão real, a equipe continuaria em uma caixa de atendimento. Este exemplo termina aqui.</p>}
        </div>
        <footer><span>Consultas sempre confirmadas pela equipe.</span><button type="button" onClick={reset}>Reiniciar demonstração ↻</button></footer>
      </section>
    </div>
  </div>
}
