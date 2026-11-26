const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
function fixture(){
 let change;const interest={value:'',addEventListener:(event,fn)=>{change=fn;}};
 const fields={};const context={activeView:'project',form:{elements:{interest,brief:{}}},document:{getElementById:id=>fields[id]??=( {})},resetFormFeedback(){}};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('const enquiryInterests'),source.indexOf('function configureView(')),context);
 return {context,interest,choose(value){interest.value=value;change();}};
}
test('returning to an enquiry preserves the visitor choice rather than reapplying the default',()=>{
 const f=fixture();f.context.configureEnquiry('project');f.choose('Campaign coordination');
 f.context.activeView='view-brands';f.context.configureEnquiry('project');
 assert.equal(f.interest.value,'Campaign coordination');
});
test('remembered enquiry choice does not replace a different entry point default',()=>{
 const f=fixture();f.context.configureEnquiry('project');f.choose('Something else');
 f.context.activeView='creators';f.context.configureEnquiry('creators');assert.equal(f.interest.value,'Creator partnerships');
 f.context.configureEnquiry('talent');assert.equal(f.interest.value,'Representation');
 f.context.configureEnquiry('project');assert.equal(f.interest.value,'Something else');
});
test('navigation captures a selection even when the select has not blurred or emitted change',()=>{
 const f=fixture();f.context.configureEnquiry('project');f.interest.value='Campaign coordination';
 f.context.rememberEnquiryInterest();f.context.activeView='view-brands';f.context.configureEnquiry('project');
 assert.equal(f.interest.value,'Campaign coordination');
});
