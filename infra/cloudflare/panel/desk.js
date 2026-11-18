// Operational dashboard. No patient information is persisted in browser storage.
let todaySequence=0;
async function loadToday(){
 const target=$('#today-content'),generation=privateGeneration,request=++todaySequence;if(!target)return;
 try{const data=await call('today');if(request!==todaySequence||generation!==privateGeneration||expiresAt===1)return;target.replaceChildren();
  const metrics=el('div',undefined,'today-metrics');
  for(const [label,value,action] of [['Aguardando contato',data.counts.new_contacts,()=>quickQueue({status:'novo'})],['Retornos vencidos',data.counts.overdue,()=>quickQueue({returns:'overdue'})],['Sem responsável',data.counts.unassigned,()=>quickQueue({assignee:'unassigned'})],['Consultas de hoje',data.appointments.length,()=>$('#today-agenda')?.scrollIntoView({block:'center'})]]){
   const b=button('',action,'metric');b.append(el('span',label),el('strong',String(value||0)));metrics.append(b);
  }target.append(metrics);
  const grid=el('div',undefined,'today-columns'),agenda=el('section'),returns=el('section');agenda.id='today-agenda';agenda.append(el('h3','Agenda de hoje'),el('p','Reservas confirmadas no painel. Sem expediente fixo.','muted'));
  if(!data.appointments.length)agenda.append(el('p','Nenhuma reserva para hoje. Abra a ficha de um contato para combinar um horário.','blank-note'));
  for(const item of data.appointments){const b=button('',()=>showDetail(item),'agenda-item');b.append(el('strong',formatDate(item.starts_at)+' · '+item.duration+' min'),el('span',item.name),el('small',item.professional));agenda.append(b)}
  returns.append(el('h3','Próximos retornos'),el('p','Vencidos e de hoje · até 20 mais antigos.','muted'));
  if(!data.callbacks.length)returns.append(el('p','Nenhum retorno pendente até o fim de hoje.','blank-note'));
  for(const item of data.callbacks){const b=button('',()=>showDetail(item),'agenda-item');b.append(el('strong',item.name),el('span',formatDate(item.callback_at)),el('small',staffName(item.assignee)));returns.append(b)}
  grid.append(agenda,returns);target.append(grid);
 }catch{if(request===todaySequence&&generation===privateGeneration)target.replaceChildren(el('p','Não foi possível carregar a visão de hoje. Use Atualizar para tentar novamente.','error'))}
}
function quickQueue(values){for(const id of ['search','state','campaign','from','to','assignee','returns'])$('#'+id).value='';$('#scope').value='active';if(values.status)$('#state').value=values.status;if(values.returns)$('#returns').value=values.returns;if(values.assignee)$('#assignee').value=values.assignee;page=1;load();$('#contatos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
async function bookingForm(record,body){
 const section=el('section',undefined,'workflow booking');section.append(el('h3','Agenda da consulta'));body.append(section);
 try{const data=await call('appointment?id='+encodeURIComponent(record.request_id));if(!section.isConnected)return;const a=data.appointment;
  const form=el('form'),grid=el('div',undefined,'form-columns');watchDraft(form);
  function field(label,input){const wrap=el('label',label);wrap.append(input);grid.append(wrap);return input}
  const professional=el('select');professional.required=true;const empty=el('option','Selecione o profissional');empty.value='';professional.append(empty);for(const name of data.professionals){const o=el('option',name);o.value=name;professional.append(o)}professional.value=a?.professional||'';field('Profissional',professional);
  const start=el('input');start.type='datetime-local';start.required=true;start.value=a?.starts_at?new Date(Date.parse(a.starts_at)-10800000).toISOString().slice(0,16):'';field('Data e hora (Belém)',start);
  const duration=el('input');duration.type='number';duration.min=5;duration.max=480;duration.step=1;duration.required=true;duration.placeholder='Defina com a equipe';duration.value=a?.duration||'';field('Duração em minutos',duration);
  const save=button(a?.status==='confirmed'?'Atualizar reserva':'Reservar horário',()=>{},'primary');save.type='submit';const result=el('p','','muted');result.setAttribute('role','status');
  form.append(grid,el('p','Combine o horário e a duração com a equipe antes de reservar. O painel verifica conflitos do mesmo profissional, sem enviar mensagens ou confirmar disponibilidade clínica. A situação da fila é atualizada separadamente.','muted'),save,result);section.append(form);
  let version=a?.version||0;
  async function store(payload){if(saving)return false;saving=true;save.disabled=true;try{await call('appointment',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify(payload)});version++;delete form.dataset.unsaved;await loadToday();return true}catch(e){result.textContent=e.message;result.className='error';return false}finally{saving=false;save.disabled=false}}
  form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;if(await store({request_id:record.request_id,professional:professional.value,starts_at:new Date(start.value+':00-03:00').toISOString(),duration:Number(duration.value),version,status:'confirmed'})){result.className='muted';result.textContent='Reserva salva. Nenhuma mensagem foi enviada.';cancel.hidden=false}});
  const cancel=button('Cancelar reserva',()=>{if(saving||!window.confirm('Cancelar esta reserva? O horário será liberado, mantendo o histórico.'))return;store({request_id:record.request_id,version,status:'cancelled'}).then(ok=>{if(ok){result.className='muted';result.textContent='Reserva cancelada e horário liberado.';cancel.hidden=true}})});cancel.hidden=a?.status!=='confirmed';section.append(cancel);
  if(a?.status==='cancelled')section.append(el('p','A última reserva foi cancelada. Salve para reservar novamente.','muted'));
  if(data.history.length){const history=el('details');history.append(el('summary','Histórico da agenda'));for(const item of data.history){history.append(el('p',(item.status==='confirmed'?'Reservado':'Cancelado')+' · '+formatDate(item.starts_at)+' · '+item.professional+' · '+item.actor,'muted'))}section.append(history)}
 }catch(e){section.append(el('p','Agenda indisponível: '+e.message,'error'))}
}
$('#manual-open')?.addEventListener('click',()=>{$('#manual-form').reset();$('#manual-feedback').textContent='';$('#manual-dialog').showModal();$('#manual-form input[name=name]').focus()});
$('#manual-form')?.addEventListener('submit',async e=>{
 e.preventDefault();const form=e.currentTarget;if(saving||!form.reportValidity())return;const phone=form.elements.phone.value.replace(/\D/g,'');const result=$('#manual-feedback');
 if(!/^\d{2}9\d{8}$/.test(phone)){result.textContent='Informe o WhatsApp completo: DDD e nove dígitos.';return}
 const save=form.querySelector('[type=submit]');saving=true;save.disabled=true;const requestId=form.dataset.requestId||crypto.randomUUID();form.dataset.requestId=requestId;
 try{await call('manual',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({request_id:requestId,name:form.elements.name.value.trim(),phone,treatment:form.elements.treatment.value,campaign:form.elements.campaign.value,acknowledged:form.elements.acknowledged.checked})});form.dataset.requestId='';$('#manual-dialog').close();saving=false;$('#scope').value='active';$('#state').value='';$('#search').value=phone;page=1;await load();notice('Contato cadastrado. Abra a ficha para atribuir uma responsável e combinar o retorno.')}
 catch(err){result.textContent=err.message;result.className='error'}finally{saving=false;save.disabled=false}
});
$('#manual-dialog')?.addEventListener('close',()=>{if(!saving){$('#manual-form').reset();$('#manual-form').dataset.requestId=''}});
$('#scope')?.addEventListener('change',()=>{$('#state').value='';page=1;load()});

