import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{M as t,a as n,b as r,c as i,d as a,f as o,j as s,m as c,s as l,u,w as d}from"./iframe-DuNgvyfV.js";import{n as f,t as p}from"./_plugin-vue_export-helper-ktEZWxTd.js";var m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),m={class:`input-field`},h=[`for`],g={key:0,class:`input-field__required`,"aria-hidden":`true`},_=[`id`,`name`,`type`,`value`,`placeholder`,`autocomplete`,`disabled`,`required`,`aria-invalid`,`aria-describedby`],v=[`id`],y=[`id`],b=c({__name:`MmInput`,props:{modelValue:{default:``},label:{},type:{default:`text`},placeholder:{default:``},hint:{default:``},error:{default:``},disabled:{type:Boolean,default:!1},required:{type:Boolean,default:!1},autocomplete:{default:`off`},name:{default:void 0}},emits:[`update:modelValue`],setup(e,{emit:n}){let c=e,f=n,p=d(),b=l(()=>`mm-input-${p}`),x=l(()=>`${b.value}-hint`),S=l(()=>`${b.value}-error`),C=l(()=>{let e=[];return c.hint&&e.push(x.value),c.error&&e.push(S.value),e.join(` `)||void 0});function w(e){let t=e.target;f(`update:modelValue`,t.value)}return(n,c)=>(r(),a(`div`,m,[i(`label`,{class:`input-field__label`,for:b.value},[o(t(e.label)+` `,1),e.required?(r(),a(`span`,g,`*`)):u(``,!0)],8,h),i(`input`,{id:b.value,class:s([`input-field__control`,{"input-field__control--error":e.error}]),name:e.name,type:e.type,value:e.modelValue,placeholder:e.placeholder,autocomplete:e.autocomplete,disabled:e.disabled,required:e.required,"aria-invalid":e.error?`true`:void 0,"aria-describedby":C.value,onInput:w},null,42,_),e.hint?(r(),a(`p`,{key:0,id:x.value,class:`input-field__hint`},t(e.hint),9,v)):u(``,!0),e.error?(r(),a(`p`,{key:1,id:S.value,class:`input-field__error`,role:`alert`},t(e.error),9,y)):u(``,!0)]))}})})))()}var S;function C(){return(C=e((()=>{x(),f(),S=p(b,[[`__scopeId`,`data-v-aaaaf8df`]]),b.__docgenInfo=Object.assign({displayName:b.name??b.__name},{exportName:`default`,displayName:`MmInput`,description:``,tags:{},props:[{name:`modelValue`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`label`,required:!0,type:{name:`string`}},{name:`type`,required:!1,type:{name:`InputType`},defaultValue:{func:!1,value:`'text'`}},{name:`placeholder`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`hint`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`error`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`disabled`,required:!1,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`required`,required:!1,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`autocomplete`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`'off'`}},{name:`name`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`undefined`}}],events:[{name:`update:modelValue`,type:{names:[`string`]}}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/atoms/MmInput/MmInput.vue`]})})))()}var w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{C(),w={title:`Atoms/Input`,component:S,tags:[`autodocs`],argTypes:{modelValue:{control:`text`,description:`Current input value.`},label:{control:`text`,description:`Visible and accessible label.`},type:{control:`select`,options:[`text`,`url`,`password`],description:`Native HTML input type.`},placeholder:{control:`text`,description:`Placeholder displayed when the input is empty.`},hint:{control:`text`,description:`Optional helper text below the input.`},error:{control:`text`,description:`Validation error displayed below the input.`},disabled:{control:`boolean`,description:`Prevents interaction.`},required:{control:`boolean`,description:`Marks the field as required.`},autocomplete:{control:`text`,description:`Native autocomplete attribute.`},name:{control:`text`,description:`Native input name.`}},args:{modelValue:``,label:`Server URL`,type:`url`,placeholder:`https://jellyfin.example.com`,hint:``,error:``,disabled:!1,required:!1,autocomplete:`off`,name:`url`},render:e=>({components:{MmInput:S},setup(){return{args:e}},template:`
      <div style="width: 320px">
        <mm-input
          v-bind="args"
          @update:model-value="args.modelValue = $event"
        />
      </div>
    `})},T={},E={args:{label:`Server URL`,type:`url`,placeholder:`https://jellyfin.example.com`,required:!0}},D={args:{label:`API Key`,type:`password`,placeholder:`Enter API key`,name:`apiKey`}},O={args:{label:`API Key`,type:`password`,placeholder:`Leave blank to reuse saved API key`,hint:`Leave this field empty to keep your existing API key.`,name:`apiKey`}},k={args:{label:`Server URL`,type:`url`,hint:`Enter the HTTPS address of your server.`}},A={args:{label:`Server URL`,type:`url`,modelValue:`http://localhost:8096`,error:`Only HTTPS server URLs are supported.`}},j={args:{label:`Server URL`,required:!0}},M={args:{label:`Server URL`,modelValue:`https://jellyfin.example.com`,disabled:!0}},N=[`Playground`,`ServerUrl`,`ApiKey`,`ExistingApiKey`,`WithHint`,`WithError`,`Required`,`Disabled`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{}`,...T.parameters?.docs?.source},description:{story:`Interactive playground for input properties.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    type: 'url',
    placeholder: 'https://jellyfin.example.com',
    required: true
  }
}`,...E.parameters?.docs?.source},description:{story:`URL field used when configuring a service.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'API Key',
    type: 'password',
    placeholder: 'Enter API key',
    name: 'apiKey'
  }
}`,...D.parameters?.docs?.source},description:{story:`Password field used for service API keys.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'API Key',
    type: 'password',
    placeholder: 'Leave blank to reuse saved API key',
    hint: 'Leave this field empty to keep your existing API key.',
    name: 'apiKey'
  }
}`,...O.parameters?.docs?.source},description:{story:`Existing credentials can be reused.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    type: 'url',
    hint: 'Enter the HTTPS address of your server.'
  }
}`,...k.parameters?.docs?.source},description:{story:`Helper text provides additional guidance.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    type: 'url',
    modelValue: 'http://localhost:8096',
    error: 'Only HTTPS server URLs are supported.'
  }
}`,...A.parameters?.docs?.source},description:{story:`Validation errors are announced to assistive technology.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    required: true
  }
}`,...j.parameters?.docs?.source},description:{story:`Required fields display a visual indicator.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    modelValue: 'https://jellyfin.example.com',
    disabled: true
  }
}`,...M.parameters?.docs?.source},description:{story:`Disabled inputs cannot be edited.`,...M.parameters?.docs?.description}}}})))()}P();export{D as ApiKey,M as Disabled,O as ExistingApiKey,T as Playground,j as Required,E as ServerUrl,A as WithError,k as WithHint,N as __namedExportsOrder,w as default};