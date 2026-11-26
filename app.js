const disciplines={models:{word:'MODELS',kicker:'For models',title:'A CAREER.<br>WITH CHARACTER.',description:'Personal representation for fashion, editorial and commercial work. Guidance on your portfolio, introductions and the opportunities that suit you.',tags:['Fashion','Editorial','Commercial'],cta:'Introduce yourself',note:'Presence. Personality. Perspective.'},actors:{word:'ACTORS',kicker:'For actors',title:'YOUR NEXT<br>CHAPTER.',description:'Representation for screen, stage and commercial work. A personal conversation about your experience, your strengths and the roles you want to explore.',tags:['Screen','Stage','Commercial'],cta:'Introduce yourself',note:'Character. Voice. Connection.'},creators:{word:'CREATORS',kicker:'For creators',title:'YOUR VOICE.<br>NEW POSSIBILITIES.',description:'Support for creators with a distinctive point of view. Thoughtful brand introductions, collaboration briefs and clear expectations around your work.',tags:['Content','Partnerships','Campaigns'],cta:'Introduce yourself',note:'Ideas. Originality. Impact.'}};
// One motion language. Every retarget starts from the rendered presentation value.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const moving = new Map();
const easing = 'cubic-bezier(.22,1,.36,1)';
async function animateTo(element, target, duration = 280) {
  const style = getComputedStyle(element);
  const from = Object.fromEntries(Object.keys(target).map(key => [key, style[key]]));
  moving.get(element)?.cancel();
  Object.assign(element.style, from);
  if (motionPreference.matches || duration === 0 || !element.animate) {
    Object.assign(element.style, target);
    moving.delete(element);
    return true;
  }
  const animation = element.animate([from, target], { duration, easing, fill: 'both' });
  moving.set(element, animation);
  try { await animation.finished; } catch { return false; }
  if (moving.get(element) !== animation) return false;
  Object.assign(element.style, target);
  moving.delete(element);
  animation.cancel();
  return true;
}
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) [...moving.values()].forEach(animation => animation.finish());
});

// Immediate discipline selection and reserved content space.
let selected = 'models', renderedDiscipline = 'models';
const tabs = [...document.querySelectorAll('[data-discipline]')];
const disciplinePanel = document.getElementById('discipline-panel');
const disciplineWord = document.getElementById('discipline-word');
const disciplineCopy = document.querySelector('.discipline-copy');
function renderDiscipline(key) {
  const d = disciplines[key];
  renderedDiscipline = key;
  disciplineWord.textContent = d.word;
  document.getElementById('discipline-kicker').textContent = d.kicker;
  document.getElementById('discipline-title').innerHTML = d.title;
  document.getElementById('discipline-description').textContent = d.description;
  document.querySelector('.discipline-note').textContent = d.note;
  document.getElementById('discipline-tags').replaceChildren(...d.tags.map(tag => {
    const span = document.createElement('span'); span.textContent = tag; return span;
  }));
  document.getElementById('discipline-cta').firstChild.textContent = d.cta + ' ';
}
function selectDiscipline(key, focus = false) {
  tabs.forEach(tab => {
    const active = tab.dataset.discipline === key;
    tab.setAttribute('aria-selected', active); tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus({preventScroll:true});
  });
  if (key === selected) return;
  selected = key;
  // Discrete reading content updates immediately; no fade or queued intermediate state.
  renderDiscipline(key);
  disciplinePanel.setAttribute('aria-labelledby', 'tab-' + key);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDiscipline(tab.dataset.discipline));
  tab.addEventListener('keydown', event => {
    const next = {ArrowRight:(index+1)%tabs.length, ArrowDown:(index+1)%tabs.length, ArrowLeft:(index+tabs.length-1)%tabs.length, ArrowUp:(index+tabs.length-1)%tabs.length, Home:0, End:tabs.length-1}[event.key];
    if (next !== undefined) {event.preventDefault(); selectDiscipline(tabs[next].dataset.discipline, true);}
  });
});

