import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmServiceForm-CixVF6oi.js";var r,i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{t(),r={title:`Organisms/Service Form`,component:n,tags:[`autodocs`],args:{serviceId:`jellyfin`,url:``,configured:!1,loading:!1,error:``,jellyfinUsers:[],jellyfinUserId:``,jellyfinUsersLoading:!1,jellyfinUserSaving:!1,jellyfinUsersError:``},argTypes:{serviceId:{control:`select`,options:[`jellyfin`,`seerr`,`sonarr`,`radarr`,`qbittorrent`]},url:{control:`text`},configured:{control:`boolean`},loading:{control:`boolean`},error:{control:`text`},jellyfinUserId:{control:`text`},jellyfinUsersLoading:{control:`boolean`},jellyfinUserSaving:{control:`boolean`},jellyfinUsersError:{control:`text`}},render:e=>({components:{MmServiceForm:n},setup(){return{args:e}},template:`
      <div style="width: 320px">
        <mm-service-form v-bind="args" />
      </div>
    `})},i=[{id:`user-1`,name:`Alice`},{id:`user-2`,name:`Bob`},{id:`user-3`,name:`Charlie`}],a={},o={args:{serviceId:`jellyfin`,configured:!1}},s={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},c={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-2`}},l={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsersLoading:!0}},u={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsersError:`Unable to load Jellyfin users: HTTP 403.`}},d={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0}},f={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,loading:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},p={args:{serviceId:`radarr`,url:`https://radarr.example.com`,configured:!0,error:`Could not reach the server.`}},m=[`Playground`,`FreshInstall`,`Configured`,`JellyfinUserSelected`,`JellyfinUsersLoading`,`JellyfinUsersError`,`Sonarr`,`Loading`,`ConnectionError`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    configured: false
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-2'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersLoading: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersError: 'Unable to load Jellyfin users: HTTP 403.'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    loading: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'Could not reach the server.'
  }
}`,...p.parameters?.docs?.source}}}})))()}h();export{s as Configured,p as ConnectionError,o as FreshInstall,c as JellyfinUserSelected,u as JellyfinUsersError,l as JellyfinUsersLoading,f as Loading,a as Playground,d as Sonarr,m as __namedExportsOrder,r as default};