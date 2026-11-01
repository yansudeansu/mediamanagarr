import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-DA-JxWpr.js";import{n as r,t as i}from"./MmSelect-Cigj7Vmj.js";import{n as a,t as o}from"./MmButton-BafzNkk5.js";import{n as s,t as c}from"./MmPanel-XlHM71H4.js";var l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),s(),r(),a(),l={title:`Atoms/Panel`,component:c,tags:[`autodocs`],argTypes:{padding:{control:`select`,options:[`sm`,`md`],description:`Controls the internal padding of the panel.`}},args:{padding:`md`},parameters:{docs:{description:{component:`A bordered container for grouping related controls or information. Use MmPanel for settings and grouped UI; use MmCard for standalone content items.`}}}},u=[{label:`Popup`,value:`popup`},{label:`Sidebar`,value:`sidebar`},{label:`Detached window`,value:`detached`}],d={render:e=>({components:{MmPanel:c},setup(){return{args:e}},template:`
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Example panel">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Panel heading
          </h2>

          <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
            A reusable container for related information and controls.
          </p>
        </mm-panel>
      </div>
    `})},f={args:{padding:`sm`},render:e=>({components:{MmPanel:c},setup(){return{args:e}},template:`
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Compact panel">
          <p style="margin: 0">
            Compact panel content
          </p>
        </mm-panel>
      </div>
    `})},p={render:e=>({components:{MmPanel:c,MmSelect:i,MmButton:o},setup(){return{args:e,workspaceMode:t(`popup`),workspaceOptions:u}},template:`
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Workspace preferences">
          <mm-select
            v-model="workspaceMode"
            label="Default workspace"
            :options="workspaceOptions"
            hint="Choose how MediaManagarr opens when you click its toolbar icon."
          />

          <div style="display: flex; flex-direction: column; gap: var(--space-3)">
            <h3 style="margin: 0; font-size: var(--font-size-xs)">
              Open workspace
            </h3>

            <mm-button variant="secondary" block>
              Open Sidebar
            </mm-button>

            <mm-button variant="secondary" block>
              Open Detached Window
            </mm-button>
          </div>
        </mm-panel>
      </div>
    `})},m={render:e=>({components:{MmPanel:c,MmButton:o},setup(){return{args:e}},template:`
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Jellyfin configuration">
          <div style="display: flex; flex-direction: column; gap: var(--space-1)">
            <h2 style="margin: 0; font-size: var(--font-size-md)">
              Jellyfin
            </h2>

            <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
              Connect your Jellyfin media server.
            </p>
          </div>

          <mm-button variant="primary" block>
            Connect &amp; Test
          </mm-button>
        </mm-panel>
      </div>
    `})},h=[`Playground`,`Compact`,`WorkspacePreferences`,`ServiceConfiguration`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
      <div style="width: 340px">
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
}`,...d.parameters?.docs?.source},description:{story:`Basic panel demonstrating the default content slot and padding control.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Compact panel">
          <p style="margin: 0">
            Compact panel content
          </p>
        </mm-panel>
      </div>
    \`
  })
}`,...f.parameters?.docs?.source},description:{story:`Smaller padding for compact groups of related content.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmPanel,
      MmSelect,
      MmButton
    },
    setup() {
      const workspaceMode = ref('popup');
      return {
        args,
        workspaceMode,
        workspaceOptions
      };
    },
    template: \`
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Workspace preferences">
          <mm-select
            v-model="workspaceMode"
            label="Default workspace"
            :options="workspaceOptions"
            hint="Choose how MediaManagarr opens when you click its toolbar icon."
          />

          <div style="display: flex; flex-direction: column; gap: var(--space-3)">
            <h3 style="margin: 0; font-size: var(--font-size-xs)">
              Open workspace
            </h3>

            <mm-button variant="secondary" block>
              Open Sidebar
            </mm-button>

            <mm-button variant="secondary" block>
              Open Detached Window
            </mm-button>
          </div>
        </mm-panel>
      </div>
    \`
  })
}`,...p.parameters?.docs?.source},description:{story:`Illustrates the intended use in Workspace Settings.

Interactions are local to Storybook and do not call extension APIs.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmPanel,
      MmButton
    },
    setup() {
      return {
        args
      };
    },
    template: \`
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Jellyfin configuration">
          <div style="display: flex; flex-direction: column; gap: var(--space-1)">
            <h2 style="margin: 0; font-size: var(--font-size-md)">
              Jellyfin
            </h2>

            <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
              Connect your Jellyfin media server.
            </p>
          </div>

          <mm-button variant="primary" block>
            Connect &amp; Test
          </mm-button>
        </mm-panel>
      </div>
    \`
  })
}`,...m.parameters?.docs?.source},description:{story:`Demonstrates a panel containing a service configuration heading.`,...m.parameters?.docs?.description}}}})))()}g();export{f as Compact,d as Playground,m as ServiceConfiguration,p as WorkspacePreferences,h as __namedExportsOrder,l as default};