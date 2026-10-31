import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n,u as r}from"./iframe-m9aPkZiu.js";import{n as i,t as a}from"./MmSettingsTemplate-jVLXNIKL.js";import{n as o,t as s}from"./MmServiceSelector-Dg8iW0KM.js";import{n as c,t as l}from"./MmServiceForm-1a_G_x3e.js";function u(e,n=`jellyfin`,i={}){return()=>({components:{MmSettingsTemplate:a,MmServiceSelector:s,MmServiceForm:l},setup(){let a=t(n),o=t(`user-1`),s={jellyfin:`https://jellyfin.example.com`,seerr:`https://seerr.example.com`,sonarr:`https://sonarr.example.com`,radarr:`https://radarr.example.com`,qbittorrent:`https://qbittorrent.example.com`},c=r(()=>s[a.value]??``),l=r(()=>(e[a.value]??`not-configured`)!==`not-configured`);return{selectedService:a,statuses:e,selectedUrl:c,selectedHealth:r(()=>i[a.value]),configured:l,jellyfinUsers:g,jellyfinUserId:o}},template:`
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
              :health="selectedHealth"
              :jellyfin-users="jellyfinUsers"
              :jellyfin-user-id="jellyfinUserId"
              @select-jellyfin-user="jellyfinUserId = $event"
            />
          </template>
        </mm-settings-template>
      </div>
    `})}var d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),i(),o(),c(),d={title:`Templates/Settings`,component:a,tags:[`autodocs`]},f={jellyfin:`configured`,seerr:`configured`,sonarr:`not-configured`,radarr:`not-configured`,qbittorrent:`not-configured`},p={jellyfin:`connected`,seerr:`connected`,sonarr:`connected`,radarr:`connected`,qbittorrent:`connected`},m={jellyfin:{status:`connected`,lastCheckedAt:`2026-10-31T12:00:00.000Z`},seerr:{status:`connected`,lastCheckedAt:`2026-10-31T12:00:00.000Z`},sonarr:{status:`connected`,lastCheckedAt:`2026-10-31T12:00:00.000Z`},radarr:{status:`connected`,lastCheckedAt:`2026-10-31T12:00:00.000Z`},qbittorrent:{status:`connected`,lastCheckedAt:`2026-10-31T12:00:00.000Z`}},h={radarr:{status:`failed`,lastCheckedAt:`2026-10-31T12:00:00.000Z`,error:`Unable to reach the Radarr server.`}},g=[{id:`user-1`,name:`Test User 1`},{id:`user-2`,name:`Test User 2`},{id:`user-3`,name:`Test User 3`}],_={render:u(f)},v={render:u({})},y={render:u(p,`jellyfin`,m)},b={render:u({...f,radarr:`failed`},`radarr`,h)},x=[`Playground`,`FreshInstall`,`AllConnected`,`ConnectionFailed`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: createStory(configuredStatuses)
}`,..._.parameters?.docs?.source},description:{story:`Settings layout with configured services that have not been checked yet.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: createStory({})
}`,...v.parameters?.docs?.source},description:{story:`No services configured.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: createStory(connectedStatuses, 'jellyfin', connectedHealth)
}`,...y.parameters?.docs?.source},description:{story:`All services connected with recorded health checks.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: createStory({
    ...configuredStatuses,
    radarr: 'failed'
  }, 'radarr', failedHealth)
}`,...b.parameters?.docs?.source},description:{story:`Radarr selected with a failed connection and an actionable error.`,...b.parameters?.docs?.description}}}})))()}S();export{y as AllConnected,b as ConnectionFailed,v as FreshInstall,_ as Playground,x as __namedExportsOrder,d as default};