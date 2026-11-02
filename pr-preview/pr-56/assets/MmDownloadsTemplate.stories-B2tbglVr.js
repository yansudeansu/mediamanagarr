import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-CS7GQ-tH.js";import{n as r,t as i}from"./MmButton-BPbSDiIy.js";import{n as a,t as o}from"./MmDownloadsTemplate-imFuFqqz.js";import{n as s,t as c}from"./MmTransferStats-DtlE1Btr.js";import{n as l,t as u}from"./MmTorrentConfirmation-BvMuGOy3.js";import{n as d,t as f}from"./MmTorrentList-DXzu7Mxl.js";function p(e){let t=[`downloading`,`neutral`,`seeding`,`stopped`],n=[`Downloading`,`Stalled`,`Seeding`,`Stopped`],r=(e-1)%t.length,i=t[r],a=n[r],o=e%2!=0,s=Math.ceil(e/2),c=o?`Movie ${s} (2026) 1080p WEB-DL`:`TV Show ${s} S01E01 1080p WEB-DL`,l=Math.min(1,e/20),u=i===`stopped`;return{id:e.toString(16).padStart(40,`0`),name:c,statusLabel:a,statusVariant:i,progress:l*100,progressLabel:`${(l*100).toFixed(1)}%`,sizeLabel:`${Math.round(l*1024)} MiB / 1.0 GiB`,downloadSpeedLabel:e%4==0?`0 B/s`:`${e}.0 MiB/s`,uploadSpeedLabel:e%3==0?`512 KiB/s`:`0 B/s`,etaLabel:`${e*10}m`,primaryActionLabel:u?`Start`:`Stop`}}function m(e){return Array.from({length:e},(e,t)=>p(t+1))}var h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),a(),r(),s(),d(),l(),h=m(12),g={title:`Templates/DownloadsTemplate`,component:o,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},_={render:()=>({components:{MmDownloadsTemplate:o,MmButton:i,MmTransferStats:c,MmTorrentList:f,MmTorrentConfirmation:u},setup(){let e=t(1),n=t([...h]),r=t(null);function i(e){let t=n.value.find(t=>t.id===e);r.value=t?{id:t.id,name:t.name}:null}function a(e){n.value=n.value.filter(t=>t.id!==e.id),r.value=null}function o(e){n.value=n.value.map(t=>{if(t.id!==e)return t;let n=t.primaryActionLabel===`Start`;return{...t,statusLabel:n?`Downloading`:`Stopped`,statusVariant:n?`downloading`:`stopped`,primaryActionLabel:n?`Stop`:`Start`}})}return{page:e,torrents:n,selectedTorrent:r,selectTorrent:i,confirmRemoval:a,handlePrimaryAction:o}},template:`
      <MmDownloadsTemplate>
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="refresh"
          >
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
            :item="selectedTorrent"
            title="Remove torrent?"
            description="Remove this torrent from the download client."
            delete-files-label="Also delete downloaded files"
            delete-files-hint="Permanently delete downloaded data."
            delete-files-warning="This cannot be undone."
            confirm-label="Remove torrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="torrents"
          @primary-action="handlePrimaryAction"
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
          <p
            style="margin: 0 0 10px; color: var(--danger); font-size: 12px;"
          >
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
    `})},x={render:()=>({components:{MmDownloadsTemplate:o,MmTransferStats:c,MmTorrentList:f,MmTorrentConfirmation:u},setup(){let e=t(1),n=t({id:h[0].id,name:h[0].name});function r(){n.value=null}return{page:e,mockTorrents:h,selectedTorrent:n,confirmRemoval:r}},template:`
      <MmDownloadsTemplate>
        <template #stats>
          <MmTransferStats
            :download-speed="4 * 1024 * 1024"
            :upload-speed="512 * 1024"
          />
        </template>

        <template v-if="selectedTorrent" #confirmation>
          <MmTorrentConfirmation
            :item="selectedTorrent"
            title="Remove torrent?"
            description="Remove this torrent from the download client."
            delete-files-label="Also delete downloaded files"
            delete-files-hint="Permanently delete downloaded data."
            delete-files-warning="This cannot be undone."
            confirm-label="Remove torrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
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
      const torrents = ref<TorrentCardData[]>([...mockTorrents]);
      const selectedTorrent = ref<ConfirmationItem | null>(null);
      function selectTorrent(id: string): void {
        const torrent = torrents.value.find(item => item.id === id);
        selectedTorrent.value = torrent ? {
          id: torrent.id,
          name: torrent.name
        } : null;
      }
      function confirmRemoval(payload: {
        id: string;
        deleteFiles: boolean;
      }): void {
        torrents.value = torrents.value.filter(torrent => torrent.id !== payload.id);
        selectedTorrent.value = null;
      }
      function handlePrimaryAction(id: string): void {
        torrents.value = torrents.value.map(torrent => {
          if (torrent.id !== id) {
            return torrent;
          }
          const stopped = torrent.primaryActionLabel === 'Start';
          return {
            ...torrent,
            statusLabel: stopped ? 'Downloading' : 'Stopped',
            statusVariant: stopped ? 'downloading' as const : 'stopped' as const,
            primaryActionLabel: stopped ? 'Stop' : 'Start'
          };
        });
      }
      return {
        page,
        torrents,
        selectedTorrent,
        selectTorrent,
        confirmRemoval,
        handlePrimaryAction
      };
    },
    template: \`
      <MmDownloadsTemplate>
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="refresh"
          >
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
            :item="selectedTorrent"
            title="Remove torrent?"
            description="Remove this torrent from the download client."
            delete-files-label="Also delete downloaded files"
            delete-files-hint="Permanently delete downloaded data."
            delete-files-warning="This cannot be undone."
            confirm-label="Remove torrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="torrents"
          @primary-action="handlePrimaryAction"
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
      function retry(): void {
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
          <p
            style="margin: 0 0 10px; color: var(--danger); font-size: 12px;"
          >
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
      const selectedTorrent = ref<ConfirmationItem | null>({
        id: mockTorrents[0]!.id,
        name: mockTorrents[0]!.name
      });
      function confirmRemoval(): void {
        selectedTorrent.value = null;
      }
      return {
        page,
        mockTorrents,
        selectedTorrent,
        confirmRemoval
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

        <template v-if="selectedTorrent" #confirmation>
          <MmTorrentConfirmation
            :item="selectedTorrent"
            title="Remove torrent?"
            description="Remove this torrent from the download client."
            delete-files-label="Also delete downloaded files"
            delete-files-hint="Permanently delete downloaded data."
            delete-files-warning="This cannot be undone."
            confirm-label="Remove torrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
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