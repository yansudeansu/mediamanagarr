import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmPagination-B4DueSQg.js";function r(){return e=>{let[,t]=i();return{components:{MmPagination:n},setup(){function n(e){t({page:e})}return{args:e,handlePageChange:n}},template:`
        <div style="width: 340px;">
          <MmPagination
            :page="args.page"
            :total-pages="args.totalPages"
            @update:page="handlePageChange"
          />
        </div>
      `}}}var i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),{useArgs:i}=__STORYBOOK_MODULE_PREVIEW_API__,a={title:`Molecules/Pagination`,component:n,tags:[`autodocs`],args:{page:1,totalPages:10},argTypes:{page:{control:{type:`number`,min:1}},totalPages:{control:{type:`number`,min:0}}}},o={render:r()},s={args:{page:1,totalPages:10},render:r()},c={args:{page:5,totalPages:10},render:r()},l={args:{page:10,totalPages:10},render:r()},u={args:{page:1,totalPages:1},render:r()},d={args:{page:25,totalPages:50},render:r()},f=[`Default`,`FirstPage`,`MiddlePage`,`LastPage`,`SinglePage`,`ManyPages`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: interactiveStory()
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    page: 1,
    totalPages: 10
  },
  render: interactiveStory()
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    page: 5,
    totalPages: 10
  },
  render: interactiveStory()
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    page: 10,
    totalPages: 10
  },
  render: interactiveStory()
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    page: 1,
    totalPages: 1
  },
  render: interactiveStory()
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    page: 25,
    totalPages: 50
  },
  render: interactiveStory()
}`,...d.parameters?.docs?.source}}}})))()}p();export{o as Default,s as FirstPage,l as LastPage,d as ManyPages,c as MiddlePage,u as SinglePage,f as __namedExportsOrder,a as default};