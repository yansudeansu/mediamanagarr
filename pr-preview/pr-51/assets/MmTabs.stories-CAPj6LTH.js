import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-DA-JxWpr.js";import{n as r,t as i}from"./MmTabs-C0VXKhI9.js";function a(e,n=`400px`){return{components:{MmTabs:i},setup(){return{args:e,selected:t(e?.modelValue??``),width:n}},template:`
      <div :style="{ width, maxWidth: '100%' }">
        <nav
          v-if="args.variant === 'navigation'"
          :aria-label="args.label"
        >
          <mm-tabs
            v-model="selected"
            :items="args.items"
            variant="navigation"
          />
        </nav>

        <mm-tabs
          v-else
          v-model="selected"
          :items="args.items"
          variant="tabs"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p>Selected: {{ selected }}</p>
        </div>
      </div>
    `}}var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),r(),o=[{id:`overview`,label:`Overview`},{id:`details`,label:`Details`},{id:`history`,label:`History`}],s=[{id:`home`,label:`Home`},{id:`explore`,label:`Explore`},{id:`favorites`,label:`Favorites`},{id:`activity`,label:`Activity`}],c=[...s,{id:`collections`,label:`Collections`},{id:`notifications`,label:`Notifications`},{id:`preferences`,label:`Preferences`},{id:`help`,label:`Help`}],l=[{id:`overview`,label:`Overview`},{id:`details`,label:`Details`},{id:`history`,label:`History`,disabled:!0}],u={title:`Molecules/Tabs`,component:i,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`tabs`,`navigation`]},modelValue:{control:`text`},label:{control:`text`}}},d={args:{modelValue:`overview`,items:o,variant:`tabs`,label:`Content sections`},render:e=>a(e)},f={args:{modelValue:`home`,items:s,variant:`navigation`,label:`Primary navigation`},render:e=>a(e)},p={args:{modelValue:`overview`,items:l,variant:`tabs`,label:`Content sections`},render:e=>a(e)},m={args:{modelValue:`home`,items:s,variant:`navigation`,label:`Primary navigation`},render:e=>a(e,`240px`)},h={args:{modelValue:`home`,items:c,variant:`navigation`,label:`Primary navigation`},render:e=>a(e,`360px`)},g={args:{modelValue:`help`,items:c,variant:`navigation`,label:`Primary navigation`},render:e=>a(e,`360px`)},_=[`Default`,`Navigation`,`DisabledTabs`,`NarrowNavigation`,`OverflowingNavigation`,`ActiveItemAtEnd`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'overview',
    items: tabItems,
    variant: 'tabs',
    label: 'Content sections'
  },
  render: args => renderTabs(args)
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'home',
    items: navigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args)
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'overview',
    items: disabledItems,
    variant: 'tabs',
    label: 'Content sections'
  },
  render: args => renderTabs(args)
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'home',
    items: navigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args, '240px')
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'home',
    items: extendedNavigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args, '360px')
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'help',
    items: extendedNavigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args, '360px')
}`,...g.parameters?.docs?.source}}}})))()}v();export{g as ActiveItemAtEnd,d as Default,p as DisabledTabs,m as NarrowNavigation,f as Navigation,h as OverflowingNavigation,_ as __namedExportsOrder,u as default};