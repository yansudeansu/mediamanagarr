import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,M as n,a as r}from"./iframe-m9aPkZiu.js";import{n as i,t as a}from"./MmServiceSelector-Dg8iW0KM.js";var o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{r(),i(),o={title:`Organisms/Service Selector`,component:a,tags:[`autodocs`],argTypes:{modelValue:{control:`select`,options:[null,`jellyfin`,`seerr`,`sonarr`,`radarr`,`qbittorrent`],description:`Currently selected service.`},statuses:{control:`object`,description:`Connection status for each service.`},disabled:{control:`boolean`,description:`Disables interaction with all services.`}},args:{modelValue:`jellyfin`,statuses:{jellyfin:`configured`,seerr:`configured`,sonarr:`not-configured`,radarr:`not-configured`,qbittorrent:`not-configured`},disabled:!1},render:e=>({components:{MmServiceSelector:a},setup(){let r=t(e.modelValue??null);return n(()=>e.modelValue,e=>{r.value=e??null}),{args:e,selected:r}},template:`
      <div style="width: 320px">
        <mm-service-selector
          v-bind="args"
          v-model="selected"
        />
      </div>
    `})},s={},c={args:{modelValue:null,statuses:{}}},l={args:{modelValue:`jellyfin`,statuses:{jellyfin:`configured`,seerr:`configured`,sonarr:`not-configured`,radarr:`not-configured`,qbittorrent:`not-configured`}}},u={args:{modelValue:`jellyfin`,statuses:{jellyfin:`connected`,seerr:`connected`,sonarr:`connected`,radarr:`connected`,qbittorrent:`connected`}}},d={args:{modelValue:`radarr`,statuses:{jellyfin:`connected`,seerr:`configured`,sonarr:`connected`,radarr:`failed`,qbittorrent:`not-configured`}}},f={args:{disabled:!0}},p=[`Playground`,`FreshInstall`,`PartiallyConfigured`,`AllConnected`,`ConnectionFailed`,`Disabled`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Interactive service selection.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: null,
    statuses: {}
  }
}`,...c.parameters?.docs?.source},description:{story:`No services have been configured yet.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'jellyfin',
    statuses: {
      jellyfin: 'configured',
      seerr: 'configured',
      sonarr: 'not-configured',
      radarr: 'not-configured',
      qbittorrent: 'not-configured'
    }
  }
}`,...l.parameters?.docs?.source},description:{story:`Some services have saved configuration.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'jellyfin',
    statuses: {
      jellyfin: 'connected',
      seerr: 'connected',
      sonarr: 'connected',
      radarr: 'connected',
      qbittorrent: 'connected'
    }
  }
}`,...u.parameters?.docs?.source},description:{story:`All services are connected.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'radarr',
    statuses: {
      jellyfin: 'connected',
      seerr: 'configured',
      sonarr: 'connected',
      radarr: 'failed',
      qbittorrent: 'not-configured'
    }
  }
}`,...d.parameters?.docs?.source},description:{story:`A service has failed its connection test.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...f.parameters?.docs?.source},description:{story:`All service rows are disabled.`,...f.parameters?.docs?.description}}}})))()}m();export{u as AllConnected,d as ConnectionFailed,f as Disabled,c as FreshInstall,l as PartiallyConfigured,s as Playground,p as __namedExportsOrder,o as default};