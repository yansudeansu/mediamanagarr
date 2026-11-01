import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarDay-B86X85pT.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),{fn:r}=__STORYBOOK_MODULE_TEST__,i={id:`episode-101`,source:`sonarr`,type:`tv`,title:`Example Series`,subtitle:`S01E01 · Pilot`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},a={id:`movie-201`,source:`radarr`,type:`movie`,title:`Example Movie`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},o={title:`Molecules/CalendarDay`,component:n,tags:[`autodocs`],args:{date:`2026-11-05`,day:5,items:[],isToday:!1,isSelected:!1,isOutsideMonth:!1,tooltipId:void 0,onSelect:r(),onPreview:r()},argTypes:{date:{control:`text`,description:`Calendar date in YYYY-MM-DD format.`},day:{control:{type:`number`,min:1,max:31}},items:{control:`object`,description:`Releases scheduled for this date.`},isToday:{control:`boolean`},isSelected:{control:`boolean`},isOutsideMonth:{control:`boolean`},tooltipId:{control:`text`,description:`ID of an associated tooltip, when present.`}},parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 60px"><story /></div>`})]},s={},c={args:{isToday:!0}},l={args:{isSelected:!0}},u={args:{items:[i]}},d={args:{items:[a]}},f={args:{items:[i,a]}},p={args:{isSelected:!0,items:[i,a]}},m={args:{day:30,date:`2026-10-30`,isOutsideMonth:!0}},h={args:{isToday:!0,items:[i]}},g=[`Default`,`Today`,`Selected`,`TvRelease`,`MovieRelease`,`MixedReleases`,`SelectedWithReleases`,`OutsideMonth`,`TodayWithReleases`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    isToday: true
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    isSelected: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem]
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: [movieItem]
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem, movieItem]
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    isSelected: true,
    items: [tvItem, movieItem]
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    day: 30,
    date: '2026-10-30',
    isOutsideMonth: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    isToday: true,
    items: [tvItem]
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{s as Default,f as MixedReleases,d as MovieRelease,m as OutsideMonth,l as Selected,p as SelectedWithReleases,c as Today,h as TodayWithReleases,u as TvRelease,g as __namedExportsOrder,o as default};