// Measure the three real copy sets at the current width, not guessed fixed heights.
let measuredCopyWidth = 0;
function reserveDisciplineSpace(force = false) {
  const width = disciplineCopy.getBoundingClientRect().width;
  if (!width || (!force && Math.abs(width - measuredCopyWidth) < 1)) return;
  measuredCopyWidth = width;
  const selectors = ['.eyebrow','h3','p','.tags','.text-link'];
  const maxima = selectors.map(() => 0);
  const measure = disciplineCopy.cloneNode(true);
  measure.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  measure.setAttribute('aria-hidden','true'); measure.setAttribute('inert','');
  Object.assign(measure.style, {position:'absolute',left:'0',top:'0',width:width+'px',visibility:'hidden',pointerEvents:'none',opacity:'1',height:'auto',minHeight:'0'});
  selectors.forEach(selector => measure.querySelector(selector).style.minHeight = '0');
  disciplinePanel.append(measure);
  Object.values(disciplines).forEach(d => {
    measure.querySelector('.eyebrow').textContent = d.kicker;
    measure.querySelector('h3').innerHTML = d.title;
    measure.querySelector('p').textContent = d.description;
    measure.querySelector('.tags').replaceChildren(...d.tags.map(text => {const span=document.createElement('span');span.textContent=text;return span;}));
    measure.querySelector('.text-link').firstChild.textContent = d.cta + ' ';
    selectors.forEach((selector,index) => maxima[index] = Math.max(maxima[index],measure.querySelector(selector).getBoundingClientRect().height));
  });
  measure.remove();
  selectors.forEach((selector,index) => disciplineCopy.querySelector(selector).style.minHeight = maxima[index]+'px');
}
new ResizeObserver(() => reserveDisciplineSpace()).observe(disciplineCopy);
document.fonts.ready.then(() => reserveDisciplineSpace(true));

// Cache original background attributes so opening views never leak focus.
const enquiry = document.getElementById('enquiry-view');
const form = document.getElementById('enquiry-form');
const menu = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const narrowScreen = matchMedia('(max-width: 760px)');
function syncTabOrientation(){document.querySelector('.discipline-tabs').setAttribute('aria-orientation',narrowScreen.matches?'horizontal':'vertical');}
syncTabOrientation();narrowScreen.addEventListener('change',syncTabOrientation);
const background = [...document.body.children].filter(element => element !== enquiry && element.tagName !== 'SCRIPT');
const originals = new Map(background.map(element => [element, {inert:element.hasAttribute('inert'), aria:element.getAttribute('aria-hidden')}]));
function lockElements(elements, locked) {
  elements.forEach(element => {
    const original = originals.get(element);
    if (locked) {element.setAttribute('inert',''); element.setAttribute('aria-hidden','true');}
    else {if (!original.inert) element.removeAttribute('inert'); if (original.aria === null) element.removeAttribute('aria-hidden'); else element.setAttribute('aria-hidden', original.aria);}
  });
}
const menuBackground = [document.querySelector('main'), document.querySelector('footer')];
let menuOpen = false, menuVersion = 0;
async function setMenu(open, restoreFocus = true, instant = false) {
  if (open === menuOpen) return;
  menuOpen = open; const version = ++menuVersion;
  menu.setAttribute('aria-expanded', String(open));
  if (open) {
    mobileMenu.hidden = false;
    mobileMenu.removeAttribute('inert');
    lockElements(menuBackground, true);
    document.documentElement.classList.add('menu-open');
    if (!moving.has(mobileMenu)) Object.assign(mobileMenu.style, {opacity:'0', transform:'translateY(-8px)'});
  } else mobileMenu.setAttribute('inert','');
  const done = await animateTo(mobileMenu, {opacity:open?'1':'0', transform:open?'translateY(0)':'translateY(-8px)'}, instant?0:open?220:160);
  if (!done || version !== menuVersion) return;
  if (!open) {
    mobileMenu.hidden = true; lockElements(menuBackground, false);
    document.documentElement.classList.remove('menu-open');
    if (restoreFocus) menu.focus({preventScroll:true});
  }
}
menu.addEventListener('click', () => setMenu(!menuOpen));
document.querySelector('.header .brand').addEventListener('click', () => {if (menuOpen) setMenu(false, false, true);});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false, false, true)));
narrowScreen.addEventListener('change', () => {if (!narrowScreen.matches) setMenu(false, false, true);});
document.addEventListener('keydown', event => {
  if (!menuOpen) return;
  if (event.key === 'Escape') {event.preventDefault(); setMenu(false);}
  if (event.key === 'Tab') {
    const last = mobileMenu.querySelector('button');
    if (event.shiftKey && document.activeElement === menu) {event.preventDefault(); last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); menu.focus();}
  }
});