// Presentation only: choosing a profile does not authenticate a different person.
const operatorBar=$('#operator').closest('.operator-bar'),profileAvatar=el('div',undefined,'profile-avatar'),profileInitials=el('span','OP'),profilePhoto=el('img'),profileIdentity=el('div',undefined,'profile-identity');
profilePhoto.width=80;profilePhoto.height=80;profilePhoto.hidden=true;profileAvatar.append(profileInitials,profilePhoto);
const profileEyebrow=el('span','SEU ESPAÇO DE ATENDIMENTO','profile-eyebrow'),profileGreeting=el('h2','Quem vai cuidar dos contatos hoje?'),profileRole=el('p','Selecione seu perfil para começar.','profile-role');profileIdentity.append(profileEyebrow,profileGreeting,profileRole);
const profileControls=el('div',undefined,'profile-controls');profileControls.append(operatorBar.querySelector('label'),$('#operator'));
const switchPerson=button('Trocar pessoa',()=>{if(saving||detailDraft()||$('#manual-dialog').open&&manualDraft()){notice('Conclua ou descarte as alterações antes de trocar de pessoa.',true);return}$('#operator').value='';$('#operator').dispatchEvent(new Event('change'));$('#operator').focus()});switchPerson.id='switch-person';
const operatorNote=el('p','','operator-note');operatorNote.setAttribute('role','status');operatorBar.prepend(profileAvatar,profileIdentity,profileControls);operatorBar.append(switchPerson,operatorNote);
let profilePhotos=[],selectedOperator='';
function updateProfilePhotos(photos){profilePhotos=Array.isArray(photos)?photos:[];refreshProfile()}
function clearProfilePresentation(){profilePhotos=[];selectedOperator='';updateOperatorNote()}
function refreshProfile(){
 const id=$('#operator').value,profiles={'atendente-1':['Rosiane','Rosiane Oliveira Santiago','ASB · equipe de atendimento','RS'],'atendente-2':['Nayra','Nayra Almeida','Estagiária · equipe de atendimento','NA'],'atendente-3':['equipe de apoio','Apoio da clínica','Perfil geral · pessoa autorizada da clínica','AC']},p=profiles[id];
 document.body.dataset.profile=id||'neutral';profileGreeting.textContent=p?'Olá, '+p[0]+'.':'Quem vai cuidar dos contatos hoje?';profileRole.textContent=p?p[2]:'Escolha seu perfil. A sua fila fica organizada para você.';profileInitials.textContent=p?p[3]:'OP';profileAvatar.setAttribute('aria-label',p?'Identificação de '+p[1]:'Escolha um perfil');switchPerson.hidden=!p;
 const saved=profilePhotos.find(photo=>photo.staff_id===id&&!photo.hidden),src=saved?'api/staff-photo?id='+encodeURIComponent(id)+'&v='+saved.version:'';
 if(src){if(profilePhoto.getAttribute('src')!==src)profilePhoto.src=src;profilePhoto.alt='Foto de '+p[1];profilePhoto.hidden=false;profileInitials.hidden=true}else{profilePhoto.hidden=true;profilePhoto.removeAttribute('src');profilePhoto.alt='';profileInitials.hidden=false}
 const mine=$('.personal-queue button');if(mine){const active=!!id&&$('#assignee').value===id;mine.classList.add('mine-queue');mine.setAttribute('aria-pressed',String(active));mine.textContent=p?'Minha fila · '+p[0]:'Minha fila'}
}
profilePhoto.addEventListener('error',()=>{profilePhoto.hidden=true;profileInitials.hidden=false});
function updateOperatorNote(){const select=$('#operator');operatorNote.textContent=select.value?'Perfil selecionado: '+select.selectedOptions[0].textContent+'. Assuma um contato livre antes de ligar. A identificação é declarada; o acesso continua pelo e-mail compartilhado.':'Escolha Rosiane, Nayra ou Apoio da clínica. Todos usam o mesmo e-mail administrativo.';refreshProfile()}
$('#operator').addEventListener('change',()=>{if(saving||detailDraft()||$('#manual-dialog').open&&manualDraft()){$('#operator').value=selectedOperator;notice('Conclua as alterações antes de trocar de pessoa.',true);return}selectedOperator=$('#operator').value;updateOperatorNote();if(selectedOperator){for(const id of ['search','state','campaign','from','to','returns'])$('#'+id).value='';$('#scope').value='active';$('#assignee').value=selectedOperator;$('#order').value='queue';page=1;load(false)}else{$('#assignee').value='';page=1;load(false)}});updateOperatorNote();
const manualDraft=()=>{const form=$('#manual-form');return Boolean(form.elements.name.value.trim()||form.elements.phone.value.trim())};
function keepManualDraft(event){if(saving||manualDraft()&&!window.confirm('Descartar os dados deste cadastro? O contato ainda não foi salvo.')){event.preventDefault();event.stopImmediatePropagation()}}
$('#manual-dialog')?.addEventListener('cancel',keepManualDraft);
document.querySelector('[data-close="manual-dialog"]')?.addEventListener('click',keepManualDraft,true);
function watchDraft(form){for(const event of ['input','change'])form.addEventListener(event,()=>{form.dataset.unsaved='true'})}
function detailDraft(){return $('#detail')?.open&&Boolean($('#detail-body [data-unsaved="true"]'))}
function keepDetailDraft(event){if(saving||detailDraft()&&!window.confirm('Há alterações na ficha que ainda não foram salvas. Descartar e fechar?')){event.preventDefault();event.stopImmediatePropagation()}}
$('#detail').addEventListener('cancel',keepDetailDraft);
document.querySelector('[data-close="detail"]').addEventListener('click',keepDetailDraft,true);
window.addEventListener('beforeunload',event=>{if(saving||$('#manual-dialog')?.open&&manualDraft()||detailDraft()){event.preventDefault();event.returnValue=''}});

