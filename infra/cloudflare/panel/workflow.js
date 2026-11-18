// Only organizational data. Never store clinical notes in this form.
async function workflowForm(record,body){
 const section=el('section',undefined,'workflow');section.append(el('h3','Responsável e próximo retorno'));body.append(section);
 try{
  const {workflow:w,history=[]}=await call('workflow?id='+encodeURIComponent(record.request_id));if(!section.isConnected)return;record.assignee=w.assignee;
  const form=el('form'),grid=el('div',undefined,'detail-grid');watchDraft(form);
  function field(label,input){const wrap=el('label',label);wrap.append(input);grid.append(wrap);return input}
  const owner=el('select');for(const [value,name] of [['','Sem responsável'],['atendente-1','Rosiane Oliveira Santiago'],['atendente-2','Nayra Almeida'],['atendente-3','Apoio da clínica']]){const o=el('option',name);o.value=value;owner.append(o)}owner.value=w.assignee;field('Responsável pelo retorno',owner);
  function localTime(v){return v?new Date(Date.parse(v)-10800000).toISOString().slice(0,16):''}
  const callback=el('input');callback.type='datetime-local';callback.value=localTime(w.callback_at);field('Próximo retorno (Belém)',callback);
  const appointment=el('input');appointment.type='datetime-local';appointment.value=localTime(w.appointment_at);
  const professional=el('input');professional.maxLength=80;professional.value=w.professional;
  const save=button('Salvar organização',()=>{},'primary');save.type='submit';const result=el('p','','muted');result.setAttribute('role','status');
  form.append(grid,el('p','Rosiane: ASB, registro informado 1090 (UF a confirmar). Nayra Almeida: estagiária. Apoio da clínica é um perfil geral, sem identidade individual. As opções não criam contas de acesso. Para reservar horários, use a Agenda desta ficha. Dados de consultas antigas são apenas anotações, sem reserva. Não inclua diagnósticos.','muted'),save,result);section.append(form);
  if(w.updated_at)section.append(el('small','Última atualização: '+formatDate(w.updated_at)+' · '+w.updated_by));
  section.append(el('h4','Histórico da organização'));if(!history.length)section.append(el('p','Sem registros detalhados. O histórico detalhado começa a partir desta atualização.','muted'));else{const list=el('ol',undefined,'history');for(const event of history){const item=el('li'),ownerName=event.assignee==='atendente-1'?'Rosiane Oliveira Santiago':event.assignee==='atendente-2'?'Nayra Almeida':event.assignee==='atendente-3'?'Apoio da clínica':'Sem responsável';item.append(el('strong',ownerName),el('span','Retorno: '+(event.callback_at?formatDate(event.callback_at):'não definido')+' · Consulta: '+(event.appointment_at?formatDate(event.appointment_at):'não definida')+' · Profissional: '+(event.professional||'não definido')),el('span',formatDate(event.created_at)+' · '+event.actor));list.append(item)}section.append(list,el('small','Até 50 registros recentes. O e-mail compartilhado não identifica a pessoa individualmente.'))}
  form.addEventListener('submit',async e=>{e.preventDefault();if(saving)return;if(w.assignee&&owner.value!==w.assignee&&!window.confirm('Transferir este contato de '+staffName(w.assignee)+' para '+staffName(owner.value)+'? Combine a passagem de atendimento para evitar dois retornos.'))return;save.disabled=true;saving=true;
   try{
    const utc=v=>v?new Date(v+':00-03:00').toISOString():'';
    await call('workflow',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({request_id:record.request_id,assignee:owner.value,callback_at:utc(callback.value),appointment_at:utc(appointment.value),professional:professional.value,version:w.version})});
    w.version++;w.assignee=owner.value;record.assignee=owner.value;delete form.dataset.unsaved;result.className='muted';result.textContent='Organização salva. A situação do contato permanece a mesma.';saving=false;await load(false);
   }catch(error){result.textContent=error.message;result.className='error'}finally{saving=false;save.disabled=false}
  });
 }catch(error){section.append(el('p','Organização indisponível: '+error.message,'error'))}
}
let previousNewCount=null;
function incomingNotice(count){
 let banner=$('#incoming-notice');if(!banner){banner=el('p','','warning');banner.id='incoming-notice';banner.setAttribute('role','status');$('.summary').before(banner);banner.hidden=true}
 if(previousNewCount!==null&&count>previousNewCount){banner.hidden=false;banner.textContent='Há novos contatos aguardando retorno. Confira a fila de novos contatos.';document.title='Novos contatos | Odonto Personnallite'}
 previousNewCount=count;
}

let reminderSequence=0,reportSequence=0;
async function showReminders(){
 const generation=privateGeneration,request=++reminderSequence;
 let area=$('#callback-reminders');if(!area){area=el('section',undefined,'workflow');area.id='callback-reminders';$('.inbox').before(area)}
 try{const data=await call('reminders');if(request!==reminderSequence||generation!==privateGeneration||expiresAt===1)return;area.replaceChildren();if(data.reminders.length){area.append(el('h2','Retornos vencidos — até 30 mais antigos'));for(const r of data.reminders){const label=staffName(r.assignee);area.append(button(r.name+' · '+formatDate(r.callback_at)+' · '+label,()=>showDetail(r)))}}}catch{if(request===reminderSequence&&generation===privateGeneration)area.replaceChildren(el('p','Não foi possível consultar os lembretes. Atualize para tentar novamente.','error'))}
}

