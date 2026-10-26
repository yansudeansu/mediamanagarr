import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarTooltip-C0OLRJZc.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r={id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`TV Show 1`,subtitle:`S02E03 · Episode 3`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},i={id:`radarr-201`,source:`radarr`,type:`movie`,title:`Movie 1`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a={title:`Molecules/CalendarTooltip`,component:n,tags:[`autodocs`],args:{date:`2026-11-05`,items:[r,i]}},o={},s={args:{items:[r]}},c={args:{items:[i]}},l={args:{items:Array.from({length:7},(e,t)=>({...r,id:`sonarr-${t+101}`,title:`TV Show ${t+1}`}))}},u={args:{date:`invalid`}},d=[`Default`,`TvOnly`,`MovieOnly`,`ManyReleases`,`InvalidDate`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem]
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    items: [movieItem]
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: Array.from({
      length: 7
    }, (_, index) => ({
      ...tvItem,
      id: \`sonarr-\${index + 101}\`,
      title: \`TV Show \${index + 1}\`
    }))
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'invalid'
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{o as Default,u as InvalidDate,l as ManyReleases,c as MovieOnly,s as TvOnly,d as __namedExportsOrder,a as default};