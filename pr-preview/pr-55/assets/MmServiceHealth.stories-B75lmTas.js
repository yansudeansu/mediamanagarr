import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmServiceHealth-BICEkYMC.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r={title:`Molecules/Service Health`,component:n,tags:[`autodocs`],argTypes:{status:{control:`select`,options:[`not-checked`,`connected`,`failed`],description:`Connection health status to display.`},lastCheckedLabel:{control:`text`,description:`Preformatted label for the last connection check.`},error:{control:`text`,description:`Error message displayed when the connection has failed.`}},args:{status:`not-checked`,lastCheckedLabel:``,error:``},parameters:{layout:`centered`,docs:{description:{component:`Displays a connection health status, an optional preformatted last-checked label, and an optional error message. The parent is responsible for formatting timestamps and supplying presentation data.`}}},decorators:[()=>({template:`
        <div style="width: min(420px, 90vw);">
          <story />
        </div>
      `})]},i={},a={args:{status:`not-checked`,lastCheckedLabel:``,error:``}},o={args:{status:`connected`,lastCheckedLabel:`31 Oct 2026, 13:00`,error:``}},s={args:{status:`failed`,lastCheckedLabel:`31 Oct 2026, 13:00`,error:`Unable to reach the server. Check the URL and try again.`}},c={args:{status:`failed`,lastCheckedLabel:`31 Oct 2026, 13:00`,error:``}},l={args:{status:`connected`,lastCheckedLabel:``,error:``}},u={render:()=>({components:{MmServiceHealth:n},template:`
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: min(420px, 90vw);
        "
      >
        <mm-service-health
          status="not-checked"
        />

        <mm-service-health
          status="connected"
          last-checked-label="31 Oct 2026, 13:00"
        />

        <mm-service-health
          status="failed"
          last-checked-label="31 Oct 2026, 13:00"
          error="Unable to reach the server. Check the URL and try again."
        />
      </div>
    `})},d=[`Playground`,`NotCheckedYet`,`Connected`,`ConnectionFailed`,`ConnectionFailedWithoutDetails`,`ConnectedWithoutTimestamp`,`AllStates`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'not-checked',
    lastCheckedLabel: '',
    error: ''
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'connected',
    lastCheckedLabel: '31 Oct 2026, 13:00',
    error: ''
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed',
    lastCheckedLabel: '31 Oct 2026, 13:00',
    error: 'Unable to reach the server. Check the URL and try again.'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed',
    lastCheckedLabel: '31 Oct 2026, 13:00',
    error: ''
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'connected',
    lastCheckedLabel: '',
    error: ''
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmServiceHealth
    },
    template: \`
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: min(420px, 90vw);
        "
      >
        <mm-service-health
          status="not-checked"
        />

        <mm-service-health
          status="connected"
          last-checked-label="31 Oct 2026, 13:00"
        />

        <mm-service-health
          status="failed"
          last-checked-label="31 Oct 2026, 13:00"
          error="Unable to reach the server. Check the URL and try again."
        />
      </div>
    \`
  })
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as AllStates,o as Connected,l as ConnectedWithoutTimestamp,s as ConnectionFailed,c as ConnectionFailedWithoutDetails,a as NotCheckedYet,i as Playground,d as __namedExportsOrder,r as default};