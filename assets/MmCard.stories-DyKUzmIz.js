import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmCard-1gVQi_9W.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{t(),r={title:`Atoms/Card`,component:n,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`default`,`outlined`]},padding:{control:`select`,options:[`none`,`sm`,`md`]}},args:{variant:`default`,padding:`md`}},i={render:e=>({components:{MmCard:n},setup:()=>({args:e}),template:`
      <MmCard v-bind="args">
        <h3 style="margin: 0 0 8px; font-size: 14px;">Example Movie</h3>
        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          Requested by Alice
        </p>
      </MmCard>
    `})},a={args:{variant:`outlined`},render:e=>({components:{MmCard:n},setup:()=>({args:e}),template:`
      <MmCard v-bind="args">
        <p style="margin: 0;">Outlined card content</p>
      </MmCard>
    `})},o={render:e=>({components:{MmCard:n},setup:()=>({args:e}),template:`
      <MmCard v-bind="args">
        <template #header>
          <h3 style="margin: 0; font-size: 14px;">Download activity</h3>
        </template>

        <p style="margin: 0; font-size: 12px;">
          3 downloads in progress
        </p>

        <template #footer>
          <span style="font-size: 12px; color: var(--muted);">
            Updated just now
          </span>
        </template>
      </MmCard>
    `})},s={args:{padding:`none`},render:e=>({components:{MmCard:n},setup:()=>({args:e}),template:`
      <MmCard v-bind="args">
        <div style="padding: 14px;">
          Custom layout with manually controlled spacing.
        </div>
      </MmCard>
    `})},c=[`Default`,`Outlined`,`WithHeaderAndFooter`,`NoPadding`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmCard
    },
    setup: () => ({
      args
    }),
    template: \`
      <MmCard v-bind="args">
        <h3 style="margin: 0 0 8px; font-size: 14px;">Example Movie</h3>
        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          Requested by Alice
        </p>
      </MmCard>
    \`
  })
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outlined'
  },
  render: args => ({
    components: {
      MmCard
    },
    setup: () => ({
      args
    }),
    template: \`
      <MmCard v-bind="args">
        <p style="margin: 0;">Outlined card content</p>
      </MmCard>
    \`
  })
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmCard
    },
    setup: () => ({
      args
    }),
    template: \`
      <MmCard v-bind="args">
        <template #header>
          <h3 style="margin: 0; font-size: 14px;">Download activity</h3>
        </template>

        <p style="margin: 0; font-size: 12px;">
          3 downloads in progress
        </p>

        <template #footer>
          <span style="font-size: 12px; color: var(--muted);">
            Updated just now
          </span>
        </template>
      </MmCard>
    \`
  })
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    padding: 'none'
  },
  render: args => ({
    components: {
      MmCard
    },
    setup: () => ({
      args
    }),
    template: \`
      <MmCard v-bind="args">
        <div style="padding: 14px;">
          Custom layout with manually controlled spacing.
        </div>
      </MmCard>
    \`
  })
}`,...s.parameters?.docs?.source}}}})))()}l();export{i as Default,s as NoPadding,a as Outlined,o as WithHeaderAndFooter,c as __namedExportsOrder,r as default};