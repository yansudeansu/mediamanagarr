import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-CTj4TPtD.js";import{n as r,t as i}from"./MmSelect-BYWl54wK.js";import{n as a,t as o}from"./MmButton-rrFJGoHK.js";import{n as s,t as c}from"./MmTabs-C4oiIXds.js";import{n as l,t as u}from"./MmCard--OSVJZSX.js";import{n as d,t as f}from"./MmSettingsTemplate-CbE1c95p.js";var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),d(),s(),l(),r(),a(),p=[{id:`connections`,label:`Connections`},{id:`workspace`,label:`Workspace`}],m=[{label:`Popup`,value:`popup`},{label:`Sidebar`,value:`sidebar`},{label:`Detached window`,value:`detached`}],h={title:`Templates/Settings`,component:f,tags:[`autodocs`],parameters:{docs:{description:{component:`A generic Settings layout with a navigation slot and a default content slot. The parent owns navigation state, content, and settings behavior.`}}}},g={render:()=>({components:{MmSettingsTemplate:f,MmTabs:c,MmCard:u,MmSelect:i,MmButton:o},setup(){let e=t(`connections`),n=t(`popup`);return{activeTab:e,settingsTabs:p,workspaceMode:n,workspaceOptions:m}},template:`
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <mm-tabs
              v-model="activeTab"
              :items="settingsTabs"
              label="Settings sections"
            />
          </template>

          <section
            v-if="activeTab === 'connections'"
            aria-labelledby="connections-title"
          >
            <mm-card>
              <h2 id="connections-title">Connections</h2>

              <p>
                Configure the services MediaManagarr connects to.
              </p>

              <mm-button variant="secondary" block>
                Add connection
              </mm-button>
            </mm-card>
          </section>

          <section
            v-else
            aria-labelledby="workspace-title"
          >
            <mm-card>
              <h2 id="workspace-title">Workspace</h2>

              <p>
                Choose how MediaManagarr opens from your browser toolbar.
              </p>

              <mm-select
                v-model="workspaceMode"
                label="Default workspace"
                :options="workspaceOptions"
              />
            </mm-card>
          </section>
        </mm-settings-template>
      </div>
    `})},_={render:()=>({components:{MmSettingsTemplate:f,MmTabs:c},setup(){return{activeTab:t(`connections`),settingsTabs:p}},template:`
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <mm-tabs
              v-model="activeTab"
              :items="settingsTabs"
              label="Settings sections"
            />
          </template>
        </mm-settings-template>
      </div>
    `})},v={render:()=>({components:{MmSettingsTemplate:f,MmCard:u},template:`
      <div style="width: 360px">
        <mm-settings-template>
          <mm-card>
            <h2>General Settings</h2>

            <p>
              Settings content can be rendered without navigation.
            </p>
          </mm-card>
        </mm-settings-template>
      </div>
    `})},y={render:()=>({components:{MmSettingsTemplate:f,MmCard:u},template:`
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <nav aria-label="Example navigation">
              Custom navigation
            </nav>
          </template>

          <mm-card>
            <h2>Custom Settings</h2>

            <p>
              The template does not require a specific form,
              service selector, or settings component.
            </p>
          </mm-card>
        </mm-settings-template>
      </div>
    `})},b=[`Playground`,`NavigationOnly`,`ContentOnly`,`CustomContent`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmTabs,
      MmCard,
      MmSelect,
      MmButton
    },
    setup() {
      const activeTab = ref('connections');
      const workspaceMode = ref('popup');
      return {
        activeTab,
        settingsTabs,
        workspaceMode,
        workspaceOptions
      };
    },
    template: \`
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <mm-tabs
              v-model="activeTab"
              :items="settingsTabs"
              label="Settings sections"
            />
          </template>

          <section
            v-if="activeTab === 'connections'"
            aria-labelledby="connections-title"
          >
            <mm-card>
              <h2 id="connections-title">Connections</h2>

              <p>
                Configure the services MediaManagarr connects to.
              </p>

              <mm-button variant="secondary" block>
                Add connection
              </mm-button>
            </mm-card>
          </section>

          <section
            v-else
            aria-labelledby="workspace-title"
          >
            <mm-card>
              <h2 id="workspace-title">Workspace</h2>

              <p>
                Choose how MediaManagarr opens from your browser toolbar.
              </p>

              <mm-select
                v-model="workspaceMode"
                label="Default workspace"
                :options="workspaceOptions"
              />
            </mm-card>
          </section>
        </mm-settings-template>
      </div>
    \`
  })
}`,...g.parameters?.docs?.source},description:{story:`Interactive example demonstrating how a parent composes
Settings navigation and content.

All state is local to Storybook.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmTabs
    },
    setup() {
      const activeTab = ref('connections');
      return {
        activeTab,
        settingsTabs
      };
    },
    template: \`
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <mm-tabs
              v-model="activeTab"
              :items="settingsTabs"
              label="Settings sections"
            />
          </template>
        </mm-settings-template>
      </div>
    \`
  })
}`,..._.parameters?.docs?.source},description:{story:`A Settings layout containing only navigation.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmCard
    },
    template: \`
      <div style="width: 360px">
        <mm-settings-template>
          <mm-card>
            <h2>General Settings</h2>

            <p>
              Settings content can be rendered without navigation.
            </p>
          </mm-card>
        </mm-settings-template>
      </div>
    \`
  })
}`,...v.parameters?.docs?.source},description:{story:`A Settings layout without navigation.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmCard
    },
    template: \`
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <nav aria-label="Example navigation">
              Custom navigation
            </nav>
          </template>

          <mm-card>
            <h2>Custom Settings</h2>

            <p>
              The template does not require a specific form,
              service selector, or settings component.
            </p>
          </mm-card>
        </mm-settings-template>
      </div>
    \`
  })
}`,...y.parameters?.docs?.source},description:{story:`Demonstrates that the template can render arbitrary content.`,...y.parameters?.docs?.description}}}})))()}x();export{v as ContentOnly,y as CustomContent,_ as NavigationOnly,g as Playground,b as __namedExportsOrder,h as default};