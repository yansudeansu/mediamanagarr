import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmSelect-bHktQwio.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),r={title:`Atoms/Select`,component:n,tags:[`autodocs`],argTypes:{modelValue:{control:`text`,description:`Currently selected option value.`},label:{control:`text`,description:`Visible and accessible label.`},options:{control:`object`,description:`Available options containing labels and values.`},placeholder:{control:`text`,description:`Optional placeholder shown before a selection is made.`},hint:{control:`text`,description:`Optional helper text.`},error:{control:`text`,description:`Validation error message.`},disabled:{control:`boolean`,description:`Prevents interaction.`},loading:{control:`boolean`,description:`Disables the select while options are loading.`},required:{control:`boolean`,description:`Marks the field as required.`},name:{control:`text`,description:`Native HTML select name.`}},args:{modelValue:``,label:`Jellyfin user`,options:[{label:`Alice`,value:`user-1`},{label:`Bob`,value:`user-2`},{label:`Charlie`,value:`user-3`}],placeholder:`Select a user`,hint:``,error:``,disabled:!1,loading:!1,required:!1,name:`jellyfinUser`},render:e=>({components:{MmSelect:n},setup(){return{args:e}},template:`
      <div style="width: 320px">
        <mm-select
          v-bind="args"
          @update:model-value="args.modelValue = $event"
        />
      </div>
    `})},i={},a={args:{label:`Jellyfin user`,placeholder:`Select a user`,hint:`Watched movies and episodes will be hidden for the selected user.`}},o={args:{modelValue:`user-2`}},s={args:{required:!0}},c={args:{options:[{label:`Alice`,value:`user-1`},{label:`Bob`,value:`user-2`,disabled:!0},{label:`Charlie`,value:`user-3`}]}},l={args:{loading:!0,placeholder:`Loading users...`,options:[]}},u={args:{disabled:!0,modelValue:`user-1`}},d={args:{error:`Please select a Jellyfin user.`,required:!0}},f={args:{hint:`Choose the account whose watch history should be used.`}},p=[`Playground`,`JellyfinUser`,`Selected`,`Required`,`DisabledOption`,`Loading`,`Disabled`,`WithError`,`WithHint`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Jellyfin user',
    placeholder: 'Select a user',
    hint: 'Watched movies and episodes will be hidden for the selected user.'
  }
}`,...a.parameters?.docs?.source},description:{story:`Jellyfin account selection.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'user-2'
  }
}`,...o.parameters?.docs?.source},description:{story:`An existing user selection.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    required: true
  }
}`,...s.parameters?.docs?.source},description:{story:`A required selection.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'Alice',
      value: 'user-1'
    }, {
      label: 'Bob',
      value: 'user-2',
      disabled: true
    }, {
      label: 'Charlie',
      value: 'user-3'
    }]
  }
}`,...c.parameters?.docs?.source},description:{story:`A select with a disabled option.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    placeholder: 'Loading users...',
    options: []
  }
}`,...l.parameters?.docs?.source},description:{story:`Loading Jellyfin users.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    modelValue: 'user-1'
  }
}`,...u.parameters?.docs?.source},description:{story:`A disabled select.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Please select a Jellyfin user.',
    required: true
  }
}`,...d.parameters?.docs?.source},description:{story:`An invalid selection.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    hint: 'Choose the account whose watch history should be used.'
  }
}`,...f.parameters?.docs?.source},description:{story:`A select with additional guidance.`,...f.parameters?.docs?.description}}}})))()}m();export{u as Disabled,c as DisabledOption,a as JellyfinUser,l as Loading,i as Playground,s as Required,o as Selected,d as WithError,f as WithHint,p as __namedExportsOrder,r as default};