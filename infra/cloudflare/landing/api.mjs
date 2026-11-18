const allowedHosts = new Set(['odontopersonnallite.com.br','www.odontopersonnallite.com.br']);
const contactCampaigns=['tratamento-humanizado','urgencia-protese-implante'];
const treatments=['Clínica Geral','Harmonização Facial','Endodontia','Ortodontia','Prótese Dentária','Implante Dentário','Quero uma avaliação'];
const urgencyTreatments=['Cimentação de coroa','Provisório','Fratura em prótese','Implante Dentário','Quero uma avaliação'];
const json=(v,status=200,headers={})=>Response.json(v,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const digest=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v))),n=>n.toString(16).padStart(2,'0')).join('');
async function bodyText(request){
  const reader=request.body?.getReader();if(!reader)return '';
  let total=0;const chunks=[];try{for(;;){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>4096){await reader.cancel();throw new Error('large')}chunks.push(value)}}finally{reader.releaseLock()}
  const bytes=new Uint8Array(total);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}return new TextDecoder().decode(bytes);
}
export async function api(request,env){
  const url=new URL(request.url),campaign=url.pathname.split('/')[1];
  if(!contactCampaigns.includes(campaign))return json({status:'not_found'},404);
  const prefix='/'+campaign+'/api/',route=url.pathname.slice(prefix.length);
  if(!url.pathname.startsWith(prefix))return json({status:'not_found'},404);
  if(!allowedHosts.has(url.hostname))return json({status:'forbidden'},403);
  if(request.method==='GET'&&route==='health'){
    try{await env.DB.prepare('SELECT request_id FROM contact_requests LIMIT 1').all();return json({database:'ready'})}catch{return json({database:'unavailable'},503)}
  }
  if(request.method==='GET'&&route==='contact/config'){
    if(!env.DB)return json({available:false},503);
    const token=crypto.randomUUID();
    return json({available:true,csrfToken:token},200,{'Set-Cookie':`clinic_contact_csrf=${token}; HttpOnly; Secure; SameSite=Strict; Path=${prefix}; Max-Age=1800`});
  }
  if(route!=='contact/requests')return json({status:'not_found'},404);
  if(request.method!=='POST')return json({status:'method_not_allowed'},405,{'Allow':'POST'});
  if(!env.DB)return json({status:'unavailable'},503);
  if(request.headers.get('Origin')!==url.origin)return json({status:'forbidden'},403);
  const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)clinic_contact_csrf=([^;]+)/)?.[1];
  if(!uuid(cookie)||cookie!==request.headers.get('X-CSRF-Token'))return json({status:'forbidden'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({status:'invalid'},415);
  let text;try{text=await bodyText(request)}catch{return json({status:'invalid'},413)}
  let d;try{d=JSON.parse(text)}catch{return json({status:'invalid'},400)}
  const fields=['name','phone','treatment','period','acknowledged','request_id','website','source'];
  if(!d||typeof d!=='object'||Array.isArray(d)||Object.keys(d).some(k=>!fields.includes(k))||d.acknowledged!==true||!uuid(d.request_id)||d.website||d.source!==undefined&&!['site-principal','ligacao'].includes(d.source)||d.source==='ligacao'&&campaign!=='tratamento-humanizado')return json({status:'invalid'},400);
  if(typeof d.name!=='string'||typeof d.phone!=='string'||!(campaign==='urgencia-protese-implante'?urgencyTreatments:treatments).includes(d.treatment)||!['','Manhã','Tarde','Sem preferência'].includes(d.period))return json({status:'invalid'},400);
  const name=d.name.trim();let phone=d.phone.replace(/\D/g,'');if(phone.startsWith('55')&&phone.length>11)phone=phone.slice(2);
  if(name.length<2||name.length>80||/[\x00-\x1f]/.test(name)||!/^[1-9][0-9]{9,10}$/.test(phone))return json({status:'invalid'},400);
  const savedCampaign=d.source==='site-principal'&&campaign==='tratamento-humanizado'?'site-principal':d.source==='ligacao'?'tratamento-humanizado-ligacao':campaign;
  const fingerprint=await digest(JSON.stringify(campaign==='tratamento-humanizado'?[name,phone,d.treatment,d.period,...(savedCampaign!==campaign?[savedCampaign]:[])]:[name,phone,d.treatment,d.period,campaign]));
  try{
    const prior=await env.DB.prepare('SELECT fingerprint FROM contact_requests WHERE request_id = ?').bind(d.request_id).first();
    if(prior)return prior.fingerprint===fingerprint?json({status:'received'}):json({status:'conflict'},409);
    const rateKey=await digest('personnallite:'+ (request.headers.get('CF-Connecting-IP')||'unknown')+':'+new Date().toISOString().slice(0,13));
    // Quota and insert are one SQLite statement, including across concurrent requests.
    await env.DB.prepare("INSERT INTO contact_requests (request_id,name,phone,treatment,period,campaign,status,owner_id,fingerprint,rate_key,acknowledged_at) SELECT ?,?,?,?,?,?,'novo',NULL,?,?,? WHERE (SELECT COUNT(*) FROM contact_requests WHERE rate_key = ?) < 8 ON CONFLICT(request_id) DO NOTHING")
      .bind(d.request_id,name,phone,d.treatment,d.period,savedCampaign,fingerprint,rateKey,new Date().toISOString(),rateKey).run();
    const saved=await env.DB.prepare('SELECT fingerprint FROM contact_requests WHERE request_id = ?').bind(d.request_id).first();
    if(!saved)return json({status:'try_later'},429,{'Retry-After':'3600'});
    return saved.fingerprint===fingerprint?json({status:'received'},201):json({status:'conflict'},409);
  }catch{return json({status:'unavailable'},503)}
}
