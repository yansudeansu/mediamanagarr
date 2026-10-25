import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{T as t,_ as n,a as r,b as i,d as a,f as o,m as s,o as c,p as l,v as u}from"./iframe-fABrrWJN.js";import{n as d,t as f}from"./MmButton-BXFIIBDy.js";import{n as p,t as m}from"./_plugin-vue_export-helper-ktEZWxTd.js";var h,g;function _(){return(_=e((()=>{r(),d(),h={class:`navigation`,"aria-label":`Main navigation`},g=s({__name:`MmNavigation`,props:{activeView:{}},emits:[`navigate`],setup(e,{emit:r}){let s=r,d=[{id:`requests`,label:`Requests`},{id:`up-next`,label:`Up Next`},{id:`calendar`,label:`Calendar`},{id:`downloads`,label:`Downloads`}];return(r,p)=>(n(),a(`nav`,h,[(n(),a(c,null,u(d,n=>l(f,{key:n.id,variant:`ghost`,size:`small`,class:`navigation__item`,"aria-current":e.activeView===n.id?`page`:void 0,onClick:e=>s(`navigate`,n.id)},{default:i(()=>[o(t(n.label),1)]),_:2},1032,[`aria-current`,`onClick`])),64))]))}})})))()}var v;function y(){return(y=e((()=>{_(),p(),v=m(g,[[`__scopeId`,`data-v-77ba6aab`]]),g.__docgenInfo=Object.assign({displayName:g.name??g.__name},{exportName:`default`,displayName:`MmNavigation`,description:``,tags:{},props:[{name:`activeView`,required:!0,type:{name:`NavigationView`}}],events:[{name:`navigate`,type:{names:[`NavigationView`]}}],sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/components/molecules/MmNavigation/MmNavigation.vue`]})})))()}var b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{y(),{fn:b}=__STORYBOOK_MODULE_TEST__,x={title:`Molecules/Navigation`,component:v,tags:[`autodocs`],argTypes:{activeView:{control:`select`,options:[`requests`,`up-next`,`calendar`,`downloads`],description:`Currently active application view.`},onNavigate:{description:`Emitted when a navigation item is selected.`,table:{category:`events`}}},args:{activeView:`requests`,onNavigate:b()},decorators:[()=>({template:`<div style="width: 380px"><story /></div>`})]},S={},C={args:{activeView:`requests`}},w={args:{activeView:`up-next`}},T={args:{activeView:`calendar`}},E={args:{activeView:`downloads`}},D=[`Playground`,`Requests`,`UpNext`,`Calendar`,`Downloads`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'requests'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'up-next'
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'calendar'
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    activeView: 'downloads'
  }
}`,...E.parameters?.docs?.source}}}})))()}O();export{T as Calendar,E as Downloads,S as Playground,C as Requests,w as UpNext,D as __namedExportsOrder,x as default};