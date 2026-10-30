import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmServiceForm-BquEsga3.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{t(),r={title:`Organisms/Service Form`,component:n,tags:[`autodocs`],args:{serviceId:`jellyfin`,url:``,configured:!1,loading:!1,removing:!1,error:``,success:``,jellyfinUsers:[],jellyfinUserId:``,jellyfinUsersLoading:!1,jellyfinUserSaving:!1,jellyfinUsersError:``,jellyfinUserSuccess:``},argTypes:{serviceId:{control:`select`,options:[`jellyfin`,`seerr`,`sonarr`,`radarr`,`qbittorrent`]},url:{control:`text`},configured:{control:`boolean`},loading:{control:`boolean`},removing:{control:`boolean`},error:{control:`text`},success:{control:`text`},jellyfinUserId:{control:`text`},jellyfinUsersLoading:{control:`boolean`},jellyfinUserSaving:{control:`boolean`},jellyfinUsersError:{control:`text`},jellyfinUserSuccess:{control:`text`}},render:e=>({components:{MmServiceForm:n},setup(){return{args:e}},template:`
      <div style="width: 320px">
        <mm-service-form v-bind="args" />
      </div>
    `})},i=[{id:`user-1`,name:`Test User 1`},{id:`user-2`,name:`Test User 2`},{id:`user-3`,name:`Test User 3`}],a={},o={args:{serviceId:`jellyfin`,configured:!1}},s={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},c={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0}},l={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,loading:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},u={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,success:`Connected to Jellyfin successfully.`,jellyfinUsers:i,jellyfinUserId:`user-1`}},d={args:{serviceId:`radarr`,url:`https://radarr.example.com`,configured:!0,error:`Could not reach the server.`}},f={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},p={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,removing:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},m={args:{serviceId:`jellyfin`,configured:!1,success:`Jellyfin server removed successfully.`}},h={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0,error:`Unable to remove server.`}},g={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-2`}},_={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsersLoading:!0}},v={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsersError:`Unable to load Jellyfin users: HTTP 403.`}},y={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`,jellyfinUserSaving:!0}},b={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-2`,jellyfinUserSuccess:`Jellyfin user saved successfully.`}},x={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`,jellyfinUsersError:`Unable to save Jellyfin user.`}},S=[`Playground`,`FreshInstall`,`Configured`,`Sonarr`,`Loading`,`ConnectionSuccess`,`ConnectionError`,`RemovalConfirmation`,`Removing`,`RemovalSuccess`,`RemovalError`,`JellyfinUserSelected`,`JellyfinUsersLoading`,`JellyfinUsersError`,`JellyfinUserSaving`,`JellyfinUserSaved`,`JellyfinUserSaveError`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    loading: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    success: 'Connected to Jellyfin successfully.',
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'Could not reach the server.'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    removing: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    configured: false,
    success: 'Jellyfin server removed successfully.'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    error: 'Unable to remove server.'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-2'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersLoading: true
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersError: 'Unable to load Jellyfin users: HTTP 403.'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
    jellyfinUserSaving: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-2',
    jellyfinUserSuccess: 'Jellyfin user saved successfully.'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
    jellyfinUsersError: 'Unable to save Jellyfin user.'
  }
}`,...x.parameters?.docs?.source}}}})))()}C();export{s as Configured,d as ConnectionError,u as ConnectionSuccess,o as FreshInstall,x as JellyfinUserSaveError,b as JellyfinUserSaved,y as JellyfinUserSaving,g as JellyfinUserSelected,v as JellyfinUsersError,_ as JellyfinUsersLoading,l as Loading,a as Playground,f as RemovalConfirmation,h as RemovalError,m as RemovalSuccess,p as Removing,c as Sonarr,S as __namedExportsOrder,r as default};