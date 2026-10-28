import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n,u as r}from"./iframe-B9L0hNSe.js";import{n as i,t as a}from"./MmButton-CADGR_Oi.js";import{n as o,t as s}from"./MmRequestsTemplate--L5-JsKb.js";import{n as c,t as l}from"./MmRequestCard-S3aMLstV.js";import{n as u,t as d}from"./MmPagination-BSVra2z8.js";function f(e=`all`){return()=>({components:{MmRequestsTemplate:s,MmRequestCard:l,MmPagination:d,MmButton:a},setup(){let n=t(e),i=t(1),a=r(()=>{if(n.value===`all`)return p;let e=n.value===`pending`?`Pending`:`Approved`;return p.filter(t=>t.status===e)}),o=r(()=>Math.max(1,Math.ceil(a.value.length/h))),s=r(()=>{let e=(i.value-1)*h;return a.value.slice(e,e+h)});function c(e){n.value=e,i.value=1}function l(){n.value=`all`,i.value=1}return{filters:m,activeFilter:n,page:i,totalPages:o,visibleRequests:s,selectFilter:c,reset:l}},template:`
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
    `})}var p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{n(),o(),c(),u(),i(),p=[{id:1,type:`movie`,title:`Movie 1`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Test User 1`,createdAt:`2026-10-20T12:00:00.000Z`,posterPath:null},{id:2,type:`tv`,title:`TV Show 1`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Test User 2`,createdAt:`2026-10-19T09:30:00.000Z`,posterPath:null},{id:3,type:`movie`,title:`Movie 2`,status:`Approved`,mediaStatus:`Processing`,requestedBy:`Test User 3`,createdAt:`2026-10-18T16:45:00.000Z`,posterPath:null},{id:4,type:`tv`,title:`TV Show 2`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Test User 1`,createdAt:`2026-10-17T11:20:00.000Z`,posterPath:null},{id:5,type:`movie`,title:`Movie 3`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Test User 4`,createdAt:`2026-10-16T14:10:00.000Z`,posterPath:null},{id:6,type:`tv`,title:`TV Show 3`,status:`Approved`,mediaStatus:`Partially Available`,requestedBy:`Test User 5`,createdAt:`2026-10-15T08:00:00.000Z`,posterPath:null},{id:7,type:`movie`,title:`Movie 4`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Test User 6`,createdAt:`2026-10-14T19:25:00.000Z`,posterPath:null},{id:8,type:`tv`,title:`TV Show 4`,status:`Approved`,mediaStatus:`Processing`,requestedBy:`Test User 7`,createdAt:`2026-10-13T10:15:00.000Z`,posterPath:null},{id:9,type:`movie`,title:`Movie 5`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Test User 8`,createdAt:`2026-10-12T13:40:00.000Z`,posterPath:null},{id:10,type:`tv`,title:`TV Show 5`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Test User 9`,createdAt:`2026-10-11T17:55:00.000Z`,posterPath:null},{id:11,type:`movie`,title:`Movie 6`,status:`Approved`,mediaStatus:`Available`,requestedBy:`Test User 10`,createdAt:`2026-10-10T12:30:00.000Z`,posterPath:null},{id:12,type:`tv`,title:`TV Show 6`,status:`Pending`,mediaStatus:`Pending`,requestedBy:`Test User 11`,createdAt:`2026-10-09T09:15:00.000Z`,posterPath:null}],m=[{label:`All`,value:`all`},{label:`Pending`,value:`pending`},{label:`Approved`,value:`approved`}],h=10,g={title:`Templates/RequestsTemplate`,component:s,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},_={render:f()},v={render:f(`pending`)},y={render:f(`approved`)},b={render:()=>({components:{MmRequestsTemplate:s,MmButton:a},setup(){let e=t(`all`);return{filters:m,activeFilter:e}},template:`
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
    `})},x={render:()=>({components:{MmRequestsTemplate:s},template:`
      <MmRequestsTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading requests…
        </p>
      </MmRequestsTemplate>
    `})},S={render:()=>({components:{MmRequestsTemplate:s,MmButton:a},setup(){let e=t(!1);function n(){e.value=!0}return{retrying:e,retry:n}},template:`
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
    `})},C=[`Default`,`Pending`,`Approved`,`Empty`,`Loading`,`Error`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: createStory()
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: createStory('pending')
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: createStory('approved')
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}}})))()}w();export{y as Approved,_ as Default,b as Empty,S as Error,x as Loading,v as Pending,C as __namedExportsOrder,g as default};