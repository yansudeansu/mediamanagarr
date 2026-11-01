import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmServiceHealth-DoQoh08Q.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r={title:`Molecules/Service Health`,component:n,tags:[`autodocs`],argTypes:{health:{control:`object`,description:`Latest connection health, including status, last check time, and optional error.`}},args:{health:{status:`unknown`,lastCheckedAt:null}},parameters:{layout:`centered`},decorators:[()=>({template:`
        <div style="width: min(420px, 90vw);">
          <story />
        </div>
      `})]},i={},a={args:{health:{status:`unknown`,lastCheckedAt:null}}},o={args:{health:{status:`connected`,lastCheckedAt:`2026-10-31T12:00:00.000Z`}}},s={args:{health:{status:`failed`,lastCheckedAt:`2026-10-31T12:00:00.000Z`,error:`Unable to reach the server. Check the URL and try again.`}}},c={args:{health:{status:`failed`,lastCheckedAt:`2026-10-31T12:00:00.000Z`}}},l={args:{health:{status:`connected`,lastCheckedAt:null}}},u={render:()=>({components:{MmServiceHealth:n},setup(){return{checkedAt:`2026-10-31T12:00:00.000Z`}},template:`
      <div style="display: flex; flex-direction: column; gap: 16px; width: min(420px, 90vw);">
        <mm-service-health
          :health="{ status: 'unknown', lastCheckedAt: null }"
        />

        <mm-service-health
          :health="{ status: 'connected', lastCheckedAt: checkedAt }"
        />

        <mm-service-health
          :health="{
            status: 'failed',
            lastCheckedAt: checkedAt,
            error: 'Unable to reach the server. Check the URL and try again.',
          }"
        />
      </div>
    `})},d=[`Playground`,`NotCheckedYet`,`Connected`,`ConnectionFailed`,`ConnectionFailedWithoutDetails`,`ConnectedWithoutTimestamp`,`AllStates`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    health: {
      status: 'unknown',
      lastCheckedAt: null
    }
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    health: {
      status: 'connected',
      lastCheckedAt: '2026-10-31T12:00:00.000Z'
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    health: {
      status: 'failed',
      lastCheckedAt: '2026-10-31T12:00:00.000Z',
      error: 'Unable to reach the server. Check the URL and try again.'
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    health: {
      status: 'failed',
      lastCheckedAt: '2026-10-31T12:00:00.000Z'
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    health: {
      status: 'connected',
      lastCheckedAt: null
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmServiceHealth
    },
    setup() {
      const checkedAt = '2026-10-31T12:00:00.000Z';
      return {
        checkedAt
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column; gap: 16px; width: min(420px, 90vw);">
        <mm-service-health
          :health="{ status: 'unknown', lastCheckedAt: null }"
        />

        <mm-service-health
          :health="{ status: 'connected', lastCheckedAt: checkedAt }"
        />

        <mm-service-health
          :health="{
            status: 'failed',
            lastCheckedAt: checkedAt,
            error: 'Unable to reach the server. Check the URL and try again.',
          }"
        />
      </div>
    \`
  })
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as AllStates,o as Connected,l as ConnectedWithoutTimestamp,s as ConnectionFailed,c as ConnectionFailedWithoutDetails,a as NotCheckedYet,i as Playground,d as __namedExportsOrder,r as default};