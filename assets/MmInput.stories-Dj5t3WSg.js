import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmInput-Cnxwcmkf.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),{useArgs:r}=__STORYBOOK_MODULE_PREVIEW_API__,i={title:`Atoms/Input`,component:n,tags:[`autodocs`],argTypes:{modelValue:{control:`text`,description:`Current input value.`},label:{control:`text`,description:`Visible and accessible label.`},type:{control:`select`,options:[`text`,`url`,`password`],description:`Native HTML input type.`},placeholder:{control:`text`,description:`Placeholder displayed when the input is empty.`},hint:{control:`text`,description:`Optional helper text below the input.`},error:{control:`text`,description:`Validation error displayed below the input.`},disabled:{control:`boolean`,description:`Prevents interaction.`},required:{control:`boolean`,description:`Marks the field as required.`},autocomplete:{control:`text`,description:`Native autocomplete attribute.`},name:{control:`text`,description:`Native input name.`}},args:{modelValue:``,label:`Name`,type:`text`,placeholder:`Enter your name`,hint:``,error:``,disabled:!1,required:!1,autocomplete:`off`,name:`name`},render:e=>{let[,t]=r();return{components:{MmInput:n},setup(){function n(e){t({modelValue:e})}return{args:e,updateValue:n}},template:`
      <div style="width: 320px; max-width: 100%;">
        <mm-input
          v-bind="args"
          @update:model-value="updateValue"
        />
      </div>
    `}}},a={},o={},s={args:{label:`Website`,type:`url`,placeholder:`https://example.com`,name:`website`}},c={args:{label:`Password`,type:`password`,placeholder:`Enter your password`,autocomplete:`new-password`,name:`password`}},l={args:{label:`Username`,placeholder:`Choose a username`,hint:`Use at least 3 characters.`,name:`username`}},u={args:{label:`Username`,modelValue:`ab`,placeholder:`Choose a username`,error:`Username must be at least 3 characters.`,name:`username`}},d={args:{label:`Full name`,placeholder:`Enter your full name`,required:!0,name:`fullName`}},f={args:{label:`Username`,modelValue:`example_user`,disabled:!0,name:`username`}},p=[`Playground`,`Default`,`Url`,`Password`,`WithHint`,`WithError`,`Required`,`Disabled`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Interactive playground for input properties.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Standard text input.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    name: 'website'
  }
}`,...s.parameters?.docs?.source},description:{story:`URL input with native URL validation.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    autocomplete: 'new-password',
    name: 'password'
  }
}`,...c.parameters?.docs?.source},description:{story:`Password input with masked characters.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    hint: 'Use at least 3 characters.',
    name: 'username'
  }
}`,...l.parameters?.docs?.source},description:{story:`Helper text provides additional guidance.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    modelValue: 'ab',
    placeholder: 'Choose a username',
    error: 'Username must be at least 3 characters.',
    name: 'username'
  }
}`,...u.parameters?.docs?.source},description:{story:`Validation errors are announced to assistive technology.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Full name',
    placeholder: 'Enter your full name',
    required: true,
    name: 'fullName'
  }
}`,...d.parameters?.docs?.source},description:{story:`Required fields display a visual indicator.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    modelValue: 'example_user',
    disabled: true,
    name: 'username'
  }
}`,...f.parameters?.docs?.source},description:{story:`Disabled inputs cannot be edited.`,...f.parameters?.docs?.description}}}})))()}m();export{o as Default,f as Disabled,c as Password,a as Playground,d as Required,s as Url,u as WithError,l as WithHint,p as __namedExportsOrder,i as default};