// One full-screen surface for audience views and contact. Native history owns the route.
const audienceView = document.querySelector('.audience-view');
const contactLayout = document.querySelector('.enquiry-layout');
const talentView = document.getElementById('talent');
const brandsView = document.getElementById('brands');
let previousFocus, savedScroll = 0, enquiryOpen = false, enquiryVersion = 0;
let activeView = null;
const viewScroll = new Map();
const viewFocus = new Map();
const routeFor = type => type === 'view-talent' ? '#talent' : type === 'view-brands' ? '#brands' : '#enquiry';
function configureEnquiry(type) {
  const talent = type === 'talent';
  form.elements.interest.value = talent ? 'Representation' : ({casting:'Casting & bookings', creators:'Creator partnerships', campaign:'Campaign coordination'}[type] || 'Casting & bookings');
  document.getElementById('enquiry-intro').textContent = talent ? 'Tell us about your work and where you’d like to go.' : 'Tell us what you have in mind. We’ll get back to you by email.';
  form.elements.brief.placeholder = talent ? 'Your discipline, experience and portfolio links.' : 'Your project, timing, location and budget, if known.';
  document.getElementById('form-heading').textContent = talent ? 'Your introduction' : 'Your enquiry';
  resetFormFeedback();
}
function configureView(type) {
  const audience = type.startsWith('view-');
  audienceView.hidden = !audience; contactLayout.hidden = audience;
  talentView.hidden = type !== 'view-talent'; brandsView.hidden = type !== 'view-brands';
  document.querySelector('.process').hidden = type !== 'view-brands';
  enquiry.classList.toggle('show-talent',type === 'view-talent');
  enquiry.classList.toggle('show-audience',audience);
  document.querySelector('.view-navigation').hidden = !audience;
  document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===type)));
  const title = document.getElementById(type === 'view-talent' ? 'talent-title' : type === 'view-brands' ? 'brands-title' : 'enquiry-title');
  title.tabIndex = -1; enquiry.setAttribute('aria-labelledby',title.id);
  if (!audience && activeView !== type) configureEnquiry(type);
  return title;
}
// Critically damped analytic spring: position AND velocity survive every retarget.
function springStep(position, velocity, target, seconds, omega = 24) {
  const displacement = position - target;
  const carry = velocity + omega * displacement;
  const decay = Math.exp(-omega * seconds);
  return {position:target + (displacement + carry * seconds) * decay,
    velocity:(velocity - omega * carry * seconds) * decay};
}
let travel = {position:100,velocity:0,target:100,frame:0,last:0,resolve:null};
function finishTravel() {
  cancelAnimationFrame(travel.frame); travel.frame = 0;
  travel.position = travel.target; travel.velocity = 0;
  enquiry.style.transform = `translate3d(0,${travel.position}%,0)`;
  travel.resolve?.(true); travel.resolve = null;
}
function springTravel(target) {
  travel.resolve?.(false); travel.target = target;
  const promise = new Promise(resolve => travel.resolve = resolve);
  if (motionPreference.matches) {finishTravel(); return promise;}
  if (!travel.frame) {
    travel.last = performance.now();
    const tick = now => {
      // Analytic integration is stable across refresh rates and dropped frames.
      const next = springStep(travel.position,travel.velocity,travel.target,(now-travel.last)/1000);
      travel.position = next.position; travel.velocity = next.velocity; travel.last = now;
      enquiry.style.transform = `translate3d(0,${travel.position}%,0)`;
      if (Math.abs(travel.position-travel.target)<.025 && Math.abs(travel.velocity)<.1) finishTravel();
      else travel.frame = requestAnimationFrame(tick);
    };
    travel.frame = requestAnimationFrame(tick);
  }
  return promise;
}
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)finishTravel();});
async function setEnquiry(open, type = 'project', addHistory = false) {
  if (!open && enquiry.hidden) return;
  const version = ++enquiryVersion;
  const restoreCandidate = mobileMenu.contains(document.activeElement) ? menu : document.activeElement;
  const switching = open && enquiryOpen && activeView !== type;
  if (open) {
    if (menuOpen) await setMenu(false,false,true);
    if (enquiry.hidden) {
      previousFocus = restoreCandidate === document.body ? document.querySelector(type==='view-brands'?'.route-brands':type==='view-talent'?'.route-talent':'.header-contact') : restoreCandidate; savedScroll = window.scrollY;
      enquiry.hidden = false; travel.position = 100; travel.velocity = 0;
      enquiry.style.transform = 'translate3d(0,100%,0)';
    }
    if (switching && activeView) {
      viewScroll.set(activeView,enquiry.scrollTop); viewFocus.set(activeView,restoreCandidate);
    }
    enquiryOpen = true;
    const title = configureView(type); activeView = type;
    enquiry.scrollTop = addHistory ? 0 : (viewScroll.get(type)||0);
    lockElements(background,true); document.documentElement.classList.add('enquiry-open');
    if (addHistory) history.pushState({rocksideView:true,type,parent:switching},'',routeFor(type));
    const isBack = !!history.state?.parent;
    document.querySelector('.close-label').textContent = isBack ? 'Back' : 'Close';
    document.querySelector('.close-symbol').textContent = isBack ? '←' : '×';
    document.querySelector('.enquiry-close').classList.toggle('is-back',isBack);
    const remembered = !addHistory && viewFocus.get(type);
    (remembered?.isConnected && remembered.getClientRects().length ? remembered : title).focus({preventScroll:true});
    // Internal routes replace discrete content in place; no opacity flash.

  } else enquiryOpen = false;
  const done = await springTravel(open?0:100);
  if (!done || version !== enquiryVersion) return;
  if (open && !enquiry.contains(document.activeElement)) {
    const remembered = viewFocus.get(type);
    const title = document.getElementById(enquiry.getAttribute('aria-labelledby'));
    (remembered?.isConnected && remembered.getClientRects().length ? remembered : title).focus({preventScroll:true});
  }
  if (!open) {
    enquiry.hidden = true; activeView = null;
    lockElements(background,false); document.documentElement.classList.remove('enquiry-open');
    window.scrollTo({top:savedScroll,behavior:'instant'}); previousFocus?.focus({preventScroll:true});
    viewScroll.clear(); viewFocus.clear();
  }
}
function requestEnquiryClose() {
  if (!enquiryOpen) return;
  if (history.state?.rocksideView) history.back();
  else {history.replaceState(null,'',location.pathname+location.search);setEnquiry(false);}
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{if(activeView!==button.dataset.view)setEnquiry(true,button.dataset.view,true);}));
document.querySelectorAll('[data-enquire]').forEach(button=>button.addEventListener('click',()=>setEnquiry(true,button.dataset.enquire,true)));
document.querySelectorAll('a[href="#talent"],a[href="#brands"]').forEach(link=>{
  link.setAttribute('aria-haspopup','dialog');
  link.addEventListener('click',event=>{event.preventDefault();setEnquiry(true,link.hash==='#talent'?'view-talent':'view-brands',true);});
});
document.querySelectorAll('[data-close-enquiry]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();requestEnquiryClose();}));
window.addEventListener('popstate',()=>{
  const hash=location.hash;
  if(hash==='#talent'||hash==='#brands'||hash==='#enquiry')setEnquiry(true,history.state?.type||(hash==='#talent'?'view-talent':hash==='#brands'?'view-brands':'project'));
  else setEnquiry(false);
});
enquiry.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();requestEnquiryClose();}
  if(event.key==='Tab'){
    const focusable=[...enquiry.querySelectorAll('a,button,input,select,textarea')].filter(element=>!element.disabled&&element.tabIndex>=0&&element.getClientRects().length);
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&(document.activeElement===first||document.activeElement.id===enquiry.getAttribute('aria-labelledby'))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});

