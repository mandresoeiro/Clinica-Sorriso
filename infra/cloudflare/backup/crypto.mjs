// Web Crypto only. The encryption key is never included in a backup or log.
const encoder=new TextEncoder(),decoder=new TextDecoder();
const fail=()=>{const e=new Error('invalid_encrypted_backup');e.code='invalid_encrypted_backup';return e};
function bytesToBase64(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s)}
function base64ToBytes(s){if(typeof s!=='string'||s.length>16000000||!/^[A-Za-z0-9+/]*={0,2}$/.test(s))throw fail();try{return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}catch{throw fail()}}
async function keyFromHex(hex){if(typeof hex!=='string'||!/^([a-f0-9]{2}){32}$/i.test(hex))throw fail();return crypto.subtle.importKey('raw',Uint8Array.from(hex.match(/../g),v=>parseInt(v,16)),{name:'AES-GCM'},false,['encrypt','decrypt'])}
function additionalData(meta){return encoder.encode(JSON.stringify({format:meta.format,created_at:meta.created_at,encoding:meta.encoding}))}
export async function encryptSnapshot(snapshot,keyHex){
 const key=await keyFromHex(keyHex),iv=crypto.getRandomValues(new Uint8Array(12));
 const plain=encoder.encode(JSON.stringify(snapshot));if(plain.byteLength>8*1024*1024)throw fail();
 const compressed=new Uint8Array(await new Response(new Blob([plain]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
 const meta={format:'odonto-encrypted-backup-v1',created_at:snapshot.created_at,encoding:'gzip+aes-256-gcm'};
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:additionalData(meta),tagLength:128},key,compressed);
 return {...meta,iv:bytesToBase64(iv),ciphertext:bytesToBase64(new Uint8Array(encrypted))};
}
export async function decryptSnapshot(envelope,keyHex){
 try{
  if(envelope?.format!=='odonto-encrypted-backup-v1'||envelope.encoding!=='gzip+aes-256-gcm'||typeof envelope.created_at!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(envelope.created_at))throw fail();
  const iv=base64ToBytes(envelope.iv);if(iv.length!==12)throw fail();
  const key=await keyFromHex(keyHex),cipher=base64ToBytes(envelope.ciphertext);
  const compressed=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:additionalData(envelope),tagLength:128},key,cipher);
  const reader=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
  let size=0;const parts=[];for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>8*1024*1024){await reader.cancel();throw fail()}parts.push(value)}
  const plain=new Uint8Array(size);let offset=0;for(const part of parts){plain.set(part,offset);offset+=part.length}
  const snapshot=JSON.parse(decoder.decode(plain));if(snapshot.created_at!==envelope.created_at)throw fail();return snapshot;
 }catch{throw fail()}
}
