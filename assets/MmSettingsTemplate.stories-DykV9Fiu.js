import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{A as t,S as n,a as r,l as i,p as a,u as o,w as s}from"./iframe-BYBapgUe.js";import{n as c,t as l}from"./_plugin-vue_export-helper-ktEZWxTd.js";import{n as u,t as d}from"./MmServiceForm-CPwpdx2G.js";import{n as f,t as p}from"./MmServiceSelector-D4cyLUWQ.js";function m(e,t){return n(),a(`div`,g,[o(`section`,_,[t[0]||=o(`h2`,{id:`service-connections-title`,class:`settings-template__title`},`Service Connections`,-1),s(e.$slots,`selector`,{},void 0,!0)]),s(e.$slots,`configuration`,{},void 0,!0)])}var h,g,_,v;function y(){return(y=e((()=>{r(),c(),h={},g={class:`settings-template`},_={class:`settings-template__section`,"aria-labelledby":`service-connections-title`},v=l(h,[[`render`,m],[`__scopeId`,`data-v-9bd34200`]]),h.__docgenInfo=Object.assign({displayName:h.name??h.__name},{displayName:`MmSettingsTemplate`,description:``,tags:{},slots:[{name:`selector`},{name:`configuration`}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/templates/MmSettingsTemplate/MmSettingsTemplate.vue`]})})))()}function b(e,n=`jellyfin`){return()=>({components:{MmSettingsTemplate:v,MmServiceSelector:p,MmServiceForm:d},setup(){let r=t(n),a=t(`user-1`),o={jellyfin:`https://jellyfin.example.com`,seerr:`https://seerr.example.com`,sonarr:`https://sonarr.example.com`,radarr:`https://radarr.example.com`,qbittorrent:`https://qbittorrent.example.com`};return{selectedService:r,statuses:e,selectedUrl:i(()=>o[r.value]??``),configured:i(()=>(e[r.value]??`not-configured`)!==`not-configured`),jellyfinUsers:w,jellyfinUserId:a}},template:`
      <div style="width: 340px">
        <mm-settings-template>
          <template #selector>
            <mm-service-selector
              v-model="selectedService"
              :statuses="statuses"
            />
          </template>

          <template #configuration>
            <mm-service-form
              :service-id="selectedService"
              :url="selectedUrl"
              :configured="configured"
              :jellyfin-users="jellyfinUsers"
              :jellyfin-user-id="jellyfinUserId"
              @select-jellyfin-user="jellyfinUserId = $event"
            />
          </template>
        </mm-settings-template>
      </div>
    `})}var x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{r(),y(),f(),u(),x={title:`Templates/Settings`,component:v,tags:[`autodocs`]},S={jellyfin:`configured`,seerr:`configured`,sonarr:`not-configured`,radarr:`not-configured`,qbittorrent:`not-configured`},C={jellyfin:`connected`,seerr:`connected`,sonarr:`connected`,radarr:`connected`,qbittorrent:`connected`},w=[{id:`user-1`,name:`Alice`},{id:`user-2`,name:`Bob`},{id:`user-3`,name:`Charlie`}],T={render:b(S)},E={render:b({})},D={render:b(C)},O={render:b({...S,radarr:`failed`},`radarr`)},k=[`Playground`,`FreshInstall`,`AllConnected`,`ConnectionFailed`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: createStory(configuredStatuses)
}`,...T.parameters?.docs?.source},description:{story:`Original MediaManagarr Settings layout with configured services.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: createStory({})
}`,...E.parameters?.docs?.source},description:{story:`No services configured.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: createStory(connectedStatuses)
}`,...D.parameters?.docs?.source},description:{story:`All services connected.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: createStory({
    ...configuredStatuses,
    radarr: 'failed'
  }, 'radarr')
}`,...O.parameters?.docs?.source},description:{story:`Radarr selected with a failed connection.`,...O.parameters?.docs?.description}}}})))()}A();export{D as AllConnected,O as ConnectionFailed,E as FreshInstall,T as Playground,k as __namedExportsOrder,x as default};