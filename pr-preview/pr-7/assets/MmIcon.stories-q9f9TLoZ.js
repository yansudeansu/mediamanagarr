import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmIcon-CM55oIlp.js";var r,i,a,o,s,c,l,u;function d(){return(d=e((()=>{t(),r={title:`Atoms/Icon`,component:n,tags:[`autodocs`],argTypes:{name:{control:`select`,options:[`settings`,`arrow-left`,`refresh`],description:`Name of the icon to display.`},size:{control:{type:`number`,min:12,max:48,step:2},description:`Icon width and height in pixels.`}},args:{name:`settings`,size:18}},i={},a={args:{name:`settings`}},o={args:{name:`arrow-left`}},s={args:{name:`refresh`}},c={render:()=>({components:{MmIcon:n},setup(){return{icons:[`settings`,`arrow-left`,`refresh`]}},template:`
      <div style="display: flex; gap: 24px; align-items: center;">
        <div
          v-for="icon in icons"
          :key="icon"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <mm-icon :name="icon" :size="24" />
          <span style="font-size: 12px;">{{ icon }}</span>
        </div>
      </div>
    `})},l={render:()=>({components:{MmIcon:n},setup(){return{sizes:[16,18,24,32]}},template:`
      <div style="display: flex; gap: 24px; align-items: center;">
        <div
          v-for="size in sizes"
          :key="size"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <mm-icon name="settings" :size="size" />
          <span style="font-size: 12px;">{{ size }}px</span>
        </div>
      </div>
    `})},u=[`Playground`,`Settings`,`ArrowLeft`,`Refresh`,`Gallery`,`Sizes`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive icon playground.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'settings'
  }
}`,...a.parameters?.docs?.source},description:{story:`Settings icon, used in the application header.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-left'
  }
}`,...o.parameters?.docs?.source},description:{story:`Back navigation icon.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'refresh'
  }
}`,...s.parameters?.docs?.source},description:{story:`Refresh icon, used for reloading service data.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmIcon
    },
    setup() {
      const icons = ['settings', 'arrow-left', 'refresh'] as const;
      return {
        icons
      };
    },
    template: \`
      <div style="display: flex; gap: 24px; align-items: center;">
        <div
          v-for="icon in icons"
          :key="icon"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <mm-icon :name="icon" :size="24" />
          <span style="font-size: 12px;">{{ icon }}</span>
        </div>
      </div>
    \`
  })
}`,...c.parameters?.docs?.source},description:{story:`All available icons displayed together.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmIcon
    },
    setup() {
      return {
        sizes: [16, 18, 24, 32]
      };
    },
    template: \`
      <div style="display: flex; gap: 24px; align-items: center;">
        <div
          v-for="size in sizes"
          :key="size"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <mm-icon name="settings" :size="size" />
          <span style="font-size: 12px;">{{ size }}px</span>
        </div>
      </div>
    \`
  })
}`,...l.parameters?.docs?.source},description:{story:`Compare common icon sizes.`,...l.parameters?.docs?.description}}}})))()}d();export{o as ArrowLeft,c as Gallery,i as Playground,s as Refresh,a as Settings,l as Sizes,u as __namedExportsOrder,r as default};