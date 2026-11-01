import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmIcon-Bq_DXM7G.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{t(),r=[`settings`,`menu`,`external-link`,`arrow-left`,`arrow-right`,`arrow-up`,`arrow-down`,`chevron-left`,`chevron-right`,`refresh`,`detach`,`attach`,`sidebar`,`sidebar-close`],i={title:`Atoms/Icon`,component:n,tags:[`autodocs`],argTypes:{name:{control:`select`,options:r,description:`Icon to display.`},size:{control:{type:`number`,min:12,max:48,step:2},description:`Icon size in pixels.`}},args:{name:`settings`,size:18}},a={},o={args:{name:`settings`}},s={args:{name:`menu`}},c={args:{name:`external-link`}},l={args:{name:`arrow-left`}},u={args:{name:`arrow-right`}},d={args:{name:`arrow-up`}},f={args:{name:`arrow-down`}},p={args:{name:`chevron-left`}},m={args:{name:`chevron-right`}},h={args:{name:`refresh`}},g={args:{name:`detach`}},_={args:{name:`attach`}},v={args:{name:`sidebar`}},y={args:{name:`sidebar-close`}},b={render:()=>({components:{MmIcon:n},setup(){return{icons:r}},template:`
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
    `})},x={render:()=>({components:{MmIcon:n},setup(){return{sizes:[16,18,24,32]}},template:`
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
    `})},S=[`Playground`,`Settings`,`Menu`,`ExternalLink`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`ChevronLeft`,`ChevronRight`,`Refresh`,`Detach`,`Attach`,`Sidebar`,`SidebarClose`,`Gallery`,`Sizes`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'settings'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'menu'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'external-link'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-left'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-right'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-up'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-down'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'chevron-left'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'chevron-right'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'refresh'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'detach'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'attach'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'sidebar'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'sidebar-close'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}}})))()}C();export{f as ArrowDown,l as ArrowLeft,u as ArrowRight,d as ArrowUp,_ as Attach,p as ChevronLeft,m as ChevronRight,g as Detach,c as ExternalLink,b as Gallery,s as Menu,a as Playground,h as Refresh,o as Settings,v as Sidebar,y as SidebarClose,x as Sizes,S as __namedExportsOrder,i as default};