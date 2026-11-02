import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmProgressBar-Nu1oHvmD.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),r={title:`Atoms/ProgressBar`,component:n,tags:[`autodocs`],argTypes:{value:{control:{type:`range`,min:0,max:100,step:.1},description:`Progress value, normalized to the range 0–100.`},label:{control:`text`,description:`Accessible label for the progress bar.`},showPercentage:{control:`boolean`,description:`Displays the label and formatted percentage above the bar.`}},args:{value:50,label:`Progress`,showPercentage:!1},decorators:[()=>({template:`<div style="width: 280px; max-width: 100%"><story /></div>`})]},i={},a={},o={args:{value:0}},s={args:{value:42.5,label:`Downloading`,showPercentage:!0}},c={args:{value:96.8,label:`Almost finished`,showPercentage:!0}},l={args:{value:100,label:`Complete`,showPercentage:!0}},u={args:{value:-25,label:`Negative progress`,showPercentage:!0}},d={args:{value:150,label:`Over maximum`,showPercentage:!0}},f=[`Playground`,`Default`,`Empty`,`Downloading`,`NearlyComplete`,`Complete`,`InvalidValue`,`OverMaximum`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground for all progress bar properties.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Standard progress bar at 50%.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0
  }
}`,...o.parameters?.docs?.source},description:{story:`Empty progress bar.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: 42.5,
    label: 'Downloading',
    showPercentage: true
  }
}`,...s.parameters?.docs?.source},description:{story:`Partially completed progress with a visible percentage.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: 96.8,
    label: 'Almost finished',
    showPercentage: true
  }
}`,...c.parameters?.docs?.source},description:{story:`Progress approaching completion.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: 100,
    label: 'Complete',
    showPercentage: true
  }
}`,...l.parameters?.docs?.source},description:{story:`Fully completed progress bar.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    value: -25,
    label: 'Negative progress',
    showPercentage: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Negative values are clamped to zero.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: 150,
    label: 'Over maximum',
    showPercentage: true
  }
}`,...d.parameters?.docs?.source},description:{story:`Values above 100 are clamped to 100.`,...d.parameters?.docs?.description}}}})))()}p();export{l as Complete,a as Default,s as Downloading,o as Empty,u as InvalidValue,c as NearlyComplete,d as OverMaximum,i as Playground,f as __namedExportsOrder,r as default};