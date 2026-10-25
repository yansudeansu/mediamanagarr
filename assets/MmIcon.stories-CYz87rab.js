import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmIcon-DeIElI2x.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r={title:`Atoms/Icon`,component:n,tags:[`autodocs`],argTypes:{name:{control:`select`,options:[`settings`,`arrow-left`,`arrow-right`,`refresh`],description:`Name of the icon to display.`},size:{control:{type:`number`,min:12,max:48,step:2},description:`Icon width and height in pixels.`}},args:{name:`settings`,size:18}},i={},a={args:{name:`settings`}},o={args:{name:`arrow-left`}},s={args:{name:`arrow-right`}},c={args:{name:`refresh`}},l={render:()=>({components:{MmIcon:n},setup(){return{icons:[`settings`,`arrow-left`,`arrow-right`,`refresh`]}},template:`
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
    `})},u={render:()=>({components:{MmIcon:n},setup(){return{sizes:[16,18,24,32]}},template:`
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
    `})},d=[`Playground`,`Settings`,`ArrowLeft`,`ArrowRight`,`Refresh`,`Gallery`,`Sizes`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive icon playground.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'settings'
  }
}`,...a.parameters?.docs?.source},description:{story:`Settings icon, used in the application header.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-left'
  }
}`,...o.parameters?.docs?.source},description:{story:`Back navigation icon.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-right'
  }
}`,...s.parameters?.docs?.source},description:{story:`Forward navigation icon.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'refresh'
  }
}`,...c.parameters?.docs?.source},description:{story:`Refresh icon, used for reloading service data.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmIcon
    },
    setup() {
      const icons = ['settings', 'arrow-left', 'arrow-right', 'refresh'] as const;
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
}`,...l.parameters?.docs?.source},description:{story:`All available icons displayed together.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source},description:{story:`Compare common icon sizes.`,...u.parameters?.docs?.description}}}})))()}f();export{o as ArrowLeft,s as ArrowRight,l as Gallery,i as Playground,c as Refresh,a as Settings,u as Sizes,d as __namedExportsOrder,r as default};