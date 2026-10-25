import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{A as t,S as n,a as r,l as i,p as a,u as o,w as s}from"./iframe-Dtya5xvD.js";import{n as c,t as l}from"./_plugin-vue_export-helper-ktEZWxTd.js";import{n as u,t as d}from"./MmServiceForm-CwnumjBR.js";import{n as f,t as p}from"./MmServiceSelector-B3L-LNX2.js";function m(e,t){return n(),a(`div`,g,[o(`section`,_,[t[0]||=o(`h2`,{id:`service-connections-title`,class:`settings-template__title`},`Service Connections`,-1),s(e.$slots,`selector`,{},void 0,!0)]),s(e.$slots,`configuration`,{},void 0,!0)])}var h,g,_,v;function y(){return(y=e((()=>{r(),c(),h={},g={class:`settings-template`},_={class:`settings-template__section`,"aria-labelledby":`service-connections-title`},v=l(h,[[`render`,m],[`__scopeId`,`data-v-9bd34200`]]),h.__docgenInfo=Object.assign({displayName:h.name??h.__name},{displayName:`MmSettingsTemplate`,description:``,tags:{},slots:[{name:`selector`},{name:`configuration`}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/templates/MmSettingsTemplate/MmSettingsTemplate.vue`]})})))()}function b(e,n=`jellyfin`){return()=>({components:{MmSettingsTemplate:v,MmServiceSelector:p,MmServiceForm:d},setup(){let r=t(n),a={jellyfin:`https://jellyfin.example.com`,seerr:`https://seerr.example.com`,sonarr:`https://sonarr.example.com`,radarr:`https://radarr.example.com`,qbittorrent:`https://qbittorrent.example.com`};return{selectedService:r,statuses:e,selectedUrl:i(()=>a[r.value]??``),configured:i(()=>(e[r.value]??`not-configured`)!==`not-configured`)}},template:`
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
            />
          </template>
        </mm-settings-template>
      </div>
    `})}var x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{r(),y(),f(),u(),x={title:`Templates/Settings`,component:v,tags:[`autodocs`]},S={jellyfin:`configured`,seerr:`configured`,sonarr:`not-configured`,radarr:`not-configured`,qbittorrent:`not-configured`},C={jellyfin:`connected`,seerr:`connected`,sonarr:`connected`,radarr:`connected`,qbittorrent:`connected`},w={render:b(S)},T={render:b({})},E={render:b(C)},D={render:b({...S,radarr:`failed`},`radarr`)},O=[`Playground`,`FreshInstall`,`AllConnected`,`ConnectionFailed`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: createStory(configuredStatuses)
}`,...w.parameters?.docs?.source},description:{story:`Original MediaManagarr Settings layout.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: createStory({})
}`,...T.parameters?.docs?.source},description:{story:`No services configured.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: createStory(connectedStatuses)
}`,...E.parameters?.docs?.source},description:{story:`All services connected.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: createStory({
    ...configuredStatuses,
    radarr: 'failed'
  }, 'radarr')
}`,...D.parameters?.docs?.source},description:{story:`Radarr selected with a failed connection.`,...D.parameters?.docs?.description}}}})))()}k();export{E as AllConnected,D as ConnectionFailed,T as FreshInstall,w as Playground,O as __namedExportsOrder,x as default};