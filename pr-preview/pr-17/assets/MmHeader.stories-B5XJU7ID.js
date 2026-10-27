import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmHeader-C5ZUOj5w.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{t(),r={title:`Molecules/Header`,component:n,tags:[`autodocs`],argTypes:{mode:{control:`radio`,options:[`main`,`settings`],description:`Determines the header title and navigation action.`},windowMode:{control:`radio`,options:[`popup`,`detached`],description:`Determines whether the workspace is attached or detached.`},onSettings:{description:`Emitted when the settings button is clicked.`,table:{category:`events`}},onBack:{description:`Emitted when the back button is clicked.`,table:{category:`events`}},onDetach:{description:`Emitted when the detach button is clicked.`,table:{category:`events`}},onAttach:{description:`Emitted when the attach button is clicked.`,table:{category:`events`}}},args:{mode:`main`,windowMode:`popup`},decorators:[()=>({template:`<div style="width: 380px"><story /></div>`})]},i={},a={args:{mode:`main`}},o={args:{mode:`settings`}},s={args:{mode:`main`,windowMode:`detached`}},c={args:{mode:`settings`,windowMode:`detached`}},l=[`Playground`,`Main`,`Settings`,`DetachedMain`,`DetachedSettings`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground.
Switch between main and settings using Storybook Controls.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main'
  }
}`,...a.parameters?.docs?.source},description:{story:`Default header with the application title and settings button.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings'
  }
}`,...o.parameters?.docs?.source},description:{story:`Settings header with a back button and settings title.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'detached'
  }
}`,...s.parameters?.docs?.source},description:{story:`Detached workspace with the application title and settings button.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings',
    windowMode: 'detached'
  }
}`,...c.parameters?.docs?.source},description:{story:`Detached workspace with a back button and settings title.`,...c.parameters?.docs?.description}}}})))()}u();export{s as DetachedMain,c as DetachedSettings,a as Main,i as Playground,o as Settings,l as __namedExportsOrder,r as default};