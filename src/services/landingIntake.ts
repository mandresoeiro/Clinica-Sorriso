export async function saveLandingIntake(payload: {request_id:string;name:string;phone:string;treatment:string;period:string;acknowledged:boolean}) {
  const base='/tratamento-humanizado/api/contact/'
  const controller=new AbortController()
  const timeout=setTimeout(()=>controller.abort(),15000)
  try {
    const config=await fetch(base+'config',{credentials:'same-origin',cache:'no-store',signal:controller.signal})
    if(!config.ok)throw Error('Não foi possível conectar. Tente novamente.')
    const session=await config.json()
    if(typeof session.csrfToken!=='string')throw Error('Não foi possível validar o envio.')
    const response=await fetch(base+'requests',{method:'POST',credentials:'same-origin',signal:controller.signal,headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrfToken},body:JSON.stringify({...payload,website:'',source:'site-principal'})})
    if(!response.ok)throw Error(response.status===429?'Muitas tentativas. Aguarde ou converse diretamente pelo WhatsApp.':'Não foi possível registrar. Tente novamente ou use o WhatsApp.')
    if((await response.json()).status!=='received')throw Error('Recebimento não confirmado. Tente novamente.')
  } finally {clearTimeout(timeout)}
}
