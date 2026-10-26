import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{C as t,T as n,a as r,d as i,j as a,m as o,p as s,u as c}from"./iframe-Bq8FMHBt.js";import{n as l,t as u}from"./MmButton-_tt-Lqzq.js";import{n as d,t as f}from"./_plugin-vue_export-helper-ktEZWxTd.js";import{n as p,t as m}from"./MmPagination-DjiyNPbI.js";import{n as h,t as g}from"./MmRequestCard-BYjPAj0y.js";function _(e,r){return t(),o(`div`,y,[i(`header`,b,[r[0]||=i(`div`,{class:`requests-template__heading`},[i(`h2`,{id:`requests-title`,class:`requests-template__title`},`Requests`),i(`p`,{class:`requests-template__description`},`Browse media requests from Seerr.`)],-1),e.$slots.actions?(t(),o(`div`,x,[n(e.$slots,`actions`,{},void 0,!0)])):s(``,!0)]),e.$slots.filters?(t(),o(`section`,S,[n(e.$slots,`filters`,{},void 0,!0)])):s(``,!0),i(`section`,C,[n(e.$slots,`default`,{},void 0,!0)]),e.$slots.pagination?(t(),o(`nav`,w,[n(e.$slots,`pagination`,{},void 0,!0)])):s(``,!0)])}var v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),d(),v={},y={class:`requests-template`},b={class:`requests-template__header`},x={key:0,class:`requests-template__actions`},S={key:0,class:`requests-template__filters`,"aria-label":`Request filters`},C={class:`requests-template__content`,"aria-labelledby":`requests-title`},w={key:1,class:`requests-template__pagination`,"aria-label":`Request pagination`},T=f(v,[[`render`,_],[`__scopeId`,`data-v-866e856b`]]),v.__docgenInfo=Object.assign({displayName:v.name??v.__name},{displayName:`MmRequestsTemplate`,description:``,tags:{},slots:[{name:`actions`},{name:`filters`},{name:`default`},{name:`pagination`}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/templates/MmRequestsTemplate/MmRequestsTemplate.vue`]})})))()}function D(e=`all`){return()=>({components:{MmRequestsTemplate:T,MmRequestCard:g,MmPagination:m,MmButton:u},setup(){let t=a(e),n=a(1),r=c(()=>{if(t.value===`all`)return O;let e=t.value===`pending`?`Pending`:`Approved`;return O.filter(t=>t.status===e)}),i=c(()=>Math.max(1,Math.ceil(r.value.length/A))),o=c(()=>{let e=(n.value-1)*A;return r.value.slice(e,e+A)});function s(e){t.value=e,n.value=1}function l(){t.value=`all`,n.value=1}return{filters:k,activeFilter:t,page:n,totalPages:i,visibleRequests:o,selectFilter:s,reset:l}},template:`
      <MmRequestsTemplate>
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            @click="reset"
          >
            Reset
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

        <MmRequestCard
          v-for="request in visibleRequests"
          :key="request.id"
          :request="request"
        />

        <template v-if="totalPages > 1" #pagination>
          <MmPagination
            v-model:page="page"
            :total-pages="totalPages"
          />
        </template>
      </MmRequestsTemplate>
    `})}var O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{r(),E(),h(),p(),l(),O=[{id:1,type:`movie`,title:`The Emerald Horizon`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Alice`,createdAt:`2026-10-20T12:00:00.000Z`,posterPath:null},{id:2,type:`tv`,title:`Signals from Tomorrow`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Bob`,createdAt:`2026-10-19T09:30:00.000Z`,posterPath:null},{id:3,type:`movie`,title:`Beyond the Glass Moon`,status:`Approved`,mediaStatus:`Processing`,requestedBy:`Charlie`,createdAt:`2026-10-18T16:45:00.000Z`,posterPath:null},{id:4,type:`tv`,title:`The Midnight Archive`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Alice`,createdAt:`2026-10-17T11:20:00.000Z`,posterPath:null},{id:5,type:`movie`,title:`Starlight Over Evermere`,status:`Approved`,mediaStatus:`Available`,requestedBy:`David`,createdAt:`2026-10-16T14:10:00.000Z`,posterPath:null},{id:6,type:`tv`,title:`The Clockwork Garden`,status:`Approved`,mediaStatus:`Partially Available`,requestedBy:`Emma`,createdAt:`2026-10-15T08:00:00.000Z`,posterPath:null},{id:7,type:`movie`,title:`Whispers of the Aurora`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Frank`,createdAt:`2026-10-14T19:25:00.000Z`,posterPath:null},{id:8,type:`tv`,title:`Aether Station Nine`,status:`Approved`,mediaStatus:`Processing`,requestedBy:`Grace`,createdAt:`2026-10-13T10:15:00.000Z`,posterPath:null},{id:9,type:`movie`,title:`The Last Lantern Keeper`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Henry`,createdAt:`2026-10-12T13:40:00.000Z`,posterPath:null},{id:10,type:`tv`,title:`Tales of Silver Hollow`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Isabel`,createdAt:`2026-10-11T17:55:00.000Z`,posterPath:null},{id:11,type:`movie`,title:`Voyage to the Violet Sun`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Jack`,createdAt:`2026-10-10T12:30:00.000Z`,posterPath:null},{id:12,type:`tv`,title:`The Forgotten Observatory`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Kelly`,createdAt:`2026-10-09T09:15:00.000Z`,posterPath:null}],k=[{label:`All`,value:`all`},{label:`Pending`,value:`pending`},{label:`Approved`,value:`approved`}],A=10,j={title:`Templates/RequestsTemplate`,component:T,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px;"><story /></div>`})]},M={render:D()},N={render:D(`pending`)},P={render:D(`approved`)},F={render:()=>({components:{MmRequestsTemplate:T,MmButton:u},setup(){let e=a(`all`);return{filters:k,activeFilter:e}},template:`
      <MmRequestsTemplate>
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
          No requests found.
        </p>
      </MmRequestsTemplate>
    `})},I={render:()=>({components:{MmRequestsTemplate:T},template:`
      <MmRequestsTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading requests…
        </p>
      </MmRequestsTemplate>
    `})},L={render:()=>({components:{MmRequestsTemplate:T,MmButton:u},setup(){let e=a(!1);function t(){e.value=!0}return{retrying:e,retry:t}},template:`
      <MmRequestsTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load requests from Seerr.
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
      </MmRequestsTemplate>
    `})},R=[`Default`,`Pending`,`Approved`,`Empty`,`Loading`,`Error`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: createStory()
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: createStory('pending')
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: createStory('approved')
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmRequestsTemplate,
      MmButton
    },
    setup() {
      const activeFilter = ref<SeerrRequestFilter>('all');
      return {
        filters,
        activeFilter
      };
    },
    template: \`
      <MmRequestsTemplate>
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
          No requests found.
        </p>
      </MmRequestsTemplate>
    \`
  })
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmRequestsTemplate
    },
    template: \`
      <MmRequestsTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading requests…
        </p>
      </MmRequestsTemplate>
    \`
  })
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmRequestsTemplate,
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
      <MmRequestsTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load requests from Seerr.
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
      </MmRequestsTemplate>
    \`
  })
}`,...L.parameters?.docs?.source}}}})))()}z();export{P as Approved,M as Default,F as Empty,L as Error,I as Loading,N as Pending,R as __namedExportsOrder,j as default};