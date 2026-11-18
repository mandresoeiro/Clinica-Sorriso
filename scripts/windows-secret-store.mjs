import {spawnSync} from 'node:child_process';
import path from 'node:path';

function transform(input,restore){
  if(process.platform!=='win32')throw Error('windows_required');
  const executable=path.join(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe');
  const initialize='[void][Reflection.Assembly]::LoadWithPartialName("System.Security");';
  const command=restore
    ? '[Console]::Write([Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect([Convert]::FromBase64String([Console]::In.ReadToEnd()),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)))'
    : '[Console]::Write([Convert]::ToBase64String([Security.Cryptography.ProtectedData]::Protect([Text.Encoding]::UTF8.GetBytes([Console]::In.ReadToEnd()),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)))';
  const result=spawnSync(executable,['-NoProfile','-NonInteractive','-Command',initialize+command],{input,encoding:'utf8',windowsHide:true,timeout:20000,maxBuffer:1024*1024});
  if(result.status!==0||!result.stdout)throw Error('protection_failed');
  return result.stdout;
}
export const protectSecret=value=>transform(value,false);
export const unprotectSecret=value=>transform(value,true);
