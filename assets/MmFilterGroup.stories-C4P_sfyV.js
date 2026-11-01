import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmFilterGroup-CYMWOPbg.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),{useArgs:r}=__STORYBOOK_MODULE_PREVIEW_API__,i=e=>{let[,t]=r();return{components:{MmFilterGroup:n},setup(){return{args:e,onUpdateModelValue:e=>{t({modelValue:e})}}},template:`
      <MmFilterGroup
        v-bind="args"
        @update:model-value="onUpdateModelValue"
      />
    `}},a={title:`Molecules/FilterGroup`,component:n,tags:[`autodocs`],args:{modelValue:`all`,ariaLabel:`Filters`,disabled:!1,options:[{label:`All`,value:`all`},{label:`Active`,value:`active`},{label:`Completed`,value:`completed`}]},argTypes:{modelValue:{control:`text`,description:`Currently selected filter value.`},options:{control:`object`,description:`Available filter options.`},ariaLabel:{control:`text`,description:`Accessible label for the filter group.`},disabled:{control:`boolean`,description:`Disable every filter option.`}},parameters:{layout:`centered`},render:i},o={},s={args:{options:[{label:`All`,value:`all`},{label:`New`,value:`new`,indicator:!0},{label:`Archived`,value:`archived`}]}},c={args:{disabled:!0}},l={args:{options:[{label:`All`,value:`all`},{label:`Active`,value:`active`,disabled:!0},{label:`Completed`,value:`completed`}]}},u={args:{options:[{label:`All`,value:`all`},{label:`Draft`,value:`draft`},{label:`Pending`,value:`pending`},{label:`Active`,value:`active`},{label:`Paused`,value:`paused`},{label:`Completed`,value:`completed`},{label:`Archived`,value:`archived`}]}},d=[`Default`,`WithIndicators`,`Disabled`,`IndividualDisabled`,`ManyOptions`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'All',
      value: 'all'
    }, {
      label: 'New',
      value: 'new',
      indicator: true
    }, {
      label: 'Archived',
      value: 'archived'
    }]
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'All',
      value: 'all'
    }, {
      label: 'Active',
      value: 'active',
      disabled: true
    }, {
      label: 'Completed',
      value: 'completed'
    }]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'All',
      value: 'all'
    }, {
      label: 'Draft',
      value: 'draft'
    }, {
      label: 'Pending',
      value: 'pending'
    }, {
      label: 'Active',
      value: 'active'
    }, {
      label: 'Paused',
      value: 'paused'
    }, {
      label: 'Completed',
      value: 'completed'
    }, {
      label: 'Archived',
      value: 'archived'
    }]
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{o as Default,c as Disabled,l as IndividualDisabled,u as ManyOptions,s as WithIndicators,d as __namedExportsOrder,a as default};