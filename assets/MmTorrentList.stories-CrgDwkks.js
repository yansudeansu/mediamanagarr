import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-BfdF06dh.js";import{n as r,t as i}from"./MmTorrentList-GK7e37z8.js";function a(e){let t=[`downloading`,`stalledDL`,`uploading`,`stoppedDL`],n=e%2!=0,r=Math.ceil(e/2),i=n?`Movie ${r} (2026) 1080p WEB-DL`:`TV Show ${r} S01E01 1080p WEB-DL`;return{hash:e.toString(16).padStart(40,`0`),name:i,progress:Math.min(1,e/20),state:t[(e-1)%t.length],downloadSpeed:e%4==0?0:1048576*e,uploadSpeed:e%3==0?524288:0,eta:e*600,size:1024**3,downloaded:Math.min(1,e/20)*1024**3}}function o(e){return Array.from({length:e},(e,t)=>a(t+1))}var s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),r(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`Organisms/TorrentList`,component:i,tags:[`autodocs`],args:{torrents:o(5),page:1,pageSize:10,pendingAction:null,disabled:!1,onStart:s(),onStop:s(),onRemove:s(),"onUpdate:page":s()},argTypes:{page:{control:`number`,description:`Current page number (1-based).`},pageSize:{control:`number`,description:`Maximum number of torrents per page.`},disabled:{control:`boolean`,description:`Disable all torrent actions.`},onStart:{description:`Emitted when a torrent should start.`},onStop:{description:`Emitted when a torrent should stop.`},onRemove:{description:`Emitted when a torrent removal is requested.`},"onUpdate:page":{description:`Emitted when the selected page changes.`}},decorators:[()=>({template:`<div style="width: 380px; max-width: 100%;"><story /></div>`})]},l={},u={args:{torrents:[]}},d={args:{torrents:o(1)}},f={args:{torrents:o(10)}},p={args:{torrents:o(23)},render:e=>({components:{MmTorrentList:i},setup(){return{args:e,page:t(e.page)}},template:`
      <mm-torrent-list
        v-bind="args"
        v-model:page="page"
      />
    `})},m={args:{torrents:o(15),page:2}},h={args:{torrents:o(3),pendingAction:{hash:a(1).hash,action:`stop`}}},g={args:{torrents:o(3),disabled:!0}},_={args:{torrents:o(8),pageSize:3}},v=[`Default`,`Empty`,`SingleTorrent`,`FullPage`,`MultiplePages`,`SecondPage`,`PendingAction`,`Disabled`,`CustomPageSize`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: []
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(1)
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(10)
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(23)
  },
  render: args => ({
    components: {
      MmTorrentList
    },
    setup() {
      const page = ref(args.page);
      return {
        args,
        page
      };
    },
    template: \`
      <mm-torrent-list
        v-bind="args"
        v-model:page="page"
      />
    \`
  })
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(15),
    page: 2
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(3),
    pendingAction: {
      hash: createTorrent(1).hash,
      action: 'stop'
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(3),
    disabled: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(8),
    pageSize: 3
  }
}`,..._.parameters?.docs?.source}}}})))()}y();export{_ as CustomPageSize,l as Default,g as Disabled,u as Empty,f as FullPage,p as MultiplePages,h as PendingAction,m as SecondPage,d as SingleTorrent,v as __namedExportsOrder,c as default};