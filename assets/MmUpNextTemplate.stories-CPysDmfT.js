import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,M as n,a as r,u as i}from"./iframe-CS7GQ-tH.js";import{n as a,t as o}from"./MmButton-BPbSDiIy.js";import{n as s,t as c}from"./MmPagination-B4DueSQg.js";import{n as l,t as u}from"./MmUpNextTemplate-nZq3tEt4.js";import{n as d,t as f}from"./MmArrivalCard-BgObPpQ7.js";function p(e=`all`){return()=>({components:{MmUpNextTemplate:u,MmArrivalCard:f,MmPagination:c,MmButton:o},setup(){let r=t(h.map(e=>({...e}))),a=t(e),o=t(1),s=i(()=>r.value.filter(e=>e.unread).length),c=i(()=>a.value===`new`?r.value.filter(e=>e.unread):r.value),l=i(()=>Math.max(1,Math.ceil(c.value.length/m))),u=i(()=>{let e=(o.value-1)*m;return c.value.slice(e,e+m)}),d=i(()=>s.value>0?`${s.value} new · ${r.value.length} unwatched items`:`${r.value.length} unwatched items`);n(l,e=>{o.value>e&&(o.value=e)});function f(e){a.value=e,o.value=1}function p(e,t){r.value=r.value.map(n=>n.id===e?{...n,unread:t}:n)}function _(){r.value=r.value.map(e=>({...e,unread:!1}))}function v(){r.value=h.map(e=>({...e})),a.value=`all`,o.value=1}return{filters:g,activeFilter:a,page:o,totalPages:l,visibleArrivals:u,unreadCount:s,description:d,selectFilter:f,toggleUnread:p,clearNotifications:_,refresh:v}},template:`
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
    `})}var m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{r(),l(),d(),s(),a(),m=10,h=[{id:`movie-1`,type:`Movie`,title:`Movie 1`,subtitle:`2024`,dateAdded:`2026-10-24T18:30:00.000Z`,imageId:`movie-1`,imageTag:null,unread:!0},{id:`episode-2`,type:`Episode`,title:`Episode 1`,subtitle:`TV Show 1 · S01E09`,dateAdded:`2026-10-23T14:15:00.000Z`,imageId:`series-2`,imageTag:null,unread:!0},{id:`movie-3`,type:`Movie`,title:`Movie 2`,subtitle:`2014`,dateAdded:`2026-10-22T11:00:00.000Z`,imageId:`movie-3`,imageTag:null,unread:!1},{id:`episode-4`,type:`Episode`,title:`Episode 2`,subtitle:`TV Show 2 · S01E01`,dateAdded:`2026-10-21T20:45:00.000Z`,imageId:`series-4`,imageTag:null,unread:!0},{id:`movie-5`,type:`Movie`,title:`Movie 3`,subtitle:`2023`,dateAdded:`2026-10-20T09:30:00.000Z`,imageId:`movie-5`,imageTag:null,unread:!1},{id:`episode-6`,type:`Episode`,title:`Episode 3`,subtitle:`TV Show 3 · S01E01`,dateAdded:`2026-10-19T16:00:00.000Z`,imageId:`series-6`,imageTag:null,unread:!1},{id:`movie-7`,type:`Movie`,title:`Movie 4`,subtitle:`2022`,dateAdded:`2026-10-18T13:20:00.000Z`,imageId:`movie-7`,imageTag:null,unread:!1},{id:`episode-8`,type:`Episode`,title:`Episode 4`,subtitle:`TV Show 4 · S01E01`,dateAdded:`2026-10-17T08:45:00.000Z`,imageId:`series-8`,imageTag:null,unread:!0},{id:`movie-9`,type:`Movie`,title:`Movie 5`,subtitle:`2022`,dateAdded:`2026-10-16T17:10:00.000Z`,imageId:`movie-9`,imageTag:null,unread:!1},{id:`episode-10`,type:`Episode`,title:`Episode 5`,subtitle:`TV Show 5 · S01E10`,dateAdded:`2026-10-15T12:00:00.000Z`,imageId:`series-10`,imageTag:null,unread:!1},{id:`movie-11`,type:`Movie`,title:`Movie 6`,subtitle:`2017`,dateAdded:`2026-10-14T10:00:00.000Z`,imageId:`movie-11`,imageTag:null,unread:!0},{id:`episode-12`,type:`Episode`,title:`Episode 6`,subtitle:`TV Show 6 · S01E01`,dateAdded:`2026-10-13T19:30:00.000Z`,imageId:`series-12`,imageTag:null,unread:!1}],g=[{label:`All`,value:`all`},{label:`New`,value:`new`}],_={title:`Templates/UpNextTemplate`,component:u,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},v={render:p()},y={render:p(`new`)},b={render:()=>({components:{MmUpNextTemplate:u,MmButton:o},setup(){let e=t(`all`);return{filters:g,activeFilter:e}},template:`
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
    `})},x={render:()=>({components:{MmUpNextTemplate:u},template:`
      <MmUpNextTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading arrivals…
        </p>
      </MmUpNextTemplate>
    `})},S={render:()=>({components:{MmUpNextTemplate:u,MmButton:o},setup(){let e=t(!1);function n(){e.value=!0}return{retrying:e,retry:n}},template:`
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
    `})},C={render:()=>({components:{MmUpNextTemplate:u,MmArrivalCard:f},setup(){return{arrival:{...h[0],title:`Movie 1 — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing`,subtitle:`2026 · Extended Edition With an Extremely Long Subtitle for Layout Testing`}}},template:`
      <MmUpNextTemplate>
        <MmArrivalCard :arrival="arrival" />
      </MmUpNextTemplate>
    `})},w=[`Default`,`New`,`Empty`,`Loading`,`Error`,`LongTitle`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: createStory()
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: createStory('new')
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmUpNextTemplate,
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmUpNextTemplate,
      MmArrivalCard
    },
    setup() {
      const arrival: JellyfinArrival = {
        ...mockArrivals[0]!,
        title: 'Movie 1 — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing',
        subtitle: '2026 · Extended Edition With an Extremely Long Subtitle for Layout Testing'
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
}`,...C.parameters?.docs?.source}}}})))()}T();export{v as Default,b as Empty,S as Error,x as Loading,C as LongTitle,y as New,w as __namedExportsOrder,_ as default};