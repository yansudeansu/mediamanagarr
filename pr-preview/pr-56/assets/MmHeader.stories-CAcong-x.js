import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmHeader-C2_jorgQ.js";import{n as r,t as i}from"./MmButton-BPbSDiIy.js";var a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),r(),{fn:a}=__STORYBOOK_MODULE_TEST__,o=`data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%3E%3Crect%20width%3D%2228%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%232563eb%22%2F%3E%3Ccircle%20cx%3D%2214%22%20cy%3D%2214%22%20r%3D%227%22%20fill%3D%22%23ffffff%22%2F%3E%3C%2Fsvg%3E`,s=a(),c={title:`Atoms/Header`,component:n,tags:[`autodocs`],args:{title:`Example App`,logo:null},argTypes:{title:{control:`text`,description:`Heading displayed in the header.`},logo:{control:`text`,description:`Optional logo image URL.`}},parameters:{layout:`centered`},decorators:[()=>({template:`
        <div style="width: 380px; max-width: 100%;">
          <story />
        </div>
      `})]},l={},u={args:{title:`Dashboard`}},d={args:{title:`Example App`,logo:o}},f={args:{title:`Dashboard`},render:e=>({components:{MmHeader:n,MmButton:i},setup(){return{args:e,onAction:s}},template:`
      <MmHeader v-bind="args">
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="settings"
            icon-only
            aria-label="Open preferences"
            title="Open preferences"
            @click="onAction('preferences')"
          />
        </template>
      </MmHeader>
    `})},p={args:{title:`Dashboard`,logo:o},render:e=>({components:{MmHeader:n,MmButton:i},setup(){return{args:e,onAction:s}},template:`
      <MmHeader v-bind="args">
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="search"
            icon-only
            aria-label="Search"
            title="Search"
            @click="onAction('search')"
          />
          <MmButton
            variant="secondary"
            size="small"
            icon="settings"
            icon-only
            aria-label="Open preferences"
            title="Open preferences"
            @click="onAction('preferences')"
          />
        </template>
      </MmHeader>
    `})},m={args:{title:`A Very Long Application Title That Needs to Wrap Within a Narrow Header`,logo:o}},h={args:{title:`Preferences`,logo:null}},g=[`Playground`,`Default`,`WithLogo`,`WithActions`,`MultipleActions`,`LongTitle`,`WithoutLogo`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Dashboard'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Example App',
    logo: exampleLogo
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Dashboard'
  },
  render: args => ({
    components: {
      MmHeader,
      MmButton
    },
    setup() {
      return {
        args,
        onAction
      };
    },
    template: \`
      <MmHeader v-bind="args">
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="settings"
            icon-only
            aria-label="Open preferences"
            title="Open preferences"
            @click="onAction('preferences')"
          />
        </template>
      </MmHeader>
    \`
  })
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Dashboard',
    logo: exampleLogo
  },
  render: args => ({
    components: {
      MmHeader,
      MmButton
    },
    setup() {
      return {
        args,
        onAction
      };
    },
    template: \`
      <MmHeader v-bind="args">
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="search"
            icon-only
            aria-label="Search"
            title="Search"
            @click="onAction('search')"
          />
          <MmButton
            variant="secondary"
            size="small"
            icon="settings"
            icon-only
            aria-label="Open preferences"
            title="Open preferences"
            @click="onAction('preferences')"
          />
        </template>
      </MmHeader>
    \`
  })
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'A Very Long Application Title That Needs to Wrap Within a Narrow Header',
    logo: exampleLogo
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Preferences',
    logo: null
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{u as Default,m as LongTitle,p as MultipleActions,l as Playground,f as WithActions,d as WithLogo,h as WithoutLogo,g as __namedExportsOrder,c as default};