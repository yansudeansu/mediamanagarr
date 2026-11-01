import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,M as n,a as r}from"./iframe-DIbSi_Sq.js";import{n as i,t as a}from"./MmNavigation-D1MqyvCk.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{r(),i(),{fn:o}=__STORYBOOK_MODULE_TEST__,s=[{id:`overview`,label:`Overview`},{id:`activity`,label:`Activity`},{id:`library`,label:`Library`}],c=[{id:`dashboard`,label:`Dashboard`},{id:`projects`,label:`Projects`},{id:`reports`,label:`Reports`},{id:`settings`,label:`Settings`}],l={title:`Molecules/Navigation`,component:a,tags:[`autodocs`],argTypes:{activeView:{control:`text`,description:`ID of the currently active navigation item.`},items:{control:`object`,description:`Navigation items supplied by the parent.`},label:{control:`text`,description:`Accessible label for the navigation landmark.`},onNavigate:{description:`Emitted with the selected navigation item ID.`,table:{category:`events`}}},args:{activeView:`overview`,items:s,label:`Main navigation`,onNavigate:o()},decorators:[()=>({template:`<div style="width: 380px"><story /></div>`})]},u={render:e=>({components:{MmNavigation:a},setup(){let r=t(e.activeView);n(()=>e.activeView,e=>{r.value=e});function i(t){r.value=t,e.onNavigate?.(t)}return{args:e,activeView:r,handleNavigate:i}},template:`
      <mm-navigation
        :active-view="activeView"
        :items="args.items"
        :label="args.label"
        @navigate="handleNavigate"
      />
    `})},d={},f={args:{activeView:`activity`}},p={args:{activeView:`library`}},m={args:{activeView:`dashboard`,items:c}},h={args:{activeView:`overview`,items:[{id:`overview`,label:`Overview`},{id:`activity`,label:`Activity`,disabled:!0},{id:`library`,label:`Library`}]}},g={args:{label:`Library sections`}},_=[`Playground`,`Overview`,`Activity`,`Library`,`ExtendedNavigation`,`DisabledItem`,`CustomLabel`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmNavigation
    },
    setup() {
      const activeView = ref(args.activeView);
      watch(() => args.activeView, value => {
        activeView.value = value;
      });
      function handleNavigate(view: string): void {
        activeView.value = view;
        args.onNavigate?.(view);
      }
      return {
        args,
        activeView,
        handleNavigate
      };
    },
    template: \`
      <mm-navigation
        :active-view="activeView"
        :items="args.items"
        :label="args.label"
        @navigate="handleNavigate"
      />
    \`
  })
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'activity'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'library'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'dashboard',
    items: extendedItems
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'overview',
    items: [{
      id: 'overview',
      label: 'Overview'
    }, {
      id: 'activity',
      label: 'Activity',
      disabled: true
    }, {
      id: 'library',
      label: 'Library'
    }]
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Library sections'
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{f as Activity,g as CustomLabel,h as DisabledItem,m as ExtendedNavigation,p as Library,d as Overview,u as Playground,_ as __namedExportsOrder,l as default};