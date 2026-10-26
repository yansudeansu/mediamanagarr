import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmIcon-DF5yI9X5.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),r={title:`Atoms/Icon`,component:n,tags:[`autodocs`],argTypes:{name:{control:`select`,options:[`settings`,`arrow-left`,`arrow-right`,`chevron-left`,`chevron-right`,`refresh`],description:`Name of the icon to display.`},size:{control:{type:`number`,min:12,max:48,step:2},description:`Icon width and height in pixels.`}},args:{name:`settings`,size:18}},i={},a={args:{name:`settings`}},o={args:{name:`arrow-left`}},s={args:{name:`arrow-right`}},c={args:{name:`chevron-left`}},l={args:{name:`chevron-right`}},u={args:{name:`refresh`}},d={render:()=>({components:{MmIcon:n},setup(){return{icons:[`settings`,`arrow-left`,`arrow-right`,`chevron-left`,`chevron-right`,`refresh`]}},template:`
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div
          v-for="icon in icons"
          :key="icon"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <mm-icon :name="icon" :size="24" />
          <span style="font-size: 12px;">{{ icon }}</span>
        </div>
      </div>
    `})},f={render:()=>({components:{MmIcon:n},setup(){return{sizes:[16,18,24,32]}},template:`
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
    `})},p=[`Playground`,`Settings`,`ArrowLeft`,`ArrowRight`,`ChevronLeft`,`ChevronRight`,`Refresh`,`Gallery`,`Sizes`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive icon playground.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
    name: 'chevron-left'
  }
}`,...c.parameters?.docs?.source},description:{story:`Previous month chevron.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'chevron-right'
  }
}`,...l.parameters?.docs?.source},description:{story:`Next month chevron.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'refresh'
  }
}`,...u.parameters?.docs?.source},description:{story:`Refresh icon, used for reloading service data.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmIcon
    },
    setup() {
      const icons = ['settings', 'arrow-left', 'arrow-right', 'chevron-left', 'chevron-right', 'refresh'] as const;
      return {
        icons
      };
    },
    template: \`
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
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
}`,...d.parameters?.docs?.source},description:{story:`All available icons displayed together.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source},description:{story:`Compare common icon sizes.`,...f.parameters?.docs?.description}}}})))()}m();export{o as ArrowLeft,s as ArrowRight,c as ChevronLeft,l as ChevronRight,d as Gallery,i as Playground,u as Refresh,a as Settings,f as Sizes,p as __namedExportsOrder,r as default};