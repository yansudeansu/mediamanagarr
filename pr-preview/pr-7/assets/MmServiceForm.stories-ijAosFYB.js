import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmServiceForm-CwnumjBR.js";var r,i,a,o,s,c,l,u;function d(){return(d=e((()=>{t(),r={title:`Organisms/Service Form`,component:n,tags:[`autodocs`],args:{serviceId:`jellyfin`,url:``,configured:!1,loading:!1,error:``},argTypes:{serviceId:{control:`select`,options:[`jellyfin`,`seerr`,`sonarr`,`radarr`,`qbittorrent`]},url:{control:`text`},configured:{control:`boolean`},loading:{control:`boolean`},error:{control:`text`}},render:e=>({components:{MmServiceForm:n},setup(){return{args:e}},template:`
      <div style="width: 320px">
        <mm-service-form v-bind="args" />
      </div>
    `})},i={},a={args:{serviceId:`jellyfin`,configured:!1}},o={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0}},s={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0}},c={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,loading:!0}},l={args:{serviceId:`radarr`,url:`https://radarr.example.com`,configured:!0,error:`Could not reach the server.`}},u=[`Playground`,`FreshInstall`,`Configured`,`Sonarr`,`Loading`,`ConnectionError`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    configured: false
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    loading: true
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'Could not reach the server.'
  }
}`,...l.parameters?.docs?.source}}}})))()}d();export{o as Configured,l as ConnectionError,a as FreshInstall,c as Loading,i as Playground,s as Sonarr,u as __namedExportsOrder,r as default};