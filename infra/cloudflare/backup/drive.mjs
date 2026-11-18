const fail=code=>{const error=new Error(code);error.code=code;return error};
export async function driveToken(env,api=fetch){
 if(env.DRIVE_CLIENT_ID&&env.DRIVE_CLIENT_SECRET&&env.DRIVE_REFRESH_TOKEN){
  const response=await api('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.DRIVE_CLIENT_ID,client_secret:env.DRIVE_CLIENT_SECRET,refresh_token:env.DRIVE_REFRESH_TOKEN,grant_type:'refresh_token'})});
  if(!response.ok)throw fail('drive_authorization_expired');
  const token=(await response.json()).access_token;if(typeof token!=='string'||!token)throw fail('drive_authorization_expired');return token;
 }
 if(env.DRIVE_ACCESS_TOKEN)return env.DRIVE_ACCESS_TOKEN;
 throw fail('drive_authorization_missing');
}
// Reversible retention: never permanently deletes files or empties Trash.
// Only files marked by this integration, in this exact folder, are eligible.
export async function retireOldCopies(api,headers,folder,now){
 const cutoff=new Date(Date.parse(now)-30*86400000).toISOString();
 const query="'"+folder.replaceAll("'","\\'")+"' in parents and trashed = false and appProperties has { key='odontoBackup' and value='v1' } and createdTime < '"+cutoff+"'";
 const params=new URLSearchParams({q:query,fields:'nextPageToken,files(id,createdTime,parents,appProperties)',pageSize:'100'});
 let count=0,page;
 do{
  if(page)params.set('pageToken',page);
  const response=await api('https://www.googleapis.com/drive/v3/files?'+params,{headers});if(!response.ok)throw fail('retention_failed');
  const data=await response.json();if(!Array.isArray(data.files))throw fail('retention_failed');
  for(const file of data.files){
   if(!file.id||!file.parents?.includes(folder)||file.appProperties?.odontoBackup!=='v1'||!(Date.parse(file.createdTime)<Date.parse(cutoff)))throw fail('retention_scope_invalid');
   const changed=await api('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(file.id)+'?fields=id,trashed',{method:'PATCH',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({trashed:true})});
   if(!changed.ok||(await changed.json()).trashed!==true)throw fail('retention_failed');count++;
  }
  page=data.nextPageToken;
 }while(page);
 return count;
}
