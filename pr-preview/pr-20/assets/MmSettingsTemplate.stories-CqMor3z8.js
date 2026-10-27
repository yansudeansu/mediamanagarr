import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{P as t,a as n,u as r}from"./iframe-Bx3EHdNZ.js";import{n as i,t as a}from"./MmSettingsTemplate-CWxqrOsI.js";import{n as o,t as s}from"./MmServiceSelector-C6r4Ksh_.js";import{n as c,t as l}from"./MmServiceForm-CW7tDUlu.js";function u(e,n=`jellyfin`){return()=>({components:{MmSettingsTemplate:a,MmServiceSelector:s,MmServiceForm:l},setup(){let i=t(n),a=t(`user-1`),o={jellyfin:`https://jellyfin.example.com`,seerr:`https://seerr.example.com`,sonarr:`https://sonarr.example.com`,radarr:`https://radarr.example.com`,qbittorrent:`https://qbittorrent.example.com`};return{selectedService:i,statuses:e,selectedUrl:r(()=>o[i.value]??``),configured:r(()=>(e[i.value]??`not-configured`)!==`not-configured`),jellyfinUsers:m,jellyfinUserId:a}},template:`
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
    `})}var d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{n(),i(),o(),c(),d={title:`Templates/Settings`,component:a,tags:[`autodocs`]},f={jellyfin:`configured`,seerr:`configured`,sonarr:`not-configured`,radarr:`not-configured`,qbittorrent:`not-configured`},p={jellyfin:`connected`,seerr:`connected`,sonarr:`connected`,radarr:`connected`,qbittorrent:`connected`},m=[{id:`user-1`,name:`Test User 1`},{id:`user-2`,name:`Test User 2`},{id:`user-3`,name:`Test User 3`}],h={render:u(f)},g={render:u({})},_={render:u(p)},v={render:u({...f,radarr:`failed`},`radarr`)},y=[`Playground`,`FreshInstall`,`AllConnected`,`ConnectionFailed`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: createStory(configuredStatuses)
}`,...h.parameters?.docs?.source},description:{story:`Original MediaManagarr Settings layout with configured services.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: createStory({})
}`,...g.parameters?.docs?.source},description:{story:`No services configured.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: createStory(connectedStatuses)
}`,..._.parameters?.docs?.source},description:{story:`All services connected.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: createStory({
    ...configuredStatuses,
    radarr: 'failed'
  }, 'radarr')
}`,...v.parameters?.docs?.source},description:{story:`Radarr selected with a failed connection.`,...v.parameters?.docs?.description}}}})))()}b();export{_ as AllConnected,v as ConnectionFailed,g as FreshInstall,h as Playground,y as __namedExportsOrder,d as default};