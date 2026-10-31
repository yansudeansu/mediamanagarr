import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmHeader-ObGv8HxV.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),r={jellyfin:{url:`https://media.example.com/jellyfin`,configured:!0},seerr:{url:`https://requests.example.com:5055`,configured:!0},sonarr:{url:`http://localhost:8989/sonarr`,configured:!0},radarr:{url:`http://localhost:7878/radarr`,configured:!0},qbittorrent:{url:`http://localhost:8080`,configured:!0}},i={jellyfin:{url:`https://media.example.com/jellyfin`,configured:!0},seerr:{url:`https://requests.example.com:5055`,configured:!0},sonarr:{url:``,configured:!1},radarr:{url:``,configured:!1},qbittorrent:{url:``,configured:!1}},a={title:`Molecules/Header`,component:n,tags:[`autodocs`],argTypes:{mode:{control:`radio`,options:[`main`,`settings`],description:`Determines whether the header displays the application title and Quick Access menu or the Settings title and back button.`},windowMode:{control:`radio`,options:[`popup`,`detached`,`sidebar`],description:`Determines whether the workspace is displayed as a popup, detached window, or native browser sidebar.`},services:{control:`object`,description:`Safe service configuration used to populate the Quick Access menu. Only configured services with valid URLs are shown.`},onSettings:{description:`Emitted when Settings is selected from the Quick Access menu.`,table:{category:`events`}},onBack:{description:`Emitted when the back button is clicked.`,table:{category:`events`}},onDetach:{description:`Emitted when the detach button is clicked.`,table:{category:`events`}},onAttach:{description:`Emitted when the attach button is clicked.`,table:{category:`events`}},onSidebar:{description:`Emitted when the native browser sidebar button is clicked.`,table:{category:`events`}},onSidebarClose:{description:`Emitted when the close browser sidebar button is clicked.`,table:{category:`events`}}},args:{mode:`main`,windowMode:`popup`,services:r},decorators:[()=>({template:`
        <div style="width: 380px; min-height: 350px; display: flex; align-items: flex-start;">
          <div style="width: 100%;">
            <story />
          </div>
        </div>
      `})]},o={},s={args:{mode:`main`,windowMode:`popup`,services:r}},c={args:{mode:`settings`,windowMode:`popup`}},l={args:{mode:`main`,windowMode:`detached`,services:r}},u={args:{mode:`settings`,windowMode:`detached`}},d={args:{mode:`main`,windowMode:`sidebar`,services:r}},f={args:{mode:`settings`,windowMode:`sidebar`}},p={args:{mode:`main`,windowMode:`popup`,services:i}},m={args:{mode:`main`,windowMode:`popup`,services:{}}},h={args:{mode:`main`,windowMode:`popup`,services:{jellyfin:{url:`https://home.example.com/jellyfin`,configured:!0},sonarr:{url:`https://home.example.com:8443/sonarr`,configured:!0},radarr:{url:`https://home.example.com/radarr`,configured:!0}}}},g=[`Playground`,`Main`,`Settings`,`DetachedMain`,`DetachedSettings`,`SidebarMain`,`SidebarSettings`,`PartiallyConfigured`,`NoServices`,`ReverseProxyUrls`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Interactive playground.

Switch between main/settings and popup/detached/sidebar.
Edit the service configurations using Storybook Controls.

In main mode, click the three-dot button to open Quick Access.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'popup',
    services: configuredServices
  }
}`,...s.parameters?.docs?.source},description:{story:`Default popup header.

Shows the application title, sidebar button, detach button,
and Quick Access menu containing all configured services.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings',
    windowMode: 'popup'
  }
}`,...c.parameters?.docs?.source},description:{story:`Popup settings header.

Shows the Settings title, sidebar button, detach button,
and back button.

Quick Access is hidden while Settings is open.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'detached',
    services: configuredServices
  }
}`,...l.parameters?.docs?.source},description:{story:`Detached workspace.

Shows the application title, sidebar button, attach button,
and Quick Access menu.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings',
    windowMode: 'detached'
  }
}`,...u.parameters?.docs?.source},description:{story:`Detached workspace showing Settings.

Shows the Settings title, sidebar button, attach button,
and back button.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'sidebar',
    services: configuredServices
  }
}`,...d.parameters?.docs?.source},description:{story:`Native browser sidebar.

Shows the application title, close sidebar button,
and Quick Access menu.

Opening and detaching actions are hidden because
the application is already running inside the sidebar.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'settings',
    windowMode: 'sidebar'
  }
}`,...f.parameters?.docs?.source},description:{story:`Native browser sidebar showing Settings.

Shows the Settings title, close sidebar button,
and back button.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'popup',
    services: partiallyConfiguredServices
  }
}`,...p.parameters?.docs?.source},description:{story:`Quick Access with only two configured services.

Unconfigured services should not appear in the dropdown.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'popup',
    services: {}
  }
}`,...m.parameters?.docs?.source},description:{story:`Quick Access with no configured services.

The dropdown should display an empty-state message
while keeping Settings accessible.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'main',
    windowMode: 'popup',
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
}`,...h.parameters?.docs?.source},description:{story:`Quick Access with services behind reverse proxies.

Service links should preserve their URL paths and ports.`,...h.parameters?.docs?.description}}}})))()}_();export{l as DetachedMain,u as DetachedSettings,s as Main,m as NoServices,p as PartiallyConfigured,o as Playground,h as ReverseProxyUrls,c as Settings,d as SidebarMain,f as SidebarSettings,g as __namedExportsOrder,a as default};