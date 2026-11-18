let staffSequence=0,staffWriteGeneration=null;
async function loadStaff(){
 if(staffWriteGeneration===privateGeneration)return;
 const generation=privateGeneration,request=++staffSequence,area=$('#staff-cards');
 let photos=[],available=true;
 try{photos=(await call('staff')).staff}catch{available=false}
 if(request!==staffSequence||generation!==privateGeneration)return;
 area.replaceChildren();
 updateProfilePhotos(photos);
 for(const [id,name,description] of [['atendente-1','Rosiane Oliveira Santiago','ASB · registro informado 1090 · UF a confirmar'],['atendente-2','Nayra Almeida','Estagiária'],['atendente-3','Apoio da clínica','Perfil geral · pessoa autorizada da clínica']]){
  area.append(staffCard(id,name,description,photos.find(photo=>photo.staff_id===id),available,generation));
 }
 if(!available)area.append(el('p','Fotos reais indisponíveis no momento. Os avatares ilustrativos continuam sendo exibidos.','error'));
}

function staffCard(id,name,description,saved,available,generation){
 const card=el('article',undefined,'staff-card'),img=el('img'),caption=el('small');
 img.width=48;
 img.height=48;
 img.addEventListener('error',()=>{
  if(img.getAttribute('src')==='avatar.svg')return;
  img.src='avatar.svg';
  img.alt='Avatar ilustrativo';
  caption.textContent='Foto indisponível';
 });
 const identity=el('div',undefined,'staff-identity');
 identity.append(el('h3',name),el('p',description,'muted'),caption);
 const input=el('input');
 input.type='file';
 input.accept='image/jpeg,image/png,image/webp';
 input.hidden=true;
 const choose=button('',()=>{if(!saving)input.click()});
 choose.disabled=!available;
 const visibility=button('',async()=>{
  if(saving||!saved)return;
  const hidden=!saved.hidden;
  if(!confirm(hidden?'Ocultar a foto? Ela ficará guardada e poderá ser mostrada novamente. Isso não exclui o arquivo.':'Mostrar novamente a foto no painel?'))return;
  await changePhoto('staff-visibility',{hidden},hidden);
 });
 const actions=el('div',undefined,'staff-actions');
 actions.append(input,choose,visibility);
 const message=el('div',undefined,'staff-feedback');
 message.setAttribute('role','status');
 card.append(img,identity,actions,message);

 function updateCard(){
  const visible=saved&&!saved.hidden;
  img.alt=visible?'Foto de '+name:'Avatar ilustrativo de '+name;
  img.src=visible?'api/staff-photo?id='+id+'&v='+saved.version:'avatar.svg';
  caption.textContent=visible?'Foto cadastrada':saved?'Foto oculta':available?'Sem foto':'Status indisponível';
  const action=saved?'Trocar foto':'Adicionar foto';
  choose.textContent=action;
  choose.setAttribute('aria-label',action+' de '+name);
  visibility.textContent=saved?.hidden?'Mostrar foto':'Ocultar foto';
  visibility.hidden=!saved;
 }
 updateCard();

 async function changePhoto(route,fields,hidden,prepare){
  saving=true;
  staffWriteGeneration=generation;
  staffSequence++;
  const version=saved?.version||0;
  try{
   if(prepare)fields.photo=await prepare();
   if(generation!==privateGeneration)return;
   await call(route,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({id,version,...fields})});
   if(generation!==privateGeneration)return;
   saved={staff_id:id,version:version+1,hidden};
   updateCard();
   const photos=[...profilePhotos.filter(photo=>photo.staff_id!==id),saved];
   if($('#operator').value===id)updateProfilePhotos(photos);
   else profilePhotos=photos;
   message.textContent=route==='staff'?'Foto salva.':'';
  }catch(error){
   if(generation===privateGeneration)message.textContent=error.message;
  }finally{
   saving=false;
   staffWriteGeneration=null;
  }
 }

 input.addEventListener('change',async()=>{
  const file=input.files?.[0];
  input.value='';
  if(!file||saving)return;
  if(!input.accept.split(',').includes(file.type)||file.size>5000000){
   message.textContent='Use JPG, PNG ou WebP de até 5 MB.';
   return;
  }
  if(!confirm('Você confirma que tem autorização para usar esta foto de '+name+' no painel interno da clínica?'))return;
  message.textContent='Preparando foto…';
  await changePhoto('staff',{},false,async()=>{
   const photo=await framePhoto(file,name,generation);
   if(photo.length>110000)throw Error('Escolha uma foto menor.');
   return photo;
  });
 });
 return card;
}
async function framePhoto(file,name,generation){
 const bitmap=await createImageBitmap(file);if(generation!==privateGeneration){bitmap.close();throw Error('A sessão mudou. Entre novamente.')}if(bitmap.width*bitmap.height>40000000){bitmap.close();throw Error('Imagem muito grande. Escolha uma foto menor.')}
 return new Promise((resolve,reject)=>{
  const dialog=el('dialog');dialog.id='photo-editor';dialog.setAttribute('aria-label','Ajustar foto de '+name);
  const canvas=el('canvas');canvas.width=256;canvas.height=256;canvas.setAttribute('aria-label','Prévia do enquadramento');
  const ctx=canvas.getContext('2d'),zoom=el('input'),horizontal=el('input'),vertical=el('input');
  for(const [input,title,min,max,value,step] of [[zoom,'Zoom',1,3,1,.05],[horizontal,'Posição horizontal',-100,100,0,1],[vertical,'Posição vertical',-100,100,0,1]]){input.type='range';input.min=min;input.max=max;input.step=step;input.value=value;const label=el('label',title);label.append(input);dialog.append(label);input.addEventListener('input',draw)}
  function draw(){const side=Math.min(bitmap.width,bitmap.height)/Number(zoom.value),x=(bitmap.width-side)*(Number(horizontal.value)+100)/200,y=(bitmap.height-side)*(Number(vertical.value)+100)/200;ctx.fillStyle='#fff';ctx.fillRect(0,0,256,256);ctx.drawImage(bitmap,x,y,side,side,0,0,256,256)}
  let completed=false;
  dialog.prepend(el('h2','Ajustar foto de '+name),el('p','Use uma foto autorizada do rosto em JPG, PNG ou WebP de até 5 MB. Ajuste o zoom e a posição na prévia. A foto será salva apenas no painel interno.','muted'),canvas);dialog.append(button('Cancelar',()=>dialog.close()),button('Usar foto',()=>{completed=true;const photo=canvas.toDataURL('image/jpeg',.8);dialog.close();resolve(photo)},'primary'));
  dialog.addEventListener('close',()=>{bitmap.close();dialog.remove();if(!completed)reject(Error('Envio cancelado.'))});document.body.append(dialog);draw();dialog.showModal();
 });
}
