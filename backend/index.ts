import {createContactHandler,emailText} from './contact-core.mjs';
const env=(name:string)=>(Deno.env.get(name)||'').trim();
const service=env('SUPABASE_SERVICE_ROLE_KEY');
const base=env('SUPABASE_URL');
const publishable='sb_publishable_X4CdUNDE6Ve42fWDdGMBdA_Ev-2F_v2';
const hash=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(b=>b.toString(16).padStart(2,'0')).join('');
async function rpc(name:string,body:unknown={}){
 const response=await fetch(base+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw Error('Private configuration unavailable');return response.json();
}
Deno.serve(createContactHandler({
 allowedOrigins:['https://rockside.world','https://www.rockside.world','http://rockside.world','http://www.rockside.world','http://127.0.0.1:4189'],
 authenticate:(req:Request)=>req.headers.get('apikey')===publishable,
 reserve:async(contact:Record<string,string>,req:Request)=>{
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  return rpc('rockside_reserve_contact',{p_id:contact.id,p_fingerprint:await hash(JSON.stringify(contact)),p_email:await hash(service+contact.email),p_ip:await hash(service+ip)});
 },
 send:async(contact:Record<string,string>)=>{
  const key=env('RESEND_API_KEY');if(!key)throw Error('Email unavailable');
  const settings=await rpc('rockside_mail_settings');
  if(!settings?.recipient||!settings?.sender)throw Error('Email unavailable');
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json','Idempotency-Key':'rockside-contact-'+contact.id},body:JSON.stringify({from:settings.sender,to:[settings.recipient],reply_to:contact.email,subject:'Rockside enquiry — '+contact.interest,text:emailText(contact),tags:[{name:'site',value:'rockside'}]}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('Email unavailable');
  const receipt=await response.json();if(!receipt.id)throw Error('No receipt');
  console.info(JSON.stringify({event:'rockside_contact_sent',reference:contact.id,receipt:receipt.id}));
 }
}));
