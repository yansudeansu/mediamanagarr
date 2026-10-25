import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{A as t,S as n,a as r,f as i,l as a,p as o,u as s,w as c}from"./iframe-DF0nGz2g.js";import{n as l,t as u}from"./MmButton-DeWVT2aN.js";import{n as d,t as f}from"./_plugin-vue_export-helper-ktEZWxTd.js";import{n as p,t as m}from"./MmPagination-BH2aTYQ8.js";import{n as h,t as g}from"./MmRequestCard-DJthNeEk.js";function _(e,t){return n(),o(`div`,y,[s(`header`,b,[t[0]||=s(`div`,{class:`requests-template__heading`},[s(`h2`,{id:`requests-title`,class:`requests-template__title`},`Requests`),s(`p`,{class:`requests-template__description`},`Browse media requests from Seerr.`)],-1),e.$slots.actions?(n(),o(`div`,x,[c(e.$slots,`actions`,{},void 0,!0)])):i(``,!0)]),e.$slots.filters?(n(),o(`section`,S,[c(e.$slots,`filters`,{},void 0,!0)])):i(``,!0),s(`section`,C,[c(e.$slots,`default`,{},void 0,!0)]),e.$slots.pagination?(n(),o(`nav`,w,[c(e.$slots,`pagination`,{},void 0,!0)])):i(``,!0)])}var v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),d(),v={},y={class:`requests-template`},b={class:`requests-template__header`},x={key:0,class:`requests-template__actions`},S={key:0,class:`requests-template__filters`,"aria-label":`Request filters`},C={class:`requests-template__content`,"aria-labelledby":`requests-title`},w={key:1,class:`requests-template__pagination`,"aria-label":`Request pagination`},T=f(v,[[`render`,_],[`__scopeId`,`data-v-866e856b`]]),v.__docgenInfo=Object.assign({displayName:v.name??v.__name},{displayName:`MmRequestsTemplate`,description:``,tags:{},slots:[{name:`actions`},{name:`filters`},{name:`default`},{name:`pagination`}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/templates/MmRequestsTemplate/MmRequestsTemplate.vue`]})})))()}function D(e=`all`){return()=>({components:{MmRequestsTemplate:T,MmRequestCard:g,MmPagination:m,MmButton:u},setup(){let n=t(e),r=t(1),i=a(()=>{if(n.value===`all`)return O;let e=n.value===`pending`?`Pending`:`Approved`;return O.filter(t=>t.status===e)}),o=a(()=>Math.max(1,Math.ceil(i.value.length/A))),s=a(()=>{let e=(r.value-1)*A;return i.value.slice(e,e+A)});function c(e){n.value=e,r.value=1}function l(){n.value=`all`,r.value=1}return{filters:k,activeFilter:n,page:r,totalPages:o,visibleRequests:s,selectFilter:c,reset:l}},template:`
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
    `})}var O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{r(),E(),h(),p(),l(),O=[{id:1,type:`movie`,title:`Dune: Part Two`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Alice`,createdAt:`2026-10-20T12:00:00.000Z`,posterPath:`/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`},{id:2,type:`tv`,title:`The Last of Us`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Bob`,createdAt:`2026-10-19T09:30:00.000Z`,posterPath:`/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg`},{id:3,type:`movie`,title:`Oppenheimer`,status:`Approved`,mediaStatus:`Processing`,requestedBy:`Charlie`,createdAt:`2026-10-18T16:45:00.000Z`,posterPath:`/ptpr0kGAckfQkJeJIt8st5dglvd.jpg`},{id:4,type:`tv`,title:`Severance`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Alice`,createdAt:`2026-10-17T11:20:00.000Z`,posterPath:`/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg`},{id:5,type:`movie`,title:`Interstellar`,status:`Approved`,mediaStatus:`Available`,requestedBy:`David`,createdAt:`2026-10-16T14:10:00.000Z`,posterPath:`/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`},{id:6,type:`tv`,title:`Fallout`,status:`Approved`,mediaStatus:`Partially Available`,requestedBy:`Emma`,createdAt:`2026-10-15T08:00:00.000Z`,posterPath:`/AnsSKRjLqQPNYQTNtOJ8r5hM3Wb.jpg`},{id:7,type:`movie`,title:`The Batman`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Frank`,createdAt:`2026-10-14T19:25:00.000Z`,posterPath:`/74xTEgt7R36Fpooo50r9T25onhq.jpg`},{id:8,type:`tv`,title:`House of the Dragon`,status:`Approved`,mediaStatus:`Processing`,requestedBy:`Grace`,createdAt:`2026-10-13T10:15:00.000Z`,posterPath:`/z2yahl2uefxDCl0nogcRBstwruJ.jpg`},{id:9,type:`movie`,title:`Everything Everywhere All at Once`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Henry`,createdAt:`2026-10-12T13:40:00.000Z`,posterPath:`/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg`},{id:10,type:`tv`,title:`The Bear`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Isabel`,createdAt:`2026-10-11T17:55:00.000Z`,posterPath:`/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg`},{id:11,type:`movie`,title:`Blade Runner 2049`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Jack`,createdAt:`2026-10-10T12:30:00.000Z`,posterPath:`/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg`},{id:12,type:`tv`,title:`Silo`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Kelly`,createdAt:`2026-10-09T09:15:00.000Z`,posterPath:null}],k=[{label:`All`,value:`all`},{label:`Pending`,value:`pending`},{label:`Approved`,value:`approved`}],A=10,j={title:`Templates/RequestsTemplate`,component:T,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px;"><story /></div>`})]},M={render:D()},N={render:D(`pending`)},P={render:D(`approved`)},F={render:()=>({components:{MmRequestsTemplate:T,MmButton:u},setup(){let e=t(`all`);return{filters:k,activeFilter:e}},template:`
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
    `})},L={render:()=>({components:{MmRequestsTemplate:T,MmButton:u},setup(){let e=t(!1);function n(){e.value=!0}return{retrying:e,retry:n}},template:`
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