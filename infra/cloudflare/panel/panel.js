const $=s=>document.querySelector(s);
const names={novo:'Novo',em_atendimento:'Em atendimento',agendado:'Agendado',arquivado:'Arquivado',excluido:'Na lixeira'};
const origins={'tratamento-humanizado-ligacao':'Atendimento humanizado · pediu ligação','site-principal':'Site principal','tratamento-humanizado':'Atendimento humanizado','urgencia-protese-implante':'Urgência em prótese e implante','manual-whatsapp':'WhatsApp direto','manual-telefone':'Telefone','manual-presencial':'Presencial'};
const staffLabels={'atendente-1':'Rosiane Oliveira Santiago','atendente-2':'Nayra Almeida','atendente-3':'Apoio da clínica'};
function staffName(id){return staffLabels[id]||'Sem responsável'}
let privateGeneration=0,panelRole='reception';
let csrf='',page=1,pages=1,loading=false,saving=false,sequence=0,detailSequence=0,lastUpdate=0,expiresAt=0,pending=null,undo=null;
const feedback=$('#feedback'),rows=$('#rows');
function notice(text,error=false){feedback.textContent=text;feedback.classList.toggle('error',error);const detailFeedback=$('#detail-feedback');if(detailFeedback){detailFeedback.textContent=text;detailFeedback.classList.toggle('error',error)}}
async function call(path,options={}){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{
  if(options.method==='POST'){options.headers={...options.headers,'X-Operator-Id':$('#operator')?.value||''}}
  const r=await fetch('api/'+path,{credentials:'same-origin',cache:'no-store',redirect:'error',...options,signal:controller.signal});
  if(r.status===403){const denied=await r.clone().json().catch(()=>null);if(denied?.error==='insufficient_role')throw Error('Esta ação é restrita à administração.')}
  if(r.status===401||r.status===403){expiresAt=1;clearPrivate();throw Error('Seu acesso expirou. Saia e entre novamente para continuar.')}
  if(r.status===409){const issue=await r.clone().json().catch(()=>({}));if(issue.error==='already_assigned')throw Error('Este contato já foi assumido ou saiu da fila ativa. Atualize e escolha outro contato livre.')}
  if(!r.ok){const problem=await r.clone().json().catch(()=>({}));if(problem.error==='appointment_conflict')throw Error('Este profissional já tem uma consulta nesse intervalo. Escolha outro horário.');if(problem.error==='duplicate_contact')throw Error('Já existe um contato ativo com este telefone. Localize-o pela busca antes de cadastrar novamente.');if(r.status===409)throw Error('Outra pessoa alterou este contato. Atualize a lista antes de tentar novamente.');if(r.status===404)throw Error('Contato não encontrado. Atualize a lista.');throw Error('Não foi possível concluir. Confira a conexão e tente novamente.')}
  return await r.json();
 }catch(e){if(e.name==='AbortError')throw Error('A conexão demorou mais que o esperado. Tente atualizar.');throw e}finally{clearTimeout(timer)}
}
function el(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e}
function cell(label,node){const td=el('td');td.dataset.label=label;td.append(node);return td}
function formatPhone(phone){return phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/,'($1) $2-$3')}
function date(value){const raw=value.replace(' ','T');return new Date(/[Zz]|[+-]\d{2}:\d{2}$/.test(raw)?raw:raw+'Z')}
function formatDate(value){const d=date(value);return Number.isNaN(d.valueOf())?'—':d.toLocaleString('pt-BR',{timeZone:'America/Belem',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function age(value){const n=Math.max(0,Math.floor((Date.now()-date(value).getTime())/60000));return !Number.isFinite(n)?'':n<60?n+' min':n<1440?Math.floor(n/60)+' h':Math.floor(n/1440)+' dia'+(Math.floor(n/1440)===1?'':'s')}
function button(text,action,className='secondary'){const b=el('button',text,className);b.type='button';b.addEventListener('click',action);return b}
function phoneAction(record){const a=el('a','Ligar ↗','phone-action');if(/^[1-9][0-9]{9,10}$/.test(record.phone)){a.href='tel:+55'+record.phone;a.setAttribute('aria-label','Ligar para '+record.name);a.addEventListener('click',event=>{if(!record.assignee){event.preventDefault();notice('Assuma o contato antes de iniciar a ligação.',true);return}if(record.assignee!==$('#operator').value&&!window.confirm('Este contato está com '+staffName(record.assignee)+'. Combine o retorno antes de ligar. Continuar?'))event.preventDefault()})}else{a.textContent='Telefone inválido';a.removeAttribute('href')}return a}
function whatsapp(record){const a=el('a','WhatsApp ↗','whatsapp');if(/^[1-9][0-9]{9,10}$/.test(record.phone)){const source=record.campaign?.startsWith('manual-')?'Estamos retornando seu contato.':'Recebemos sua solicitação pelo site.';a.href='https://wa.me/55'+record.phone+'?text='+encodeURIComponent('Olá! Somos da Odonto Personnallite. '+source+' Podemos conversar sobre os horários disponíveis?');a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Conversar com '+record.name+' pelo WhatsApp');a.addEventListener('click',event=>{if(record.assignee&&record.assignee!==$('#operator').value&&!window.confirm('Este contato está com '+staffName(record.assignee)+'. Combine com a pessoa responsável para evitar dois retornos. Abrir mesmo assim?'))event.preventDefault()})}else a.textContent='Telefone inválido';return a}
async function copyPhone(record){try{await navigator.clipboard.writeText(record.phone);notice('Telefone copiado.')}catch{notice('Não foi possível copiar. Selecione o telefone na ficha.',true)}}
function clearPrivate(){$('#operator').value='';clearProfilePresentation();document.querySelector('#today-content')?.replaceChildren();document.querySelector('#manual-dialog')?.close();document.querySelector('#photo-editor')?.close();$('#staff-cards').replaceChildren();$('#admin-summary').textContent='';$('#admin-summary').hidden=true;privateGeneration++;detailSequence++;$('#callback-reminders')?.replaceChildren();$('#incoming-notice')?.remove();rows.replaceChildren();$('#detail-body').replaceChildren();if($('#detail').open)$('#detail').close();if($('#confirm').open)$('#confirm').close();$('#empty').hidden=true;for(const state of Object.keys(names))$('#count-'+state).textContent='—';$('#total').textContent='';$('#page-info').textContent='';undo=null;$('#undo').hidden=true}
function render(records){
 rows.replaceChildren();
 for(const record of records){
  const tr=el('tr'),person=el('div');
  const owner=el('small',record.assignee?'Com '+staffName(record.assignee):'Disponível para assumir',record.assignee?'owner-badge':'owner-badge owner-free');person.append(owner);if(record.campaign==='tratamento-humanizado-ligacao')person.append(el('small','PEDIU UMA LIGAÇÃO','callback-preference'));
  person.append(button(record.name,()=>showDetail(record),'contact-name'),el('div',formatPhone(record.phone),'phone'));
  if(record.status==='novo')person.append(el('span','Sem retorno registrado · '+age(record.created_at),'waiting'));
  if(record.callback_at&&['novo','em_atendimento'].includes(record.status))person.append(el('span','Retorno: '+formatDate(record.callback_at)+(date(record.callback_at)<new Date()?' · vencido':''),'waiting'));
  tr.append(cell('Contato',person));
  const interest=el('div');interest.append(el('span',record.treatment,'interest'),el('div',origins[record.campaign]||'Página não identificada','source '+(record.campaign==='urgencia-protese-implante'?'source-urgency':'')));
  tr.append(cell('Interesse e origem',interest),cell('Recebido em',el('span',formatDate(record.created_at),'date')));
  const select=el('select',undefined,'state-select');select.setAttribute('aria-label','Situação de '+record.name);select.dataset.state=record.status;
  for(const [value,label] of Object.entries(names)){const option=el('option',label);option.value=value;select.append(option)}select.value=record.status;
  select.addEventListener('change',()=>{const next=select.value;select.value=record.status;pending={record,next};$('#confirm-text').textContent='Alterar '+record.name+' de “'+names[record.status]+'” para “'+names[next]+'”?';$('#confirm-note').textContent=next==='excluido'?'O contato irá para a lixeira e poderá ser restaurado. Uma reserva existente será cancelada. Isso não é eliminação definitiva de dados.':next==='arquivado'?'Arquivar não exclui os dados. Uma reserva existente será cancelada; o contato poderá ser reaberto.':next==='agendado'?'Confirme que o horário já foi combinado com a pessoa. A reserva de horário é feita separadamente na Agenda da ficha. Não enviamos confirmação automática.':'A alteração ficará registrada no histórico com seu e-mail e horário.';$('#confirm').showModal();$('#confirm-save').focus()});
  tr.append(cell('Situação',select));
  const actions=el('div',undefined,'row-actions');if(!record.assignee&&['novo','em_atendimento','agendado'].includes(record.status))actions.append(button('Assumir contato',()=>claimContact(record),'claim-button'));if(record.campaign==='tratamento-humanizado-ligacao')actions.append(phoneAction(record));actions.append(whatsapp(record),button('Abrir ficha',()=>showDetail(record)),button('Copiar telefone',()=>copyPhone(record)));tr.append(cell('Ações',actions));rows.append(tr);
 }
 const filtered=filterValues();const has=filtered.returns||filtered.assignee||filtered.q||filtered.status||filtered.campaign||filtered.from||filtered.to;
 $('#empty').hidden=records.length!==0;$('#empty h3').textContent=has?'Nenhum contato encontrado.':'Nenhum contato por aqui ainda.';$('#empty p').textContent=has?'Tente outro período ou limpe os filtros.':'As novas solicitações aparecerão nesta lista.';
}
function filterValues(){return {scope:$('#scope').value,returns:$('#returns').value,assignee:$('#assignee').value,status:$('#state').value,q:$('#search').value.trim(),campaign:$('#campaign').value,from:$('#from').value,to:$('#to').value,order:$('#order').value}}
function validFilters(){if($('#from').value&&$('#to').value&&$('#from').value>$('#to').value){notice('A data inicial deve ser anterior ou igual à data final.',true);return false}return true}
async function load(clearNotice=true){
 if(saving||!validFilters())return;
 const seq=++sequence;loading=true;$('#refresh').disabled=true;$('#contatos').setAttribute('aria-busy','true');
 if(clearNotice)notice('Carregando solicitações…');
 try{
  const session=await call('session');if(seq!==sequence)return;csrf=session.csrfToken;expiresAt=session.expiresAt||0;panelRole=session.role||'reception';$('#identity').textContent=session.email+' · '+(panelRole==='admin'?'Administração':'Recepção');
  const f=filterValues(),data=await call('requests?'+new URLSearchParams({...f,page:String(page)}));if(seq!==sequence)return;
  pages=data.pagination.pages;if(page>pages){page=pages;return load(clearNotice)}render(data.requests);
  for(const state of Object.keys(names))$('#count-'+state).textContent=String(data.summary[state]||0);
  $('#total').textContent=data.pagination.total+' contato'+(data.pagination.total===1?'':'s');$('#page-info').textContent='Página '+page+' de '+pages;$('#previous').disabled=page<=1;$('#next').disabled=page>=pages;
  $('#filter-summary').textContent=(origins[f.campaign]||'Todas as origens')+' · '+(names[f.status]||'Todas as situações')+' · '+(f.from||'início')+' até '+(f.to||'hoje');
  loadStaff();dailyReport();loadToday();incomingNotice(data.summary.novo||0);showReminders();lastUpdate=Date.now();$('#connection-dot').classList.remove('offline');$('#updated').textContent='Atualizado às '+new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Belem',hour:'2-digit',minute:'2-digit'});
  if(clearNotice)notice('');sessionNotice();updateWorkspace();
 }catch(error){if(seq!==sequence)return;clearPrivate();notice(error.message,true);$('#connection-dot').classList.add('offline');$('#updated').textContent='Lista indisponível · tente atualizar';$('#previous').disabled=true;$('#next').disabled=true}
 finally{if(seq===sequence){loading=false;$('#refresh').disabled=false;$('#contatos').setAttribute('aria-busy','false')}}
}
async function change(record,next,isUndo=false){
 if(saving||loading)return;const old=record.status;saving=true;$('#confirm-save').disabled=true;notice('Salvando situação…');
 try{await call('status',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({request_id:record.request_id,status:next,expected_status:old})});record.status=next;undo=isUndo?null:{record:{...record},next:old};$('#undo').hidden=!undo;$('#confirm').close();pending=null;notice(isUndo?'Alteração desfeita e registrada no histórico.':'Situação atualizada.');saving=false;await load(false)}catch(e){notice(e.message,true);$('#confirm').close();pending=null}finally{saving=false;$('#confirm-save').disabled=false}
}
async function showDetail(record){
 const seq=++detailSequence;$('#detail-title').textContent=record.name;const body=$('#detail-body');body.replaceChildren(el('p','Carregando ficha…'));$('#detail').showModal();
 try{const data=await call('detail?id='+encodeURIComponent(record.request_id));if(seq!==detailSequence||!$('#detail').open)return;body.replaceChildren();const r=data.record,dl=el('dl',undefined,'detail-grid');for(const [label,value] of [['Telefone',formatPhone(r.phone)],['Interesse',r.treatment],['Origem',origins[r.campaign]||'Não informada'],['Período preferido',r.period||'Não informado'],['Recebido em',formatDate(r.created_at)],['Situação',names[r.status]]]){dl.append(el('dt',label),el('dd',value))}body.append(dl);if(r.status!=='excluido'){workflowForm(r,body);bookingForm(r,body)}else body.append(el('p','Este contato está na lixeira. Restaure a situação pela fila para voltar a organizar o atendimento.','warning'));const detailFeedback=el('p','','muted');detailFeedback.id='detail-feedback';detailFeedback.setAttribute('role','status');body.append(detailFeedback);const actions=el('div',undefined,'dialog-actions');if(r.campaign==='tratamento-humanizado-ligacao')actions.append(phoneAction(r));actions.append(whatsapp(r),button('Copiar telefone',()=>copyPhone(r)));body.append(actions,el('h3','Histórico de alterações'));if(!data.history.length)body.append(el('p','Nenhuma alteração de situação registrada.','muted'));else{const list=el('ol',undefined,'history');for(const event of data.history){const li=el('li');li.append(el('strong',names[event.old_status]+' → '+names[event.new_status]),el('span',formatDate(event.created_at)+' · '+event.actor));list.append(li)}body.append(list,el('p','Até 50 alterações recentes. Horário de Belém.','muted'))}}catch(e){if(seq===detailSequence&&$('#detail').open)body.replaceChildren(el('p',e.message,'error'))}
}
function sessionNotice(){const warning=$('#session-warning'),remaining=expiresAt*1000-Date.now();warning.hidden=!expiresAt||remaining>600000;if(!warning.hidden)warning.textContent=remaining>0?'Seu acesso expira em cerca de '+Math.ceil(remaining/60000)+' minutos. Conclua as alterações e entre novamente quando necessário.':'Seu acesso expirou. Saia e entre novamente para continuar.';if(expiresAt&&remaining<=0){clearPrivate();notice('Sessão expirada. Entre novamente.',true)}}
$('#filters').addEventListener('submit',e=>{e.preventDefault();page=1;load()});
$('#clear').addEventListener('click',()=>{for(const id of ['search','state','campaign','from','to','assignee','returns'])$('#'+id).value='';$('#scope').value='active';$('#order').value='queue';page=1;load()});
$('#refresh').addEventListener('click',()=>load());
$('#previous').addEventListener('click',()=>{if(!loading&&page>1){page--;load()}});$('#next').addEventListener('click',()=>{if(!loading&&page<pages){page++;load()}});
$('#confirm-save').addEventListener('click',()=>{if(pending)change(pending.record,pending.next)});$('#undo').addEventListener('click',()=>{if(undo)change(undo.record,undo.next,true)});
$('#help-open').addEventListener('click',()=>$('#guide').showModal());
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{if(saving)return;$('#'+b.dataset.close).close()}));
$('#confirm').addEventListener('cancel',e=>{if(saving)e.preventDefault()});$('#confirm').addEventListener('close',()=>{pending=null});$('#detail').addEventListener('close',()=>{detailSequence++;$('#detail-body').replaceChildren()});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$('#scope').value='all';$('#state').value=b.dataset.filter;page=1;load();$('#contatos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}));
setInterval(()=>{sessionNotice();if(lastUpdate&&Date.now()-lastUpdate>300000){$('#connection-dot').classList.add('offline');$('#updated').textContent='Lista há mais de 5 minutos sem atualização'}if($('#auto-refresh').checked&&!document.hidden&&!document.querySelector('dialog[open]')&&!loading&&!saving&&(!expiresAt||expiresAt*1000>Date.now())&&Date.now()-lastUpdate>=120000)load()},30000);
window.addEventListener('offline',()=>{$('#connection-dot').classList.add('offline');$('#updated').textContent='Sem conexão · dados podem estar desatualizados'});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload()});load();
