import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{C as t,a as n}from"./iframe-CS7GQ-tH.js";import{n as r,t as i}from"./MmServiceForm-DNak63UX.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{n(),r(),{fn:a}=__STORYBOOK_MODULE_TEST__,o=[{label:`Test User 1`,value:`user-1`},{label:`Test User 2`,value:`user-2`},{label:`Test User 3`,value:`user-3`}],s=`https://jellyfin.example.com`,c=`https://sonarr.example.com`,l=`https://radarr.example.com`,u=`https://seerr.example.com`,d={userSelectionLabel:`Jellyfin User`,userSelectionHint:`Select the Jellyfin user whose library should be displayed.`,userOptions:o,selectedUserId:`user-1`,removalNote:`The selected Jellyfin user will also be cleared.`},f={title:`Organisms/Service Form`,component:i,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Presentational configuration form. The parent supplies service metadata, saved-key reuse permission, connection health, and optional user selection. The parent also owns URL normalization, connection persistence, health checks, and removal.`}}},args:{name:`Jellyfin`,description:`Recently added movies and episodes`,url:``,configured:!1,loading:!1,testing:!1,removing:!1,error:``,success:``,healthStatus:`not-checked`,healthLastCheckedLabel:``,healthError:``,canReuseSavedKey:!1,userSelectionLabel:``,userSelectionHint:``,userOptions:[],selectedUserId:``,usersLoading:!1,userSaving:!1,usersError:``,userSuccess:``,removalNote:``,onConnect:a(),onTestConnection:a(),onRemove:a(),onSelectUser:a(),onEdit:a()},argTypes:{name:{control:`text`,description:`Display name of the configured service.`},description:{control:`text`,description:`Short description shown beneath the service name.`},url:{control:`text`,description:`Saved server URL.`},configured:{control:`boolean`,description:`Whether the service has a saved configuration.`},loading:{control:`boolean`,description:`Whether connection setup is in progress.`},testing:{control:`boolean`,description:`Whether the saved connection is being tested.`},removing:{control:`boolean`,description:`Whether server removal is in progress.`},error:{control:`text`,description:`Connection or removal error.`},success:{control:`text`,description:`Connection or removal success message.`},healthStatus:{control:`select`,options:[`connected`,`failed`,`not-checked`],description:`Presentation status of the saved connection.`},healthLastCheckedLabel:{control:`text`,description:`Already-formatted label for the last health check.`},healthError:{control:`text`,description:`Error from the most recent health check.`},canReuseSavedKey:{control:`boolean`,description:`Whether a blank API key may reuse saved credentials.`},userSelectionLabel:{control:`text`,description:`Optional user-selector label. Empty hides the selector.`},userSelectionHint:{control:`text`,description:`Optional explanatory text for user selection.`},userOptions:{control:`object`,description:`Generic user options with label and value fields.`},selectedUserId:{control:`text`,description:`Currently selected user ID.`},usersLoading:{control:`boolean`,description:`Whether user options are loading.`},userSaving:{control:`boolean`,description:`Whether the selected user is being saved.`},usersError:{control:`text`,description:`User loading or saving error.`},userSuccess:{control:`text`,description:`User selection success feedback.`},removalNote:{control:`text`,description:`Optional additional note in removal confirmation.`}},render:e=>({components:{MmServiceForm:i},setup(){return{args:e}},template:`
      <div style="width: min(420px, 90vw)">
        <mm-service-form v-bind="args" />
      </div>
    `})},p={},m={args:{name:`Jellyfin`,configured:!1}},h={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d}},g={args:{name:`Sonarr`,description:`TV series management`,url:c,configured:!0,canReuseSavedKey:!0}},_={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,healthStatus:`connected`,healthLastCheckedLabel:`October 31, 2026 at 12:00`,...d}},v={args:{name:`Sonarr`,description:`TV series management`,url:c,configured:!0,canReuseSavedKey:!0,healthStatus:`failed`,healthLastCheckedLabel:`October 31, 2026 at 12:00`,healthError:`Unable to reach the Sonarr server.`}},y={args:{name:`Radarr`,description:`Movie management`,url:l,configured:!0,canReuseSavedKey:!0,healthStatus:`not-checked`}},b={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,loading:!0,...d}},x={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,success:`Connected to Jellyfin successfully.`,...d}},S={args:{name:`Radarr`,description:`Movie management`,url:l,configured:!0,canReuseSavedKey:!0,error:`Could not reach the server.`}},C={args:{name:`Sonarr`,description:`TV series management`,url:c,configured:!0,canReuseSavedKey:!0}},w={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,testing:!0,...d}},T={args:{name:`Sonarr`,description:`TV series management`,url:c,configured:!0,canReuseSavedKey:!0,success:`Connected to Sonarr successfully.`}},E={args:{name:`Radarr`,description:`Movie management`,url:l,configured:!0,canReuseSavedKey:!0,error:`The server is temporarily unavailable (HTTP 503). Please try again later.`}},D={args:{name:`Seerr`,description:`Media requests`,url:u,configured:!0,canReuseSavedKey:!0,error:`The service is receiving too many requests. Please try again later.`}},O={args:{name:`Jellyfin`,configured:!0,url:``,canReuseSavedKey:!1}},k={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d},render:e=>({components:{MmServiceForm:i},setup(){async function n(e){e&&(await t(),Array.from(e.querySelectorAll(`button`)).find(e=>e.textContent?.trim()===`Remove server`)?.click())}return{args:e,openConfirmation:n}},template:`
      <div
        style="width: min(420px, 90vw)"
        :ref="openConfirmation"
      >
        <mm-service-form v-bind="args" />
      </div>
    `})},A={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,removing:!0,...d}},j={args:{name:`Jellyfin`,configured:!1,success:`Jellyfin server removed successfully.`}},M={args:{name:`Sonarr`,description:`TV series management`,url:c,configured:!0,canReuseSavedKey:!0,error:`Unable to remove server.`}},N={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d,selectedUserId:`user-2`}},P={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d,userOptions:[],usersLoading:!0}},F={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d,userOptions:[],usersError:`Unable to load Jellyfin users: HTTP 403.`}},I={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d,userSaving:!0}},L={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d,selectedUserId:`user-2`,userSuccess:`Jellyfin user saved successfully.`}},R={args:{name:`Jellyfin`,url:s,configured:!0,canReuseSavedKey:!0,...d,usersError:`Unable to save Jellyfin user.`}},z=`Playground.FreshInstall.Configured.Sonarr.HealthConnected.HealthFailed.HealthNotChecked.Loading.ConnectionSuccess.ConnectionError.ReadyToTest.TestingConnection.TestConnectionSuccess.TestConnectionFailed.TestConnectionRateLimited.TestConnectionUnavailable.RemovalConfirmation.Removing.RemovalSuccess.RemovalError.JellyfinUserSelected.JellyfinUsersLoading.JellyfinUsersError.JellyfinUserSaving.JellyfinUserSaved.JellyfinUserSaveError`.split(`.`),p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    configured: false
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    healthStatus: 'connected',
    healthLastCheckedLabel: 'October 31, 2026 at 12:00',
    ...jellyfinUserProps
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
    healthStatus: 'failed',
    healthLastCheckedLabel: 'October 31, 2026 at 12:00',
    healthError: 'Unable to reach the Sonarr server.'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Radarr',
    description: 'Movie management',
    url: radarrUrl,
    configured: true,
    canReuseSavedKey: true,
    healthStatus: 'not-checked'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    loading: true,
    ...jellyfinUserProps
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    success: 'Connected to Jellyfin successfully.',
    ...jellyfinUserProps
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Radarr',
    description: 'Movie management',
    url: radarrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'Could not reach the server.'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    testing: true,
    ...jellyfinUserProps
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
    success: 'Connected to Sonarr successfully.'
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Radarr',
    description: 'Movie management',
    url: radarrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'The server is temporarily unavailable (HTTP 503). Please try again later.'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Seerr',
    description: 'Media requests',
    url: seerrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'The service is receiving too many requests. Please try again later.'
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    configured: true,
    url: '',
    canReuseSavedKey: false
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps
  },
  render: args => ({
    components: {
      MmServiceForm
    },
    setup() {
      async function openConfirmation(element: Element | null): Promise<void> {
        if (!element) return;
        await nextTick();
        const removeButton = Array.from(element.querySelectorAll('button')).find(button => button.textContent?.trim() === 'Remove server');
        removeButton?.click();
      }
      return {
        args,
        openConfirmation
      };
    },
    template: \`
      <div
        style="width: min(420px, 90vw)"
        :ref="openConfirmation"
      >
        <mm-service-form v-bind="args" />
      </div>
    \`
  })
}`,...k.parameters?.docs?.source},description:{story:`Opens the removal confirmation so its appearance can be inspected directly.
Uses the public button interaction rather than component internals.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    removing: true,
    ...jellyfinUserProps
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    configured: false,
    success: 'Jellyfin server removed successfully.'
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'Unable to remove server.'
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    selectedUserId: 'user-2'
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    userOptions: [],
    usersLoading: true
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    userOptions: [],
    usersError: 'Unable to load Jellyfin users: HTTP 403.'
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    userSaving: true
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    selectedUserId: 'user-2',
    userSuccess: 'Jellyfin user saved successfully.'
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    usersError: 'Unable to save Jellyfin user.'
  }
}`,...R.parameters?.docs?.source}}}})))()}B();export{h as Configured,S as ConnectionError,x as ConnectionSuccess,m as FreshInstall,_ as HealthConnected,v as HealthFailed,y as HealthNotChecked,R as JellyfinUserSaveError,L as JellyfinUserSaved,I as JellyfinUserSaving,N as JellyfinUserSelected,F as JellyfinUsersError,P as JellyfinUsersLoading,b as Loading,p as Playground,C as ReadyToTest,k as RemovalConfirmation,M as RemovalError,j as RemovalSuccess,A as Removing,g as Sonarr,E as TestConnectionFailed,D as TestConnectionRateLimited,T as TestConnectionSuccess,O as TestConnectionUnavailable,w as TestingConnection,z as __namedExportsOrder,f as default};