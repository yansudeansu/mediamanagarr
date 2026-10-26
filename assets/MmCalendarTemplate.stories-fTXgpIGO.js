import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{C as t,T as n,a as r,d as i,h as a,j as o,m as s,p as c,u as l}from"./iframe-Bq8FMHBt.js";import{n as u,t as d}from"./MmButton-_tt-Lqzq.js";import{n as f,t as p}from"./_plugin-vue_export-helper-ktEZWxTd.js";import{a as m,i as h,n as g,o as _,t as v}from"./calendar-date-DtK8QOta.js";import{n as y,t as b}from"./MmCalendarHeader-9a5G877j.js";import{n as x,t as S}from"./MmFilterGroup-CWr1celH.js";import{n as C,t as w}from"./MmCalendarDetails-C-1Tdd-u.js";import{n as T,t as E}from"./MmCalendarGrid-BJwqZaNF.js";function D(e,r){return t(),s(`div`,k,[i(`header`,A,[i(`div`,j,[r[1]||=i(`h2`,{id:`calendar-title`,class:`calendar-template__title`},`Calendar`,-1),i(`p`,M,[n(e.$slots,`description`,{},()=>[r[0]||=a(`Upcoming TV episodes and movie releases.`,-1)],!0)])])]),e.$slots.filters||e.$slots.actions?(t(),s(`section`,N,[e.$slots.filters?(t(),s(`div`,P,[n(e.$slots,`filters`,{},void 0,!0)])):c(``,!0),e.$slots.actions?(t(),s(`div`,F,[n(e.$slots,`actions`,{},void 0,!0)])):c(``,!0)])):c(``,!0),e.$slots.navigation?(t(),s(`section`,I,[n(e.$slots,`navigation`,{},void 0,!0)])):c(``,!0),e.$slots.status?(t(),s(`div`,L,[n(e.$slots,`status`,{},void 0,!0)])):c(``,!0),i(`section`,R,[n(e.$slots,`default`,{},void 0,!0)]),e.$slots.details?(t(),s(`div`,z,[n(e.$slots,`details`,{},void 0,!0)])):c(``,!0)])}var O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{r(),f(),O={},k={class:`calendar-template`},A={class:`calendar-template__header`},j={class:`calendar-template__heading`},M={class:`calendar-template__description`},N={key:0,class:`calendar-template__toolbar`,"aria-label":`Calendar controls`},P={key:0,class:`calendar-template__filters`},F={key:1,class:`calendar-template__actions`},I={key:1,class:`calendar-template__navigation`,"aria-label":`Calendar navigation`},L={key:2,class:`calendar-template__status`},R={class:`calendar-template__content`,"aria-labelledby":`calendar-title`},z={key:3,class:`calendar-template__details`},B=p(O,[[`render`,D],[`__scopeId`,`data-v-cce2ffb0`]]),O.__docgenInfo=Object.assign({displayName:O.name??O.__name},{displayName:`MmCalendarTemplate`,description:``,tags:{},slots:[{name:`description`},{name:`filters`},{name:`actions`},{name:`navigation`},{name:`status`},{name:`default`},{name:`details`}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/templates/MmCalendarTemplate/MmCalendarTemplate.vue`]})})))()}function H(e={}){return()=>({components:{MmCalendarTemplate:B,MmCalendarHeader:b,MmCalendarGrid:E,MmCalendarDetails:w,MmFilterGroup:S,MmButton:d},setup(){let t=`2026-11-05`,n=o(`2026-11-01`),r=o(`2026-11-05`),i=o(`all`),a=o(e.loading??!1),s=o(e.items??U),c=l(()=>i.value===`all`?s.value:s.value.filter(e=>e.type===i.value)),u=l(()=>c.value.filter(e=>g(e.date)===r.value)),d=l(()=>{let e=n.value.slice(0,7);return c.value.filter(t=>g(t.date)?.startsWith(e)).length}),f=l(()=>d.value===1?`1 release this month`:`${d.value} releases this month`);function p(e){(e===`all`||e===`tv`||e===`movie`)&&(i.value=e)}function y(e){r.value=e;let t=`${e.slice(0,7)}-01`;t!==n.value&&(n.value=t)}function b(){let e=m(n.value);e&&(n.value=v(_(e)),r.value=n.value)}function x(){let e=m(n.value);e&&(n.value=v(h(e)),r.value=n.value)}function S(){n.value=`${t.slice(0,7)}-01`,r.value=t}function C(){a.value||(a.value=!0,window.setTimeout(()=>{a.value=!1},600))}return{today:t,month:n,selectedDate:r,activeFilter:i,loading:a,filters:W,filteredItems:c,selectedItems:u,description:f,selectFilter:p,selectDate:y,previousMonth:b,nextMonth:x,goToToday:S,refresh:C}},template:`
      <div style="width: 340px">
        <mm-calendar-template>
          <template #description>
            {{ description }}
          </template>

          <template #filters>
            <mm-filter-group
              :model-value="activeFilter"
              :options="filters"
              aria-label="Calendar filters"
              :disabled="loading"
              @update:model-value="selectFilter"
            />
          </template>

          <template #actions>
            <mm-button
              variant="secondary"
              size="small"
              @click="goToToday"
            >
              Today
            </mm-button>

            <mm-button
              variant="secondary"
              size="small"
              icon="refresh"
              icon-only
              aria-label="Refresh calendar"
              title="Refresh calendar"
              :disabled="loading"
              @click="refresh"
            />
          </template>

          <template #navigation>
            <mm-calendar-header
              :month="month"
              @previous="previousMonth"
              @next="nextMonth"
            />
          </template>

          <template v-if="loading" #status>
            <p role="status">Loading calendar releases…</p>
          </template>

          <mm-calendar-grid
            :month="month"
            :selected-date="selectedDate"
            :today="today"
            :items="filteredItems"
            @select="selectDate"
          />

          <template #details>
            <mm-calendar-details
              :date="selectedDate"
              :items="selectedItems"
              :loading="loading"
            />
          </template>
        </mm-calendar-template>
      </div>
    `})}var U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{r(),V(),y(),T(),C(),x(),u(),U=[{id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`Example Series`,subtitle:`S02E03 · The Adventure`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},{id:`radarr-201`,source:`radarr`,type:`movie`,title:`Example Movie`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},{id:`sonarr-102`,source:`sonarr`,type:`tv`,title:`Another Series`,subtitle:`S01E01 · Pilot`,date:`2026-11-12`,releaseType:`air`,posterUrl:null},{id:`radarr-202`,source:`radarr`,type:`movie`,title:`Another Movie`,subtitle:`2026`,date:`2026-11-20`,releaseType:`physical`,posterUrl:null}],W=[{label:`All`,value:`all`},{label:`TV`,value:`tv`},{label:`Movies`,value:`movie`}],G={title:`Templates/Calendar`,component:B,tags:[`autodocs`]},K={render:H()},q={render:H({items:[]})},J={render:H({loading:!0})},Y={render:H({items:U.filter(e=>e.type===`tv`)})},X={render:H({items:U.filter(e=>e.type===`movie`)})},Z=[`Playground`,`Empty`,`Loading`,`TvReleases`,`MovieReleases`],K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: createStory()
}`,...K.parameters?.docs?.source},description:{story:`Interactive calendar with TV episodes and movie releases.`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: createStory({
    items: []
  })
}`,...q.parameters?.docs?.source},description:{story:`Calendar without scheduled releases.`,...q.parameters?.docs?.description}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: createStory({
    loading: true
  })
}`,...J.parameters?.docs?.source},description:{story:`Calendar displaying its loading state.`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: createStory({
    items: items.filter(item => item.type === 'tv')
  })
}`,...Y.parameters?.docs?.source},description:{story:`Calendar containing only TV releases.`,...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: createStory({
    items: items.filter(item => item.type === 'movie')
  })
}`,...X.parameters?.docs?.source},description:{story:`Calendar containing only movie releases.`,...X.parameters?.docs?.description}}}})))()}Q();export{q as Empty,J as Loading,X as MovieReleases,K as Playground,Y as TvReleases,Z as __namedExportsOrder,G as default};