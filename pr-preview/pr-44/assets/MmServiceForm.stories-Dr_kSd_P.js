import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmServiceForm-U-K-hvT3.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{t(),r={title:`Organisms/Service Form`,component:n,tags:[`autodocs`],args:{serviceId:`jellyfin`,url:``,configured:!1,loading:!1,testing:!1,removing:!1,error:``,success:``,health:void 0,jellyfinUsers:[],jellyfinUserId:``,jellyfinUsersLoading:!1,jellyfinUserSaving:!1,jellyfinUsersError:``,jellyfinUserSuccess:``},argTypes:{serviceId:{control:`select`,options:[`jellyfin`,`seerr`,`sonarr`,`radarr`,`qbittorrent`]},url:{control:`text`},configured:{control:`boolean`},loading:{control:`boolean`},testing:{control:`boolean`,description:`Whether the saved connection is currently being tested.`},removing:{control:`boolean`},error:{control:`text`},success:{control:`text`},health:{control:`object`,description:`Persisted connection health, including status, last check time, and optional error.`},jellyfinUserId:{control:`text`},jellyfinUsersLoading:{control:`boolean`},jellyfinUserSaving:{control:`boolean`},jellyfinUsersError:{control:`text`},jellyfinUserSuccess:{control:`text`}},render:e=>({components:{MmServiceForm:n},setup(){return{args:e}},template:`
      <div style="width: 320px">
        <mm-service-form v-bind="args" />
      </div>
    `})},i=[{id:`user-1`,name:`Test User 1`},{id:`user-2`,name:`Test User 2`},{id:`user-3`,name:`Test User 3`}],a={},o={args:{serviceId:`jellyfin`,configured:!1}},s={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},c={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0}},l={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,health:{status:`connected`,lastCheckedAt:`2026-10-31T12:00:00.000Z`},jellyfinUsers:i,jellyfinUserId:`user-1`}},u={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0,health:{status:`failed`,lastCheckedAt:`2026-10-31T12:00:00.000Z`,error:`Unable to reach the Sonarr server.`}}},d={args:{serviceId:`radarr`,url:`https://radarr.example.com`,configured:!0,health:{status:`unknown`,lastCheckedAt:null}}},f={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,loading:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},p={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,success:`Connected to Jellyfin successfully.`,jellyfinUsers:i,jellyfinUserId:`user-1`}},m={args:{serviceId:`radarr`,url:`https://radarr.example.com`,configured:!0,error:`Could not reach the server.`}},h={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0,testing:!1}},g={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,testing:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},_={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0,success:`Connected to Sonarr successfully.`}},v={args:{serviceId:`radarr`,url:`https://radarr.example.com`,configured:!0,error:`The server is temporarily unavailable (HTTP 503). Please try again later.`}},y={args:{serviceId:`seerr`,url:`https://seerr.example.com`,configured:!0,error:`The service is receiving too many requests. Please try again later.`}},b={args:{serviceId:`jellyfin`,configured:!0,url:``,testing:!1}},x={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},S={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,removing:!0,jellyfinUsers:i,jellyfinUserId:`user-1`}},C={args:{serviceId:`jellyfin`,configured:!1,success:`Jellyfin server removed successfully.`}},w={args:{serviceId:`sonarr`,url:`https://sonarr.example.com`,configured:!0,error:`Unable to remove server.`}},T={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-2`}},E={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsersLoading:!0}},D={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsersError:`Unable to load Jellyfin users: HTTP 403.`}},O={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`,jellyfinUserSaving:!0}},k={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-2`,jellyfinUserSuccess:`Jellyfin user saved successfully.`}},A={args:{serviceId:`jellyfin`,url:`https://jellyfin.example.com`,configured:!0,jellyfinUsers:i,jellyfinUserId:`user-1`,jellyfinUsersError:`Unable to save Jellyfin user.`}},j=`Playground.FreshInstall.Configured.Sonarr.HealthConnected.HealthFailed.HealthNotChecked.Loading.ConnectionSuccess.ConnectionError.ReadyToTest.TestingConnection.TestConnectionSuccess.TestConnectionFailed.TestConnectionRateLimited.TestConnectionUnavailable.RemovalConfirmation.Removing.RemovalSuccess.RemovalError.JellyfinUserSelected.JellyfinUsersLoading.JellyfinUsersError.JellyfinUserSaving.JellyfinUserSaved.JellyfinUserSaveError`.split(`.`),a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
    health: {
      status: 'connected',
      lastCheckedAt: '2026-10-31T12:00:00.000Z'
    },
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    health: {
      status: 'failed',
      lastCheckedAt: '2026-10-31T12:00:00.000Z',
      error: 'Unable to reach the Sonarr server.'
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    health: {
      status: 'unknown',
      lastCheckedAt: null
    }
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
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    success: 'Connected to Jellyfin successfully.',
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'Could not reach the server.'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    testing: false
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    testing: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    success: 'Connected to Sonarr successfully.'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'The server is temporarily unavailable (HTTP 503). Please try again later.'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'seerr',
    url: 'https://seerr.example.com',
    configured: true,
    error: 'The service is receiving too many requests. Please try again later.'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    configured: true,
    url: '',
    testing: false
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    removing: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    configured: false,
    success: 'Jellyfin server removed successfully.'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    error: 'Unable to remove server.'
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-2'
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersLoading: true
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersError: 'Unable to load Jellyfin users: HTTP 403.'
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
    jellyfinUserSaving: true
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-2',
    jellyfinUserSuccess: 'Jellyfin user saved successfully.'
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
    jellyfinUsersError: 'Unable to save Jellyfin user.'
  }
}`,...A.parameters?.docs?.source}}}})))()}M();export{s as Configured,m as ConnectionError,p as ConnectionSuccess,o as FreshInstall,l as HealthConnected,u as HealthFailed,d as HealthNotChecked,A as JellyfinUserSaveError,k as JellyfinUserSaved,O as JellyfinUserSaving,T as JellyfinUserSelected,D as JellyfinUsersError,E as JellyfinUsersLoading,f as Loading,a as Playground,h as ReadyToTest,x as RemovalConfirmation,w as RemovalError,C as RemovalSuccess,S as Removing,c as Sonarr,v as TestConnectionFailed,y as TestConnectionRateLimited,_ as TestConnectionSuccess,b as TestConnectionUnavailable,g as TestingConnection,j as __namedExportsOrder,r as default};