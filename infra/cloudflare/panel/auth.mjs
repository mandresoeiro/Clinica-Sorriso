const panelKeys=new Map();
const fromBase64Url=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=')),c=>c.charCodeAt(0));
const decodeJwt=s=>JSON.parse(new TextDecoder().decode(fromBase64Url(s)));
export async function authorizePanel(request,env,options={}){
 const issuer=env.PANEL_ACCESS_ISSUER,audience=env.PANEL_ACCESS_AUD;
 const allowed=(env.PANEL_ALLOWED_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
 if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer||'')||!audience||!allowed.length)return {status:503,error:'not_configured'};
 const token=request.headers.get('Cf-Access-Jwt-Assertion');
 if(!token||token.length>16384){console.warn('panel_auth_rejected: missing_assertion');return {status:401,error:'login_required',reason:'missing_assertion'}}
 let stage='decode';
 try{
  const parts=token.split('.');if(parts.length!==3)throw Error();
  const header=decodeJwt(parts[0]),claims=decodeJwt(parts[1]);
  const now=options.now??Math.floor(Date.now()/1000);
  stage='claims';
  if(header.alg!=='RS256'||typeof header.kid!=='string'||header.kid.length>256)throw Error();
  if(claims.iss!==issuer||!Array.isArray(claims.aud)||!claims.aud.includes(audience)||typeof claims.exp!=='number'||claims.exp<=now||typeof claims.iat!=='number'||claims.iat>now+30||claims.nbf!==undefined&&(typeof claims.nbf!=='number'||claims.nbf>now+30))throw Error();
  if(typeof claims.email!=='string'||!allowed.includes(claims.email.toLowerCase())||typeof claims.sub!=='string'||!claims.sub)throw Error();
  stage='keys';
  const cacheId=issuer+':'+header.kid;
  let cached=panelKeys.get(cacheId);
  if(!cached||cached.until<=now){
   stage='keys_fetch';
   const controller=new AbortController(),deadline=setTimeout(()=>controller.abort(),5000);
   let response;
   try{response=await (options.fetcher||fetch)(issuer+'/cdn-cgi/access/certs',{signal:controller.signal,redirect:'manual'})}finally{clearTimeout(deadline)}
   if(!response.ok){stage='keys_http_'+response.status;throw Error()}
   stage='keys_json';
   const keys=(await response.json()).keys;if(!Array.isArray(keys))throw Error();
   stage='keys_match';
   const jwk=keys.find(k=>k.kid===header.kid&&k.kty==='RSA'&&(!k.alg||k.alg==='RS256')&&(!k.use||k.use==='sig'));
   if(!jwk)throw Error();
   stage='keys_import';
   const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
   if(panelKeys.size>50)panelKeys.clear();
   cached={key,until:now+300};panelKeys.set(cacheId,cached);
  }
  stage='signature';
  const valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',cached.key,fromBase64Url(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
  if(!valid)throw Error();
  return {status:200,user:{email:claims.email.toLowerCase(),id:claims.sub,expiresAt:claims.exp}};
 }catch{console.warn('panel_auth_rejected: '+stage);return {status:401,error:'login_required',reason:stage}}
}
