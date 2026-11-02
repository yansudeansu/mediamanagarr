import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmSelect-Z5fTQuvF.js";var r,i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{t(),{useArgs:r}=__STORYBOOK_MODULE_PREVIEW_API__,i={title:`Atoms/Select`,component:n,tags:[`autodocs`],argTypes:{modelValue:{control:`text`,description:`Currently selected option value.`},label:{control:`text`,description:`Visible and accessible label.`},options:{control:`object`,description:`Available options containing labels and values.`},placeholder:{control:`text`,description:`Optional placeholder shown before a selection is made.`},hint:{control:`text`,description:`Optional helper text.`},error:{control:`text`,description:`Validation error message.`},disabled:{control:`boolean`,description:`Prevents interaction.`},loading:{control:`boolean`,description:`Disables the select while options are loading.`},required:{control:`boolean`,description:`Marks the field as required.`},name:{control:`text`,description:`Native form field name.`}},args:{modelValue:``,label:`Priority`,options:[{label:`Low`,value:`low`},{label:`Medium`,value:`medium`},{label:`High`,value:`high`}],placeholder:`Select a priority`,hint:``,error:``,disabled:!1,loading:!1,required:!1,name:`priority`},render:e=>{let[,t]=r();return{components:{MmSelect:n},setup(){function n(e){t({modelValue:e})}return{args:e,updateValue:n}},template:`
      <div style="width: 320px; max-width: 100%;">
        <mm-select
          v-bind="args"
          @update:model-value="updateValue"
        />
      </div>
    `}}},a={},o={},s={args:{modelValue:`medium`}},c={args:{required:!0}},l={args:{options:[{label:`Low`,value:`low`},{label:`Medium`,value:`medium`,disabled:!0},{label:`High`,value:`high`}]}},u={args:{loading:!0,options:[]}},d={args:{disabled:!0,modelValue:`medium`}},f={args:{error:`Please select a priority.`,required:!0}},p={args:{hint:`Choose how important this item is.`}},m=[`Playground`,`Default`,`Selected`,`Required`,`DisabledOption`,`Loading`,`Disabled`,`WithError`,`WithHint`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Interactive playground for select properties.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Default select without a selected value.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'medium'
  }
}`,...s.parameters?.docs?.source},description:{story:`Select with an existing value.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    required: true
  }
}`,...c.parameters?.docs?.source},description:{story:`Required selection with a visual indicator.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source},description:{story:`Select containing an unavailable option.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    options: []
  }
}`,...u.parameters?.docs?.source},description:{story:`Select while options are loading.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    modelValue: 'medium'
  }
}`,...d.parameters?.docs?.source},description:{story:`Disabled select with an existing value.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Please select a priority.',
    required: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Select displaying a validation error.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    hint: 'Choose how important this item is.'
  }
}`,...p.parameters?.docs?.source},description:{story:`Select with additional guidance.`,...p.parameters?.docs?.description}}}})))()}h();export{o as Default,d as Disabled,l as DisabledOption,u as Loading,a as Playground,c as Required,s as Selected,f as WithError,p as WithHint,m as __namedExportsOrder,i as default};