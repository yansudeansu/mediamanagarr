import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmStatusBadge-l-VmaK7E.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r={title:`Atoms/Status Badge`,component:n,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`neutral`,`info`,`success`,`danger`],description:`Visual appearance of the badge.`},label:{control:`text`,description:`Text displayed inside the badge.`}},args:{variant:`neutral`,label:`Pending`}},i={},a={args:{variant:`neutral`,label:`Not started`}},o={args:{variant:`info`,label:`In progress`}},s={args:{variant:`success`,label:`Completed`}},c={args:{variant:`danger`,label:`Failed`}},l={args:{variant:`success`,label:`All checks passed`}},u={render:()=>({components:{MmStatusBadge:n},template:`
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="neutral" label="Not started" />
          <span style="font-size: 12px; color: var(--muted);">
            Neutral state for items awaiting action
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="info" label="In progress" />
          <span style="font-size: 12px; color: var(--muted);">
            Informational state for ongoing work
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="success" label="Completed" />
          <span style="font-size: 12px; color: var(--muted);">
            Successful completion or positive status
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="danger" label="Failed" />
          <span style="font-size: 12px; color: var(--muted);">
            Error or failure requiring attention
          </span>
        </div>
      </div>
    `})},d=[`Playground`,`Neutral`,`Info`,`Success`,`Danger`,`CustomLabel`,`AllVariants`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'neutral',
    label: 'Not started'
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    label: 'In progress'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    label: 'Completed'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    label: 'Failed'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    label: 'All checks passed'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmStatusBadge
    },
    template: \`
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="neutral" label="Not started" />
          <span style="font-size: 12px; color: var(--muted);">
            Neutral state for items awaiting action
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="info" label="In progress" />
          <span style="font-size: 12px; color: var(--muted);">
            Informational state for ongoing work
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="success" label="Completed" />
          <span style="font-size: 12px; color: var(--muted);">
            Successful completion or positive status
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="danger" label="Failed" />
          <span style="font-size: 12px; color: var(--muted);">
            Error or failure requiring attention
          </span>
        </div>
      </div>
    \`
  })
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as AllVariants,l as CustomLabel,c as Danger,o as Info,a as Neutral,i as Playground,s as Success,d as __namedExportsOrder,r as default};