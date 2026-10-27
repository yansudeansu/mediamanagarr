import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarEvent-DorPeKu3.js";var r,i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{t(),r={id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`TV Show 1`,subtitle:`S02E03 · Episode 3`,date:`2026-11-05T20:00:00Z`,releaseType:`air`,posterUrl:null},i={id:`radarr-201`,source:`radarr`,type:`movie`,title:`Movie 1`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a=e=>`data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192">
      <rect width="128" height="192" fill="#272c35"/>
      <text x="64" y="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" fill="#e5e7eb">${e}</text>
    </svg>`),o={title:`Molecules/CalendarEvent`,component:n,tags:[`autodocs`],args:{item:r,image:null},parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 360px; max-width: 100%"><story /></div>`})]},s={},c={args:{item:i}},l={args:{item:{...i,id:`radarr-202`,title:`Movie 2`,releaseType:`physical`}}},u={args:{image:a(`TV Show 1`)}},d={args:{item:i,image:a(`Movie 1`)}},f={args:{item:{...r,title:`TV Show 1 — Extended Edition With an Extremely Long Title for Layout Testing`,subtitle:`S12E24 · Episode 24 With an Extremely Long Subtitle for Layout Testing`}}},p={args:{item:{...i,date:`invalid-date`}}},m=[`TvEpisode`,`DigitalMovie`,`PhysicalMovie`,`TvWithPoster`,`MovieWithPoster`,`LongTitle`,`MissingDate`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    item: digitalMovie
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      ...digitalMovie,
      id: 'radarr-202',
      title: 'Movie 2',
      releaseType: 'physical'
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    image: createPoster('TV Show 1')
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    item: digitalMovie,
    image: createPoster('Movie 1')
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      ...tvItem,
      title: 'TV Show 1 — Extended Edition With an Extremely Long Title for Layout Testing',
      subtitle: 'S12E24 · Episode 24 With an Extremely Long Subtitle for Layout Testing'
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      ...digitalMovie,
      date: 'invalid-date'
    }
  }
}`,...p.parameters?.docs?.source}}}})))()}h();export{c as DigitalMovie,f as LongTitle,p as MissingDate,d as MovieWithPoster,l as PhysicalMovie,s as TvEpisode,u as TvWithPoster,m as __namedExportsOrder,o as default};