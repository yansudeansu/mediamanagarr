import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarDay-C23VL_I1.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),r={id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`TV Show 1`,subtitle:`S01E01 · Episode 1`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},i={id:`radarr-201`,source:`radarr`,type:`movie`,title:`Movie 1`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a={title:`Molecules/CalendarDay`,component:n,tags:[`autodocs`],args:{date:`2026-11-05`,day:5,items:[],isToday:!1,isSelected:!1,isOutsideMonth:!1},parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 60px"><story /></div>`})]},o={},s={args:{isToday:!0}},c={args:{isSelected:!0}},l={args:{items:[r]}},u={args:{items:[i]}},d={args:{items:[r,i]}},f={args:{isSelected:!0,items:[r,i]}},p={args:{day:30,date:`2026-10-30`,isOutsideMonth:!0}},m={args:{isToday:!0,items:[r]}},h=[`Default`,`Today`,`Selected`,`TvRelease`,`MovieRelease`,`MixedReleases`,`SelectedWithReleases`,`OutsideMonth`,`TodayWithReleases`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    isToday: true
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    isSelected: true
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    items: [movieItem]
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem, movieItem]
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    isSelected: true,
    items: [tvItem, movieItem]
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    day: 30,
    date: '2026-10-30',
    isOutsideMonth: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    isToday: true,
    items: [tvItem]
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{o as Default,d as MixedReleases,u as MovieRelease,p as OutsideMonth,c as Selected,f as SelectedWithReleases,s as Today,m as TodayWithReleases,l as TvRelease,h as __namedExportsOrder,a as default};