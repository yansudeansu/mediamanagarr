import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmNavigation-Dqf5xrXg.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),{fn:r}=__STORYBOOK_MODULE_TEST__,{useArgs:i}=__STORYBOOK_MODULE_PREVIEW_API__,a=[{id:`overview`,label:`Overview`},{id:`activity`,label:`Activity`},{id:`library`,label:`Library`}],o=[{id:`dashboard`,label:`Dashboard`},{id:`projects`,label:`Projects`},{id:`reports`,label:`Reports`},{id:`settings`,label:`Settings`}],s={title:`Molecules/Navigation`,component:n,tags:[`autodocs`],argTypes:{activeView:{control:`text`,description:`ID of the currently active navigation item.`},items:{control:`object`,description:`Navigation items supplied by the parent.`},label:{control:`text`,description:`Accessible label for the navigation landmark.`},onNavigate:{description:`Emitted with the selected navigation item ID.`,table:{category:`events`}}},args:{activeView:`overview`,items:a,label:`Main navigation`,onNavigate:r()},decorators:[()=>({template:`<div style="width: 380px"><story /></div>`})]},c={render:e=>{let[,t]=i();return{components:{MmNavigation:n},setup(){function n(n){t({activeView:n}),e.onNavigate?.(n)}return{args:e,handleNavigate:n}},template:`
        <mm-navigation
          :active-view="args.activeView"
          :items="args.items"
          :label="args.label"
          @navigate="handleNavigate"
        />
      `}}},l={},u={args:{activeView:`activity`}},d={args:{activeView:`library`}},f={args:{activeView:`dashboard`,items:o}},p={args:{activeView:`overview`,items:[{id:`overview`,label:`Overview`},{id:`activity`,label:`Activity`,disabled:!0},{id:`library`,label:`Library`}]}},m={args:{label:`Library sections`}},h=[`Playground`,`Overview`,`Activity`,`Library`,`ExtendedNavigation`,`DisabledItem`,`CustomLabel`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [, updateArgs] = useArgs();
    return {
      components: {
        MmNavigation
      },
      setup() {
        function handleNavigate(view: string): void {
          updateArgs({
            activeView: view
          });
          args.onNavigate?.(view);
        }
        return {
          args,
          handleNavigate
        };
      },
      template: \`
        <mm-navigation
          :active-view="args.activeView"
          :items="args.items"
          :label="args.label"
          @navigate="handleNavigate"
        />
      \`
    };
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'activity'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'library'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'dashboard',
    items: extendedItems
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Library sections'
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{u as Activity,m as CustomLabel,p as DisabledItem,f as ExtendedNavigation,d as Library,l as Overview,c as Playground,h as __namedExportsOrder,s as default};