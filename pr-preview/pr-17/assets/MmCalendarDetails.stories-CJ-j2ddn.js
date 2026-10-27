import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarDetails-CtpTLTbT.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),r={id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`TV Show 1`,subtitle:`S02E03 · Episode 3`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},i={id:`radarr-201`,source:`radarr`,type:`movie`,title:`Movie 1`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a=e=>`data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192">
      <rect width="128" height="192" fill="#272c35"/>
      <text x="64" y="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" fill="#e5e7eb">${e}</text>
    </svg>`),o={title:`Organisms/CalendarDetails`,component:n,tags:[`autodocs`],args:{date:`2026-11-05`,items:[r,i],images:{},loading:!1},argTypes:{date:{control:`text`,description:`Selected date in YYYY-MM-DD format.`},items:{control:`object`,description:`Releases to display for the selected date.`},images:{control:`object`,description:`Resolved artwork keyed by calendar item ID.`},loading:{control:`boolean`,description:`Whether releases are currently loading.`}}},s={},c={args:{items:[]}},l={args:{items:[r]}},u={args:{items:[i]}},d={args:{items:[r,i,{...r,id:`sonarr-102`,title:`TV Show 2`,subtitle:`S01E01 · Episode 1`},{...i,id:`radarr-202`,title:`Movie 2`,subtitle:`2026`,releaseType:`physical`}]}},f={args:{images:{"sonarr-101":a(`TV Show 1`),"radarr-201":a(`Movie 1`)}}},p={args:{loading:!0}},m={args:{date:`invalid`,items:[]}},h=[`Default`,`Empty`,`SingleEpisode`,`SingleMovie`,`MultipleReleases`,`WithArtwork`,`Loading`,`InvalidDate`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`A selected day containing TV and movie releases.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...c.parameters?.docs?.source},description:{story:`A day with no scheduled releases.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem]
  }
}`,...l.parameters?.docs?.source},description:{story:`A day containing one TV episode.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    items: [movieItem]
  }
}`,...u.parameters?.docs?.source},description:{story:`A day containing one movie.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem, movieItem, {
      ...tvItem,
      id: 'sonarr-102',
      title: 'TV Show 2',
      subtitle: 'S01E01 · Episode 1'
    }, {
      ...movieItem,
      id: 'radarr-202',
      title: 'Movie 2',
      subtitle: '2026',
      releaseType: 'physical'
    }]
  }
}`,...d.parameters?.docs?.source},description:{story:`A day containing several releases.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    images: {
      'sonarr-101': createPoster('TV Show 1'),
      'radarr-201': createPoster('Movie 1')
    }
  }
}`,...f.parameters?.docs?.source},description:{story:`A day containing releases with resolved artwork.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...p.parameters?.docs?.source},description:{story:`A loading state.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'invalid',
    items: []
  }
}`,...m.parameters?.docs?.source},description:{story:`Invalid dates are handled without throwing errors.`,...m.parameters?.docs?.description}}}})))()}g();export{s as Default,c as Empty,m as InvalidDate,p as Loading,d as MultipleReleases,l as SingleEpisode,u as SingleMovie,f as WithArtwork,h as __namedExportsOrder,o as default};