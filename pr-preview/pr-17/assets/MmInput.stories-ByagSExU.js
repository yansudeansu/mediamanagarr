import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmInput-rFb2AIwf.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),r={title:`Atoms/Input`,component:n,tags:[`autodocs`],argTypes:{modelValue:{control:`text`,description:`Current input value.`},label:{control:`text`,description:`Visible and accessible label.`},type:{control:`select`,options:[`text`,`url`,`password`],description:`Native HTML input type.`},placeholder:{control:`text`,description:`Placeholder displayed when the input is empty.`},hint:{control:`text`,description:`Optional helper text below the input.`},error:{control:`text`,description:`Validation error displayed below the input.`},disabled:{control:`boolean`,description:`Prevents interaction.`},required:{control:`boolean`,description:`Marks the field as required.`},autocomplete:{control:`text`,description:`Native autocomplete attribute.`},name:{control:`text`,description:`Native input name.`}},args:{modelValue:``,label:`Server URL`,type:`url`,placeholder:`https://jellyfin.example.com`,hint:``,error:``,disabled:!1,required:!1,autocomplete:`off`,name:`url`},render:e=>({components:{MmInput:n},setup(){return{args:e}},template:`
      <div style="width: 320px">
        <mm-input
          v-bind="args"
          @update:model-value="args.modelValue = $event"
        />
      </div>
    `})},i={},a={args:{label:`Server URL`,type:`url`,placeholder:`https://jellyfin.example.com`,required:!0}},o={args:{label:`API Key`,type:`password`,placeholder:`Enter API key`,name:`apiKey`}},s={args:{label:`API Key`,type:`password`,placeholder:`Leave blank to reuse saved API key`,hint:`Leave this field empty to keep your existing API key.`,name:`apiKey`}},c={args:{label:`Server URL`,type:`url`,hint:`Enter the HTTPS address of your server.`}},l={args:{label:`Server URL`,type:`url`,modelValue:`http://localhost:8096`,error:`Only HTTPS server URLs are supported.`}},u={args:{label:`Server URL`,required:!0}},d={args:{label:`Server URL`,modelValue:`https://jellyfin.example.com`,disabled:!0}},f=[`Playground`,`ServerUrl`,`ApiKey`,`ExistingApiKey`,`WithHint`,`WithError`,`Required`,`Disabled`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground for input properties.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    type: 'url',
    placeholder: 'https://jellyfin.example.com',
    required: true
  }
}`,...a.parameters?.docs?.source},description:{story:`URL field used when configuring a service.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'API Key',
    type: 'password',
    placeholder: 'Enter API key',
    name: 'apiKey'
  }
}`,...o.parameters?.docs?.source},description:{story:`Password field used for service API keys.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'API Key',
    type: 'password',
    placeholder: 'Leave blank to reuse saved API key',
    hint: 'Leave this field empty to keep your existing API key.',
    name: 'apiKey'
  }
}`,...s.parameters?.docs?.source},description:{story:`Existing credentials can be reused.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    type: 'url',
    hint: 'Enter the HTTPS address of your server.'
  }
}`,...c.parameters?.docs?.source},description:{story:`Helper text provides additional guidance.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    type: 'url',
    modelValue: 'http://localhost:8096',
    error: 'Only HTTPS server URLs are supported.'
  }
}`,...l.parameters?.docs?.source},description:{story:`Validation errors are announced to assistive technology.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    required: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Required fields display a visual indicator.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Server URL',
    modelValue: 'https://jellyfin.example.com',
    disabled: true
  }
}`,...d.parameters?.docs?.source},description:{story:`Disabled inputs cannot be edited.`,...d.parameters?.docs?.description}}}})))()}p();export{o as ApiKey,d as Disabled,s as ExistingApiKey,i as Playground,u as Required,a as ServerUrl,l as WithError,c as WithHint,f as __namedExportsOrder,r as default};