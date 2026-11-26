const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=readFileSync(path.join(__dirname,'../app.js'),'utf8');
const start=source.indexOf('function formatBrief(');
const end=source.indexOf("form.addEventListener('submit'",start);
const scope={};vm.createContext(scope);vm.runInContext(source.slice(start,end),scope);
test('brief exports real line breaks and preserves international names and project text',()=>{
 const text=scope.formatBrief({name:'  Zoë 李  ',email:' person@example.com ',interest:'Representation',brief:'  First line.\nSecond line — café.  '},'ACTORS');
 assert.ok(text.startsWith('ROCKSIDE TALENT / ENQUIRY\n\nName: Zoë 李\n'));
 assert.ok(text.includes('First line.\nSecond line — café.'));
 assert.ok(text.includes('Discipline viewed: ACTORS'));
 assert.ok(!text.includes('\\n'));
});
test('brief never claims delivery and does not insert a private destination',()=>{
 const text=scope.formatBrief({name:'Test',email:'visitor@example.com',interest:'Casting & bookings',brief:'Project'},'MODELS');
 assert.ok(text.endsWith('Prepared locally. This enquiry has not been sent.'));
 assert.equal((text.match(/@/g)||[]).length,1);
});
