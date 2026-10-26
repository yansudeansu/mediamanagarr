import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCalendarDetails-C-1Tdd-u.js";var r,i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{t(),r={id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`Example Series`,subtitle:`S02E03 · The Adventure`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},i={id:`radarr-201`,source:`radarr`,type:`movie`,title:`Example Movie`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},a={title:`Organisms/CalendarDetails`,component:n,tags:[`autodocs`],args:{date:`2026-11-05`,items:[r,i],images:{},loading:!1},argTypes:{date:{control:`text`,description:`Selected date in YYYY-MM-DD format.`},items:{control:`object`,description:`Releases to display for the selected date.`},images:{control:`object`,description:`Resolved artwork keyed by calendar item ID.`},loading:{control:`boolean`,description:`Whether releases are currently loading.`}}},o={},s={args:{items:[]}},c={args:{items:[r]}},l={args:{items:[i]}},u={args:{items:[r,i,{...r,id:`sonarr-102`,title:`Another Series`,subtitle:`S01E01 · Pilot`},{...i,id:`radarr-202`,title:`Another Movie`,subtitle:`2026`,releaseType:`physical`}]}},d={args:{images:{"sonarr-101":`https://placehold.co/128x192/272c35/e5e7eb?text=TV`,"radarr-201":`https://placehold.co/128x192/272c35/e5e7eb?text=Movie`}}},f={args:{loading:!0}},p={args:{date:`invalid`,items:[]}},m=[`Default`,`Empty`,`SingleEpisode`,`SingleMovie`,`MultipleReleases`,`WithArtwork`,`Loading`,`InvalidDate`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`A selected day containing TV and movie releases.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...s.parameters?.docs?.source},description:{story:`A day with no scheduled releases.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem]
  }
}`,...c.parameters?.docs?.source},description:{story:`A day containing one TV episode.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: [movieItem]
  }
}`,...l.parameters?.docs?.source},description:{story:`A day containing one movie.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    items: [tvItem, movieItem, {
      ...tvItem,
      id: 'sonarr-102',
      title: 'Another Series',
      subtitle: 'S01E01 · Pilot'
    }, {
      ...movieItem,
      id: 'radarr-202',
      title: 'Another Movie',
      subtitle: '2026',
      releaseType: 'physical'
    }]
  }
}`,...u.parameters?.docs?.source},description:{story:`A day containing several releases.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    images: {
      'sonarr-101': 'https://placehold.co/128x192/272c35/e5e7eb?text=TV',
      'radarr-201': 'https://placehold.co/128x192/272c35/e5e7eb?text=Movie'
    }
  }
}`,...d.parameters?.docs?.source},description:{story:`A day containing releases with resolved artwork.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...f.parameters?.docs?.source},description:{story:`A loading state.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    date: 'invalid',
    items: []
  }
}`,...p.parameters?.docs?.source},description:{story:`Invalid dates are handled without throwing errors.`,...p.parameters?.docs?.description}}}})))()}h();export{o as Default,s as Empty,p as InvalidDate,f as Loading,u as MultipleReleases,c as SingleEpisode,l as SingleMovie,d as WithArtwork,m as __namedExportsOrder,a as default};