export const interests=['Casting & bookings','Creator partnerships','Campaign coordination','Representation','Something else'];
export function validateContact(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Please check your message.');
 const {name,email,interest,brief,id,website=''}=value;
 if(website)throw Error('Please reopen the contact form.');
 if(typeof name!=='string'||!name.trim()||name.trim().length>120||/[\r\n\0]/.test(name))throw Error('Enter your name (up to 120 characters).');
 if(typeof email!=='string'||email.length>254||/[\r\n\0]/.test(email)||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email.trim()))throw Error('Enter a valid email address.');
 if(!interests.includes(interest))throw Error('Choose an enquiry type.');
 if(typeof brief!=='string'||!brief.trim()||brief.trim().length>4000||brief.includes('\0'))throw Error('Write a message of up to 4,000 characters.');
 if(typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))throw Error('Please reopen the contact form.');
 return {name:name.trim(),email:email.trim().toLowerCase(),interest,brief:brief.trim(),id};
}
async function limitedBody(req){
 if(Number(req.headers.get('content-length')||0)>16384)throw Error('size');
 const reader=req.body?.getReader();if(!reader)return '';
 const chunks=[];let length=0;
 while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>16384){await reader.cancel();throw Error('size');}chunks.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return new TextDecoder().decode(bytes);
}
export function createContactHandler({allowedOrigins,authenticate,reserve,send}){
 return async(req)=>{
  const origin=req.headers.get('origin')||'';
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
  if(allowedOrigins.includes(origin))Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS'});
  const reply=(body,status=200,extra={})=>Response.json(body,{status,headers:{...headers,...extra}});
  if(!allowedOrigins.includes(origin))return reply({error:'Use the Rockside contact form.'},403);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(req.method!=='POST')return reply({error:'Use the contact form.'},405);
  if(!authenticate(req))return reply({error:'Please reload the page and try again.'},401);
  let raw;try{raw=await limitedBody(req);}catch{return reply({error:'Your message is too large.'},413);}
  let contact;try{contact=validateContact(JSON.parse(raw));}catch(error){return reply({error:error instanceof SyntaxError?'Please check your message.':error.message},400);}
  try{
   if(!await reserve(contact,req))return reply({error:'Please wait before sending another enquiry. Your message is still here.'},429,{'Retry-After':'3600'});
   await send(contact);
   return reply({ok:true,reference:contact.id});
  }catch{return reply({error:'We couldn’t send your message. Your details are still here—please try again.'},503);}
 };
}
export function emailText(contact){return ['New Rockside enquiry','',`Name: ${contact.name}`,`Reply email (visitor supplied): ${contact.email}`,`Enquiry: ${contact.interest}`,'',contact.brief,'',`Reference: ${contact.id}`,'Sent from rockside.world. The visitor supplied the reply address.'].join('\n');}
