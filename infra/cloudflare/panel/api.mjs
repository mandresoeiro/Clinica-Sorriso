import {receptionOperations} from './operations-api.mjs';
const panelUuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
async function panelBodyText(request,maxBytes=1024){
 const reader=request.body?.getReader();if(!reader)return '';
 let total=0,text='';const decoder=new TextDecoder();
 try{for(;;){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>maxBytes){await reader.cancel();throw Error('large')}text+=decoder.decode(value,{stream:true})}return text+decoder.decode()}finally{reader.releaseLock()}
}
const panelBase='/tratamento-humanizado/painel/';
const panelStates=['novo','em_atendimento','agendado','arquivado','excluido'];
const panelDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
const panelJson=(value,status=200,headers={})=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',...headers}});
export async function panelApi(request,env,user){
 if(!user)return panelJson({error:'login_required'},401);
 const role=(env.PANEL_ADMIN_EMAILS||'').split(',').map(v=>v.trim().toLowerCase()).includes(user.email)?'admin':'reception';
 let staffId=null;try{const mapping=JSON.parse(env.PANEL_STAFF_EMAILS||'{}');const id=mapping[user.email];if(['atendente-1','atendente-2','atendente-3'].includes(id))staffId=id}catch{}
 const url=new URL(request.url),route=url.pathname.slice((panelBase+'api/').length);
 if(route==='session'&&request.method==='GET'){
  const token=crypto.randomUUID();
  return panelJson({email:user.email,csrfToken:token,expiresAt:user.expiresAt||null,role,staffId},200,{'Set-Cookie':`clinic_panel_csrf=${token}; HttpOnly; Secure; SameSite=Strict; Path=${panelBase}api/; Max-Age=1800`});
 }
 const operator=request.headers.get('X-Operator-Id')||'';
 if(!['','atendente-1','atendente-2','atendente-3'].includes(operator))return panelJson({error:'invalid_operator'},400);
 const auditActor=user.email+(operator?' · identificação declarada: '+({'atendente-1':'Rosiane Oliveira Santiago','atendente-2':'Nayra Almeida','atendente-3':'Apoio da clínica'}[operator]):'');
 if(!env.DB)return panelJson({error:'unavailable'},503);
 if(['today','manual','appointment'].includes(route))return receptionOperations(request,env,{...user,email:auditActor},route,url,panelBodyText);
 const staffIds=['atendente-1','atendente-2','atendente-3'];
 if(route==='staff'&&request.method==='GET'){
  try{const data=await env.DB.prepare('SELECT p.staff_id,p.version,p.updated_by,p.updated_at,COALESCE(v.hidden,0) AS hidden FROM reception_staff_photos p LEFT JOIN reception_staff_photo_visibility v ON v.staff_id=p.staff_id').all();return panelJson({staff:data.results})}catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='staff-photo'&&request.method==='GET'){
  const id=url.searchParams.get('id');if(!staffIds.includes(id))return panelJson({error:'invalid'},400);
  try{const row=await env.DB.prepare('SELECT photo FROM reception_staff_photos p WHERE staff_id=? AND NOT EXISTS (SELECT 1 FROM reception_staff_photo_visibility v WHERE v.staff_id=p.staff_id AND v.hidden=1)').bind(id).first();if(!row)return panelJson({error:'not_found'},404);const match=row.photo.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);if(!match)return panelJson({error:'unavailable'},503);const bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));return new Response(bytes,{headers:{'Content-Type':match[1],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'"}})}catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='staff-visibility'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return panelJson({error:'forbidden'},403);
  const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)clinic_panel_csrf=([^;]+)/)?.[1];
  if(!cookie||cookie!==request.headers.get('X-CSRF-Token'))return panelJson({error:'forbidden'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return panelJson({error:'invalid'},415);
  let d;try{d=JSON.parse(await panelBodyText(request))}catch{return panelJson({error:'invalid'},400)}
  if(!d||Array.isArray(d)||Object.keys(d).some(k=>!['id','hidden','version'].includes(k))||!staffIds.includes(d.id)||typeof d.hidden!=='boolean'||!Number.isInteger(d.version)||d.version<1)return panelJson({error:'invalid'},400);
  try{const results=await env.DB.batch([
   env.DB.prepare('UPDATE reception_staff_photos SET version=version+1,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE staff_id=? AND version=?').bind(auditActor,d.id,d.version),
   env.DB.prepare('INSERT INTO reception_staff_photo_visibility (staff_id,hidden,updated_by) SELECT ?,?,? WHERE changes()=1 ON CONFLICT(staff_id) DO UPDATE SET hidden=excluded.hidden,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP').bind(d.id,Number(d.hidden),auditActor)
  ]);return results[0].meta.changes?panelJson({status:'updated'}):panelJson({error:'conflict'},409)}catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='staff'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return panelJson({error:'forbidden'},403);
  const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)clinic_panel_csrf=([^;]+)/)?.[1];
  if(!cookie||cookie!==request.headers.get('X-CSRF-Token'))return panelJson({error:'forbidden'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return panelJson({error:'invalid'},415);
  let d;try{d=JSON.parse(await panelBodyText(request,115000))}catch{return panelJson({error:'invalid'},400)}
  if(!d||Array.isArray(d)||Object.keys(d).some(k=>!['id','photo','version'].includes(k))||!staffIds.includes(d.id)||typeof d.photo!=='string'||d.photo.length>110000||!Number.isInteger(d.version)||d.version<0)return panelJson({error:'invalid'},400);
  const m=d.photo.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/);if(!m)return panelJson({error:'invalid'},400);
  let raw;try{raw=atob(m[2])}catch{return panelJson({error:'invalid'},400)}
  const png=raw.startsWith('\x89PNG\r\n\x1a\n'),jpg=raw.startsWith('\xff\xd8\xff'),webp=raw.startsWith('RIFF')&&raw.slice(8,12)==='WEBP';
  if(raw.length>81920||raw.length<24||!(m[1]==='image/png'&&png||m[1]==='image/jpeg'&&jpg||m[1]==='image/webp'&&webp))return panelJson({error:'invalid'},400);
  try{const statement=env.DB.prepare('INSERT INTO reception_staff_photos (staff_id,photo,version,updated_by) SELECT ?,?,1,? WHERE ?=0 OR EXISTS (SELECT 1 FROM reception_staff_photos WHERE staff_id=? AND version=?) ON CONFLICT(staff_id) DO UPDATE SET photo=excluded.photo,version=reception_staff_photos.version+1,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP WHERE reception_staff_photos.version=?').bind(d.id,d.photo,auditActor,d.version,d.id,d.version,d.version);const result=await env.DB.batch([statement,env.DB.prepare('INSERT INTO reception_staff_photo_visibility (staff_id,hidden,updated_by) SELECT ?,0,? WHERE changes()=1 ON CONFLICT(staff_id) DO UPDATE SET hidden=0,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP').bind(d.id,auditActor)]);if(!result[0].meta.changes)return panelJson({error:'conflict'},409);return panelJson({status:'updated'})}catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='requests'&&request.method==='GET'){
  const state=url.searchParams.get('status')||'',q=(url.searchParams.get('q')||'').trim(),page=Number(url.searchParams.get('page')||1);
  let assignee=url.searchParams.get('assignee')||'';if(assignee==='mine'){if(!staffId)return panelJson({error:'staff_not_mapped'},400);assignee=staffId}
  const returns=url.searchParams.get('returns')||'';if(!['','overdue','today','future'].includes(returns))return panelJson({error:'invalid'},400);
  if(!['','unassigned','atendente-1','atendente-2','atendente-3'].includes(assignee))return panelJson({error:'invalid'},400);
  const campaign=url.searchParams.get('campaign')||'',from=url.searchParams.get('from')||'',to=url.searchParams.get('to')||'',order=url.searchParams.get('order')||'recent';
  const validDate=d=>!d||/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
  if(state&&!panelStates.includes(state)||q.length>80||!Number.isInteger(page)||page<1||page>2000||campaign&&!['site-principal','tratamento-humanizado','tratamento-humanizado-ligacao','urgencia-protese-implante','manual-whatsapp','manual-telefone','manual-presencial'].includes(campaign)||!validDate(from)||!validDate(to)||from&&to&&from>to||!['recent','oldest','queue'].includes(order))return panelJson({error:'invalid'},400);
  const scope=url.searchParams.get('scope')||'all';if(!['all','active','trash','tests'].includes(scope))return panelJson({error:'invalid'},400);
  const clauses=[scope==='trash'||state==='excluido'?"status='excluido'":"status IN ('novo','em_atendimento','agendado','arquivado')",scope==='tests'?"name LIKE 'TESTE TECNICO - %'":"name NOT LIKE 'TESTE TECNICO - %'"],args=[];
  if(scope==='active')clauses.push("status!='arquivado'");
  if(returns){const now=new Date(),day=new Date(now.getTime()-10800000).toISOString().slice(0,10),start=day+'T03:00:00.000Z',end=new Date(Date.parse(start)+86400000).toISOString();clauses.push("status IN ('novo','em_atendimento')");const condition=returns==='overdue'?'w.callback_at < ?':returns==='today'?'w.callback_at >= ? AND w.callback_at < ?':'w.callback_at >= ?';clauses.push("EXISTS (SELECT 1 FROM contact_request_workflow w WHERE w.request_id=contact_requests.request_id AND w.callback_at != '' AND "+condition+")");args.push(...(returns==='overdue'?[now.toISOString()]:returns==='today'?[start,end]:[end]))}
  if(assignee==='unassigned')clauses.push("NOT EXISTS (SELECT 1 FROM contact_request_workflow w WHERE w.request_id=contact_requests.request_id AND w.assignee != '')");
  else if(assignee){clauses.push('EXISTS (SELECT 1 FROM contact_request_workflow w WHERE w.request_id=contact_requests.request_id AND w.assignee = ?)');args.push(assignee)}
  if(state){clauses.push('status = ?');args.push(state)}
  if(campaign){clauses.push('campaign = ?');args.push(campaign)}
  if(from){clauses.push('created_at >= ?');args.push(new Date(from+'T00:00:00-03:00').toISOString().slice(0,19).replace('T',' '))}
  if(to){clauses.push('created_at < ?');args.push(new Date(Date.parse(to+'T00:00:00-03:00')+86400000).toISOString().slice(0,19).replace('T',' '))}
  if(q){clauses.push("(name LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\')");const search='%'+q.replace(/[\\%_]/g,s=>'\\'+s)+'%';args.push(search,search)}
  const where=clauses.join(' AND ');
  const sorting=order==='queue'?"CASE status WHEN 'novo' THEN 0 WHEN 'em_atendimento' THEN 1 WHEN 'agendado' THEN 2 ELSE 3 END,created_at ASC,request_id ASC":order==='oldest'?'created_at ASC,request_id ASC':'created_at DESC,request_id DESC';
  try{
   const data=await env.DB.batch([
    env.DB.prepare('SELECT request_id,name,phone,treatment,period,campaign,status,created_at,(SELECT assignee FROM contact_request_workflow w WHERE w.request_id=contact_requests.request_id) AS assignee,(SELECT callback_at FROM contact_request_workflow w WHERE w.request_id=contact_requests.request_id) AS callback_at FROM contact_requests WHERE '+where+' ORDER BY '+sorting+' LIMIT 30 OFFSET ?').bind(...args,(page-1)*30),
    env.DB.prepare('SELECT COUNT(*) AS total FROM contact_requests WHERE '+where).bind(...args),
    env.DB.prepare("SELECT status,COUNT(*) AS total FROM contact_requests WHERE status IN ('novo','em_atendimento','agendado','arquivado','excluido') AND name NOT LIKE 'TESTE TECNICO - %' GROUP BY status")
   ]);
   const summary=Object.fromEntries(panelStates.map(s=>[s,0]));for(const row of data[2].results)summary[row.status]=row.total;
   const total=data[1].results[0].total;
   return panelJson({requests:data[0].results,summary,pagination:{page,total,pages:Math.max(1,Math.ceil(total/30))}});
  }catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='detail'&&request.method==='GET'){
  const id=url.searchParams.get('id');if(!panelUuid(id))return panelJson({error:'invalid'},400);
  try{
   const record=await env.DB.prepare("SELECT request_id,name,phone,treatment,period,campaign,status,created_at FROM contact_requests WHERE request_id = ? AND status IN ('novo','em_atendimento','agendado','arquivado','excluido')").bind(id).first();
   if(!record)return panelJson({error:'not_found'},404);
   const history=await env.DB.prepare('SELECT actor,old_status,new_status,created_at FROM contact_request_events WHERE request_id = ? ORDER BY created_at DESC,event_id DESC LIMIT 50').bind(id).all();
   return panelJson({record,history:history.results});
  }catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='report'&&request.method==='GET'){
  if(role!=='admin')return panelJson({error:'insufficient_role'},403);
  const day=new Date(Date.now()-10800000).toISOString().slice(0,10),from=url.searchParams.get('from')||day,to=url.searchParams.get('to')||day,campaign=url.searchParams.get('campaign')||'';
  let assignee=url.searchParams.get('assignee')||'';if(assignee==='mine'){if(!staffId)return panelJson({error:'staff_not_mapped'},400);assignee=staffId}
  if(!panelDate(from)||!panelDate(to)||from>to||!['','site-principal','tratamento-humanizado','tratamento-humanizado-ligacao','urgencia-protese-implante','manual-whatsapp','manual-telefone','manual-presencial'].includes(campaign)||!['','unassigned',...staffIds].includes(assignee))return panelJson({error:'invalid'},400);
  const start=from+' 03:00:00',end=new Date(Date.parse(to+'T03:00:00Z')+86400000).toISOString().slice(0,19).replace('T',' '),clauses=["c.status IN ('novo','em_atendimento','agendado','arquivado')", "c.name NOT LIKE 'TESTE TECNICO - %'"],args=[];
  if(campaign){clauses.push('c.campaign=?');args.push(campaign)}
  if(assignee==='unassigned')clauses.push("COALESCE(w.assignee,'')=''");else if(assignee){clauses.push('w.assignee=?');args.push(assignee)}
  const where=clauses.join(' AND ');
  try{const data=await env.DB.batch([
   env.DB.prepare("SELECT c.campaign,COALESCE(w.assignee,'') AS assignee,c.status,COUNT(*) AS total FROM contact_requests c LEFT JOIN contact_request_workflow w ON w.request_id=c.request_id WHERE c.created_at>=? AND c.created_at<? AND "+where+' GROUP BY c.campaign,w.assignee,c.status').bind(start,end,...args),
   env.DB.prepare("SELECT COUNT(*) AS total FROM contact_request_events e JOIN contact_requests c ON c.request_id=e.request_id LEFT JOIN contact_request_workflow w ON w.request_id=c.request_id WHERE e.created_at>=? AND e.created_at<? AND e.new_status='agendado' AND "+where).bind(start,end,...args),
   env.DB.prepare("SELECT c.treatment,c.status,c.campaign,COUNT(*) AS total FROM contact_requests c LEFT JOIN contact_request_workflow w ON w.request_id=c.request_id WHERE c.created_at>=? AND c.created_at<? AND "+where+' GROUP BY c.treatment,c.status,c.campaign').bind(start,end,...args)
  ]);return panelJson({day,from,to,groups:data[0].results,treatments:data[2].results,newContacts:data[0].results.reduce((n,r)=>n+r.total,0),bookingChanges:data[1].results[0].total})}catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='reminders'&&request.method==='GET'){
  try{const data=await env.DB.prepare("SELECT c.request_id,c.name,w.assignee,w.callback_at FROM contact_request_workflow w JOIN contact_requests c ON c.request_id=w.request_id WHERE c.status IN ('novo','em_atendimento') AND w.callback_at != '' AND w.callback_at <= ? ORDER BY w.callback_at LIMIT 30").bind(new Date().toISOString()).all();return panelJson({reminders:data.results})}catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='claim'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return panelJson({error:'forbidden'},403);
  const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)clinic_panel_csrf=([^;]+)/)?.[1];
  if(!cookie||cookie!==request.headers.get('X-CSRF-Token'))return panelJson({error:'forbidden'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return panelJson({error:'invalid'},415);
  let d;try{d=JSON.parse(await panelBodyText(request))}catch{return panelJson({error:'invalid'},400)}
  if(!operator||!d||Array.isArray(d)||Object.keys(d).some(k=>k!=='request_id')||!panelUuid(d.request_id))return panelJson({error:'invalid'},400);
  try{
   const result=await env.DB.batch([
    env.DB.prepare("INSERT INTO contact_request_workflow (request_id,assignee,updated_by) SELECT request_id,?,? FROM contact_requests WHERE request_id=? AND status IN ('novo','em_atendimento','agendado') ON CONFLICT(request_id) DO UPDATE SET assignee=excluded.assignee,version=contact_request_workflow.version+1,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP WHERE contact_request_workflow.assignee='' ").bind(operator,auditActor,d.request_id),
    env.DB.prepare('INSERT INTO contact_workflow_events (event_id,request_id,actor,version) SELECT ?,request_id,?,version FROM contact_request_workflow WHERE request_id=? AND changes()=1').bind(crypto.randomUUID(),auditActor,d.request_id),
    env.DB.prepare('INSERT INTO contact_workflow_snapshots (event_id,request_id,assignee,callback_at,appointment_at,professional,actor,version) SELECT ?,request_id,assignee,callback_at,appointment_at,professional,?,version FROM contact_request_workflow WHERE request_id=? AND changes()=1').bind(crypto.randomUUID(),auditActor,d.request_id)
   ]);
   if(!result[0].meta.changes)return panelJson({error:'already_assigned'},409);
   return panelJson({status:'assigned',assignee:operator});
  }catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='workflow'&&request.method==='GET'){
  const id=url.searchParams.get('id');if(!panelUuid(id))return panelJson({error:'invalid'},400);
  try{
   const record=await env.DB.prepare("SELECT request_id FROM contact_requests WHERE request_id = ? AND status IN ('novo','em_atendimento','agendado','arquivado')").bind(id).first();
   if(!record)return panelJson({error:'not_found'},404);
   const workflow=await env.DB.prepare('SELECT assignee,callback_at,appointment_at,professional,version,updated_by,updated_at FROM contact_request_workflow WHERE request_id = ?').bind(id).first();
   const history=await env.DB.prepare('SELECT assignee,callback_at,appointment_at,professional,actor,version,created_at FROM contact_workflow_snapshots WHERE request_id=? ORDER BY version DESC LIMIT 50').bind(id).all();
   return panelJson({workflow:workflow||{assignee:'',callback_at:'',appointment_at:'',professional:'',version:0},history:history.results});
  }catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='workflow'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return panelJson({error:'forbidden'},403);
  const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)clinic_panel_csrf=([^;]+)/)?.[1];
  if(!cookie||cookie!==request.headers.get('X-CSRF-Token'))return panelJson({error:'forbidden'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return panelJson({error:'invalid'},415);
  let d;try{d=JSON.parse(await panelBodyText(request))}catch{return panelJson({error:'invalid'},400)}
  const time=v=>typeof v==='string'&&(v===''||/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString()===v);
  if(!d||Array.isArray(d)||Object.keys(d).some(k=>!['request_id','assignee','callback_at','appointment_at','professional','version'].includes(k))||!panelUuid(d.request_id)||!['','atendente-1','atendente-2','atendente-3'].includes(d.assignee)||!time(d.callback_at)||!time(d.appointment_at)||typeof d.professional!=='string'||d.professional.length>80||/[\x00-\x1f]/.test(d.professional)||!Number.isInteger(d.version)||d.version<0)return panelJson({error:'invalid'},400);
  try{
   const record=await env.DB.prepare("SELECT request_id FROM contact_requests WHERE request_id = ? AND status IN ('novo','em_atendimento','agendado','arquivado')").bind(d.request_id).first();
   if(!record)return panelJson({error:'not_found'},404);
   const result=await env.DB.batch([
    env.DB.prepare('INSERT INTO contact_request_workflow (request_id,assignee,callback_at,appointment_at,professional,version,updated_by) SELECT ?,?,?,?,?,1,? WHERE ? = 0 OR EXISTS (SELECT 1 FROM contact_request_workflow WHERE request_id = ? AND version = ?) ON CONFLICT(request_id) DO UPDATE SET assignee=excluded.assignee,callback_at=excluded.callback_at,appointment_at=excluded.appointment_at,professional=excluded.professional,version=contact_request_workflow.version+1,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP WHERE contact_request_workflow.version = ?').bind(d.request_id,d.assignee,d.callback_at,d.appointment_at,d.professional.trim(),auditActor,d.version,d.request_id,d.version,d.version),
    env.DB.prepare('INSERT INTO contact_workflow_events (event_id,request_id,actor,version) SELECT ?,request_id,?,version FROM contact_request_workflow WHERE request_id = ? AND changes() = 1').bind(crypto.randomUUID(),auditActor,d.request_id),
    env.DB.prepare('INSERT INTO contact_workflow_snapshots (event_id,request_id,assignee,callback_at,appointment_at,professional,actor,version) SELECT ?,request_id,assignee,callback_at,appointment_at,professional,?,version FROM contact_request_workflow WHERE request_id=? AND changes()=1').bind(crypto.randomUUID(),auditActor,d.request_id)
   ]);
   if(!result[0].meta.changes)return panelJson({error:'conflict'},409);
   return panelJson({status:'updated'});
  }catch{return panelJson({error:'unavailable'},503)}
 }
 if(route==='status'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return panelJson({error:'forbidden'},403);
  const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)clinic_panel_csrf=([^;]+)/)?.[1];
  if(!cookie||cookie!==request.headers.get('X-CSRF-Token'))return panelJson({error:'forbidden'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return panelJson({error:'invalid'},415);
  let data;try{data=JSON.parse(await panelBodyText(request))}catch{return panelJson({error:'invalid'},400)}
  if(!data||Array.isArray(data)||Object.keys(data).some(k=>!['request_id','status','expected_status'].includes(k))||!panelUuid(data.request_id)||!panelStates.includes(data.status)||!panelStates.includes(data.expected_status))return panelJson({error:'invalid'},400);
  if(data.status===data.expected_status)return panelJson({error:'invalid'},400);
  try{
   // Audit and conditional change share one D1 transaction; a concurrent edit returns 409.
   const batch=await env.DB.batch([
    env.DB.prepare('INSERT INTO contact_request_events (event_id,request_id,actor,old_status,new_status) SELECT ?,request_id,?,status,? FROM contact_requests WHERE request_id = ? AND status = ?').bind(crypto.randomUUID(),auditActor,data.status,data.request_id,data.expected_status),
    env.DB.prepare('UPDATE contact_requests SET status = ? WHERE request_id = ? AND status = ?').bind(data.status,data.request_id,data.expected_status),
    env.DB.prepare("UPDATE reception_appointments SET status='cancelled',version=version+1,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE request_id=? AND status='confirmed' AND changes()=1 AND ? IN ('excluido','arquivado') AND EXISTS(SELECT 1 FROM contact_requests WHERE request_id=? AND status=?)").bind(auditActor,data.request_id,data.status,data.request_id,data.status),
    env.DB.prepare("INSERT INTO reception_appointment_events (event_id,request_id,professional,starts_at,ends_at,status,version,actor) SELECT ?,request_id,professional,starts_at,ends_at,status,version,? FROM reception_appointments WHERE request_id=? AND changes()=1").bind(crypto.randomUUID(),auditActor,data.request_id)
   ]);
   if(!batch[1].meta.changes)return panelJson({error:'conflict'},409);
   return panelJson({status:'updated'});
  }catch{return panelJson({error:'unavailable'},503)}
 }
 return panelJson({error:'not_found'},404);
}
