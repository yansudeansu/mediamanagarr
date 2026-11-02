import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmTorrentList-DXzu7Mxl.js";function r(e){let t=[`downloading`,`neutral`,`seeding`,`stopped`],n=[`Downloading`,`Stalled`,`Seeding`,`Stopped`],r=(e-1)%t.length,i=t[r],a=n[r],o=e%2!=0,s=Math.ceil(e/2),c=o?`Movie ${s} (2026) 1080p WEB-DL`:`TV Show ${s} S01E01 1080p WEB-DL`,l=Math.min(1,e/20),u=i===`stopped`;return{id:e.toString(16).padStart(40,`0`),name:c,statusLabel:a,statusVariant:i,progress:l*100,progressLabel:`${(l*100).toFixed(1)}%`,sizeLabel:`${(l*1024).toFixed(0)} MiB / 1.0 GiB`,downloadSpeedLabel:e%4==0?`0 B/s`:`${e}.0 MiB/s`,uploadSpeedLabel:e%3==0?`512 KiB/s`:`0 B/s`,etaLabel:`${e*10}m`,primaryActionLabel:u?`Start`:`Stop`}}function i(e){return Array.from({length:e},(e,t)=>r(t+1))}var a,o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{t(),{useArgs:a}=__STORYBOOK_MODULE_PREVIEW_API__,{fn:o}=__STORYBOOK_MODULE_TEST__,s={title:`Organisms/TorrentList`,component:n,tags:[`autodocs`],args:{torrents:i(5),page:1,pageSize:10,pendingAction:null,disabled:!1,onPrimaryAction:o(),onRemove:o(),"onUpdate:page":o()},argTypes:{torrents:{control:`object`,description:`Display-ready torrent card data supplied by the parent.`},page:{control:`number`,description:`Current page number (1-based).`},pageSize:{control:`number`,description:`Maximum number of torrents per page.`},pendingAction:{control:`object`,description:`Currently pending action, identified by torrent ID and action type.`},disabled:{control:`boolean`,description:`Disable all torrent actions.`},onPrimaryAction:{description:`Emitted when a torrent primary action is requested. The parent decides what that action does.`},onRemove:{description:`Emitted when a torrent removal is requested.`},"onUpdate:page":{description:`Emitted when the selected page changes.`}},decorators:[()=>({template:`<div style="width: 380px; max-width: 100%;"><story /></div>`})]},c={},l={args:{torrents:[]}},u={args:{torrents:i(1)}},d={args:{torrents:i(10)}},f={args:{torrents:i(23)},render:e=>{let[,t]=a();return{components:{MmTorrentList:n},setup(){function n(e){t({page:e})}return{args:e,handlePageChange:n}},template:`
        <mm-torrent-list
          v-bind="args"
          @update:page="handlePageChange"
        />
      `}}},p={args:{torrents:i(15),page:2}},m={args:{torrents:i(3),pendingAction:{id:r(1).id,action:`primary`}}},h={args:{torrents:i(3),disabled:!0}},g={args:{torrents:i(8),pageSize:3}},_=[`Default`,`Empty`,`SingleTorrent`,`FullPage`,`MultiplePages`,`SecondPage`,`PendingAction`,`Disabled`,`CustomPageSize`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: []
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(1)
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(10)
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(23)
  },
  render: args => {
    const [, updateArgs] = useArgs();
    return {
      components: {
        MmTorrentList
      },
      setup() {
        function handlePageChange(page: number): void {
          updateArgs({
            page
          });
        }
        return {
          args,
          handlePageChange
        };
      },
      template: \`
        <mm-torrent-list
          v-bind="args"
          @update:page="handlePageChange"
        />
      \`
    };
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(15),
    page: 2
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(3),
    pendingAction: {
      id: createTorrent(1).id,
      action: 'primary'
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(3),
    disabled: true
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    torrents: createTorrents(8),
    pageSize: 3
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{g as CustomPageSize,c as Default,h as Disabled,l as Empty,d as FullPage,f as MultiplePages,m as PendingAction,p as SecondPage,u as SingleTorrent,_ as __namedExportsOrder,s as default};