import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmRequestCard-M-iMpo3S.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{t(),r={type:`movie`,title:`Example Movie`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Alex`,createdAt:`2026-10-20T12:00:00.000Z`,posterUrl:null},i={title:`Molecules/RequestCard`,component:n,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A presentation-only card showing a media request, its status, requester, date, and optional poster. The parent supplies display-ready data and poster URLs.`}}},argTypes:{request:{control:`object`,description:`Display-ready request data, including title, media type, statuses, requester, creation date, and optional poster URL.`}},args:{request:r},decorators:[()=>({template:`
        <div style="width: min(420px, calc(100vw - 32px));">
          <story />
        </div>
      `})]},a={},o={},s={args:{request:{...r,status:`Approved`,mediaStatus:`Available`}}},c={args:{request:{...r,status:`Declined`,mediaStatus:`Unknown`}}},l={args:{request:{...r,status:`Approved`,mediaStatus:`Processing`}}},u={args:{request:{...r,type:`tv`,title:`Example Series`,status:`Approved`,mediaStatus:`Partially Available`}}},d={args:{request:{...r,type:`tv`,title:`Example Series`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Jordan`}}},f={args:{request:{...r,title:`Example Movie — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing`,requestedBy:`A User With an Extremely Long Display Name`}}},p={args:{request:{...r,posterUrl:null}}},m={args:{request:{...r,title:`Example Movie With Poster`,posterUrl:`https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`}}},h={args:{request:{...r,status:`Unknown`,mediaStatus:`Unknown`}}},g={args:{request:{...r,createdAt:`invalid-date`}}},_=[`Playground`,`Pending`,`Approved`,`Declined`,`Processing`,`PartiallyAvailable`,`TVShow`,`LongTitle`,`MissingPoster`,`WithPoster`,`UnknownStatus`,`InvalidDate`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      status: 'Approved',
      mediaStatus: 'Available'
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      status: 'Declined',
      mediaStatus: 'Unknown'
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      status: 'Approved',
      mediaStatus: 'Processing'
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      type: 'tv',
      title: 'Example Series',
      status: 'Approved',
      mediaStatus: 'Partially Available'
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      type: 'tv',
      title: 'Example Series',
      status: 'Approved',
      mediaStatus: 'Available',
      requestedBy: 'Jordan'
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      title: 'Example Movie — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing',
      requestedBy: 'A User With an Extremely Long Display Name'
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      posterUrl: null
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      title: 'Example Movie With Poster',
      posterUrl: 'https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      status: 'Unknown',
      mediaStatus: 'Unknown'
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      ...baseRequest,
      createdAt: 'invalid-date'
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{s as Approved,c as Declined,g as InvalidDate,f as LongTitle,p as MissingPoster,u as PartiallyAvailable,o as Pending,a as Playground,l as Processing,d as TVShow,h as UnknownStatus,m as WithPoster,_ as __namedExportsOrder,i as default};