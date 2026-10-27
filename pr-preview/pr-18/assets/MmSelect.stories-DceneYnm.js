import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmSelect-Bhb-Pzte.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),r={title:`Atoms/Select`,component:n,tags:[`autodocs`],argTypes:{modelValue:{control:`text`,description:`Currently selected option value.`},label:{control:`text`,description:`Visible and accessible label.`},options:{control:`object`,description:`Available options containing labels and values.`},placeholder:{control:`text`,description:`Optional placeholder shown before a selection is made.`},hint:{control:`text`,description:`Optional helper text.`},error:{control:`text`,description:`Validation error message.`},disabled:{control:`boolean`,description:`Prevents interaction.`},loading:{control:`boolean`,description:`Disables the select while options are loading.`},required:{control:`boolean`,description:`Marks the field as required.`},name:{control:`text`,description:`Native form field name.`}},args:{modelValue:``,label:`Priority`,options:[{label:`Low`,value:`low`},{label:`Medium`,value:`medium`},{label:`High`,value:`high`}],placeholder:`Select a priority`,hint:``,error:``,disabled:!1,loading:!1,required:!1,name:`priority`},render:e=>({components:{MmSelect:n},setup(){return{args:e}},template:`
      <div style="width: 320px; max-width: 100%;">
        <mm-select
          v-bind="args"
          @update:model-value="args.modelValue = $event"
        />
      </div>
    `})},i={},a={},o={args:{modelValue:`medium`}},s={args:{required:!0}},c={args:{options:[{label:`Low`,value:`low`},{label:`Medium`,value:`medium`,disabled:!0},{label:`High`,value:`high`}]}},l={args:{loading:!0,options:[]}},u={args:{disabled:!0,modelValue:`medium`}},d={args:{error:`Please select a priority.`,required:!0}},f={args:{hint:`Choose how important this item is.`}},p=[`Playground`,`Default`,`Selected`,`Required`,`DisabledOption`,`Loading`,`Disabled`,`WithError`,`WithHint`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground for select properties.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Default select without a selected value.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'medium'
  }
}`,...o.parameters?.docs?.source},description:{story:`Select with an existing value.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    required: true
  }
}`,...s.parameters?.docs?.source},description:{story:`Required selection with a visual indicator.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'Low',
      value: 'low'
    }, {
      label: 'Medium',
      value: 'medium',
      disabled: true
    }, {
      label: 'High',
      value: 'high'
    }]
  }
}`,...c.parameters?.docs?.source},description:{story:`Select containing an unavailable option.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    options: []
  }
}`,...l.parameters?.docs?.source},description:{story:`Select while options are loading.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    modelValue: 'medium'
  }
}`,...u.parameters?.docs?.source},description:{story:`Disabled select with an existing value.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Please select a priority.',
    required: true
  }
}`,...d.parameters?.docs?.source},description:{story:`Select displaying a validation error.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    hint: 'Choose how important this item is.'
  }
}`,...f.parameters?.docs?.source},description:{story:`Select with additional guidance.`,...f.parameters?.docs?.description}}}})))()}m();export{a as Default,u as Disabled,c as DisabledOption,l as Loading,i as Playground,s as Required,o as Selected,d as WithError,f as WithHint,p as __namedExportsOrder,r as default};