import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmMediaPoster-SbnC0lII.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),r=e=>`data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192">
      <rect width="128" height="192" fill="#272c35"/>
      <text x="64" y="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" fill="#e5e7eb">${e}</text>
    </svg>`),i={title:`Atoms/MediaPoster`,component:n,tags:[`autodocs`],argTypes:{title:{control:`text`,description:`Media title used for accessible image descriptions.`},type:{control:`select`,options:[`movie`,`tv`],description:`Media type used to select the placeholder icon.`},image:{control:`text`,description:`Optional poster image URL. Clear the value to show the placeholder.`},size:{control:`select`,options:[`default`,`small`],description:`Poster display size.`}},args:{title:`Example Movie`,type:`movie`,image:null,size:`default`},parameters:{layout:`centered`}},a={},o={},s={args:{title:`Example TV Show`,type:`tv`}},c={args:{image:r(`Movie`)}},l={args:{title:`Example TV Show`,type:`tv`,image:r(`TV`)}},u={args:{size:`small`}},d={args:{title:`Example TV Show`,type:`tv`,size:`small`}},f={args:{image:r(`Movie`),size:`small`}},p=[`Playground`,`MoviePlaceholder`,`TvPlaceholder`,`MovieWithImage`,`TvWithImage`,`SmallMovie`,`SmallTv`,`SmallWithImage`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Interactive playground for all poster properties.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Movie placeholder when no poster image is available.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Example TV Show',
    type: 'tv'
  }
}`,...s.parameters?.docs?.source},description:{story:`TV placeholder when no poster image is available.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    image: createPoster('Movie')
  }
}`,...c.parameters?.docs?.source},description:{story:`Movie poster with an image.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Example TV Show',
    type: 'tv',
    image: createPoster('TV')
  }
}`,...l.parameters?.docs?.source},description:{story:`TV poster with an image.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'small'
  }
}`,...u.parameters?.docs?.source},description:{story:`Small movie placeholder.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Example TV Show',
    type: 'tv',
    size: 'small'
  }
}`,...d.parameters?.docs?.source},description:{story:`Small TV placeholder.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    image: createPoster('Movie'),
    size: 'small'
  }
}`,...f.parameters?.docs?.source},description:{story:`Small poster with an image.`,...f.parameters?.docs?.description}}}})))()}m();export{o as MoviePlaceholder,c as MovieWithImage,a as Playground,u as SmallMovie,d as SmallTv,f as SmallWithImage,s as TvPlaceholder,l as TvWithImage,p as __namedExportsOrder,i as default};