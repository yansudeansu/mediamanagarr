import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n,u as r}from"./iframe-CxiWiTrG.js";import{n as i,t as a}from"./MmButton-DoHUv7-w.js";import{n as o,t as s}from"./MmFilterGroup-BBlogcn6.js";import{n as c,t as l}from"./MmCalendarTemplate-DBzJof3B.js";import{a as u,n as d,o as f,s as p,t as m}from"./calendar-date-eYd9mfWA.js";import{n as h,t as g}from"./MmCalendarHeader-DhShyhhm.js";import{n as _,t as v}from"./MmCalendarGrid-DSXva_ia.js";import{n as y,t as b}from"./MmCalendarDetails-CDlyuI9g.js";function x(e={}){return()=>({components:{MmCalendarTemplate:l,MmCalendarHeader:g,MmCalendarGrid:v,MmCalendarDetails:b,MmFilterGroup:s,MmButton:a},setup(){let n=`2026-11-05`,i=t(`2026-11-01`),a=t(`2026-11-05`),o=t(`all`),s=t(e.loading??!1),c=t(e.items??S),l=r(()=>o.value===`all`?c.value:c.value.filter(e=>e.type===o.value)),h=r(()=>l.value.filter(e=>d(e.date)===a.value)),g=r(()=>{let e=i.value.slice(0,7);return l.value.filter(t=>d(t.date)?.startsWith(e)).length}),_=r(()=>g.value===1?`1 release this month`:`${g.value} releases this month`);function v(e){(e===`all`||e===`tv`||e===`movie`)&&(o.value=e)}function y(e){a.value=e;let t=`${e.slice(0,7)}-01`;t!==i.value&&(i.value=t)}function b(){let e=f(i.value);e&&(i.value=m(p(e)),a.value=i.value)}function x(){let e=f(i.value);e&&(i.value=m(u(e)),a.value=i.value)}function w(){i.value=`${n.slice(0,7)}-01`,a.value=n}function T(){s.value||(s.value=!0,window.setTimeout(()=>{s.value=!1},600))}return{today:n,month:i,selectedDate:a,activeFilter:o,loading:s,filters:C,filteredItems:l,selectedItems:h,description:_,selectFilter:v,selectDate:y,previousMonth:b,nextMonth:x,goToToday:w,refresh:T}},template:`
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
    `})}var S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{n(),c(),h(),_(),y(),o(),i(),S=[{id:`sonarr-101`,source:`sonarr`,type:`tv`,title:`TV Show 1`,subtitle:`S02E03 · Episode 3`,date:`2026-11-05`,releaseType:`air`,posterUrl:null},{id:`radarr-201`,source:`radarr`,type:`movie`,title:`Movie 1`,subtitle:`2026`,date:`2026-11-05`,releaseType:`digital`,posterUrl:null},{id:`sonarr-102`,source:`sonarr`,type:`tv`,title:`TV Show 2`,subtitle:`S01E01 · Episode 1`,date:`2026-11-12`,releaseType:`air`,posterUrl:null},{id:`radarr-202`,source:`radarr`,type:`movie`,title:`Movie 2`,subtitle:`2026`,date:`2026-11-20`,releaseType:`physical`,posterUrl:null}],C=[{label:`All`,value:`all`},{label:`TV`,value:`tv`},{label:`Movies`,value:`movie`}],w={title:`Templates/Calendar`,component:l,tags:[`autodocs`]},T={render:x()},E={render:x({items:[]})},D={render:x({loading:!0})},O={render:x({items:S.filter(e=>e.type===`tv`)})},k={render:x({items:S.filter(e=>e.type===`movie`)})},A=[`Playground`,`Empty`,`Loading`,`TvReleases`,`MovieReleases`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: createStory()
}`,...T.parameters?.docs?.source},description:{story:`Interactive calendar with TV episodes and movie releases.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: createStory({
    items: []
  })
}`,...E.parameters?.docs?.source},description:{story:`Calendar without scheduled releases.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: createStory({
    loading: true
  })
}`,...D.parameters?.docs?.source},description:{story:`Calendar displaying its loading state.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: createStory({
    items: items.filter(item => item.type === 'tv')
  })
}`,...O.parameters?.docs?.source},description:{story:`Calendar containing only TV releases.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: createStory({
    items: items.filter(item => item.type === 'movie')
  })
}`,...k.parameters?.docs?.source},description:{story:`Calendar containing only movie releases.`,...k.parameters?.docs?.description}}}})))()}j();export{E as Empty,D as Loading,k as MovieReleases,T as Playground,O as TvReleases,A as __namedExportsOrder,w as default};