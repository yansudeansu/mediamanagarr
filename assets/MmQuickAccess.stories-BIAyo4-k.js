import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmQuickAccess-CRu0HF1E.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),r={jellyfin:{url:`https://media.example.com/jellyfin`,configured:!0},seerr:{url:`https://requests.example.com:5055`,configured:!0},sonarr:{url:`http://localhost:8989/sonarr`,configured:!0},radarr:{url:`http://localhost:7878/radarr`,configured:!0},qbittorrent:{url:`http://localhost:8080`,configured:!0}},i={jellyfin:r.jellyfin,seerr:r.seerr,sonarr:{url:`http://localhost:8989`,configured:!1}},a={title:`Molecules/QuickAccess`,component:n,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A compact workspace menu providing shortcuts to configured services and access to Settings. Service URLs are supplied without API keys.`}}},argTypes:{services:{control:`object`,description:`Configured services and their safe URLs.`},onSettings:{action:`settings`,description:`Emitted when Settings is selected.`}},args:{services:r},decorators:[()=>({template:`
        <div
          style="
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            width: 320px;
            min-height: 320px;
            padding: 16px;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--surface);
          "
        >
          <story />
        </div>
      `})]},o={},s={args:{services:r}},c={args:{services:i}},l={args:{services:{}}},u={args:{services:{jellyfin:{url:`javascript:alert(1)`,configured:!0},seerr:r.seerr}}},d={args:{services:{jellyfin:{url:`https://example.com/media/jellyfin`,configured:!0},sonarr:{url:`https://example.com/apps/sonarr`,configured:!0},radarr:{url:`https://example.com/apps/radarr`,configured:!0}}}},f=[`Playground`,`AllConfigured`,`PartiallyConfigured`,`NoServices`,`InvalidUrl`,`ReverseProxyUrls`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    services: allServices
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    services: partialServices
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    services: {}
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    services: {
      jellyfin: {
        url: 'javascript:alert(1)',
        configured: true
      },
      seerr: allServices.seerr
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    services: {
      jellyfin: {
        url: 'https://example.com/media/jellyfin',
        configured: true
      },
      sonarr: {
        url: 'https://example.com/apps/sonarr',
        configured: true
      },
      radarr: {
        url: 'https://example.com/apps/radarr',
        configured: true
      }
    }
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{s as AllConfigured,u as InvalidUrl,l as NoServices,c as PartiallyConfigured,o as Playground,d as ReverseProxyUrls,f as __namedExportsOrder,a as default};