// Native details semantics; height is the sole intentional layout animation.
const accordionItems = [...document.querySelectorAll('.accordion details')];
const accordionTargets = new WeakMap();
async function setAccordion(details, open) {
  accordionTargets.set(details, open);
  const summary = details.querySelector('summary');
  const content = details.querySelector('.detail-content');
  const currentHeight = details.getBoundingClientRect().height;
  details.style.height = currentHeight + 'px'; details.open = true;
  summary.setAttribute('aria-expanded', String(open));
  content.toggleAttribute('inert', !open);
  const target = summary.getBoundingClientRect().height + (open ? content.getBoundingClientRect().height : 0) + 1;
  const done = await animateTo(details, {height:target+'px'}, 240);
  if (!done || accordionTargets.get(details) !== open) return;
  details.open = open; details.style.height = '';
}
accordionItems.forEach(details => {
  accordionTargets.set(details, details.open);
  details.querySelector('summary').setAttribute('aria-expanded',String(details.open));
  details.querySelector('summary').addEventListener('click', event => {
    event.preventDefault(); const open = !accordionTargets.get(details);
    if (open) accordionItems.forEach(other => {if (other !== details && accordionTargets.get(other)) setAccordion(other,false);});
    setAccordion(details,open);
  });
});
// Clear validation, recoverable errors and an honest local-download success state.
form.noValidate = true;
let validationShown = false, isSending = false, lastSubmission = null;
const fieldNames = ['name','email','brief'];
const formErrors = document.getElementById('form-errors');
let lastErrorSignature = '';
function getBriefErrors() {
  const errors = {};
  if (!form.elements.name.value.trim()) errors.name = 'Enter your name.';
  if (!form.elements.email.value.trim()) errors.email = 'Enter your email address.';
  else if (!form.elements.email.validity.valid || !/^\S+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim())) errors.email = 'Enter a valid email address, such as name@example.com.';
  if (!form.elements.brief.value.trim()) errors.brief = 'Tell us a little about your project or experience.';
  return errors;
}
function showBriefErrors(errors) {
  fieldNames.forEach(name => {
    const field = form.elements[name], message = document.getElementById('error-' + name);
    message.textContent = errors[name] || ''; message.hidden = !errors[name];
    if (errors[name]) field.setAttribute('aria-invalid','true'); else field.removeAttribute('aria-invalid');
  });
  const signature = JSON.stringify(errors);
  if (signature === lastErrorSignature) return;
  lastErrorSignature = signature;
  formErrors.replaceChildren();
  const entries = Object.entries(errors);
  formErrors.hidden = !entries.length;
  if (!entries.length) return;
  const heading = document.createElement('strong'); heading.textContent = 'A few details need your attention.';
  const list = document.createElement('ul');
  entries.forEach(([name,message]) => {
    const item=document.createElement('li'),link=document.createElement('a');
    link.href='#enquiry-'+name;link.textContent=message;
    link.addEventListener('click',event=>{event.preventDefault();form.elements[name].focus();});
    item.append(link);list.append(item);
  });
  formErrors.append(heading,list);
}
function resetFormFeedback() {
  validationShown = false; showBriefErrors({});
  document.getElementById('form-status').hidden = true;
  document.getElementById('save-error').hidden = true;
  document.getElementById('save-label').textContent = isSending ? 'Sending…' : 'Send enquiry';
  document.getElementById('send-progress').hidden = !isSending;
  form.querySelector('[type=submit]').disabled = isSending;
}
form.addEventListener('input', () => {
  document.getElementById('brief-count').textContent = form.elements.brief.value.length.toLocaleString('en-GB') + ' / 4,000';
  document.getElementById('form-status').hidden = true;
  document.getElementById('save-error').hidden = true;
  document.getElementById('save-label').textContent = isSending ? 'Sending…' : 'Send enquiry';
  document.getElementById('send-progress').hidden = !isSending;
  form.querySelector('[type=submit]').disabled = isSending;
  if (validationShown) showBriefErrors(getBriefErrors());
});
// The public client contains no destination address or delivery credential.
const contactEndpoint = 'https://qbkrqibmolaetilruxki.supabase.co/functions/v1/rockside-contact';
const contactPublishableKey = 'sb_publishable_X4CdUNDE6Ve42fWDdGMBdA_Ev-2F_v2';
function contactValues(values) {
 return {name:String(values.name||'').trim(),email:String(values.email||'').trim().toLowerCase(),interest:String(values.interest||''),brief:String(values.brief||'').trim(),website:String(values.website||'')};
}
function enquiryId() {
 if (crypto.randomUUID) return crypto.randomUUID();
 return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(Number(c)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(c)/4).toString(16));
}
function setSending(value) {
 isSending=value;form.setAttribute('aria-busy',String(value));
 [...form.querySelectorAll('input,select,textarea')].forEach(field=>field.disabled=value);
 form.querySelector('[type=submit]').disabled=value;
 document.getElementById('save-label').textContent=value?'Sending…':'Send enquiry';
 document.getElementById('send-progress').hidden=!value;
}
form.addEventListener('submit', async event => {
 event.preventDefault();if(isSending)return;validationShown=true;
 const errors=getBriefErrors();showBriefErrors(errors);
 if(Object.keys(errors).length){formErrors.focus();return;}
 const values=contactValues(Object.fromEntries(new FormData(form)));
 const signature=JSON.stringify(values);
 if(!lastSubmission || lastSubmission.signature!==signature)lastSubmission={signature,id:enquiryId()};
 document.getElementById('save-error').hidden=true;document.getElementById('form-status').hidden=true;
 setSending(true);
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
 try {
  const response=await fetch(contactEndpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:contactPublishableKey},body:JSON.stringify({...values,id:lastSubmission.id}),signal:controller.signal});
  const result=await response.json().catch(()=>({}));
  if(!response.ok || result.ok!==true)throw Error(result.error||'We couldn’t send your enquiry. Your details are still here—please try again.');
  document.getElementById('form-status').hidden=false;
  document.getElementById('save-label').textContent='Sent';
 }catch(error){
  const message=error.name==='AbortError'?'Sending took too long. Your message is still here—please try again.':error.message==='Failed to fetch'?'We couldn’t connect. Your message is still here—please check your connection and try again.':error.message;
  const notice=document.getElementById('save-error');notice.textContent=message;notice.hidden=false;
 }finally{
  clearTimeout(timeout);setSending(false);
  if(!document.getElementById('form-status').hidden){document.getElementById('save-label').textContent='Sent';form.querySelector('[type=submit]').disabled=true;}
 }
});
document.getElementById('new-enquiry').addEventListener('click',()=>{
 form.elements.brief.value='';lastSubmission=null;document.getElementById('brief-count').textContent='0 / 4,000';resetFormFeedback();form.elements.brief.focus();
});
document.getElementById('year').textContent=new Date().getFullYear();

// About remains an ordinary page anchor; audience routes open focused views.
if (['#talent','#brands','#enquiry'].includes(location.hash)) setEnquiry(true,location.hash==='#talent'?'view-talent':location.hash==='#brands'?'view-brands':'project');
