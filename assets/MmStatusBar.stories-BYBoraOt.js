import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmStatusBadge-CYnKouci.js";var r,i,a,o,s,c,l,u;function d(){return(d=e((()=>{t(),r={title:`Atoms/Status Badge`,component:n,tags:[`autodocs`],argTypes:{status:{control:`select`,options:[`not-configured`,`configured`,`connected`,`failed`],description:`Current service connection status.`}},args:{status:`not-configured`}},i={},a={args:{status:`not-configured`}},o={args:{status:`configured`}},s={args:{status:`connected`}},c={args:{status:`failed`}},l={render:()=>({components:{MmStatusBadge:n},template:`
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="not-configured" />
          <span style="font-size: 12px; color: var(--muted);">
            Service has not been configured
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="configured" />
          <span style="font-size: 12px; color: var(--muted);">
            Credentials are saved, connection not tested this session
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="connected" />
          <span style="font-size: 12px; color: var(--muted);">
            Service connection was successful
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="failed" />
          <span style="font-size: 12px; color: var(--muted);">
            Service connection failed
          </span>
        </div>
      </div>
    `})},u=[`Playground`,`NotConfigured`,`Configured`,`Connected`,`Failed`,`AllStatuses`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'not-configured'
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'configured'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'connected'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmStatusBadge
    },
    template: \`
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="not-configured" />
          <span style="font-size: 12px; color: var(--muted);">
            Service has not been configured
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="configured" />
          <span style="font-size: 12px; color: var(--muted);">
            Credentials are saved, connection not tested this session
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="connected" />
          <span style="font-size: 12px; color: var(--muted);">
            Service connection was successful
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="failed" />
          <span style="font-size: 12px; color: var(--muted);">
            Service connection failed
          </span>
        </div>
      </div>
    \`
  })
}`,...l.parameters?.docs?.source}}}})))()}d();export{l as AllStatuses,o as Configured,s as Connected,c as Failed,a as NotConfigured,i as Playground,u as __namedExportsOrder,r as default};