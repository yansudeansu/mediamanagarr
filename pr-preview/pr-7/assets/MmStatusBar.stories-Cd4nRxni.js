import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{M as t,a as n,b as r,c as i,d as a,j as o,m as s,s as c}from"./iframe-DuNgvyfV.js";import{n as l,t as u}from"./_plugin-vue_export-helper-ktEZWxTd.js";var d,f;function p(){return(p=e((()=>{n(),d={class:`status-badge__label`},f=s({__name:`MmStatusBadge`,props:{status:{}},setup(e){let n=e,s={"not-configured":`Not set`,configured:`Configured`,connected:`Connected`,failed:`Failed`},l=c(()=>s[n.status]);return(n,s)=>(r(),a(`span`,{class:o([`status-badge`,`status-badge--${e.status}`])},[s[0]||=i(`span`,{class:`status-badge__dot`,"aria-hidden":`true`},null,-1),i(`span`,d,t(l.value),1)],2))}})})))()}var m;function h(){return(h=e((()=>{p(),l(),m=u(f,[[`__scopeId`,`data-v-971a667d`]]),f.__docgenInfo=Object.assign({displayName:f.name??f.__name},{exportName:`default`,displayName:`MmStatusBadge`,description:``,tags:{},props:[{name:`status`,required:!0,type:{name:`ServiceState`}}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/atoms/MmStatusBadge/MmStatusBadge.vue`]})})))()}var g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{h(),g={title:`Atoms/Status Badge`,component:m,tags:[`autodocs`],argTypes:{status:{control:`select`,options:[`not-configured`,`configured`,`connected`,`failed`],description:`Current service connection status.`}},args:{status:`not-configured`}},_={},v={args:{status:`not-configured`}},y={args:{status:`configured`}},b={args:{status:`connected`}},x={args:{status:`failed`}},S={render:()=>({components:{MmStatusBadge:m},template:`
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
    `})},C=[`Playground`,`NotConfigured`,`Configured`,`Connected`,`Failed`,`AllStatuses`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'not-configured'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'configured'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'connected'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as AllStatuses,y as Configured,b as Connected,x as Failed,v as NotConfigured,_ as Playground,C as __namedExportsOrder,g as default};