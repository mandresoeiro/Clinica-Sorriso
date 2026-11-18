(() => {
 'use strict';
 const id='G-LLJLL8E1PH',key='clinic_analytics_consent_v1',ttl=180*86400000;
 const pages={'/tratamento-humanizado/':'lp1','/urgencia-protese-implante/':'lp2'};
 const landing=pages[location.pathname];if(!landing)return;
 const safeLocation='https://odontopersonnallite.com.br/landing/'+landing;
 let accepted=false,started=false,viewed=false;const leads=new Set();
 const consent={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
 window.dataLayer=window.dataLayer||[];
 function tag(){window.dataLayer.push(arguments)}
 window['ga-disable-'+id]=true;
 tag('consent','default',consent);
 const region=document.createElement('section');region.className='analytics-consent';region.setAttribute('aria-label','Preferências de cookies');
 region.innerHTML='<div><strong>Você escolhe como navegar.</strong><p>Com sua permissão, usamos o Google Analytics para medir visitas, cadastros concluídos e cliques no WhatsApp. Não enviamos os campos do formulário. Recusar não impede o atendimento.</p><a href="https://policies.google.com/technologies/partner-sites?hl=pt-BR" target="_blank" rel="noopener noreferrer">Como o Google usa esses dados ↗</a></div><div class="analytics-actions"><button type="button" data-consent="reject">Recusar análise</button><button type="button" data-consent="accept">Aceitar análise</button></div>';
 const preferences=document.createElement('button');preferences.type='button';preferences.className='analytics-preferences';preferences.textContent='Cookies';preferences.setAttribute('aria-label','Alterar preferências de cookies de análise');
 document.body.append(region,preferences);
 function store(value){try{localStorage.setItem(key,JSON.stringify({value,at:Date.now()}))}catch{}}
 function clearCookies(){for(const raw of document.cookie.split(';')){const name=raw.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of ['',location.hostname,'.odontopersonnallite.com.br'])document.cookie=name+'=; Max-Age=0; Path=/; Secure; SameSite=Lax'+(domain?'; Domain='+domain:'')}}
 function event(name){if(!accepted||!['page_view','generate_lead','whatsapp_click'].includes(name))return;tag('event',name,{send_to:id,landing_id:landing,page_location:safeLocation,page_title:'Odonto Personnallite | '+landing,page_referrer:'',transport_type:'beacon'})}
 function activate(){
  accepted=true;window['ga-disable-'+id]=false;
  tag('consent','update',{...consent,analytics_storage:'granted'});
  if(!started){
   started=true;tag('js',new Date());
   tag('config',id,{send_page_view:false,page_location:safeLocation,page_title:'Odonto Personnallite | '+landing,page_referrer:'',ignore_referrer:true,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_flags:'SameSite=Lax;Secure'});
   const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
  }
  if(!viewed){viewed=true;event('page_view')}
 }
 function choose(value){store(value);region.hidden=true;if(value==='granted')activate();else{accepted=false;viewed=false;window['ga-disable-'+id]=true;tag('consent','update',consent);clearCookies()}}
 region.querySelector('[data-consent="reject"]').addEventListener('click',()=>choose('denied'));
 region.querySelector('[data-consent="accept"]').addEventListener('click',()=>choose('granted'));
 preferences.addEventListener('click',()=>{region.hidden=false;region.querySelector('button').focus()});
 let saved;try{saved=JSON.parse(localStorage.getItem(key))}catch{}
 if(saved&&Date.now()-saved.at>=0&&Date.now()-saved.at<ttl&&['granted','denied'].includes(saved.value)){region.hidden=true;if(saved.value==='granted')activate()}
 document.addEventListener('click',e=>{const link=e.target.closest?.('a[href]');if(!link)return;try{if(new URL(link.href,location.href).hostname==='wa.me')event('whatsapp_click')}catch{}});
 window.addEventListener('clinic:lead-saved',e=>{const request=e.detail?.id;if(!accepted||typeof request!=='string'||leads.has(request))return;leads.add(request);event('generate_lead')});
 window.addEventListener('clinic:whatsapp-open',()=>event('whatsapp_click'));
})();
