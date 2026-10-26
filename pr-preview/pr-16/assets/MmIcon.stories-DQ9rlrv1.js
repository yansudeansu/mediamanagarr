import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmIcon-B3CswUJO.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),r={title:`Atoms/Icon`,component:n,tags:[`autodocs`],argTypes:{name:{control:`select`,options:[`settings`,`arrow-left`,`arrow-right`,`arrow-up`,`arrow-down`,`chevron-left`,`chevron-right`,`refresh`],description:`Name of the icon to display.`},size:{control:{type:`number`,min:12,max:48,step:2},description:`Icon width and height in pixels.`}},args:{name:`settings`,size:18}},i={},a={args:{name:`settings`}},o={args:{name:`arrow-left`}},s={args:{name:`arrow-right`}},c={args:{name:`arrow-up`}},l={args:{name:`arrow-down`}},u={args:{name:`chevron-left`}},d={args:{name:`chevron-right`}},f={args:{name:`refresh`}},p={render:()=>({components:{MmIcon:n},setup(){return{icons:[`settings`,`arrow-left`,`arrow-right`,`arrow-up`,`arrow-down`,`chevron-left`,`chevron-right`,`refresh`]}},template:`
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
    `})},m={render:()=>({components:{MmIcon:n},setup(){return{sizes:[16,18,24,32]}},template:`
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
    `})},h=[`Playground`,`Settings`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`ChevronLeft`,`ChevronRight`,`Refresh`,`Gallery`,`Sizes`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive icon playground.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
    name: 'arrow-up'
  }
}`,...c.parameters?.docs?.source},description:{story:`Upload direction indicator.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-down'
  }
}`,...l.parameters?.docs?.source},description:{story:`Download direction indicator.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'chevron-left'
  }
}`,...u.parameters?.docs?.source},description:{story:`Previous month chevron.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'chevron-right'
  }
}`,...d.parameters?.docs?.source},description:{story:`Next month chevron.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'refresh'
  }
}`,...f.parameters?.docs?.source},description:{story:`Refresh icon, used for reloading service data.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmIcon
    },
    setup() {
      const icons = ['settings', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'chevron-left', 'chevron-right', 'refresh'] as const;
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
}`,...p.parameters?.docs?.source},description:{story:`All available icons displayed together.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source},description:{story:`Compare common icon sizes.`,...m.parameters?.docs?.description}}}})))()}g();export{l as ArrowDown,o as ArrowLeft,s as ArrowRight,c as ArrowUp,u as ChevronLeft,d as ChevronRight,p as Gallery,i as Playground,f as Refresh,a as Settings,m as Sizes,h as __namedExportsOrder,r as default};