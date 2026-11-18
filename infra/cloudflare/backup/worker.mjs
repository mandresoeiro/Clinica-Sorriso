import {encryptSnapshot,decryptSnapshot} from './crypto.mjs';
import {driveToken,retireOldCopies} from './drive.mjs';
export const backupTables=['contact_requests','contact_request_events','contact_request_workflow','contact_workflow_events','contact_workflow_snapshots','reception_staff_photos','reception_staff_photo_visibility','reception_appointments','reception_appointment_events'];
const failure=code=>{const e=new Error(code);e.code=code;return e};
export async function captureSnapshot(db){
 if(!db)throw failure('database_missing');
 const schemas="SELECT type,name,tbl_name,sql FROM sqlite_master WHERE type IN ('table','index','trigger') AND sql IS NOT NULL AND tbl_name IN ("+backupTables.map(()=>'?').join(',')+") ORDER BY type,name";
 // One atomic D1 batch. Abort rather than silently write a truncated copy.
 const statements=[db.prepare(schemas).bind(...backupTables),...backupTables.map(table=>db.prepare('SELECT * FROM "'+table+'" LIMIT 5001'))];
 let data;try{data=await db.batch(statements)}catch{throw failure('snapshot_query_failed')}
 if(!Array.isArray(data)||data.length!==statements.length||data.some(r=>r.success===false||!Array.isArray(r.results)))throw failure('snapshot_incomplete');
 const schema=data[0].results;if(backupTables.some(name=>!schema.some(s=>s.type==='table'&&s.name===name)))throw failure('schema_incomplete');
 const tables={};for(let i=0;i<backupTables.length;i++){if(data[i+1].results.length>5000)throw failure('snapshot_row_limit');tables[backupTables[i]]=data[i+1].results}
 return {format:'odonto-snapshot-v1',created_at:new Date().toISOString(),schema,tables};
}
export async function performBackup(env){
 if(env.BACKUPS_ENABLED!=='true')return {status:'disabled'};
 if(!env.DRIVE_FOLDER_ID)throw failure('private_destination_missing');
 // Validate the key before touching any contact data.
 if(!/^([a-f0-9]{2}){32}$/i.test(env.BACKUP_KEY||''))throw failure('encryption_key_missing');
 const api=env.DRIVE_FETCH||fetch;
 const headers={Authorization:'Bearer '+await driveToken(env,api)};
 const profile=await api('https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)',{headers});
 if(!profile.ok||(await profile.json()).user?.emailAddress?.toLowerCase()!=='odontopersonnallite.admin@gmail.com')throw failure('drive_account_mismatch');
 const folder=await api('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(env.DRIVE_FOLDER_ID)+'?fields=id,mimeType,trashed,shared,ownedByMe',{headers});
 if(!folder.ok)throw failure('private_destination_missing');
 const info=await folder.json();
 if(info.mimeType!=='application/vnd.google-apps.folder'||info.trashed||info.shared!==false||info.ownedByMe!==true)throw failure('destination_not_private');
 const snapshot=await captureSnapshot(env.DB),envelope=await encryptSnapshot(snapshot,env.BACKUP_KEY);
 const key='encrypted/'+snapshot.created_at.slice(0,10)+'/'+crypto.randomUUID()+'.odonto.enc';
 const body=JSON.stringify(envelope),boundary='odonto_'+crypto.randomUUID();
 const multipart='--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify({name:key.split('/').at(-1),parents:[env.DRIVE_FOLDER_ID],appProperties:{odontoBackup:'v1'}})+'\r\n--'+boundary+'\r\nContent-Type: application/octet-stream\r\n\r\n'+body+'\r\n--'+boundary+'--';
 const uploaded=await api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',{method:'POST',headers:{...headers,'Content-Type':'multipart/related; boundary='+boundary},body:multipart});
 if(!uploaded.ok)throw failure('backup_not_written');
 const fileId=(await uploaded.json()).id;if(!fileId)throw failure('backup_not_written');
 const readback=await api('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(fileId)+'?alt=media',{headers});
 if(!readback.ok)throw failure('backup_verification_failed');
 let verified;try{verified=await decryptSnapshot(await readback.json(),env.BACKUP_KEY)}catch{throw failure('backup_verification_failed')}
 if(JSON.stringify(verified)!==JSON.stringify(snapshot))throw failure('backup_verification_failed');
 const retired=env.BACKUP_RETENTION_ENABLED==='true'?await retireOldCopies(api,headers,env.DRIVE_FOLDER_ID,snapshot.created_at):0;
 return {status:'stored_verified',retired_to_trash:retired,created_at:snapshot.created_at,key,encrypted_bytes:new TextEncoder().encode(body).byteLength,rows:Object.fromEntries(backupTables.map(t=>[t,snapshot.tables[t].length]))};
}
export default {
 async fetch(){return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}})},
 async scheduled(_event,env){
  try{const result=await performBackup(env);console.log(JSON.stringify({event:'protected_backup',...result}))}
  catch(e){console.error(JSON.stringify({event:'protected_backup_failed',code:e.code||'backup_failed'}));throw new Error('protected_backup_failed')}
 }
};
