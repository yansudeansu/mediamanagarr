import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmButton-DjgUClHh.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{t(),r={title:`Atoms/Button`,component:n,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`primary`,`secondary`,`danger`,`ghost`,`pagination`],description:`Visual appearance of the button.`},size:{control:`radio`,options:[`small`,`medium`],description:`Size of the button.`},icon:{control:`select`,options:[void 0,`settings`,`arrow-left`,`refresh`,`detach`,`attach`],description:`Optional icon displayed by the button.`},disabled:{control:`boolean`,description:`Prevents interaction.`},loading:{control:`boolean`,description:`Shows a loading spinner and prevents interaction.`},block:{control:`boolean`,description:`Makes the button fill its container.`},iconOnly:{control:`boolean`,description:`Displays a square icon button. Requires an accessible name.`},type:{control:`select`,options:[`button`,`submit`,`reset`],description:`Native HTML button type.`},default:{control:`text`,description:`Button label or accessible name for icon-only buttons.`,table:{category:`slots`}}},args:{variant:`secondary`,size:`medium`,icon:void 0,disabled:!1,loading:!1,block:!1,iconOnly:!1,type:`button`,default:`Button`},render:e=>({components:{MmButton:n},setup(){return{args:e}},template:`
      <mm-button
        v-bind="args"
        :aria-label="args.iconOnly ? args.default : undefined"
      >
        {{ args.default }}
      </mm-button>
    `})},i={},a={args:{variant:`primary`,default:`Save settings`}},o={args:{variant:`secondary`,default:`Refresh`}},s={args:{variant:`danger`,default:`Remove torrent`}},c={args:{variant:`ghost`,default:`Dismiss`}},l={args:{variant:`pagination`,size:`small`,default:`3`}},u={args:{variant:`pagination`,size:`small`,disabled:!0,default:`3`},render:e=>({components:{MmButton:n},setup(){return{args:e}},template:`
      <mm-button
        v-bind="args"
        aria-current="page"
      >
        {{ args.default }}
      </mm-button>
    `})},d={args:{size:`small`,default:`Mark as read`}},f={args:{variant:`primary`,disabled:!0,default:`Save settings`}},p={args:{variant:`primary`,loading:!0,default:`Connecting...`}},m={args:{variant:`primary`,block:!0,default:`Save configuration`},decorators:[()=>({template:`<div style="width: 320px"><story /></div>`})]},h={args:{icon:`refresh`,default:`Refresh`}},g={args:{icon:`settings`,iconOnly:!0,default:`Open settings`}},_={args:{icon:`refresh`,iconOnly:!0,size:`small`,default:`Refresh`}},v={args:{variant:`primary`,icon:`refresh`,loading:!0,default:`Refreshing...`}},y={args:{icon:`refresh`,iconOnly:!0,loading:!0,default:`Refreshing`}},b=[`Playground`,`Primary`,`Secondary`,`Danger`,`Ghost`,`Pagination`,`PaginationActive`,`Small`,`Disabled`,`Loading`,`FullWidth`,`WithIcon`,`IconOnly`,`SmallIconOnly`,`LoadingWithIcon`,`LoadingIconOnly`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Interactive playground.
Change props using Storybook's Controls panel.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    default: 'Save settings'
  }
}`,...a.parameters?.docs?.source},description:{story:`Primary actions, such as saving settings.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    default: 'Refresh'
  }
}`,...o.parameters?.docs?.source},description:{story:`Standard actions, such as refreshing data.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    default: 'Remove torrent'
  }
}`,...s.parameters?.docs?.source},description:{story:`Destructive actions, such as removing a torrent.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    default: 'Dismiss'
  }
}`,...c.parameters?.docs?.source},description:{story:`Subtle actions, such as dismissing a notification.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'pagination',
    size: 'small',
    default: '3'
  }
}`,...l.parameters?.docs?.source},description:{story:`Pagination page button.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'pagination',
    size: 'small',
    disabled: true,
    default: '3'
  },
  render: args => ({
    components: {
      MmButton
    },
    setup() {
      return {
        args
      };
    },
    template: \`
      <mm-button
        v-bind="args"
        aria-current="page"
      >
        {{ args.default }}
      </mm-button>
    \`
  })
}`,...u.parameters?.docs?.source},description:{story:`Active pagination page.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'small',
    default: 'Mark as read'
  }
}`,...d.parameters?.docs?.source},description:{story:`Compact buttons for cards and toolbars.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    default: 'Save settings'
  }
}`,...f.parameters?.docs?.source},description:{story:`A disabled button cannot be activated.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    loading: true,
    default: 'Connecting...'
  }
}`,...p.parameters?.docs?.source},description:{story:`Loading buttons show progress and prevent repeated clicks.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    block: true,
    default: 'Save configuration'
  },
  decorators: [() => ({
    template: '<div style="width: 320px"><story /></div>'
  })]
}`,...m.parameters?.docs?.source},description:{story:`Full-width buttons, useful in settings forms.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'refresh',
    default: 'Refresh'
  }
}`,...h.parameters?.docs?.source},description:{story:`Button with an icon and text label.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'settings',
    iconOnly: true,
    default: 'Open settings'
  }
}`,...g.parameters?.docs?.source},description:{story:`Square icon-only button.

The icon is decorative. The button receives an accessible name.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'refresh',
    iconOnly: true,
    size: 'small',
    default: 'Refresh'
  }
}`,..._.parameters?.docs?.source},description:{story:`Compact icon-only button for toolbars.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    icon: 'refresh',
    loading: true,
    default: 'Refreshing...'
  }
}`,...v.parameters?.docs?.source},description:{story:`Loading replaces the icon with a spinner.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'refresh',
    iconOnly: true,
    loading: true,
    default: 'Refreshing'
  }
}`,...y.parameters?.docs?.source},description:{story:`Icon-only loading state.`,...y.parameters?.docs?.description}}}})))()}x();export{s as Danger,f as Disabled,m as FullWidth,c as Ghost,g as IconOnly,p as Loading,y as LoadingIconOnly,v as LoadingWithIcon,l as Pagination,u as PaginationActive,i as Playground,a as Primary,o as Secondary,d as Small,_ as SmallIconOnly,h as WithIcon,b as __namedExportsOrder,r as default};