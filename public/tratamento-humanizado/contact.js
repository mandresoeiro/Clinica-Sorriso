const query=new URLSearchParams(location.search);const sources={google:'google',instagram:'instagram',facebook:'facebook',meta:'facebook'};const landingSource=sources[query.get('utm_source')]||'site';const campaign=query.get('utm_campaign')||'humanizado';const landingCampaign=/^[a-zA-Z][a-zA-Z0-9_-]{0,59}$/.test(campaign)&&!/[0-9]{8}/.test(campaign)?campaign:'humanizado';
const contactForm = document.querySelector('#whatsapp-form');
let requestId=crypto.randomUUID(),submitting=false,successTimer;
contactForm.addEventListener('input',()=>{requestId=crypto.randomUUID();contactForm.elements.telefone.setCustomValidity('');});
contactForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if (submitting || !contactForm.reportValidity()) return;
  const callback=event.submitter?.value==='callback';
  const successToast=document.querySelector('#callback-success');if(successToast){clearTimeout(successTimer);successToast.hidden=true;}
  const fields=contactForm.elements;
  const name=fields.nome.value.trim();
  let phone=fields.telefone.value.replace(/\D/g,'');
  if (phone.startsWith('55') && phone.length>11) phone=phone.slice(2);
  if (!/^[1-9][0-9]{9,10}$/.test(phone)) {fields.telefone.setCustomValidity('Informe o número completo com DDD.');fields.telefone.reportValidity();return;}
  const treatment=fields.tratamento.value, period='';
  const message=['Olá! Conheci a página de atendimento humanizado da Odonto Personnallite.','Nome: '+name,'WhatsApp: '+phone,'Interesse: '+treatment,'Gostaria de consultar os horários disponíveis.'].join('\n');
  const url='https://wa.me/5591981888353?text='+encodeURIComponent(message);
  const fallback=document.querySelector('#form-fallback'), status=document.querySelector('#form-feedback'), button=contactForm.querySelector('[type=submit]');
  fallback.href=url; fallback.hidden=true; status.classList.remove('form-error');
  submitting=true;button.disabled=true;if(event.submitter)event.submitter.disabled=true;status.textContent='Registrando sua solicitação…';
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
  try {
    const config=await fetch('/api/v1/contact/config/',{credentials:'same-origin',cache:'no-store',signal:controller.signal});
    if (!config.ok) throw Error('unavailable');
    const {csrfToken}=await config.json();
    if (typeof csrfToken!=='string') throw Error('unavailable');
    const response=await fetch('/api/v1/contact/requests/',{method:'POST',credentials:'same-origin',signal:controller.signal,headers:{'Content-Type':'application/json','X-CSRFToken':csrfToken},body:JSON.stringify({name,phone,treatment,period,request_id:requestId,acknowledged:fields.acknowledged.checked,website:'',...(callback?{source:'ligacao'}:{})})});
    const result=await response.json();
    if (!response.ok || result.status!=='received') throw Error(response.status===429?'rate':'unavailable');
    status.textContent=callback?'Obrigado pelo contato! Recebemos sua solicitação. Nossa recepção ligará para você conforme a disponibilidade.':'Solicitação registrada. Revise e confirme a mensagem no WhatsApp.';
    fallback.textContent='Continuar no WhatsApp ↗';fallback.hidden=callback;
    if(callback&&successToast){successToast.hidden=false;successTimer=setTimeout(()=>{successToast.hidden=true},3000);}
    window.dispatchEvent(new CustomEvent('clinic:lead-saved',{detail:{id:requestId}}));
    if(!callback){window.dispatchEvent(new Event('clinic:whatsapp-open'));
    if(window.clinicMeasurement){window.clinicMeasurement.openWhatsApp(url);}else{window.location.assign(url);}}
  } catch(error) {
    status.classList.add('form-error');
    status.textContent=error.message==='rate'?'Muitas tentativas. Aguarde ou use o WhatsApp abaixo.':'Não conseguimos confirmar o registro. Tente novamente ou fale diretamente pelo WhatsApp abaixo.';
    fallback.textContent='Conversar pelo WhatsApp sem confirmar o registro ↗';fallback.hidden=false;
  } finally {clearTimeout(timer);submitting=false;button.disabled=false;if(event.submitter)event.submitter.disabled=false;}
});

