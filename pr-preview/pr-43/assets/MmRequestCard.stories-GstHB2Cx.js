import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmRequestCard-Dpjo9ogm.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),r={id:42,type:`movie`,title:`Movie 1`,status:`Pending`,mediaStatus:`Processing`,requestedBy:`Test User 1`,createdAt:`2026-10-20T12:00:00.000Z`,posterPath:null},i={title:`Molecules/RequestCard`,component:n,tags:[`autodocs`],args:{request:r}},a={},o={args:{request:{...r,status:`Approved`,mediaStatus:`Available`}}},s={args:{request:{...r,status:`Declined`,mediaStatus:`Unknown`}}},c={args:{request:{...r,id:43,type:`tv`,title:`TV Show 1`,status:`Approved`,mediaStatus:`Partially Available`,requestedBy:`Test User 2`}}},l={args:{request:{...r,title:`Movie 1 — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing`,requestedBy:`Test User With an Extremely Long Display Name`}}},u={args:{request:{...r,posterPath:null}}},d={args:{request:{...r,title:`Movie 2`,posterPath:`/storybook-test-poster.jpg`}}},f=[`Pending`,`Approved`,`Declined`,`TVShow`,`LongTitle`,`MissingPoster`,`WithPoster`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      status: 'Approved',
      mediaStatus: 'Available'
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      status: 'Declined',
      mediaStatus: 'Unknown'
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      id: 43,
      type: 'tv',
      title: 'TV Show 1',
      status: 'Approved',
      mediaStatus: 'Partially Available',
      requestedBy: 'Test User 2'
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      title: 'Movie 1 — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing',
      requestedBy: 'Test User With an Extremely Long Display Name'
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      posterPath: null
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      title: 'Movie 2',
      posterPath: '/storybook-test-poster.jpg'
    }
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{o as Approved,s as Declined,l as LongTitle,u as MissingPoster,a as Pending,c as TVShow,d as WithPoster,f as __namedExportsOrder,i as default};