import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import {decryptSnapshot} from '../infra/cloudflare/backup/crypto.mjs';
import {backupTables} from '../infra/cloudflare/backup/worker.mjs';
export function restoreIntoEmptyDatabase(db,snapshot){
 if(snapshot?.format!=='odonto-snapshot-v1'||!Array.isArray(snapshot.schema)||!snapshot.tables||Object.keys(snapshot.tables).length!==backupTables.length||backupTables.some(t=>!Array.isArray(snapshot.tables[t])))throw Error('invalid_snapshot');
 if(db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get().n!==0)throw Error('destination_must_be_empty');
 const schema=snapshot.schema;
 if(schema.some(s=>!backupTables.includes(s.tbl_name)||!['table','index','trigger'].includes(s.type)||typeof s.sql!=='string'||!/^CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX|TRIGGER)\b/i.test(s.sql.trim())))throw Error('invalid_schema');
 db.exec('PRAGMA foreign_keys=ON');db.exec('BEGIN');
 try{
  for(const table of backupTables){const definition=schema.find(s=>s.type==='table'&&s.name===table);if(!definition)throw Error('missing_schema');db.exec(definition.sql)}
  const quote=s=>'"'+s.replaceAll('"','""')+'"';
  for(const table of backupTables){const columns=db.prepare('PRAGMA table_info('+quote(table)+')').all().map(c=>c.name);for(const row of snapshot.tables[table]){const keys=Object.keys(row);if(keys.some(k=>!columns.includes(k)))throw Error('invalid_column');const sql='INSERT INTO '+quote(table)+' ('+keys.map(quote).join(',')+') VALUES ('+keys.map(()=>'?').join(',')+')';db.prepare(sql).run(...keys.map(k=>row[k]))}}
  for(const definition of schema.filter(s=>s.type!=='table'))db.exec(definition.sql);
  if(db.prepare('PRAGMA foreign_key_check').all().length||db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('restore_integrity_failed');
  db.exec('COMMIT');return Object.fromEntries(backupTables.map(t=>[t,db.prepare('SELECT COUNT(*) AS n FROM '+quote(t)).get().n]));
 }catch{db.exec('ROLLBACK');throw Error('restore_failed')}
}
async function main(){
 const [mode,input,output]=process.argv.slice(2);if(!['--check','--restore'].includes(mode)||!input||mode==='--restore'&&!output)throw Error('Use --check arquivo.odonto.enc ou --restore arquivo.odonto.enc destino-privado.sqlite');
 if(!process.env.ODONTO_BACKUP_KEY)throw Error('Informe ODONTO_BACKUP_KEY no ambiente privado; não inclua a chave na linha de comando.');
 const source=fs.statSync(input);if(source.size>16000000)throw Error('backup_too_large');
 const envelope=JSON.parse(fs.readFileSync(input,'utf8')),snapshot=await decryptSnapshot(envelope,process.env.ODONTO_BACKUP_KEY);
 const verify=new DatabaseSync(':memory:');let counts;try{counts=restoreIntoEmptyDatabase(verify,snapshot)}finally{verify.close()}
 if(mode==='--restore'){
  const target=path.resolve(output),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const relative=path.relative(root,target);if(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative))throw Error('A recuperação real deve ficar fora do projeto e de suas pastas públicas.');
  if(fs.existsSync(target))throw Error('O destino deve ser um arquivo novo; não sobrescrevemos bancos existentes.');
  fs.writeFileSync(target,'',{flag:'wx',mode:0o600});const restored=new DatabaseSync(target);try{restoreIntoEmptyDatabase(restored,snapshot)}finally{restored.close()}
 }
 console.log(JSON.stringify({status:'verified',created_at:snapshot.created_at,rows:counts,production_restored:false}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(()=>{console.error('Não foi possível verificar/restaurar. Confira chave, integridade e destino privado. Nenhum banco de produção foi alterado.');process.exitCode=1});
