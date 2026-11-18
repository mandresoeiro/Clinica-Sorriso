const toggle=document.querySelector('.menu-toggle');const menu=document.querySelector('#menu');function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');menu.classList.remove('is-open')}toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');menu.classList.toggle('is-open',open)});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});const privacy=document.querySelector('#privacy');document.querySelector('#privacy-open').addEventListener('click',()=>privacy.showModal());document.querySelector('#privacy-close').addEventListener('click',()=>privacy.close());
const careTeam=document.querySelector('.care-team');
careTeam?.querySelector('.care-team__pause')?.addEventListener('click',event=>{
 const paused=careTeam.classList.toggle('is-paused');
 event.currentTarget.setAttribute('aria-pressed',String(paused));
 event.currentTarget.textContent=paused?'Continuar movimento':'Pausar movimento';
});
