import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,M as n,a as r}from"./iframe-B9L0hNSe.js";import{n as i,t as a}from"./MmPagination-BSVra2z8.js";function o(){return e=>({components:{MmPagination:a},setup(){let r=t(e.page);return n(()=>e.page,e=>{r.value=e}),{args:e,currentPage:r}},template:`
      <div style="width: 340px;">
        <MmPagination
          v-model:page="currentPage"
          :total-pages="args.totalPages"
        />
      </div>
    `})}var s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{r(),i(),s={title:`Molecules/Pagination`,component:a,tags:[`autodocs`],args:{page:1,totalPages:10},argTypes:{page:{control:{type:`number`,min:1}},totalPages:{control:{type:`number`,min:0}}}},c={render:o()},l={args:{page:1,totalPages:10},render:o()},u={args:{page:5,totalPages:10},render:o()},d={args:{page:10,totalPages:10},render:o()},f={args:{page:1,totalPages:1},render:o()},p={args:{page:25,totalPages:50},render:o()},m=[`Default`,`FirstPage`,`MiddlePage`,`LastPage`,`SinglePage`,`ManyPages`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: interactiveStory()
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    page: 1,
    totalPages: 10
  },
  render: interactiveStory()
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    page: 5,
    totalPages: 10
  },
  render: interactiveStory()
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    page: 10,
    totalPages: 10
  },
  render: interactiveStory()
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    page: 1,
    totalPages: 1
  },
  render: interactiveStory()
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    page: 25,
    totalPages: 50
  },
  render: interactiveStory()
}`,...p.parameters?.docs?.source}}}})))()}h();export{c as Default,l as FirstPage,d as LastPage,p as ManyPages,u as MiddlePage,f as SinglePage,m as __namedExportsOrder,s as default};