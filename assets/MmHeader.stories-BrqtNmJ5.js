import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmHeader-Mp-k3-2K.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),r={jellyfin:{url:`https://media.example.com/jellyfin`,configured:!0},seerr:{url:`https://requests.example.com:5055`,configured:!0},sonarr:{url:`http://localhost:8989/sonarr`,configured:!0},radarr:{url:`http://localhost:7878/radarr`,configured:!0},qbittorrent:{url:`http://localhost:8080`,configured:!0}},i={jellyfin:{url:`https://media.example.com/jellyfin`,configured:!0},seerr:{url:`https://requests.example.com:5055`,configured:!0},sonarr:{url:``,configured:!1},radarr:{url:``,configured:!1},qbittorrent:{url:``,configured:!1}},a={title:`Molecules/Header`,component:n,tags:[`autodocs`],argTypes:{mode:{control:`radio`,options:[`main`,`settings`],description:`Determines whether the header displays the application title and Quick Access menu or the Settings title and back button.`},services:{control:`object`,description:`Safe service configuration used to populate the Quick Access menu. Only configured services with valid URLs are shown.`},onSettings:{description:`Emitted when Settings is selected from the Quick Access menu.`,table:{category:`events`}},onBack:{description:`Emitted when the back button is clicked.`,table:{category:`events`}}},args:{mode:`main`,services:r},decorators:[()=>({template:`
        <div style="width: 380px; min-height: 350px; display: flex; align-items: flex-start;">
          <div style="width: 100%;">
            <story />
          </div>
        </div>
      `})]},o={},s={args:{mode:`main`,services:r}},c={args:{mode:`settings`}},l={args:{mode:`main`,services:i}},u={args:{mode:`main`,services:{}}},d={args:{mode:`main`,services:{jellyfin:{url:`https://home.example.com/jellyfin`,configured:!0},sonarr:{url:`https://home.example.com:8443/sonarr`,configured:!0},radarr:{url:`https://home.example.com/radarr`,configured:!0}}}},f=[`Playground`,`Main`,`Settings`,`PartiallyConfigured`,`NoServices`,`ReverseProxyUrls`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Interactive playground.

Switch between main and settings modes.
Edit service configurations using Storybook Controls.

In main mode, click the three-dot button to open Quick Access.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    services: configuredServices
  }
}`,...s.parameters?.docs?.source},description:{story:`Default application header.

Shows the application title and Quick Access menu
containing all configured services.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings'
  }
}`,...c.parameters?.docs?.source},description:{story:`Settings header.

Shows the Settings title and back button.
Quick Access is hidden while Settings is open.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    services: partiallyConfiguredServices
  }
}`,...l.parameters?.docs?.source},description:{story:`Quick Access with only two configured services.

Unconfigured services should not appear in the dropdown.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    services: {}
  }
}`,...u.parameters?.docs?.source},description:{story:`Quick Access with no configured services.

The dropdown should display an empty-state message
while keeping Settings accessible.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    services: {
      jellyfin: {
        url: 'https://home.example.com/jellyfin',
        configured: true
      },
      sonarr: {
        url: 'https://home.example.com:8443/sonarr',
        configured: true
      },
      radarr: {
        url: 'https://home.example.com/radarr',
        configured: true
      }
    }
  }
}`,...d.parameters?.docs?.source},description:{story:`Quick Access with services behind reverse proxies.

Service links should preserve their URL paths and ports.`,...d.parameters?.docs?.description}}}})))()}p();export{s as Main,u as NoServices,l as PartiallyConfigured,o as Playground,d as ReverseProxyUrls,c as Settings,f as __namedExportsOrder,a as default};