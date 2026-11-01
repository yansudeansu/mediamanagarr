import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarTooltip-CoVI-CZf.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),r={id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`TV Show 1`,subtitle:`S02E03 · Episode 3`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},i={id:`radarr-201`,source:`radarr`,type:`movie`,title:`Movie 1`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a={title:`Molecules/CalendarTooltip`,component:n,tags:[`autodocs`],args:{date:`2026-11-05`,items:[r,i]},argTypes:{date:{control:`text`,description:`Calendar date in YYYY-MM-DD format.`},items:{control:`object`,description:`Releases to display in the tooltip.`}}},o={},s={args:{items:[]}},c={args:{items:[r]}},l={args:{items:[i]}},u={args:{items:Array.from({length:7},(e,t)=>({...r,id:`sonarr-${t+101}`,title:`TV Show ${t+1}`}))}},d={args:{date:`invalid`}},f=[`Default`,`Empty`,`TvOnly`,`MovieOnly`,`ManyReleases`,`InvalidDate`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem]
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: [movieItem]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    items: Array.from({
      length: 7
    }, (_, index) => ({
      ...tvItem,
      id: \`sonarr-\${index + 101}\`,
      title: \`TV Show \${index + 1}\`
    }))
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'invalid'
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{o as Default,s as Empty,d as InvalidDate,u as ManyReleases,l as MovieOnly,c as TvOnly,f as __namedExportsOrder,a as default};