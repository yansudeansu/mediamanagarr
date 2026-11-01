import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarGrid-D25P1UYb.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),r={id:`episode-101`,source:`sonarr`,type:`tv`,title:`TV Show 1`,subtitle:`S02E03 · Episode 3`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},i={id:`movie-201`,source:`radarr`,type:`movie`,title:`Movie 1`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a=[r,i,{...r,id:`episode-102`,title:`TV Show 2`,subtitle:`S01E01 · Episode 1`,date:`2026-11-12`},{...i,id:`movie-202`,title:`Movie 2`,date:`2026-11-20`,releaseType:`physical`},{...r,id:`episode-103`,title:`TV Show 3`,subtitle:`S01E02 · Episode 2`,date:`2026-10-29`}],o={title:`Organisms/CalendarGrid`,component:n,tags:[`autodocs`],args:{month:`2026-11-01`,selectedDate:`2026-11-05`,today:`2026-11-12`,items:a},parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})],argTypes:{month:{control:`text`,description:`The month to display, represented by a YYYY-MM-DD date.`},selectedDate:{control:`text`,description:`The selected calendar date.`},today:{control:`text`,description:`The date to highlight as today.`},items:{control:`object`,description:`Calendar releases to display as day indicators.`}}},s={},c={args:{items:[],selectedDate:null}},l={args:{month:`2026-11-01`}},u={args:{month:`2026-09-01`,selectedDate:`2026-09-15`,today:`2026-09-10`,items:[]}},d={args:{month:`2027-02-01`,selectedDate:`2027-02-14`,today:`2027-02-05`,items:[]}},f={args:{items:[r,i]}},p={args:{selectedDate:null}},m={args:{month:`invalid`,selectedDate:null,items:[]}},h=[`Default`,`Empty`,`SixWeeks`,`FiveWeeks`,`FourWeeks`,`MixedReleases`,`NoSelection`,`InvalidMonth`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Hover over November 5, 12, or 20 to see the custom tooltip.
Dates can also be focused using the keyboard.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    items: [],
    selectedDate: null
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    month: '2026-11-01'
  }
}`,...l.parameters?.docs?.source},description:{story:`November 2026 requires six calendar rows.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    month: '2026-09-01',
    selectedDate: '2026-09-15',
    today: '2026-09-10',
    items: []
  }
}`,...u.parameters?.docs?.source},description:{story:`September 2026 requires five calendar rows.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    month: '2027-02-01',
    selectedDate: '2027-02-14',
    today: '2027-02-05',
    items: []
  }
}`,...d.parameters?.docs?.source},description:{story:`February 2027 fits into four calendar rows.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem, movieItem]
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    selectedDate: null
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    month: 'invalid',
    selectedDate: null,
    items: []
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{s as Default,c as Empty,u as FiveWeeks,d as FourWeeks,m as InvalidMonth,f as MixedReleases,p as NoSelection,l as SixWeeks,h as __namedExportsOrder,o as default};