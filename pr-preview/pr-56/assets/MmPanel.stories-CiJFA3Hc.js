import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-CS7GQ-tH.js";import{n as r,t as i}from"./MmSelect-Z5fTQuvF.js";import{n as a,t as o}from"./MmPanel-B5omNgvR.js";var s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),a(),r(),s=[{label:`Compact`,value:`compact`},{label:`Comfortable`,value:`comfortable`},{label:`Spacious`,value:`spacious`}],c={title:`Atoms/Panel`,component:o,tags:[`autodocs`],argTypes:{padding:{control:`select`,options:[`sm`,`md`],description:`Controls the internal padding of the panel.`}},args:{padding:`md`},parameters:{docs:{description:{component:`A bordered container for grouping related content or controls. Use MmPanel for grouped layouts and MmCard for standalone content items.`}}}},l={render:e=>({components:{MmPanel:o},setup(){return{args:e}},template:`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Example panel">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Panel heading
          </h2>

          <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
            A reusable container for related information and controls.
          </p>
        </mm-panel>
      </div>
    `})},u={args:{padding:`sm`},render:e=>({components:{MmPanel:o},setup(){return{args:e}},template:`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Compact panel">
          <p style="margin: 0">
            Compact panel content
          </p>
        </mm-panel>
      </div>
    `})},d={render:e=>({components:{MmPanel:o,MmSelect:i},setup(){return{args:e,preference:t(`comfortable`),preferenceOptions:s}},template:`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Display preferences">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Display preferences
          </h2>

          <mm-select
            v-model="preference"
            label="Content density"
            :options="preferenceOptions"
            hint="Choose how much spacing to use between items."
          />

          <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
            Selected density: {{ preference }}
          </p>
        </mm-panel>
      </div>
    `})},f={render:e=>({components:{MmPanel:o},setup(){return{args:e}},template:`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Account information">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Account information
          </h2>

          <div style="display: flex; flex-direction: column; gap: var(--space-2)">
            <p style="margin: 0">
              <strong>Name:</strong> Example User
            </p>

            <p style="margin: 0">
              <strong>Role:</strong> Editor
            </p>

            <p style="margin: 0">
              <strong>Status:</strong> Active
            </p>
          </div>
        </mm-panel>
      </div>
    `})},p=[`Playground`,`Compact`,`WithControls`,`WithInformation`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmPanel
    },
    setup() {
      return {
        args
      };
    },
    template: \`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Example panel">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Panel heading
          </h2>

          <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
            A reusable container for related information and controls.
          </p>
        </mm-panel>
      </div>
    \`
  })
}`,...l.parameters?.docs?.source},description:{story:`Interactive playground demonstrating the default slot and padding control.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    padding: 'sm'
  },
  render: args => ({
    components: {
      MmPanel
    },
    setup() {
      return {
        args
      };
    },
    template: \`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Compact panel">
          <p style="margin: 0">
            Compact panel content
          </p>
        </mm-panel>
      </div>
    \`
  })
}`,...u.parameters?.docs?.source},description:{story:`Smaller padding for compact groups of related content.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmPanel,
      MmSelect
    },
    setup() {
      const preference = ref('comfortable');
      return {
        args,
        preference,
        preferenceOptions
      };
    },
    template: \`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Display preferences">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Display preferences
          </h2>

          <mm-select
            v-model="preference"
            label="Content density"
            :options="preferenceOptions"
            hint="Choose how much spacing to use between items."
          />

          <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
            Selected density: {{ preference }}
          </p>
        </mm-panel>
      </div>
    \`
  })
}`,...d.parameters?.docs?.source},description:{story:`Demonstrates a panel containing an interactive form control.
State is local to Storybook.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmPanel
    },
    setup() {
      return {
        args
      };
    },
    template: \`
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Account information">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Account information
          </h2>

          <div style="display: flex; flex-direction: column; gap: var(--space-2)">
            <p style="margin: 0">
              <strong>Name:</strong> Example User
            </p>

            <p style="margin: 0">
              <strong>Role:</strong> Editor
            </p>

            <p style="margin: 0">
              <strong>Status:</strong> Active
            </p>
          </div>
        </mm-panel>
      </div>
    \`
  })
}`,...f.parameters?.docs?.source},description:{story:`Demonstrates a panel containing grouped information.`,...f.parameters?.docs?.description}}}})))()}m();export{u as Compact,l as Playground,d as WithControls,f as WithInformation,p as __namedExportsOrder,c as default};