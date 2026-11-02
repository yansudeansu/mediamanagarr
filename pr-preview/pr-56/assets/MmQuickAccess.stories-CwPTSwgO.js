import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmQuickAccess-Ct-HWr50.js";var r,i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{t(),{fn:r}=__STORYBOOK_MODULE_TEST__,i=[{id:`dashboard`,label:`Dashboard`,href:`https://example.com/dashboard`},{id:`reports`,label:`Reports`,href:`https://example.com/reports`},{id:`documentation`,label:`Documentation`,href:`https://docs.example.com`}],a=[...i,{id:`projects`,label:`Projects`,href:`https://example.com/projects`},{id:`analytics`,label:`Analytics`,href:`https://example.com/analytics`}],o={title:`Molecules/QuickAccess`,component:n,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A compact dropdown menu providing quick access to external links and a Settings action. The parent supplies the links; the component handles menu interaction and accessibility.`}}},args:{items:i,onSettings:r()},argTypes:{items:{control:`object`,description:`Links displayed in the menu. Each item requires an id, label, and href.`},onSettings:{description:`Emitted when the Settings button is selected.`,table:{category:`events`}}},decorators:[()=>({template:`
        <div
          style="
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            width: 320px;
            min-height: 320px;
            padding: 16px;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--surface);
          "
        >
          <story />
        </div>
      `})]},s={},c={},l={args:{items:[{id:`dashboard`,label:`Dashboard`,href:`https://example.com/dashboard`}]}},u={args:{items:a}},d={args:{items:[]}},f={args:{items:[{id:`design-system`,label:`Design System`,href:`https://example.com/design-system`},{id:`api-reference`,label:`API Reference`,href:`https://example.com/api`},{id:`support`,label:`Support Center`,href:`https://example.com/support`}]}},p={args:{items:[{id:`documentation`,label:`Comprehensive Documentation and Developer Resources`,href:`https://example.com/documentation`},{id:`settings-guide`,label:`Advanced Configuration and Administration Guide`,href:`https://example.com/settings-guide`}]}},m=[`Playground`,`Default`,`SingleLink`,`MultipleLinks`,`NoLinks`,`CustomLinks`,`LongLabels`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      href: 'https://example.com/dashboard'
    }]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    items: extendedItems
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'design-system',
      label: 'Design System',
      href: 'https://example.com/design-system'
    }, {
      id: 'api-reference',
      label: 'API Reference',
      href: 'https://example.com/api'
    }, {
      id: 'support',
      label: 'Support Center',
      href: 'https://example.com/support'
    }]
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'documentation',
      label: 'Comprehensive Documentation and Developer Resources',
      href: 'https://example.com/documentation'
    }, {
      id: 'settings-guide',
      label: 'Advanced Configuration and Administration Guide',
      href: 'https://example.com/settings-guide'
    }]
  }
}`,...p.parameters?.docs?.source}}}})))()}h();export{f as CustomLinks,c as Default,p as LongLabels,u as MultipleLinks,d as NoLinks,s as Playground,l as SingleLink,m as __namedExportsOrder,o as default};