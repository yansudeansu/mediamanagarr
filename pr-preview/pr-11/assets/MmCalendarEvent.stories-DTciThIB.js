import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarEvent-C_pAleRP.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),r={id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`The Example Show`,subtitle:`S02E03 · The Adventure`,date:`2026-11-05T20:00:00Z`,releaseType:`air`,posterUrl:null},i={id:`radarr-201`,source:`radarr`,type:`movie`,title:`The Example Movie`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a={title:`Molecules/CalendarEvent`,component:n,tags:[`autodocs`],args:{item:r,image:null},parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 360px; max-width: 100%"><story /></div>`})]},o={},s={args:{item:i}},c={args:{item:{...i,id:`radarr-202`,title:`Another Example Movie`,releaseType:`physical`}}},l={args:{image:`https://placehold.co/128x192/272c35/e5e7eb?text=TV`}},u={args:{item:i,image:`https://placehold.co/128x192/272c35/e5e7eb?text=Movie`}},d={args:{item:{...r,title:`An Exceptionally Long Series Title That Should Be Truncated Gracefully`,subtitle:`S12E24 · An Equally Long Episode Title That Should Not Break the Layout`}}},f={args:{item:{...i,date:`invalid-date`}}},p=[`TvEpisode`,`DigitalMovie`,`PhysicalMovie`,`TvWithPoster`,`MovieWithPoster`,`LongTitle`,`MissingDate`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    item: digitalMovie
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      ...digitalMovie,
      id: 'radarr-202',
      title: 'Another Example Movie',
      releaseType: 'physical'
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    image: 'https://placehold.co/128x192/272c35/e5e7eb?text=TV'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    item: digitalMovie,
    image: 'https://placehold.co/128x192/272c35/e5e7eb?text=Movie'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      ...tvItem,
      title: 'An Exceptionally Long Series Title That Should Be Truncated Gracefully',
      subtitle: 'S12E24 · An Equally Long Episode Title That Should Not Break the Layout'
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      ...digitalMovie,
      date: 'invalid-date'
    }
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{s as DigitalMovie,d as LongTitle,f as MissingDate,u as MovieWithPoster,c as PhysicalMovie,o as TvEpisode,l as TvWithPoster,p as __namedExportsOrder,a as default};