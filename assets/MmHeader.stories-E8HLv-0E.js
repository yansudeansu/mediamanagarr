import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmHeader-CmxCf05q.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r={title:`Molecules/Header`,component:n,tags:[`autodocs`],argTypes:{mode:{control:`radio`,options:[`main`,`settings`],description:`Determines the header title and navigation action.`},windowMode:{control:`radio`,options:[`popup`,`detached`,`sidebar`],description:`Determines whether the workspace is displayed as a popup, detached window, or native browser sidebar.`},onSettings:{description:`Emitted when the settings button is clicked.`,table:{category:`events`}},onBack:{description:`Emitted when the back button is clicked.`,table:{category:`events`}},onDetach:{description:`Emitted when the detach button is clicked.`,table:{category:`events`}},onAttach:{description:`Emitted when the attach button is clicked.`,table:{category:`events`}},onSidebar:{description:`Emitted when the native browser sidebar button is clicked.`,table:{category:`events`}}},args:{mode:`main`,windowMode:`popup`},decorators:[()=>({template:`<div style="width: 380px"><story /></div>`})]},i={},a={args:{mode:`main`,windowMode:`popup`}},o={args:{mode:`settings`,windowMode:`popup`}},s={args:{mode:`main`,windowMode:`detached`}},c={args:{mode:`settings`,windowMode:`detached`}},l={args:{mode:`main`,windowMode:`sidebar`}},u={args:{mode:`settings`,windowMode:`sidebar`}},d=[`Playground`,`Main`,`Settings`,`DetachedMain`,`DetachedSettings`,`SidebarMain`,`SidebarSettings`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground.
Switch between main/settings and popup/detached/sidebar using Storybook Controls.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'popup'
  }
}`,...a.parameters?.docs?.source},description:{story:`Default popup header with the application title,
sidebar button, detach button, and settings button.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings',
    windowMode: 'popup'
  }
}`,...o.parameters?.docs?.source},description:{story:`Popup settings header with the back button,
sidebar button, and detach button.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'detached'
  }
}`,...s.parameters?.docs?.source},description:{story:`Detached workspace with the application title,
sidebar button, attach button, and settings button.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings',
    windowMode: 'detached'
  }
}`,...c.parameters?.docs?.source},description:{story:`Detached workspace with the settings title,
sidebar button, attach button, and back button.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'sidebar'
  }
}`,...l.parameters?.docs?.source},description:{story:`Native browser sidebar with the application title
and settings button.

Workspace actions are hidden because the application
is already running inside the sidebar.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings',
    windowMode: 'sidebar'
  }
}`,...u.parameters?.docs?.source},description:{story:`Native browser sidebar showing the settings title
and back button.

Workspace actions remain hidden in sidebar mode.`,...u.parameters?.docs?.description}}}})))()}f();export{s as DetachedMain,c as DetachedSettings,a as Main,i as Playground,o as Settings,l as SidebarMain,u as SidebarSettings,d as __namedExportsOrder,r as default};