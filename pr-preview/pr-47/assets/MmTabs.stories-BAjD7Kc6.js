import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-7-4qXXuP.js";import{n as r,t as i}from"./MmTabs-vdOJQwYr.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),a=[{id:`connections`,label:`Connections`},{id:`workspace`,label:`Workspace`}],o=[{id:`requests`,label:`Requests`},{id:`up-next`,label:`Up Next`},{id:`calendar`,label:`Calendar`},{id:`downloads`,label:`Downloads`}],s={title:`Molecules/Tabs`,component:i,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`tabs`,`navigation`]},modelValue:{control:`text`},label:{control:`text`}}},c={args:{modelValue:`connections`,items:a,variant:`tabs`,label:`Settings sections`},render:e=>({components:{MmTabs:i},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <div style="width: 100%; max-width: 400px;">
        <mm-tabs
          v-model="selected"
          :items="args.items"
          :variant="args.variant"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p v-if="selected === 'connections'">
            Service connection settings
          </p>

          <p v-else-if="selected === 'workspace'">
            Workspace preferences
          </p>
        </div>
      </div>
    `})},l={args:{modelValue:`requests`,items:o,variant:`navigation`,label:`Main navigation`},render:e=>({components:{MmTabs:i},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <div style="width: 100%; max-width: 400px;">
        <nav aria-label="Main navigation">
          <mm-tabs
            v-model="selected"
            :items="args.items"
            variant="navigation"
          />
        </nav>

        <div style="padding: 16px;">
          <p>Active view: {{ selected }}</p>
        </div>
      </div>
    `})},u={args:{modelValue:`connections`,items:[{id:`connections`,label:`Connections`},{id:`workspace`,label:`Workspace`},{id:`advanced`,label:`Advanced`,disabled:!0}],variant:`tabs`,label:`Settings sections`},render:e=>({components:{MmTabs:i},setup(){return{args:e,selected:t(e.modelValue)}},template:`
      <div style="width: 100%; max-width: 400px;">
        <mm-tabs
          v-model="selected"
          :items="args.items"
          :variant="args.variant"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p>Selected: {{ selected }}</p>
        </div>
      </div>
    `})},d=[`Settings`,`MainNavigation`,`DisabledTabs`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'connections',
    items: settingsItems,
    variant: 'tabs',
    label: 'Settings sections'
  },
  render: args => ({
    components: {
      MmTabs
    },
    setup() {
      const selected = ref(args.modelValue);
      return {
        args,
        selected
      };
    },
    template: \`
      <div style="width: 100%; max-width: 400px;">
        <mm-tabs
          v-model="selected"
          :items="args.items"
          :variant="args.variant"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p v-if="selected === 'connections'">
            Service connection settings
          </p>

          <p v-else-if="selected === 'workspace'">
            Workspace preferences
          </p>
        </div>
      </div>
    \`
  })
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'requests',
    items: navigationItems,
    variant: 'navigation',
    label: 'Main navigation'
  },
  render: args => ({
    components: {
      MmTabs
    },
    setup() {
      const selected = ref(args.modelValue);
      return {
        args,
        selected
      };
    },
    template: \`
      <div style="width: 100%; max-width: 400px;">
        <nav aria-label="Main navigation">
          <mm-tabs
            v-model="selected"
            :items="args.items"
            variant="navigation"
          />
        </nav>

        <div style="padding: 16px;">
          <p>Active view: {{ selected }}</p>
        </div>
      </div>
    \`
  })
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: 'connections',
    items: [{
      id: 'connections',
      label: 'Connections'
    }, {
      id: 'workspace',
      label: 'Workspace'
    }, {
      id: 'advanced',
      label: 'Advanced',
      disabled: true
    }],
    variant: 'tabs',
    label: 'Settings sections'
  },
  render: args => ({
    components: {
      MmTabs
    },
    setup() {
      const selected = ref(args.modelValue);
      return {
        args,
        selected
      };
    },
    template: \`
      <div style="width: 100%; max-width: 400px;">
        <mm-tabs
          v-model="selected"
          :items="args.items"
          :variant="args.variant"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p>Selected: {{ selected }}</p>
        </div>
      </div>
    \`
  })
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as DisabledTabs,l as MainNavigation,c as Settings,d as __namedExportsOrder,s as default};