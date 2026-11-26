const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = readFileSync(path.join(__dirname,'../app.js'),'utf8');
const helper = source.slice(source.indexOf('const motionPreference'),source.indexOf('// Immediate discipline selection'));
function fixture(reduced = false) {
  let change;
  const preference = {matches:reduced,addEventListener:(_,handler)=>change=handler};
  const scope = {matchMedia:()=>preference,getComputedStyle:element=>element.presentation || element.style};
  vm.createContext(scope);vm.runInContext(helper,scope);
  const calls=[];
  const element={style:{transform:'translateY(100%)'},animate(frames,options){
    let resolve,reject;
    const animation={frames,options,finished:new Promise((yes,no)=>{resolve=yes;reject=no}),cancel(){reject(new Error('cancelled'));},finish(){resolve();}};
    calls.push(animation);return animation;
  }};
  return {element,calls,animate:scope.animateTo,reduce(){preference.matches=true;change();}};
}
test('reduced motion applies the destination without creating an animation',async()=>{
 const f=fixture(true);assert.equal(await f.animate(f.element,{transform:'translateY(0)'}),true);
 assert.equal(f.calls.length,0);assert.equal(f.element.style.transform,'translateY(0)');
});
test('reversal starts from the current presentation rather than the previous endpoint',async()=>{
 const f=fixture();const first=f.animate(f.element,{transform:'translateY(0)'},620);
 f.element.presentation={transform:'matrix(1, 0, 0, 1, 0, 370)'};
 const reverse=f.animate(f.element,{transform:'translateY(100%)'},250);
 assert.equal(f.calls[1].frames[0].transform,'matrix(1, 0, 0, 1, 0, 370)');
 assert.equal(await first,false);f.calls[1].finish();assert.equal(await reverse,true);
 assert.equal(f.element.style.transform,'translateY(100%)');
});
test('rapid retargeting leaves only the final destination committed',async()=>{
 const f=fixture();const pending=[];
 for(let i=0;i<12;i++)pending.push(f.animate(f.element,{transform:`translateY(${i%2?100:0}%)`}));
 f.calls.at(-1).finish();const results=await Promise.all(pending);
 assert.equal(results.filter(Boolean).length,1);assert.equal(results.at(-1),true);
 assert.equal(f.element.style.transform,'translateY(100%)');
});
test('enabling reduced motion finishes an in-flight transition',async()=>{
 const f=fixture();const pending=f.animate(f.element,{transform:'translateY(0)'});
 f.reduce();assert.equal(await pending,true);assert.equal(f.element.style.transform,'translateY(0)');
});
