import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmTabs-BMSpcKBY.js";function r(e,t=`400px`){let[,r]=i();return{components:{MmTabs:n},setup(){function n(e){r({modelValue:e})}return{args:e,width:t,updateSelection:n}},template:`
      <div :style="{ width, maxWidth: '90vw' }">
        <nav
          v-if="args.variant === 'navigation'"
          :aria-label="args.label"
        >
          <mm-tabs
            :model-value="args.modelValue"
            :items="args.items"
            variant="navigation"
            @update:model-value="updateSelection"
          />
        </nav>

        <mm-tabs
          v-else
          :model-value="args.modelValue"
          :items="args.items"
          variant="tabs"
          :label="args.label"
          @update:model-value="updateSelection"
        />

        <div style="padding: 16px;">
          <p>Selected: {{ args.modelValue }}</p>
        </div>
      </div>
    `}}var i,a,o,s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{t(),{useArgs:i}=__STORYBOOK_MODULE_PREVIEW_API__,a=[{id:`overview`,label:`Overview`},{id:`details`,label:`Details`},{id:`history`,label:`History`}],o=[{id:`home`,label:`Home`},{id:`explore`,label:`Explore`},{id:`favorites`,label:`Favorites`},{id:`activity`,label:`Activity`}],s=[...o,{id:`collections`,label:`Collections`},{id:`notifications`,label:`Notifications`},{id:`preferences`,label:`Preferences`},{id:`help`,label:`Help`}],c=[{id:`overview`,label:`Overview`},{id:`details`,label:`Details`},{id:`history`,label:`History`,disabled:!0}],l={title:`Molecules/Tabs`,component:n,tags:[`autodocs`],args:{modelValue:`overview`,items:a,variant:`tabs`,label:`Content sections`},argTypes:{variant:{control:`select`,options:[`tabs`,`navigation`],description:`Tab-list or navigation presentation.`},modelValue:{control:`text`,description:`ID of the selected item.`},items:{control:`object`,description:`Items with IDs, labels, and optional disabled states.`},label:{control:`text`,description:`Accessible label for the tab list or surrounding navigation.`}},parameters:{layout:`centered`,docs:{description:{component:`Reusable tabs and horizontally scrollable navigation. Selection is controlled by modelValue. Parents own tab-panel content or navigation behavior.`}}}},u={render:e=>r(e)},d={args:{modelValue:`home`,items:o,variant:`navigation`,label:`Primary navigation`},render:e=>r(e)},f={args:{modelValue:`overview`,items:c,variant:`tabs`,label:`Content sections`},render:e=>r(e)},p={args:{modelValue:`home`,items:o,variant:`navigation`,label:`Primary navigation`},render:e=>r(e,`240px`)},m={args:{modelValue:`home`,items:s,variant:`navigation`,label:`Primary navigation`},render:e=>r(e,`360px`)},h={args:{modelValue:`help`,items:s,variant:`navigation`,label:`Primary navigation`},render:e=>r(e,`360px`)},g={args:{modelValue:`missing`,items:a,variant:`tabs`,label:`Content sections`},render:e=>r(e)},_={args:{modelValue:`overview`,items:a.map(e=>({...e,disabled:!0})),variant:`tabs`,label:`Unavailable sections`},render:e=>r(e)},v=[`Default`,`Navigation`,`DisabledTabs`,`NarrowNavigation`,`OverflowingNavigation`,`ActiveItemAtEnd`,`InvalidSelection`,`AllDisabled`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => renderTabs(args)
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'home',
    items: navigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args)
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'overview',
    items: disabledItems,
    variant: 'tabs',
    label: 'Content sections'
  },
  render: args => renderTabs(args)
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'home',
    items: navigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args, '240px')
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'home',
    items: extendedNavigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args, '360px')
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'help',
    items: extendedNavigationItems,
    variant: 'navigation',
    label: 'Primary navigation'
  },
  render: args => renderTabs(args, '360px')
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'missing',
    items: tabItems,
    variant: 'tabs',
    label: 'Content sections'
  },
  render: args => renderTabs(args)
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'overview',
    items: tabItems.map(item => ({
      ...item,
      disabled: true
    })),
    variant: 'tabs',
    label: 'Unavailable sections'
  },
  render: args => renderTabs(args)
}`,..._.parameters?.docs?.source}}}})))()}y();export{h as ActiveItemAtEnd,_ as AllDisabled,u as Default,f as DisabledTabs,g as InvalidSelection,p as NarrowNavigation,d as Navigation,m as OverflowingNavigation,v as __namedExportsOrder,l as default};