import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{P as t,a as n}from"./iframe-C7jqTg2E.js";import{n as r,t as i}from"./MmTorrentConfirmation-Dop5jxF1.js";var a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),r(),{fn:a}=__STORYBOOK_MODULE_TEST__,o={hash:`a`.repeat(40),name:`Movie 1 (2026) 1080p WEB-DL`,progress:.5,state:`downloading`,downloadSpeed:1048576,uploadSpeed:0,eta:3600,size:1024**3,downloaded:512*1024**2},s={...o,hash:`b`.repeat(40),name:`TV Show 1 S01E01 1080p WEB-DL`},c={title:`Molecules/TorrentConfirmation`,component:i,tags:[`autodocs`],args:{torrent:o,loading:!1,onConfirm:a(),onCancel:a()},argTypes:{loading:{control:`boolean`,description:`Whether the removal operation is processing.`},onConfirm:{description:`Emitted with the torrent hash and deleteFiles choice.`},onCancel:{description:`Emitted when the user cancels removal.`}},decorators:[()=>({template:`<div style="width: 380px; max-width: 100%;"><story /></div>`})]},l={},u={args:{loading:!0}},d={args:{torrent:{...o,name:`Movie 1 (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing 2160p HDR`}}},f={args:{torrent:null}},p={render:e=>({components:{MmTorrentConfirmation:i},setup(){let n=t(o);function r(){n.value=null,e.onCancel?.()}function i(t){e.onConfirm?.(t),n.value=null}return{args:e,selectedTorrent:n,torrent:o,anotherTorrent:s,handleCancel:r,handleConfirm:i}},template:`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button
            type="button"
            @click="selectedTorrent = torrent"
          >
            Open first torrent
          </button>

          <button
            type="button"
            @click="selectedTorrent = anotherTorrent"
          >
            Open second torrent
          </button>
        </div>

        <mm-torrent-confirmation
          :torrent="selectedTorrent"
          :loading="args.loading"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
    `})},m=[`Default`,`Loading`,`LongTorrentName`,`Hidden`,`Interactive`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...torrent,
      name: 'Movie 1 (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing 2160p HDR'
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: null
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmTorrentConfirmation
    },
    setup() {
      const selectedTorrent = ref<QBittorrentTorrent | null>(torrent);
      function handleCancel() {
        selectedTorrent.value = null;
        args.onCancel?.();
      }
      function handleConfirm(payload: {
        hash: string;
        deleteFiles: boolean;
      }) {
        args.onConfirm?.(payload);
        selectedTorrent.value = null;
      }
      return {
        args,
        selectedTorrent,
        torrent,
        anotherTorrent,
        handleCancel,
        handleConfirm
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button
            type="button"
            @click="selectedTorrent = torrent"
          >
            Open first torrent
          </button>

          <button
            type="button"
            @click="selectedTorrent = anotherTorrent"
          >
            Open second torrent
          </button>
        </div>

        <mm-torrent-confirmation
          :torrent="selectedTorrent"
          :loading="args.loading"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
    \`
  })
}`,...p.parameters?.docs?.source},description:{story:`Demonstrates opening, cancelling, and reopening the confirmation.

The delete-files checkbox must be unchecked every time the
confirmation is reopened.`,...p.parameters?.docs?.description}}}})))()}h();export{l as Default,f as Hidden,p as Interactive,u as Loading,d as LongTorrentName,m as __namedExportsOrder,c as default};