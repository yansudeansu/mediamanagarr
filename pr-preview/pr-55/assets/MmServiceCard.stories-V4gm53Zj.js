import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-CS7GQ-tH.js";import{n as r,t as i}from"./MmServiceCard-DPB0thcG.js";var a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),r(),{fn:a}=__STORYBOOK_MODULE_TEST__,o={title:`Molecules/Service Card`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`A selectable service row with a connection status badge. The parent controls selection and supplies the display name.`}}},argTypes:{name:{control:`text`,description:`Service display name.`},status:{control:`select`,options:[`not-configured`,`configured`,`connected`,`failed`],description:`Current connection status.`},selected:{control:`boolean`,description:`Whether this service row is selected.`},disabled:{control:`boolean`,description:`Whether this service row is disabled.`}},args:{name:`Example Service`,status:`not-configured`,selected:!1,disabled:!1,onSelect:a()},decorators:[()=>({template:`
        <div
          style="
            width: 320px;
            overflow: hidden;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--background);
          "
        >
          <story />
        </div>
      `})]},s={},c={args:{status:`connected`}},l={args:{status:`configured`}},u={args:{status:`not-configured`}},d={args:{status:`failed`}},f={args:{selected:!0,status:`connected`}},p={args:{disabled:!0}},m={args:{name:`Example Service With an Extremely Long Display Name for Layout Testing`,status:`connected`}},h={render:e=>({components:{MmServiceCard:i},setup(){let n=t(`one`),r=[{id:`one`,name:`Example Service One`,status:`connected`},{id:`two`,name:`Example Service Two`,status:`configured`},{id:`three`,name:`Example Service Three`,status:`failed`}];function i(t){n.value=t,e.onSelect?.()}return{selectedId:n,services:r,selectService:i}},template:`
      <div style="display: flex; flex-direction: column;">
        <mm-service-card
          v-for="service in services"
          :key="service.id"
          :name="service.name"
          :status="service.status"
          :selected="selectedId === service.id"
          @select="selectService(service.id)"
        />
      </div>
    `})},g=[`Playground`,`Connected`,`Configured`,`NotConfigured`,`Failed`,`Selected`,`Disabled`,`LongName`,`InteractiveSelection`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'connected'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'configured'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'not-configured'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    selected: true,
    status: 'connected'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Example Service With an Extremely Long Display Name for Layout Testing',
    status: 'connected'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmServiceCard
    },
    setup() {
      const selectedId = ref('one');
      const services: Array<{
        id: string;
        name: string;
        status: ServiceState;
      }> = [{
        id: 'one',
        name: 'Example Service One',
        status: 'connected'
      }, {
        id: 'two',
        name: 'Example Service Two',
        status: 'configured'
      }, {
        id: 'three',
        name: 'Example Service Three',
        status: 'failed'
      }];
      function selectService(id: string): void {
        selectedId.value = id;
        args.onSelect?.();
      }
      return {
        selectedId,
        services,
        selectService
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column;">
        <mm-service-card
          v-for="service in services"
          :key="service.id"
          :name="service.name"
          :status="service.status"
          :selected="selectedId === service.id"
          @select="selectService(service.id)"
        />
      </div>
    \`
  })
}`,...h.parameters?.docs?.source}}}})))()}_();export{l as Configured,c as Connected,p as Disabled,d as Failed,h as InteractiveSelection,m as LongName,u as NotConfigured,s as Playground,f as Selected,g as __namedExportsOrder,o as default};