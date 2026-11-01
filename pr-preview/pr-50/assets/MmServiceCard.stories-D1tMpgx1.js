import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,r as n}from"./registry-CoX8zuQC.js";import{n as r,t as i}from"./MmServiceCard-BTycQs-H.js";var a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{r(),n(),a={title:`Molecules/Service Card`,component:i,tags:[`autodocs`],argTypes:{service:{control:`object`,description:`Service information to display.`},status:{control:`select`,options:[`not-configured`,`configured`,`connected`,`failed`],description:`Current connection status.`},selected:{control:`boolean`,description:`Whether this service row is selected.`},disabled:{control:`boolean`,description:`Whether this service row is disabled.`}},args:{service:t.jellyfin,status:`not-configured`,selected:!1,disabled:!1},render:e=>({components:{MmServiceCard:i},setup(){return{args:e}},template:`
      <div
        style="
          width: 320px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
        "
      >
        <mm-service-card v-bind="args" />
      </div>
    `})},o={},s={args:{service:t.jellyfin,status:`connected`}},c={args:{service:t.seerr,status:`configured`}},l={args:{service:t.sonarr,status:`not-configured`}},u={args:{service:t.radarr,status:`failed`}},d={args:{service:t.qbittorrent,status:`connected`}},f={args:{selected:!0,status:`connected`}},p={args:{disabled:!0}},m={render:()=>({components:{MmServiceCard:i},setup(){return{SERVICE_REGISTRY:t}},template:`
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 320px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
        "
      >
        <mm-service-card
          :service="SERVICE_REGISTRY.jellyfin"
          status="connected"
          selected
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.seerr"
          status="configured"
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.sonarr"
          status="not-configured"
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.radarr"
          status="failed"
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.qbittorrent"
          status="not-configured"
        />
      </div>
    `})},h=[`Playground`,`Jellyfin`,`Seerr`,`Sonarr`,`Radarr`,`QBittorrent`,`Selected`,`Disabled`,`AllServices`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Interactive component playground.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    service: SERVICE_REGISTRY.jellyfin,
    status: 'connected'
  }
}`,...s.parameters?.docs?.source},description:{story:`Jellyfin with a successful connection.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    service: SERVICE_REGISTRY.seerr,
    status: 'configured'
  }
}`,...c.parameters?.docs?.source},description:{story:`Seerr with saved configuration.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    service: SERVICE_REGISTRY.sonarr,
    status: 'not-configured'
  }
}`,...l.parameters?.docs?.source},description:{story:`Sonarr without configuration.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    service: SERVICE_REGISTRY.radarr,
    status: 'failed'
  }
}`,...u.parameters?.docs?.source},description:{story:`Radarr with a failed connection.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    service: SERVICE_REGISTRY.qbittorrent,
    status: 'connected'
  }
}`,...d.parameters?.docs?.source},description:{story:`qBittorrent with a successful connection.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    selected: true,
    status: 'connected'
  }
}`,...f.parameters?.docs?.source},description:{story:`Selected service row.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...p.parameters?.docs?.source},description:{story:`Disabled service row.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmServiceCard
    },
    setup() {
      return {
        SERVICE_REGISTRY
      };
    },
    template: \`
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 320px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
        "
      >
        <mm-service-card
          :service="SERVICE_REGISTRY.jellyfin"
          status="connected"
          selected
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.seerr"
          status="configured"
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.sonarr"
          status="not-configured"
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.radarr"
          status="failed"
        />

        <mm-service-card
          :service="SERVICE_REGISTRY.qbittorrent"
          status="not-configured"
        />
      </div>
    \`
  })
}`,...m.parameters?.docs?.source},description:{story:`All five services displayed in a compact, grouped selector.

This matches the original MediaManagarr Settings layout.`,...m.parameters?.docs?.description}}}})))()}g();export{m as AllServices,p as Disabled,s as Jellyfin,o as Playground,d as QBittorrent,u as Radarr,c as Seerr,f as Selected,l as Sonarr,h as __namedExportsOrder,a as default};