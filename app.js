const disciplines={models:{word:'MODELS',kicker:'Beyond the first impression',title:'PRESENCE THAT<br>STAYS WITH YOU.',description:'Distinctive faces and individual character. Representation for fashion, editorial and commercial opportunities.',tags:['Fashion','Editorial','Commercial'],cta:'Enquire about modelling',note:'Presence. Personality. Perspective.'},actors:{word:'ACTORS',kicker:'There’s more to the story',title:'CHARACTER.<br>IN EVERY SENSE.',description:'Individual voices, compelling performances and people who bring a story to life. Representation for screen, stage and commercial work.',tags:['Screen','Stage','Commercial'],cta:'Enquire about acting',note:'Character. Voice. Connection.'},creators:{word:'CREATORS',kicker:'A point of view worth sharing',title:'YOUR VOICE.<br>A WIDER REACH.',description:'Original ideas and distinctive perspectives. Connecting creators with thoughtful brand partnerships and content opportunities.',tags:['Content','Partnerships','Campaigns'],cta:'Enquire about creating',note:'Ideas. Originality. Impact.'}};
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

// Immediate tab selection, a quiet content dissolve, and reserved content space.
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
let tabVersion = 0;
async function selectDiscipline(key, focus = false) {
  tabs.forEach(tab => {
    const active = tab.dataset.discipline === key;
    tab.setAttribute('aria-selected', active); tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus({preventScroll:true});
  });
  if (key === selected) return;
  selected = key;
  const version = ++tabVersion;
  // Keep the current text in place while it fades; rapid changes coalesce.
  await Promise.all([animateTo(disciplineCopy, {opacity: '.12'}, 85), animateTo(disciplineWord, {opacity: '.12'}, 85)]);
  if (version !== tabVersion) return;
  renderDiscipline(key);
  disciplinePanel.setAttribute('aria-labelledby', 'tab-' + key);
  await Promise.all([animateTo(disciplineCopy, {opacity: '1'}, 200), animateTo(disciplineWord, {opacity: '1'}, 200)]);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDiscipline(tab.dataset.discipline));
  tab.addEventListener('keydown', event => {
    const next = {ArrowRight:(index+1)%tabs.length, ArrowLeft:(index+tabs.length-1)%tabs.length, Home:0, End:tabs.length-1}[event.key];
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
    if (!moving.has(mobileMenu)) Object.assign(mobileMenu.style, {opacity:'0', transform:'translateY(-12px)'});
  } else mobileMenu.setAttribute('inert','');
  const done = await animateTo(mobileMenu, {opacity:open?'1':'0', transform:open?'translateY(0)':'translateY(-12px)'}, instant?0:open?300:220);
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

// Full-screen enquiry: one travel path in both directions, live-value reversal.
let previousFocus, savedScroll = 0, enquiryOpen = false, enquiryVersion = 0, ownsEnquiryHistory = false;
function configureEnquiry(type) {
  const talent = type === 'talent';
  form.elements.interest.value = talent ? 'Representation' : ({casting:'Casting & bookings', creators:'Creator partnerships', campaign:'Campaign coordination'}[type] || 'Casting & bookings');
  document.getElementById('enquiry-title').innerHTML = talent ? 'YOUR WIDER<br>STAGE.' : 'LET’S<br>TALK.';
  document.getElementById('enquiry-intro').textContent = talent ? 'Introduce yourself and tell us about your discipline, experience and work.' : 'Tell us about the idea, the people you need and where you want to take it.';
  form.elements.brief.placeholder = talent ? 'Your discipline, experience and portfolio links.' : 'Your project, timing, location and budget, if known.';
  document.getElementById('form-heading').textContent = talent ? 'Prepare your introduction' : 'Prepare your project brief';
  resetFormFeedback();
}
async function setEnquiry(open, type = 'project', addHistory = false) {
  if (open === enquiryOpen && !enquiry.hidden) return;
  if (!open && enquiry.hidden) return;
  const version = ++enquiryVersion;
  const restoreCandidate = mobileMenu.contains(document.activeElement) ? menu : document.activeElement;
  enquiryOpen = open;
  if (open) {
    if (menuOpen) await setMenu(false, false, true);
    if (enquiry.hidden) {
      previousFocus = restoreCandidate; savedScroll = window.scrollY;
      enquiry.hidden = false; enquiry.scrollTop = 0; enquiry.style.transform = 'translateY(100%)';
    }
    configureEnquiry(type);
    lockElements(background, true); document.documentElement.classList.add('enquiry-open');
    if (addHistory) {history.pushState({rocksideEnquiry:true,type}, '', '#enquiry'); ownsEnquiryHistory = true;}
    document.getElementById('enquiry-title').focus({preventScroll:true});
  }
  const height = enquiry.getBoundingClientRect().height;
  const currentY = enquiry.getBoundingClientRect().top;
  const distance = Math.abs((open ? 0 : height) - currentY) / Math.max(1,height);
  const done = await animateTo(enquiry, {transform:open?'translateY(0)':'translateY(100%)'}, Math.max(90, (open?620:420)*distance));
  if (!done || version !== enquiryVersion) return;
  if (!open) {
    enquiry.hidden = true; lockElements(background, false);
    document.documentElement.classList.remove('enquiry-open');
    window.scrollTo({top:savedScroll,behavior:'instant'});
    previousFocus?.focus({preventScroll:true});
  }
}
function requestEnquiryClose() {
  if (!enquiryOpen) return;
  setEnquiry(false);
  if (ownsEnquiryHistory) {ownsEnquiryHistory = false; history.back();}
  else history.replaceState(null, '', location.pathname + location.search);
}
document.querySelectorAll('[data-enquire]').forEach(button => button.addEventListener('click', () => setEnquiry(true, button.dataset.enquire, true)));
document.querySelectorAll('[data-close-enquiry]').forEach(button => button.addEventListener('click', event => {event.preventDefault(); requestEnquiryClose();}));
window.addEventListener('popstate', () => {
  const open = location.hash === '#enquiry';
  ownsEnquiryHistory = open && !!history.state?.rocksideEnquiry;
  setEnquiry(open, history.state?.type || 'project');
});
enquiry.addEventListener('keydown', event => {
  if (event.key === 'Escape') {event.preventDefault(); requestEnquiryClose();}
  if (event.key === 'Tab') {
    const focusable = [...enquiry.querySelectorAll('a,button,input,select,textarea')].filter(element => !element.disabled);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement.id === 'enquiry-title')) {event.preventDefault(); last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
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
  const done = await animateTo(details, {height:target+'px'}, 300);
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
let validationShown = false;
const fieldNames = ['name','email','brief'];
const formErrors = document.getElementById('form-errors');
let lastErrorSignature = '';
function getBriefErrors() {
  const errors = {};
  if (!form.elements.name.value.trim()) errors.name = 'Enter your name.';
  if (!form.elements.email.value.trim()) errors.email = 'Enter your email address.';
  else if (!form.elements.email.validity.valid) errors.email = 'Enter a valid email address, such as name@example.com.';
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
  document.getElementById('save-label').textContent = 'Download brief';
}
form.addEventListener('input', () => {
  document.getElementById('brief-count').textContent = form.elements.brief.value.length.toLocaleString('en-GB') + ' / 4,000';
  document.getElementById('form-status').hidden = true;
  document.getElementById('save-error').hidden = true;
  document.getElementById('save-label').textContent = 'Download brief';
  if (validationShown) showBriefErrors(getBriefErrors());
});
// Pure formatter kept separate so line breaks and international names are tested.
function formatBrief(values, discipline) {
  return ['ROCKSIDE TALENT / ENQUIRY','',`Name: ${values.name.trim()}`,`Email: ${values.email.trim()}`,`Interest: ${values.interest}`,`Discipline viewed: ${discipline}`,'',values.brief.trim(),'','Prepared locally. This enquiry has not been sent.'].join('\n');
}
form.addEventListener('submit', event => {
  event.preventDefault();validationShown = true;
  const errors = getBriefErrors();showBriefErrors(errors);
  if (Object.keys(errors).length) {formErrors.focus();return;}
  let url,link;
  try {
    const values = Object.fromEntries(new FormData(form));
    url = URL.createObjectURL(new Blob([formatBrief(values,disciplines[renderedDiscipline].word)],{type:'text/plain;charset=utf-8'}));
    link = document.createElement('a');link.href=url;link.download='Rockside-Brief.txt';
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    document.getElementById('form-status').hidden = false;
    document.getElementById('save-label').textContent = 'Download again';
  } catch {
    link?.remove();if(url)URL.revokeObjectURL(url);
    document.getElementById('save-error').hidden = false;
  }
});
document.getElementById('year').textContent = new Date().getFullYear();

// Navigation location cues don't change the link geometry or hijack scrolling.
const locationLinks=[...document.querySelectorAll('.header nav a,#mobile-menu a,.footer-top nav a')];
const sections=['talent','about','brands'].map(id=>document.getElementById(id));
const sectionObserver=new IntersectionObserver(()=>{
  const threshold=innerHeight*.36;
  const active=sections.filter(section=>section.getBoundingClientRect().top<=threshold).at(-1);
  const id=active && active.getBoundingClientRect().bottom>0 ? active.id : null;
  locationLinks.forEach(link=>{if(link.hash==='#'+id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
},{rootMargin:'-20% 0px -45% 0px',threshold:0});
sections.forEach(section=>sectionObserver.observe(section));
if (location.hash === '#enquiry') setEnquiry(true);
