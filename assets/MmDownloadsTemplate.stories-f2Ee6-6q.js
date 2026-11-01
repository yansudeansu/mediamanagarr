import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-R8RKcgYl.js";import{n as r,t as i}from"./MmButton-D89_CiNd.js";import{n as a,t as o}from"./MmDownloadsTemplate-Bh4QwyyM.js";import{n as s,t as c}from"./MmTransferStats-C-4Y3dxv.js";import{n as l,t as u}from"./MmTorrentConfirmation-D19E3g2w.js";import{n as d,t as f}from"./MmTorrentList-B8Aa3Vww.js";function p(e){let t=[`downloading`,`stalledDL`,`uploading`,`stoppedDL`],n=e%2!=0,r=Math.ceil(e/2),i=n?`Movie ${r} (2026) 1080p WEB-DL`:`TV Show ${r} S01E01 1080p WEB-DL`;return{hash:e.toString(16).padStart(40,`0`),name:i,progress:Math.min(1,e/20),state:t[(e-1)%t.length],downloadSpeed:e%4==0?0:1048576*e,uploadSpeed:e%3==0?524288:0,eta:e*600,size:1024**3,downloaded:Math.min(1,e/20)*1024**3}}function m(e){return Array.from({length:e},(e,t)=>p(t+1))}var h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),a(),r(),s(),d(),l(),h=m(12),g={title:`Templates/DownloadsTemplate`,component:o,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},_={render:()=>({components:{MmDownloadsTemplate:o,MmButton:i,MmTransferStats:c,MmTorrentList:f,MmTorrentConfirmation:u},setup(){let e=t(1),n=t(null);function r(e){n.value=h.find(t=>t.hash===e)??null}function i(){n.value=null}return{page:e,mockTorrents:h,selectedTorrent:n,selectTorrent:r,confirmRemoval:i}},template:`
      <MmDownloadsTemplate>
        <template #actions>
          <MmButton variant="secondary" size="small" icon="refresh">
            Refresh
          </MmButton>
        </template>

        <template #stats>
          <MmTransferStats
            :download-speed="4 * 1024 * 1024"
            :upload-speed="512 * 1024"
          />
        </template>

        <template v-if="selectedTorrent" #confirmation>
          <MmTorrentConfirmation
            :torrent="selectedTorrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="mockTorrents"
          @remove="selectTorrent"
        />
      </MmDownloadsTemplate>
    `})},v={render:()=>({components:{MmDownloadsTemplate:o,MmTransferStats:c,MmTorrentList:f},setup(){return{page:t(1)}},template:`
      <MmDownloadsTemplate>
        <template #stats>
          <MmTransferStats
            :download-speed="0"
            :upload-speed="0"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="[]"
        />
      </MmDownloadsTemplate>
    `})},y={render:()=>({components:{MmDownloadsTemplate:o},template:`
      <MmDownloadsTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading downloads…
        </p>
      </MmDownloadsTemplate>
    `})},b={render:()=>({components:{MmDownloadsTemplate:o,MmButton:i},setup(){let e=t(!1);function n(){e.value=!0}return{retrying:e,retry:n}},template:`
      <MmDownloadsTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load downloads from qBittorrent.
          </p>

          <MmButton
            variant="secondary"
            size="small"
            :loading="retrying"
            @click="retry"
          >
            Retry
          </MmButton>
        </div>
      </MmDownloadsTemplate>
    `})},x={render:()=>({components:{MmDownloadsTemplate:o,MmTransferStats:c,MmTorrentList:f,MmTorrentConfirmation:u},setup(){let e=t(1),n=t(h[0]);return{page:e,mockTorrents:h,selectedTorrent:n}},template:`
      <MmDownloadsTemplate>
        <template #stats>
          <MmTransferStats
            :download-speed="4 * 1024 * 1024"
            :upload-speed="512 * 1024"
          />
        </template>

        <template #confirmation>
          <MmTorrentConfirmation
            :torrent="selectedTorrent"
            @cancel="selectedTorrent = null"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="mockTorrents"
        />
      </MmDownloadsTemplate>
    `})},S=[`Default`,`Empty`,`Loading`,`Error`,`RemovalConfirmation`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmButton,
      MmTransferStats,
      MmTorrentList,
      MmTorrentConfirmation
    },
    setup() {
      const page = ref(1);
      const selectedTorrent = ref<QBittorrentTorrent | null>(null);
      function selectTorrent(hash: string) {
        selectedTorrent.value = mockTorrents.find(torrent => torrent.hash === hash) ?? null;
      }
      function confirmRemoval() {
        selectedTorrent.value = null;
      }
      return {
        page,
        mockTorrents,
        selectedTorrent,
        selectTorrent,
        confirmRemoval
      };
    },
    template: \`
      <MmDownloadsTemplate>
        <template #actions>
          <MmButton variant="secondary" size="small" icon="refresh">
            Refresh
          </MmButton>
        </template>

        <template #stats>
          <MmTransferStats
            :download-speed="4 * 1024 * 1024"
            :upload-speed="512 * 1024"
          />
        </template>

        <template v-if="selectedTorrent" #confirmation>
          <MmTorrentConfirmation
            :torrent="selectedTorrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="mockTorrents"
          @remove="selectTorrent"
        />
      </MmDownloadsTemplate>
    \`
  })
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmTransferStats,
      MmTorrentList
    },
    setup() {
      const page = ref(1);
      return {
        page
      };
    },
    template: \`
      <MmDownloadsTemplate>
        <template #stats>
          <MmTransferStats
            :download-speed="0"
            :upload-speed="0"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="[]"
        />
      </MmDownloadsTemplate>
    \`
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmDownloadsTemplate
    },
    template: \`
      <MmDownloadsTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading downloads…
        </p>
      </MmDownloadsTemplate>
    \`
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmButton
    },
    setup() {
      const retrying = ref(false);
      function retry() {
        retrying.value = true;
      }
      return {
        retrying,
        retry
      };
    },
    template: \`
      <MmDownloadsTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load downloads from qBittorrent.
          </p>

          <MmButton
            variant="secondary"
            size="small"
            :loading="retrying"
            @click="retry"
          >
            Retry
          </MmButton>
        </div>
      </MmDownloadsTemplate>
    \`
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmTransferStats,
      MmTorrentList,
      MmTorrentConfirmation
    },
    setup() {
      const page = ref(1);
      const selectedTorrent = ref<QBittorrentTorrent | null>(mockTorrents[0]);
      return {
        page,
        mockTorrents,
        selectedTorrent
      };
    },
    template: \`
      <MmDownloadsTemplate>
        <template #stats>
          <MmTransferStats
            :download-speed="4 * 1024 * 1024"
            :upload-speed="512 * 1024"
          />
        </template>

        <template #confirmation>
          <MmTorrentConfirmation
            :torrent="selectedTorrent"
            @cancel="selectedTorrent = null"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="mockTorrents"
        />
      </MmDownloadsTemplate>
    \`
  })
}`,...x.parameters?.docs?.source}}}})))()}C();export{_ as Default,v as Empty,b as Error,y as Loading,x as RemovalConfirmation,S as __namedExportsOrder,g as default};