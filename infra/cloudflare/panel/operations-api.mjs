const receptionProfessionals=['Dra. Sônia Almeida','Dra. Fabienne Rodrigues','Dra. Renata Wanderley','Dra. Ingrid Lima','Dra. Faustina'];
async function receptionOperations(request,env,user,route,url,readBody){
 const json=(v,s=200)=>Response.json(v,{status:s,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});
 const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
 const live="c.status IN ('novo','em_atendimento','agendado') AND c.name NOT LIKE 'TESTE TECNICO - %'";
 try{
 if(route==='today'&&request.method==='GET'){
  const now=new Date(),day=new Date(now.getTime()-10800000).toISOString().slice(0,10),start=day+'T03:00:00.000Z',end=new Date(Date.parse(start)+86400000).toISOString();
  const data=await env.DB.batch([
   env.DB.prepare("SELECT COUNT(*) total,SUM(CASE WHEN c.status='novo' THEN 1 ELSE 0 END) new_contacts,SUM(CASE WHEN COALESCE(w.assignee,'')='' THEN 1 ELSE 0 END) unassigned,SUM(CASE WHEN w.callback_at!='' AND w.callback_at<? AND c.status IN ('novo','em_atendimento') THEN 1 ELSE 0 END) overdue FROM contact_requests c LEFT JOIN contact_request_workflow w ON w.request_id=c.request_id WHERE "+live).bind(now.toISOString()),
   env.DB.prepare("SELECT c.request_id,c.name,c.phone,a.professional,a.starts_at,a.ends_at,a.duration,a.version FROM reception_appointments a JOIN contact_requests c ON c.request_id=a.request_id WHERE a.status='confirmed' AND a.starts_at>=? AND a.starts_at<? AND "+live+' ORDER BY a.starts_at LIMIT 50').bind(start,end),
   env.DB.prepare("SELECT c.request_id,c.name,w.callback_at,w.assignee FROM contact_request_workflow w JOIN contact_requests c ON c.request_id=w.request_id WHERE c.status IN ('novo','em_atendimento') AND c.name NOT LIKE 'TESTE TECNICO - %' AND w.callback_at!='' AND w.callback_at<? ORDER BY w.callback_at LIMIT 20").bind(end)
  ]);
  return json({day,counts:data[0].results[0],appointments:data[1].results,callbacks:data[2].results,professionals:receptionProfessionals});
 }
 if(route==='appointment'&&request.method==='GET'){
  const id=url.searchParams.get('id');if(!uuid(id))return json({error:'invalid'},400);
  const contact=await env.DB.prepare("SELECT request_id FROM contact_requests WHERE request_id=? AND status!='teste_tecnico'").bind(id).first();if(!contact)return json({error:'not_found'},404);
  const appointment=await env.DB.prepare('SELECT * FROM reception_appointments WHERE request_id=?').bind(id).first();
  const history=await env.DB.prepare('SELECT professional,starts_at,ends_at,status,actor,created_at FROM reception_appointment_events WHERE request_id=? ORDER BY version DESC LIMIT 30').bind(id).all();
  return json({appointment,history:history.results,professionals:receptionProfessionals});
 }
 if(request.method!=='POST'||!['manual','appointment'].includes(route))return json({error:'not_found'},404);
 const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)clinic_panel_csrf=([^;]+)/)?.[1];
 if(request.headers.get('Origin')!==url.origin||!cookie||cookie!==request.headers.get('X-CSRF-Token'))return json({error:'forbidden'},403);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'invalid'},415);
 let d;try{d=JSON.parse(await readBody(request,2048))}catch{return json({error:'invalid'},400)}
 if(!d||Array.isArray(d)||typeof d!=='object')return json({error:'invalid'},400);
 if(route==='manual'){
  if(Object.keys(d).some(k=>!['request_id','name','phone','treatment','campaign','acknowledged'].includes(k))||!uuid(d.request_id)||typeof d.name!=='string'||d.name.trim().length<2||d.name.length>80||/[\x00-\x1f<>]/.test(d.name)||typeof d.phone!=='string'||!/^\d{2}9\d{8}$/.test(d.phone)||!['manual-whatsapp','manual-telefone','manual-presencial'].includes(d.campaign)||!['Quero uma avaliação','Clínica Geral','Harmonização Facial','Endodontia','Ortodontia','Prótese Dentária','Implante Dentário'].includes(d.treatment)||d.acknowledged!==true)return json({error:'invalid'},400);
  const existing=await env.DB.prepare('SELECT request_id FROM contact_requests WHERE request_id=?').bind(d.request_id).first();if(existing)return json({status:'created',request_id:d.request_id});
  const duplicate=await env.DB.prepare("SELECT request_id,name FROM contact_requests WHERE phone=? AND status IN ('novo','em_atendimento','agendado') LIMIT 1").bind(d.phone).first();if(duplicate)return json({error:'duplicate_contact',request_id:duplicate.request_id},409);
  const now=new Date().toISOString();
  await env.DB.batch([
   env.DB.prepare("INSERT INTO contact_requests (request_id,name,phone,treatment,campaign,status,fingerprint,rate_key,acknowledged_at) VALUES (?,?,?,?,?,'novo',?,'manual',?) ON CONFLICT(request_id) DO NOTHING").bind(d.request_id,d.name.trim(),d.phone,d.treatment,d.campaign,'manual:'+d.request_id,now),
   env.DB.prepare("INSERT INTO contact_request_events (event_id,request_id,actor,old_status,new_status) SELECT ?,?,?, 'novo','novo' WHERE changes()=1").bind(crypto.randomUUID(),d.request_id,user.email)
  ]);return json({status:'created',request_id:d.request_id},201);
 }
 if(Object.keys(d).some(k=>!['request_id','professional','starts_at','duration','version','status'].includes(k))||!uuid(d.request_id)||!Number.isInteger(d.version)||d.version<0||!['confirmed','cancelled'].includes(d.status))return json({error:'invalid'},400);
 const contact=await env.DB.prepare("SELECT request_id FROM contact_requests WHERE request_id=? AND status IN ('novo','em_atendimento','agendado','arquivado')").bind(d.request_id).first();if(!contact)return json({error:'not_found'},404);
 let statement;
 if(d.status==='cancelled'){
  statement=env.DB.prepare("UPDATE reception_appointments SET status='cancelled',version=version+1,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE request_id=? AND version=? AND status='confirmed'").bind(user.email,d.request_id,d.version);
 }else{
  if(!receptionProfessionals.includes(d.professional)||typeof d.starts_at!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(d.starts_at)||Number.isNaN(Date.parse(d.starts_at))||new Date(d.starts_at).toISOString()!==d.starts_at||!Number.isInteger(d.duration)||d.duration<5||d.duration>480)return json({error:'invalid'},400);
  const end=new Date(Date.parse(d.starts_at)+d.duration*60000).toISOString();
  statement=env.DB.prepare("INSERT INTO reception_appointments (request_id,professional,starts_at,ends_at,duration,status,version,updated_by) SELECT ?,?,?,?,?,'confirmed',1,? WHERE (?=0 AND NOT EXISTS(SELECT 1 FROM reception_appointments WHERE request_id=?)) OR EXISTS(SELECT 1 FROM reception_appointments WHERE request_id=? AND version=?) ON CONFLICT(request_id) DO UPDATE SET professional=excluded.professional,starts_at=excluded.starts_at,ends_at=excluded.ends_at,duration=excluded.duration,status='confirmed',version=reception_appointments.version+1,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP WHERE reception_appointments.version=?").bind(d.request_id,d.professional,d.starts_at,end,d.duration,user.email,d.version,d.request_id,d.request_id,d.version,d.version);
 }
 const result=await env.DB.batch([statement,env.DB.prepare('INSERT INTO reception_appointment_events (event_id,request_id,professional,starts_at,ends_at,status,version,actor) SELECT ?,request_id,professional,starts_at,ends_at,status,version,? FROM reception_appointments WHERE request_id=? AND changes()=1').bind(crypto.randomUUID(),user.email,d.request_id)]);
 return result[0].meta.changes?json({status:'updated'}):json({error:'conflict'},409);
 }catch(e){if(String(e.message).includes('appointment_conflict'))return json({error:'appointment_conflict'},409);return json({error:'unavailable'},503)}
}
export {receptionOperations};
