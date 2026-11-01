import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmServiceSelector-BUygChU-.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{t(),{useArgs:r}=__STORYBOOK_MODULE_PREVIEW_API__,i=[{id:`jellyfin`,name:`Jellyfin`,status:`not-configured`},{id:`seerr`,name:`Seerr`,status:`not-configured`},{id:`sonarr`,name:`Sonarr`,status:`not-configured`},{id:`radarr`,name:`Radarr`,status:`not-configured`},{id:`qbittorrent`,name:`qBittorrent`,status:`not-configured`}],a=[{id:`jellyfin`,name:`Jellyfin`,status:`configured`},{id:`seerr`,name:`Seerr`,status:`configured`},{id:`sonarr`,name:`Sonarr`,status:`not-configured`},{id:`radarr`,name:`Radarr`,status:`not-configured`},{id:`qbittorrent`,name:`qBittorrent`,status:`not-configured`}],o=[{id:`jellyfin`,name:`Jellyfin`,status:`connected`},{id:`seerr`,name:`Seerr`,status:`connected`},{id:`sonarr`,name:`Sonarr`,status:`connected`},{id:`radarr`,name:`Radarr`,status:`connected`},{id:`qbittorrent`,name:`qBittorrent`,status:`connected`}],s=[{id:`jellyfin`,name:`Jellyfin`,status:`connected`},{id:`seerr`,name:`Seerr`,status:`configured`},{id:`sonarr`,name:`Sonarr`,status:`connected`},{id:`radarr`,name:`Radarr`,status:`failed`},{id:`qbittorrent`,name:`qBittorrent`,status:`not-configured`}],c={title:`Organisms/Service Selector`,component:n,tags:[`autodocs`],argTypes:{modelValue:{control:`select`,options:[null,`jellyfin`,`seerr`,`sonarr`,`radarr`,`qbittorrent`],description:`ID of the currently selected service.`},services:{control:`object`,description:`Ordered list of services, including each service ID, display name, and connection status.`},disabled:{control:`boolean`,description:`Disables interaction with all services.`}},args:{modelValue:`jellyfin`,services:a.map(e=>({...e})),disabled:!1},render:e=>{let[,t]=r();return{components:{MmServiceSelector:n},setup(){function n(e){t({modelValue:e})}return{args:e,updateSelection:n}},template:`
        <div style="width: 320px">
          <mm-service-selector
            v-bind="args"
            @update:model-value="updateSelection"
          />
        </div>
      `}}},l={},u={args:{modelValue:null,services:i.map(e=>({...e}))}},d={args:{modelValue:`jellyfin`,services:a.map(e=>({...e}))}},f={args:{modelValue:`jellyfin`,services:o.map(e=>({...e}))}},p={args:{modelValue:`radarr`,services:s.map(e=>({...e}))}},m={args:{disabled:!0}},h={args:{modelValue:null,services:[]}},g={args:{modelValue:`alpha`,services:[{id:`alpha`,name:`Alpha Server`,status:`connected`},{id:`beta`,name:`Beta Server`,status:`configured`},{id:`gamma`,name:`Gamma Server`,status:`failed`}]}},_=[`Playground`,`FreshInstall`,`PartiallyConfigured`,`AllConnected`,`ConnectionFailed`,`Disabled`,`Empty`,`CustomServices`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Interactive service selection.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: null,
    services: notConfiguredServices.map(service => ({
      ...service
    }))
  }
}`,...u.parameters?.docs?.source},description:{story:`No services have been configured yet.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'jellyfin',
    services: partiallyConfiguredServices.map(service => ({
      ...service
    }))
  }
}`,...d.parameters?.docs?.source},description:{story:`Some services have saved configuration.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'jellyfin',
    services: connectedServices.map(service => ({
      ...service
    }))
  }
}`,...f.parameters?.docs?.source},description:{story:`All services are connected.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'radarr',
    services: failedConnectionServices.map(service => ({
      ...service
    }))
  }
}`,...p.parameters?.docs?.source},description:{story:`A service has failed its connection test.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...m.parameters?.docs?.source},description:{story:`All service rows are disabled.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: null,
    services: []
  }
}`,...h.parameters?.docs?.source},description:{story:`The selector renders an empty group when no services are supplied.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'alpha',
    services: [{
      id: 'alpha',
      name: 'Alpha Server',
      status: 'connected'
    }, {
      id: 'beta',
      name: 'Beta Server',
      status: 'configured'
    }, {
      id: 'gamma',
      name: 'Gamma Server',
      status: 'failed'
    }]
  }
}`,...g.parameters?.docs?.source},description:{story:`The selector supports services outside MediaManagarr's registry.`,...g.parameters?.docs?.description}}}})))()}v();export{f as AllConnected,p as ConnectionFailed,g as CustomServices,m as Disabled,h as Empty,u as FreshInstall,d as PartiallyConfigured,l as Playground,_ as __namedExportsOrder,c as default};