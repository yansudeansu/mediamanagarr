import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmIcon-Dh3t73cV.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{t(),r=[`settings`,`arrow-left`,`arrow-right`,`arrow-up`,`arrow-down`,`chevron-left`,`chevron-right`,`refresh`,`detach`,`attach`],i={title:`Atoms/Icon`,component:n,tags:[`autodocs`],argTypes:{name:{control:`select`,options:r,description:`Icon to display.`},size:{control:{type:`number`,min:12,max:48,step:2},description:`Icon size in pixels.`}},args:{name:`settings`,size:18}},a={},o={args:{name:`settings`}},s={args:{name:`arrow-left`}},c={args:{name:`arrow-right`}},l={args:{name:`arrow-up`}},u={args:{name:`arrow-down`}},d={args:{name:`chevron-left`}},f={args:{name:`chevron-right`}},p={args:{name:`refresh`}},m={args:{name:`detach`}},h={args:{name:`attach`}},g={render:()=>({components:{MmIcon:n},setup(){return{icons:r}},template:`
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 16px;
          max-width: 600px;
        "
      >
        <div
          v-for="icon in icons"
          :key="icon"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 16px 8px;
            border: 1px solid var(--border);
            border-radius: 8px;
          "
        >
          <mm-icon :name="icon" :size="24" />

          <span style="font-size: 12px">
            {{ icon }}
          </span>
        </div>
      </div>
    `})},_={render:()=>({components:{MmIcon:n},setup(){return{sizes:[16,18,24,32]}},template:`
      <div style="display: flex; align-items: center; gap: 24px">
        <div
          v-for="size in sizes"
          :key="size"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          "
        >
          <mm-icon name="settings" :size="size" />

          <span style="font-size: 12px">
            {{ size }}px
          </span>
        </div>
      </div>
    `})},v=[`Playground`,`Settings`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`ChevronLeft`,`ChevronRight`,`Refresh`,`Detach`,`Attach`,`Gallery`,`Sizes`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'settings'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-left'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-right'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-up'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-down'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'chevron-left'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'chevron-right'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'refresh'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'detach'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'attach'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmIcon
    },
    setup() {
      return {
        icons
      };
    },
    template: \`
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 16px;
          max-width: 600px;
        "
      >
        <div
          v-for="icon in icons"
          :key="icon"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 16px 8px;
            border: 1px solid var(--border);
            border-radius: 8px;
          "
        >
          <mm-icon :name="icon" :size="24" />

          <span style="font-size: 12px">
            {{ icon }}
          </span>
        </div>
      </div>
    \`
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
      <div style="display: flex; align-items: center; gap: 24px">
        <div
          v-for="size in sizes"
          :key="size"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          "
        >
          <mm-icon name="settings" :size="size" />

          <span style="font-size: 12px">
            {{ size }}px
          </span>
        </div>
      </div>
    \`
  })
}`,..._.parameters?.docs?.source}}}})))()}y();export{u as ArrowDown,s as ArrowLeft,c as ArrowRight,l as ArrowUp,h as Attach,d as ChevronLeft,f as ChevronRight,m as Detach,g as Gallery,a as Playground,p as Refresh,o as Settings,_ as Sizes,v as __namedExportsOrder,i as default};