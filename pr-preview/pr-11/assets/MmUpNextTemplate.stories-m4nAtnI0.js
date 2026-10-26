import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{C as t,T as n,a as r,d as i,h as a,j as o,m as s,p as c,u as l}from"./iframe-Bq8FMHBt.js";import{n as u,t as d}from"./MmButton-_tt-Lqzq.js";import{n as f,t as p}from"./_plugin-vue_export-helper-ktEZWxTd.js";import{n as m,t as h}from"./MmArrivalCard-fFmntBli.js";import{n as g,t as _}from"./MmPagination-DjiyNPbI.js";function v(e,r){return t(),s(`div`,b,[i(`header`,x,[i(`div`,S,[r[1]||=i(`h2`,{id:`up-next-title`,class:`up-next-template__title`},`Up Next`,-1),i(`p`,C,[n(e.$slots,`description`,{},()=>[r[0]||=a(`Recently added, unwatched media from Jellyfin.`,-1)],!0)])]),e.$slots.actions?(t(),s(`div`,w,[n(e.$slots,`actions`,{},void 0,!0)])):c(``,!0)]),e.$slots.filters?(t(),s(`section`,T,[n(e.$slots,`filters`,{},void 0,!0)])):c(``,!0),i(`section`,E,[n(e.$slots,`default`,{},void 0,!0)]),e.$slots.pagination?(t(),s(`nav`,D,[n(e.$slots,`pagination`,{},void 0,!0)])):c(``,!0)])}var y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{r(),f(),y={},b={class:`up-next-template`},x={class:`up-next-template__header`},S={class:`up-next-template__heading`},C={class:`up-next-template__description`},w={key:0,class:`up-next-template__actions`},T={key:0,class:`up-next-template__filters`,"aria-label":`Arrival filters`},E={class:`up-next-template__content`,"aria-labelledby":`up-next-title`},D={key:1,class:`up-next-template__pagination`,"aria-label":`Arrival pagination`},O=p(y,[[`render`,v],[`__scopeId`,`data-v-0420b840`]]),y.__docgenInfo=Object.assign({displayName:y.name??y.__name},{displayName:`MmUpNextTemplate`,description:``,tags:{},slots:[{name:`description`},{name:`actions`},{name:`filters`},{name:`default`},{name:`pagination`}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/templates/MmUpNextTemplate/MmUpNextTemplate.vue`]})})))()}function A(e=`all`){return()=>({components:{MmUpNextTemplate:O,MmArrivalCard:h,MmPagination:_,MmButton:d},setup(){let t=o(M.map(e=>({...e}))),n=o(e),r=o(1),i=l(()=>t.value.filter(e=>e.unread).length),a=l(()=>Math.max(1,Math.ceil(t.value.length/j))),s=l(()=>{let e=(r.value-1)*j;return t.value.slice(e,e+j)}),c=l(()=>n.value===`new`?s.value.filter(e=>e.unread):s.value),u=l(()=>i.value>0?`${i.value} new · ${t.value.length} unwatched items`:`${t.value.length} unwatched items`);function d(e){n.value=e}function f(e,n){t.value=t.value.map(t=>t.id===e?{...t,unread:n}:t)}function p(){t.value=t.value.map(e=>({...e,unread:!1}))}function m(){t.value=M.map(e=>({...e})),n.value=`all`,r.value=1}return{filters:N,activeFilter:n,page:r,totalPages:a,visibleArrivals:c,unreadCount:i,description:u,selectFilter:d,toggleUnread:f,clearNotifications:p,refresh:m}},template:`
      <MmUpNextTemplate>
        <template #description>
          {{ description }}
        </template>

        <template #actions>
          <MmButton
            v-if="unreadCount > 0"
            variant="secondary"
            size="small"
            @click="clearNotifications"
          >
            Clear notifications
          </MmButton>

          <MmButton
            variant="secondary"
            size="small"
            icon="refresh"
            @click="refresh"
          >
            Refresh
          </MmButton>
        </template>

        <template #filters>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <MmButton
              v-for="filter in filters"
              :key="filter.value"
              size="small"
              :variant="activeFilter === filter.value ? 'primary' : 'secondary'"
              :aria-pressed="activeFilter === filter.value"
              @click="selectFilter(filter.value)"
            >
              {{ filter.label }}
            </MmButton>
          </div>
        </template>

        <p
          v-if="visibleArrivals.length === 0"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          No new items right now.
        </p>

        <MmArrivalCard
          v-for="arrival in visibleArrivals"
          :key="arrival.id"
          :arrival="arrival"
          @toggle-unread="toggleUnread"
        />

        <template v-if="totalPages > 1" #pagination>
          <MmPagination
            v-model:page="page"
            :total-pages="totalPages"
          />
        </template>
      </MmUpNextTemplate>
    `})}var j,M,N,P,F,I,L,R,z,B,V;function H(){return(H=e((()=>{r(),k(),m(),g(),u(),j=10,M=[{id:`movie-1`,type:`Movie`,title:`Dune: Part Two`,subtitle:`2024`,dateAdded:`2026-10-24T18:30:00.000Z`,imageId:`movie-1`,imageTag:null,unread:!0},{id:`episode-2`,type:`Episode`,title:`The We We Are`,subtitle:`Severance · S01E09`,dateAdded:`2026-10-23T14:15:00.000Z`,imageId:`series-2`,imageTag:null,unread:!0},{id:`movie-3`,type:`Movie`,title:`Interstellar`,subtitle:`2014`,dateAdded:`2026-10-22T11:00:00.000Z`,imageId:`movie-3`,imageTag:null,unread:!1},{id:`episode-4`,type:`Episode`,title:`When You’re Lost in the Darkness`,subtitle:`The Last of Us · S01E01`,dateAdded:`2026-10-21T20:45:00.000Z`,imageId:`series-4`,imageTag:null,unread:!0},{id:`movie-5`,type:`Movie`,title:`Oppenheimer`,subtitle:`2023`,dateAdded:`2026-10-20T09:30:00.000Z`,imageId:`movie-5`,imageTag:null,unread:!1},{id:`episode-6`,type:`Episode`,title:`Pilot`,subtitle:`Fallout · S01E01`,dateAdded:`2026-10-19T16:00:00.000Z`,imageId:`series-6`,imageTag:null,unread:!1},{id:`movie-7`,type:`Movie`,title:`The Batman`,subtitle:`2022`,dateAdded:`2026-10-18T13:20:00.000Z`,imageId:`movie-7`,imageTag:null,unread:!1},{id:`episode-8`,type:`Episode`,title:`The Heirs of the Dragon`,subtitle:`House of the Dragon · S01E01`,dateAdded:`2026-10-17T08:45:00.000Z`,imageId:`series-8`,imageTag:null,unread:!0},{id:`movie-9`,type:`Movie`,title:`Everything Everywhere All at Once`,subtitle:`2022`,dateAdded:`2026-10-16T17:10:00.000Z`,imageId:`movie-9`,imageTag:null,unread:!1},{id:`episode-10`,type:`Episode`,title:`System Shutdown`,subtitle:`Silo · S01E10`,dateAdded:`2026-10-15T12:00:00.000Z`,imageId:`series-10`,imageTag:null,unread:!1},{id:`movie-11`,type:`Movie`,title:`Blade Runner 2049`,subtitle:`2017`,dateAdded:`2026-10-14T10:00:00.000Z`,imageId:`movie-11`,imageTag:null,unread:!0},{id:`episode-12`,type:`Episode`,title:`The Original`,subtitle:`Westworld · S01E01`,dateAdded:`2026-10-13T19:30:00.000Z`,imageId:`series-12`,imageTag:null,unread:!1}],N=[{label:`All`,value:`all`},{label:`New`,value:`new`}],P={title:`Templates/UpNextTemplate`,component:O,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px;"><story /></div>`})]},F={render:A()},I={render:A(`new`)},L={render:()=>({components:{MmUpNextTemplate:O,MmButton:d},setup(){let e=o(`all`);return{filters:N,activeFilter:e}},template:`
      <MmUpNextTemplate>
        <template #description>
          0 unwatched items
        </template>

        <template #filters>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <MmButton
              v-for="filter in filters"
              :key="filter.value"
              size="small"
              :variant="activeFilter === filter.value ? 'primary' : 'secondary'"
              :aria-pressed="activeFilter === filter.value"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </MmButton>
          </div>
        </template>

        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          Nothing unwatched in your recent library.
        </p>
      </MmUpNextTemplate>
    `})},R={render:()=>({components:{MmUpNextTemplate:O},template:`
      <MmUpNextTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading arrivals…
        </p>
      </MmUpNextTemplate>
    `})},z={render:()=>({components:{MmUpNextTemplate:O,MmButton:d},setup(){let e=o(!1);function t(){e.value=!0}return{retrying:e,retry:t}},template:`
      <MmUpNextTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load arrivals from Jellyfin.
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
      </MmUpNextTemplate>
    `})},B={render:()=>({components:{MmUpNextTemplate:O,MmArrivalCard:h},setup(){return{arrival:{...M[0],title:`An Extremely Long Movie Title That Should Be Truncated Gracefully Without Breaking the Popup Layout`,subtitle:`2026 · An Extremely Long Subtitle That Should Also Be Truncated`}}},template:`
      <MmUpNextTemplate>
        <MmArrivalCard :arrival="arrival" />
      </MmUpNextTemplate>
    `})},V=[`Default`,`New`,`Empty`,`Loading`,`Error`,`LongTitle`],F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: createStory()
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: createStory('new')
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmUpNextTemplate,
      MmButton
    },
    setup() {
      const activeFilter = ref<ArrivalFilter>('all');
      return {
        filters,
        activeFilter
      };
    },
    template: \`
      <MmUpNextTemplate>
        <template #description>
          0 unwatched items
        </template>

        <template #filters>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <MmButton
              v-for="filter in filters"
              :key="filter.value"
              size="small"
              :variant="activeFilter === filter.value ? 'primary' : 'secondary'"
              :aria-pressed="activeFilter === filter.value"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </MmButton>
          </div>
        </template>

        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          Nothing unwatched in your recent library.
        </p>
      </MmUpNextTemplate>
    \`
  })
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmUpNextTemplate
    },
    template: \`
      <MmUpNextTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading arrivals…
        </p>
      </MmUpNextTemplate>
    \`
  })
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmUpNextTemplate,
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
      <MmUpNextTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load arrivals from Jellyfin.
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
      </MmUpNextTemplate>
    \`
  })
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmUpNextTemplate,
      MmArrivalCard
    },
    setup() {
      const arrival: JellyfinArrival = {
        ...mockArrivals[0]!,
        title: 'An Extremely Long Movie Title That Should Be Truncated Gracefully Without Breaking the Popup Layout',
        subtitle: '2026 · An Extremely Long Subtitle That Should Also Be Truncated'
      };
      return {
        arrival
      };
    },
    template: \`
      <MmUpNextTemplate>
        <MmArrivalCard :arrival="arrival" />
      </MmUpNextTemplate>
    \`
  })
}`,...B.parameters?.docs?.source}}}})))()}H();export{F as Default,L as Empty,z as Error,R as Loading,B as LongTitle,I as New,V as __namedExportsOrder,P as default};