async function dailyReport(){
 const generation=privateGeneration,request=++reportSequence,box=$('#admin-summary');box.hidden=panelRole!=='admin';box.replaceChildren();if(box.hidden)return;
 try{const f=filterValues(),r=await call('report?'+new URLSearchParams({from:f.from,to:f.to,campaign:f.campaign,assignee:f.assignee}));if(request!==reportSequence||generation!==privateGeneration||panelRole!=='admin')return;box.append(el('strong','Relatório administrativo · '+(r.from||r.day)+' até '+(r.to||r.day)+' · Belém'),el('p',r.newContacts+' cadastros no período e '+r.bookingChanges+' alterações para Agendado. Alterações não representam consultas realizadas.'));
 renderAggregateReport(box,r);
 if(r.groups?.length){const table=el('table'),head=el('tr');for(const label of ['Origem','Responsável atual','Situação atual','Cadastros'])head.append(el('th',label));table.append(head);for(const row of r.groups){const tr=el('tr');for(const value of [origins[row.campaign]||'Não informada',row.assignee==='atendente-1'?'Rosiane Oliveira Santiago':row.assignee==='atendente-2'?'Nayra Almeida':row.assignee==='atendente-3'?'Apoio da clínica':'Sem responsável',names[row.status]||row.status,String(row.total)])tr.append(el('td',value));table.append(tr)}box.append(table)}box.append(el('small','Usa período, origem e responsável dos filtros. Sem datas: hoje. Busca, situação e filtro de retornos não alteram este relatório.'));
 }catch{if(request===reportSequence&&generation===privateGeneration&&panelRole==='admin')box.textContent='Relatório indisponível. Confira as datas e tente atualizar.'}
}

function renderAggregateReport(box,r){
 box.classList.add('aggregate-report');
 const title=el('h2','Resultados do atendimento');box.prepend(title);
 const form=el('form',undefined,'report-filters'),from=el('input'),to=el('input');from.type=to.type='date';from.required=to.required=true;from.value=r.from||r.day;to.value=r.to||r.day;
 for(const [label,input] of [['De',from],['Até',to]]){const wrap=el('label',label);wrap.append(input);form.append(wrap)}
 const apply=button('Atualizar relatório',()=>{},'primary');apply.type='submit';form.append(apply);form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(from.value>to.value){notice('A data inicial deve ser anterior à final.',true);return}$('#from').value=from.value;$('#to').value=to.value;page=1;load()});box.append(form);
 const data=Array.isArray(r.treatments)?r.treatments:[],byTreatment=new Map(),byStatus=new Map();let calls=0;
 for(const row of data){const n=Number(row.total)||0;byTreatment.set(row.treatment,(byTreatment.get(row.treatment)||0)+n);byStatus.set(row.status,(byStatus.get(row.status)||0)+n);if(row.campaign==='tratamento-humanizado-ligacao')calls+=n}
 const kpis=el('div',undefined,'report-kpis');for(const [label,value] of [['Contatos no período',r.newContacts],['Atualmente agendados',byStatus.get('agendado')||0],['Pedidos de ligação',calls]]){const item=el('div');item.append(el('span',label),el('strong',String(value||0)));kpis.append(item)}box.append(kpis);
 const charts=el('div',undefined,'report-charts');
 function chart(title,map,label){const section=el('section');section.append(el('h3',title));if(!map.size)section.append(el('p','Sem dados no período.'));const max=Math.max(1,...map.values());for(const [key,n] of map){const item=el('div',undefined,'report-bar-row'),meter=el('meter');meter.min=0;meter.max=max;meter.value=n;meter.setAttribute('aria-label',label(key)+': '+n);item.append(el('span',label(key)),meter,el('strong',String(n)));section.append(item)}return section}
 charts.append(chart('Contatos por tratamento',byTreatment,k=>k||'Não informado'),chart('Situação atual dos contatos',byStatus,k=>names[k]||k));box.append(charts);
 const table=el('table'),caption=el('caption','Resumo por tratamento e situação atual'),thead=el('thead'),head=el('tr');for(const label of ['Tratamento','Situação','Origem / preferência','Contatos']){const th=el('th',label);th.scope='col';head.append(th)}thead.append(head);table.append(caption,thead);const tbody=el('tbody');
 for(const row of data){const tr=el('tr');for(const text of [row.treatment,names[row.status]||row.status,origins[row.campaign]||row.campaign,String(row.total)])tr.append(el('td',text));tbody.append(tr)}table.append(tbody);const wrap=el('div',undefined,'report-table-wrap');wrap.append(table);box.append(wrap);
 const actions=el('div',undefined,'report-actions');
 actions.append(button('Exportar resumo CSV',()=>{if(panelRole!=='admin'||expiresAt===1||!box.isConnected||box.hidden)return;const safe=v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};const f=filterValues(),lines=[['De','Até','Origem filtrada','Responsável filtrado','Tratamento','Situação atual','Origem / preferência','Contatos'],...data.map(row=>[r.from||r.day,r.to||r.day,f.campaign||'Todas',f.assignee||'Todos',row.treatment,names[row.status]||row.status,origins[row.campaign]||row.campaign,row.total])];const url=URL.createObjectURL(new Blob(['\ufeff'+lines.map(row=>row.map(safe).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'})),link=el('a');link.href=url;link.download='odonto-resumo-'+(r.from||r.day)+'_'+(r.to||r.day)+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}),button('Imprimir / salvar PDF',()=>{if(panelRole==='admin'&&expiresAt!==1&&!box.hidden)window.print()}));box.append(actions,el('p','Contatos cadastrados no período selecionado, agrupados pela situação e responsável atuais. Pedidos de ligação são os enviados por essa opção no formulário. Testes técnicos e lixeira ficam fora. Alterações para Agendado não equivalem a consultas realizadas. Exportação sem nomes e telefones.','muted'));
}
