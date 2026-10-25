import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{A as t,C as n,N as r,O as i,P as a,S as o,a as s,c,d as l,f as u,g as d,p as f,u as p}from"./iframe-DF0nGz2g.js";import{n as m,t as h}from"./MmButton-DeWVT2aN.js";import{n as g,t as _}from"./_plugin-vue_export-helper-ktEZWxTd.js";var v,y,b;function x(){return(x=e((()=>{s(),m(),v=[`aria-label`],y={key:0,class:`filter-group__indicator`,"aria-hidden":`true`},b=d({__name:`MmFilterGroup`,props:{modelValue:{},options:{},ariaLabel:{default:`Filters`},disabled:{type:Boolean,default:!1}},emits:[`update:modelValue`],setup(e,{emit:t}){let s=t;function d(e){s(`update:modelValue`,e)}return(t,s)=>(o(),f(`div`,{class:`filter-group`,role:`group`,"aria-label":e.ariaLabel},[(o(!0),f(c,null,n(e.options,t=>(o(),l(h,{key:t.value,variant:`secondary`,size:`small`,class:r([`filter-group__button`,{"filter-group__button--active":e.modelValue===t.value}]),"aria-pressed":e.modelValue===t.value,disabled:e.disabled||t.disabled,onClick:e=>d(t.value)},{default:i(()=>[p(`span`,null,a(t.label),1),t.indicator?(o(),f(`span`,y)):u(``,!0)]),_:2},1032,[`class`,`aria-pressed`,`disabled`,`onClick`]))),128))],8,v))}})})))()}var S;function C(){return(C=e((()=>{x(),g(),S=_(b,[[`__scopeId`,`data-v-04a7e102`]]),b.__docgenInfo=Object.assign({displayName:b.name??b.__name},{exportName:`default`,displayName:`MmFilterGroup`,description:``,tags:{},props:[{name:`modelValue`,required:!0,type:{name:`string`}},{name:`options`,required:!0,type:{name:`Array`,elements:[{name:`FilterOption`}]}},{name:`ariaLabel`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`'Filters'`}},{name:`disabled`,required:!1,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],events:[{name:`update:modelValue`,type:{names:[`string`]}}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/molecules/MmFilterGroup/MmFilterGroup.vue`]})})))()}var w,T,E,D,O,k,A;function j(){return(j=e((()=>{s(),C(),w={title:`Molecules/FilterGroup`,component:S,tags:[`autodocs`],args:{modelValue:`all`,ariaLabel:`Filters`,disabled:!1,options:[{label:`All`,value:`all`},{label:`Pending`,value:`pending`},{label:`Approved`,value:`approved`}]},parameters:{layout:`centered`}},T={render:e=>({components:{MmFilterGroup:S},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Request status filters"
      />
    `})},E={args:{options:[{label:`All`,value:`all`},{label:`New`,value:`new`,indicator:!0}]},render:e=>({components:{MmFilterGroup:S},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Up Next filters"
      />
    `})},D={args:{options:[{label:`All`,value:`all`},{label:`New`,value:`new`,indicator:!0},{label:`Watched`,value:`watched`}]},render:e=>({components:{MmFilterGroup:S},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <MmFilterGroup v-bind="args" v-model="selected" />
    `})},O={args:{disabled:!0}},k={args:{options:[{label:`All`,value:`all`},{label:`Pending`,value:`pending`,disabled:!0},{label:`Approved`,value:`approved`}]}},A=[`Requests`,`UpNext`,`WithIndicators`,`Disabled`,`IndividualDisabled`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}}})))()}j();export{O as Disabled,k as IndividualDisabled,T as Requests,E as UpNext,D as WithIndicators,A as __namedExportsOrder,w as default};