function updateWorkspace(){
 const active=['#hoje','#contatos','#equipe','#admin-summary'].includes(location.hash)?location.hash:'#hoje';
 document.querySelectorAll('.desk-nav a').forEach(a=>{if(a.hash===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 if(active==='#equipe')$('#equipe').open=true;
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String($('#state').value===b.dataset.filter)));
 const dateLabel=$('#desk-date');if(dateLabel)dateLabel.textContent=new Date().toLocaleDateString('pt-BR',{timeZone:'America/Belem',weekday:'long',day:'numeric',month:'long'});
 const advanced=['returns','assignee','campaign','from','to'].filter(id=>$('#'+id)?.value).length+($('#order')?.value!=='queue'?1:0);
 const count=$('#advanced-count');if(count){count.textContent=String(advanced);count.hidden=!advanced}
 refreshProfile();
}
window.addEventListener('hashchange',updateWorkspace);
$('#filters').addEventListener('change',updateWorkspace);
$('#clear').addEventListener('click',updateWorkspace);
$('#empty-new')?.addEventListener('click',()=>$('#manual-open').click());
$('#empty-clear')?.addEventListener('click',()=>$('#clear').click());
document.querySelector('.desk-nav a[href="#equipe"]')?.addEventListener('click',()=>{$('#equipe').open=true});
updateWorkspace();

async function claimContact(record){
 const operator=$('#operator').value;
 if(!operator){notice('Escolha quem está atendendo no topo antes de assumir um contato.',true);$('#operator').focus();return}
 if(saving||loading)return;saving=true;
 try{await call('claim',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({request_id:record.request_id})});saving=false;await load(false);notice('Contato atribuído a '+staffName(operator)+'. Use Minha fila para acompanhar seus atendimentos.')}
 catch(error){saving=false;await load(false);notice(error.message,true)}finally{saving=false}
}
const routine=el('section',undefined,'daily-routine');routine.setAttribute('aria-label','Rotina de atendimento');routine.append(el('strong','Sua rotina, em quatro passos'),el('p','Selecione seu nome → assuma um contato livre → faça o atendimento → registre a situação e o próximo retorno.','muted'));operatorBar.after(routine);
const personalQueue=el('div',undefined,'personal-queue');personalQueue.append(button('Minha fila',()=>{const id=$('#operator').value;if(!id){notice('Escolha seu perfil no topo para abrir sua fila.',true);$('#operator').focus();return}quickQueue({assignee:id})}),button('Contatos livres',()=>quickQueue({assignee:'unassigned'})),el('small','1. Escolha seu perfil · 2. Assuma o contato · 3. Converse · 4. Registre o próximo passo'));
$('#operator').closest('.operator-bar').after(personalQueue);
const claimGuide=el('li');claimGuide.append(el('strong','Divisão dos contatos: '),document.createTextNode('escolha Rosiane, Nayra ou Apoio da clínica e use Assumir contato na fila. Minha fila mostra os contatos do perfil escolhido. Apoio é um perfil geral, não uma pessoa cadastrada nem uma conta nova. A atribuição evita assumir simultaneamente o mesmo contato, mas não impede ligações externas: combine transferências com a equipe.'));$('.guide-list').prepend(claimGuide);

