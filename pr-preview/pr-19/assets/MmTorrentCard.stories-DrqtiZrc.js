import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmTorrentCard-DWPjdtHS.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),r={hash:`a`.repeat(40),name:`Movie 1 (2026) 1080p WEB-DL`,progress:.425,state:`downloading`,downloadSpeed:25e5,uploadSpeed:125e3,eta:3600,size:8e9,downloaded:34e8},i={title:`Molecules/TorrentCard`,component:n,tags:[`autodocs`],args:{torrent:r,pendingAction:null,disabled:!1},argTypes:{pendingAction:{control:`select`,options:[null,`start`,`stop`,`remove`]},disabled:{control:`boolean`}},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},a={},o={args:{torrent:{...r,state:`stalledDL`,downloadSpeed:0,eta:864e4}}},s={args:{torrent:{...r,progress:1,state:`uploading`,downloaded:r.size,downloadSpeed:0,uploadSpeed:8e5,eta:0}}},c={args:{torrent:{...r,state:`stoppedDL`,downloadSpeed:0,uploadSpeed:0}}},l={args:{torrent:{...r,progress:.987,downloaded:7896e6,eta:120}}},u={args:{torrent:{...r,state:`error`,downloadSpeed:0,uploadSpeed:0}}},d={args:{torrent:{...r,name:`Movie 1 (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing - 2160p HDR`}}},f={args:{pendingAction:`stop`}},p={args:{pendingAction:`remove`}},m={args:{disabled:!0}},h=[`Downloading`,`Stalled`,`Seeding`,`Stopped`,`NearlyComplete`,`Error`,`LongName`,`StopPending`,`RemovePending`,`Disabled`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      state: 'stalledDL',
      downloadSpeed: 0,
      eta: 8_640_000
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      progress: 1,
      state: 'uploading',
      downloaded: baseTorrent.size,
      downloadSpeed: 0,
      uploadSpeed: 800_000,
      eta: 0
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      state: 'stoppedDL',
      downloadSpeed: 0,
      uploadSpeed: 0
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      progress: 0.987,
      downloaded: 7_896_000_000,
      eta: 120
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      state: 'error',
      downloadSpeed: 0,
      uploadSpeed: 0
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      name: 'Movie 1 (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing - 2160p HDR'
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    pendingAction: 'stop'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    pendingAction: 'remove'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as Disabled,a as Downloading,u as Error,d as LongName,l as NearlyComplete,p as RemovePending,s as Seeding,o as Stalled,f as StopPending,c as Stopped,h as __namedExportsOrder,i as default};