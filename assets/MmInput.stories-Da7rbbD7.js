import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmInput-C6bp3Gqm.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),r={title:`Atoms/Input`,component:n,tags:[`autodocs`],argTypes:{modelValue:{control:`text`,description:`Current input value.`},label:{control:`text`,description:`Visible and accessible label.`},type:{control:`select`,options:[`text`,`url`,`password`],description:`Native HTML input type.`},placeholder:{control:`text`,description:`Placeholder displayed when the input is empty.`},hint:{control:`text`,description:`Optional helper text below the input.`},error:{control:`text`,description:`Validation error displayed below the input.`},disabled:{control:`boolean`,description:`Prevents interaction.`},required:{control:`boolean`,description:`Marks the field as required.`},autocomplete:{control:`text`,description:`Native autocomplete attribute.`},name:{control:`text`,description:`Native input name.`}},args:{modelValue:``,label:`Name`,type:`text`,placeholder:`Enter your name`,hint:``,error:``,disabled:!1,required:!1,autocomplete:`off`,name:`name`},render:e=>({components:{MmInput:n},setup(){return{args:e}},template:`
      <div style="width: 320px; max-width: 100%;">
        <mm-input
          v-bind="args"
          @update:model-value="args.modelValue = $event"
        />
      </div>
    `})},i={},a={},o={args:{label:`Website`,type:`url`,placeholder:`https://example.com`,name:`website`}},s={args:{label:`Password`,type:`password`,placeholder:`Enter your password`,autocomplete:`new-password`,name:`password`}},c={args:{label:`Username`,placeholder:`Choose a username`,hint:`Use at least 3 characters.`,name:`username`}},l={args:{label:`Username`,modelValue:`ab`,placeholder:`Choose a username`,error:`Username must be at least 3 characters.`,name:`username`}},u={args:{label:`Full name`,placeholder:`Enter your full name`,required:!0,name:`fullName`}},d={args:{label:`Username`,modelValue:`example_user`,disabled:!0,name:`username`}},f=[`Playground`,`Default`,`Url`,`Password`,`WithHint`,`WithError`,`Required`,`Disabled`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground for input properties.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Standard text input.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    name: 'website'
  }
}`,...o.parameters?.docs?.source},description:{story:`URL input with native URL validation.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    autocomplete: 'new-password',
    name: 'password'
  }
}`,...s.parameters?.docs?.source},description:{story:`Password input with masked characters.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    hint: 'Use at least 3 characters.',
    name: 'username'
  }
}`,...c.parameters?.docs?.source},description:{story:`Helper text provides additional guidance.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    modelValue: 'ab',
    placeholder: 'Choose a username',
    error: 'Username must be at least 3 characters.',
    name: 'username'
  }
}`,...l.parameters?.docs?.source},description:{story:`Validation errors are announced to assistive technology.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Full name',
    placeholder: 'Enter your full name',
    required: true,
    name: 'fullName'
  }
}`,...u.parameters?.docs?.source},description:{story:`Required fields display a visual indicator.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    modelValue: 'example_user',
    disabled: true,
    name: 'username'
  }
}`,...d.parameters?.docs?.source},description:{story:`Disabled inputs cannot be edited.`,...d.parameters?.docs?.description}}}})))()}p();export{a as Default,d as Disabled,s as Password,i as Playground,u as Required,o as Url,l as WithError,c as WithHint,f as __namedExportsOrder,r as default};