// Training is guidance only: no test contact is created or sent.
const training=el('section',undefined,'training-note');training.id='training-guide';
training.append(el('h3','Roteiro de atendimento'),el('p','Olá! Aqui é [seu nome], da Odonto Personnallite. Estamos retornando seu pedido. Podemos conversar sobre a disponibilidade de atendimento?','muted'));
const trainingSteps=el('ol');for(const text of ['Escolha seu perfil. Abra Contatos livres e use Assumir contato antes de ligar.','Após iniciar a conversa, marque Em atendimento. Abrir WhatsApp não muda a situação.','Se não houver resposta, combine a próxima tentativa com a equipe e registre Retornar em.','Para agendar, confirme profissional, duração e horário com a pessoa e a equipe; reserve na Agenda e atualize a situação para Agendado.','Para passar o atendimento, combine com a colega e altere a responsável na ficha.','Pedidos sobre dados pessoais vão para a administração. Lixeira é reversível e não equivale a eliminação definitiva.'])trainingSteps.append(el('li',text));
training.append(trainingSteps,el('p','Ensaio: pratique primeiro em ambiente de demonstração, com dados fictícios. Não crie contatos de teste na fila real, não faça ligações de teste para pacientes e não registre diagnósticos.','muted'));$('#guide .guide-list').before(training);
