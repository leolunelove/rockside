const disciplines={models:{word:'MODELS',kicker:'Beyond the first impression',title:'PRESENCE THAT<br>STAYS WITH YOU.',description:'Distinctive faces and individual character. Representation for fashion, editorial and commercial opportunities.',tags:['Fashion','Editorial','Commercial'],cta:'Enquire about modelling',note:'Presence. Personality. Perspective.'},actors:{word:'ACTORS',kicker:'There’s more to the story',title:'CHARACTER.<br>IN EVERY SENSE.',description:'Individual voices, compelling performances and people who bring a story to life. Representation for screen, stage and commercial work.',tags:['Screen','Stage','Commercial'],cta:'Enquire about acting',note:'Character. Voice. Connection.'},creators:{word:'CREATORS',kicker:'A point of view worth sharing',title:'YOUR VOICE.<br>A WIDER REACH.',description:'Original ideas and distinctive perspectives. Connecting creators with thoughtful brand partnerships and content opportunities.',tags:['Content','Partnerships','Campaigns'],cta:'Enquire about creating',note:'Ideas. Originality. Impact.'}};
let selected='models';const tabs=[...document.querySelectorAll('[data-discipline]')];function selectDiscipline(key,focus=false){selected=key;const d=disciplines[key];tabs.forEach(t=>{const yes=t.dataset.discipline===key;t.setAttribute('aria-selected',yes);t.tabIndex=yes?0:-1;if(yes&&focus)t.focus()});document.getElementById('discipline-panel').setAttribute('aria-labelledby','tab-'+key);document.getElementById('discipline-word').textContent=d.word;document.getElementById('discipline-kicker').textContent=d.kicker;document.getElementById('discipline-title').innerHTML=d.title;document.getElementById('discipline-description').textContent=d.description;document.querySelector('.discipline-note').textContent=d.note;document.getElementById('discipline-tags').replaceChildren(...d.tags.map(tag=>{const s=document.createElement('span');s.textContent=tag;return s}));document.getElementById('discipline-cta').firstChild.textContent=d.cta+' ';}tabs.forEach((t,i)=>{t.addEventListener('click',()=>selectDiscipline(t.dataset.discipline));t.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectDiscipline(tabs[n].dataset.discipline,true)}})});
const menu=document.querySelector('.menu-toggle'),mobileMenu=document.getElementById('mobile-menu');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',!open);mobileMenu.hidden=open});mobileMenu.querySelectorAll('a,button').forEach(a=>a.addEventListener('click',()=>{mobileMenu.hidden=true;menu.setAttribute('aria-expanded','false')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileMenu.hidden){mobileMenu.hidden=true;menu.setAttribute('aria-expanded','false');menu.focus()}});
// Full-screen enquiry, with browser history and native compositor motion.
const enquiry=document.getElementById('enquiry-view'),form=document.getElementById('enquiry-form');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const background=[...document.body.children].filter(el=>el!==enquiry&&el.tagName!=='SCRIPT');
let previousFocus,viewState='closed',viewAnimation,savedScroll=0,ownsEnquiryHistory=false,transitionVersion=0;
const originalBackground=background.map(el=>({el,inert:el.hasAttribute('inert'),aria:el.getAttribute('aria-hidden')}));
function setBackgroundLocked(locked){originalBackground.forEach(({el,inert,aria})=>{if(locked){el.setAttribute('inert','');el.setAttribute('aria-hidden','true')}else{if(!inert)el.removeAttribute('inert');if(aria===null)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',aria)}})}
function configureEnquiry(type){
 const talent=type==='talent';
 form.elements.interest.value=talent?'Representation':({casting:'Casting & bookings',creators:'Creator partnerships',campaign:'Campaign coordination'}[type]||'Casting & bookings');
 document.getElementById('enquiry-title').innerHTML=talent?'YOUR WIDER<br>STAGE.':'LET’S<br>TALK.';
 document.getElementById('enquiry-intro').textContent=talent?'Introduce yourself and tell us about your discipline, experience and work.':'Tell us about the idea, the people you need and where you want to take it.';
 form.elements.brief.placeholder=talent?'Your discipline, experience and portfolio links.':'Your project, timing, location and budget, if known.';
 document.getElementById('form-status').hidden=true;
}
async function animateEnquiry(open){
 viewAnimation?.cancel();
 if(motionPreference.matches)return;
 const animation=enquiry.animate(open?[{transform:'translateY(100%)'},{transform:'translateY(0)'}]:[{transform:'translateY(0)'},{transform:'translateY(-4%)',opacity:0}],{duration:open?650:360,easing:open?'cubic-bezier(.22,1,.36,1)':'cubic-bezier(.4,0,1,1)'});
 viewAnimation=animation;try{await animation.finished}catch{};
}
async function openEnquiry(type='project',addHistory=true){
 if(viewState==='open'||viewState==='opening')return;
 const version=++transitionVersion;
 if(viewState==='closed'){previousFocus=document.activeElement;savedScroll=window.scrollY;}
 configureEnquiry(type);
 viewState='opening';enquiry.hidden=false;enquiry.scrollTop=0;
 setBackgroundLocked(true);document.documentElement.classList.add('enquiry-open');
 if(addHistory){history.pushState({rocksideEnquiry:true,type},'', '#enquiry');ownsEnquiryHistory=true;}
 document.getElementById('enquiry-title').focus({preventScroll:true});
 await animateEnquiry(true);if(version===transitionVersion)viewState='open';
}
async function closeEnquiry(){
 if(viewState==='closed'||viewState==='closing')return;
 const version=++transitionVersion;viewState='closing';await animateEnquiry(false);
 if(version!==transitionVersion)return;
 enquiry.hidden=true;setBackgroundLocked(false);document.documentElement.classList.remove('enquiry-open');
 window.scrollTo({top:savedScroll,behavior:'instant'});previousFocus?.focus({preventScroll:true});viewState='closed';ownsEnquiryHistory=false;
}
function requestEnquiryClose(){
 if(viewState==='closed'||viewState==='closing')return;
 const goBack=ownsEnquiryHistory;ownsEnquiryHistory=false;closeEnquiry();
 if(goBack)history.back();else history.replaceState(null,'',location.pathname+location.search);
}
document.querySelectorAll('[data-enquire]').forEach(b=>b.addEventListener('click',()=>openEnquiry(b.dataset.enquire)));
document.querySelectorAll('[data-close-enquiry]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();requestEnquiryClose()}));
window.addEventListener('popstate',()=>{if(location.hash==='#enquiry'){ownsEnquiryHistory=!!history.state?.rocksideEnquiry;openEnquiry(history.state?.type||'project',false)}else closeEnquiry()});
enquiry.addEventListener('keydown',e=>{
 if(e.key==='Escape'){e.preventDefault();requestEnquiryClose()}
 if(e.key==='Tab'){
  const focusable=[...enquiry.querySelectorAll('a,button,input,select,textarea')].filter(el=>!el.disabled);
  const first=focusable[0],last=focusable.at(-1);
  if(e.shiftKey&&(document.activeElement===first||document.activeElement===document.getElementById('enquiry-title'))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)viewAnimation?.finish()});
if(location.hash==='#enquiry')openEnquiry('project',false);
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const text=['ROCKSIDE TALENT / ENQUIRY','',`Name: ${d.get('name')}`,`Email: ${d.get('email')}`,`Interest: ${d.get('interest')}`,`Discipline viewed: ${disciplines[selected].word}`,'',String(d.get('brief')),'','Prepared locally. This enquiry has not been sent.'].join('\n');const u=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='Rockside-Enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);document.getElementById('form-status').hidden=false});document.getElementById('year').textContent=new Date().getFullYear();document.querySelectorAll('.accordion details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.accordion details').forEach(other=>{if(other!==d)other.open=false})}));
