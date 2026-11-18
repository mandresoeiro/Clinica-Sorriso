import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {encryptSnapshot,decryptSnapshot} from '../infra/cloudflare/backup/crypto.mjs';
import worker,{backupTables,performBackup,captureSnapshot} from '../infra/cloudflare/backup/worker.mjs';
import {restoreIntoEmptyDatabase} from './restore-protected-backup.mjs';
import {driveToken,retireOldCopies} from '../infra/cloudflare/backup/drive.mjs';
const key='ab'.repeat(32);
const snapshot={format:'odonto-snapshot-v1',created_at:new Date().toISOString(),schema:backupTables.map(name=>({type:'table',name,tbl_name:name,sql:`CREATE TABLE ${name} (id TEXT PRIMARY KEY, value TEXT)`})),tables:Object.fromEntries(backupTables.map(t=>[t,[{id:'synthetic',value:'DADO FICTICIO'}]]))};
const encrypted=await encryptSnapshot(snapshot,key);
assert(!JSON.stringify(encrypted).includes('DADO FICTICIO'));
assert.deepEqual(await decryptSnapshot(encrypted,key),snapshot);
await assert.rejects(()=>decryptSnapshot(encrypted,'cd'.repeat(32)));
await assert.rejects(()=>decryptSnapshot({...encrypted,created_at:'2026-01-01T00:00:00Z'},key));
assert.notEqual((await encryptSnapshot(snapshot,key)).iv,encrypted.iv);
const db=new DatabaseSync(':memory:');
assert.equal(restoreIntoEmptyDatabase(db,snapshot).contact_requests,1);
assert.throws(()=>restoreIntoEmptyDatabase(db,snapshot),/destination_must_be_empty/);db.close();
assert.deepEqual(await performBackup({}),{status:'disabled'});
const env={BACKUPS_ENABLED:'true',BACKUP_KEY:key,DRIVE_FOLDER_ID:'synthetic',DRIVE_ACCESS_TOKEN:'synthetic'};
await assert.rejects(()=>performBackup({...env,BACKUP_KEY:''}),/encryption_key_missing/);
await assert.rejects(()=>performBackup({...env,DRIVE_FETCH:async()=>Response.json({user:{emailAddress:'wrong@example.test'}})}),/drive_account_mismatch/);
let calls=0;
await assert.rejects(()=>performBackup({...env,DRIVE_FETCH:async()=>Response.json(++calls===1?{user:{emailAddress:'odontopersonnallite.admin@gmail.com'}}:{mimeType:'application/vnd.google-apps.folder',shared:true,ownedByMe:true})}),/destination_not_private/);
await assert.rejects(()=>captureSnapshot({prepare:()=>({bind(){return this}}),batch:async()=>[]}),/snapshot_incomplete/);
assert.equal((await worker.fetch()).status,404);
assert.equal(await driveToken({DRIVE_CLIENT_ID:'test',DRIVE_CLIENT_SECRET:'test',DRIVE_REFRESH_TOKEN:'test'},async()=>Response.json({access_token:'renewed'})),'renewed');
await assert.rejects(()=>driveToken({},async()=>{}),/drive_authorization_missing/);
await assert.rejects(()=>driveToken({DRIVE_CLIENT_ID:'test',DRIVE_CLIENT_SECRET:'test',DRIVE_REFRESH_TOKEN:'test'},async()=>new Response('',{status:400})),/drive_authorization_expired/);
let stored,uploadedCount=0;
const mockDb={prepare:()=>({bind(){return this}}),batch:async()=>[{results:snapshot.schema},...backupTables.map(t=>({results:snapshot.tables[t]}))]};
const api=async(url,options)=>{
 if(url.includes('/about?'))return Response.json({user:{emailAddress:'odontopersonnallite.admin@gmail.com'}});
 if(url.includes('uploadType=multipart')){uploadedCount++;stored=JSON.parse(options.body.split('Content-Type: application/octet-stream\r\n\r\n')[1].split('\r\n--')[0]);return Response.json({id:'copy'});}
 if(url.includes('alt=media'))return Response.json(stored);
 if(url.includes('pageSize='))return Response.json({files:[]});
 return Response.json({mimeType:'application/vnd.google-apps.folder',shared:false,ownedByMe:true});
};
const successful=await performBackup({...env,DB:mockDb,DRIVE_FETCH:api,BACKUP_RETENTION_ENABLED:'true'});
assert.equal(successful.status,'stored_verified');assert.equal(uploadedCount,1);assert.equal(successful.rows.contact_requests,1);
let patched=0;
assert.equal(await retireOldCopies(async(url,options)=>{
 if(options.method==='PATCH'){patched++;assert.deepEqual(JSON.parse(options.body),{trashed:true});return Response.json({id:'old',trashed:true});}
 return Response.json({files:[{id:'old',createdTime:'2020-01-01T00:00:00Z',parents:['synthetic'],appProperties:{odontoBackup:'v1'}}]});
},{},'synthetic',snapshot.created_at),1);assert.equal(patched,1);
await assert.rejects(()=>retireOldCopies(async()=>Response.json({files:[{id:'unrelated',createdTime:'2020-01-01T00:00:00Z',parents:['other'],appProperties:{odontoBackup:'v1'}}]}),{},'synthetic',snapshot.created_at),/retention_scope_invalid/);
console.log('Backup: criptografia, adulteração, chave incorreta, restauração sintética e bloqueios de destino aprovados. Nenhum dado real consultado.');
