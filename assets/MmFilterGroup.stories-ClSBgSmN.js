import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-C9E6Mmxv.js";import{n as r,t as i}from"./MmFilterGroup-5JV6Dqeg.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),a={title:`Molecules/FilterGroup`,component:i,tags:[`autodocs`],args:{modelValue:`all`,ariaLabel:`Filters`,disabled:!1,options:[{label:`All`,value:`all`},{label:`Pending`,value:`pending`},{label:`Approved`,value:`approved`}]},parameters:{layout:`centered`}},o={render:e=>({components:{MmFilterGroup:i},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Request status filters"
      />
    `})},s={args:{options:[{label:`All`,value:`all`},{label:`New`,value:`new`,indicator:!0}]},render:e=>({components:{MmFilterGroup:i},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Up Next filters"
      />
    `})},c={args:{options:[{label:`All`,value:`all`},{label:`New`,value:`new`,indicator:!0},{label:`Watched`,value:`watched`}]},render:e=>({components:{MmFilterGroup:i},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <MmFilterGroup v-bind="args" v-model="selected" />
    `})},l={args:{disabled:!0}},u={args:{options:[{label:`All`,value:`all`},{label:`Pending`,value:`pending`,disabled:!0},{label:`Approved`,value:`approved`}]}},d=[`Requests`,`UpNext`,`WithIndicators`,`Disabled`,`IndividualDisabled`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmFilterGroup
    },
    setup() {
      const selected = ref(args.modelValue);
      return {
        args,
        selected
      };
    },
    template: \`
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Request status filters"
      />
    \`
  })
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'All',
      value: 'all'
    }, {
      label: 'New',
      value: 'new',
      indicator: true
    }]
  },
  render: args => ({
    components: {
      MmFilterGroup
    },
    setup() {
      const selected = ref(args.modelValue);
      return {
        args,
        selected
      };
    },
    template: \`
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Up Next filters"
      />
    \`
  })
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'All',
      value: 'all'
    }, {
      label: 'New',
      value: 'new',
      indicator: true
    }, {
      label: 'Watched',
      value: 'watched'
    }]
  },
  render: args => ({
    components: {
      MmFilterGroup
    },
    setup() {
      const selected = ref(args.modelValue);
      return {
        args,
        selected
      };
    },
    template: \`
      <MmFilterGroup v-bind="args" v-model="selected" />
    \`
  })
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      label: 'All',
      value: 'all'
    }, {
      label: 'Pending',
      value: 'pending',
      disabled: true
    }, {
      label: 'Approved',
      value: 'approved'
    }]
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as Disabled,u as IndividualDisabled,o as Requests,s as UpNext,c as WithIndicators,d as __namedExportsOrder,a as default};