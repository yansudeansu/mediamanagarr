import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarHeader-DKQmP5rl.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{t(),{fn:r}=__STORYBOOK_MODULE_TEST__,i={title:`Molecules/CalendarHeader`,component:n,tags:[`autodocs`],decorators:[()=>({template:`<div style="width: 340px"><story /></div>`})],args:{month:`2026-11-01`,onPrevious:r(),onNext:r()}},a={},o={args:{month:`2027-01-01`}},s={args:{month:`invalid`}},c=[`Default`,`DifferentMonth`,`InvalidMonth`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Month navigation with the title centered between the arrows.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    month: '2027-01-01'
  }
}`,...o.parameters?.docs?.source},description:{story:`Month navigation showing a different year.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    month: 'invalid'
  }
}`,...s.parameters?.docs?.source},description:{story:`Gracefully handles an invalid month value.`,...s.parameters?.docs?.description}}}})))()}l();export{a as Default,o as DifferentMonth,s as InvalidMonth,c as __namedExportsOrder,i as default};