import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{P as t,a as n}from"./iframe-DOEAX4Fg.js";import{n as r,t as i}from"./MmCheckbox-DGSAW8ZH.js";var a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),r(),a={title:`Atoms/MmCheckbox`,component:i,tags:[`autodocs`],args:{label:`Delete downloaded files`,modelValue:!1,hint:``,disabled:!1,required:!1},argTypes:{modelValue:{control:`boolean`,description:`Whether the checkbox is checked.`},label:{control:`text`,description:`Accessible checkbox label.`},hint:{control:`text`,description:`Optional helper text displayed below the checkbox.`},disabled:{control:`boolean`,description:`Disable checkbox interaction.`},required:{control:`boolean`,description:`Mark the checkbox as required.`}},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},o={},s={args:{modelValue:!0}},c={args:{hint:`This will permanently delete the downloaded data.`}},l={args:{modelValue:!0,hint:`This will permanently delete the downloaded data.`}},u={args:{disabled:!0}},d={args:{modelValue:!0,disabled:!0}},f={args:{label:`I understand the consequences`,required:!0}},p={render:e=>({components:{MmCheckbox:i},setup(){return{args:e,checked:t(e.modelValue)}},template:`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <mm-checkbox
          v-bind="args"
          v-model="checked"
        />

        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          Checked: {{ checked ? 'Yes' : 'No' }}
        </p>
      </div>
    `})},m=[`Default`,`Checked`,`WithHint`,`CheckedWithHint`,`Disabled`,`DisabledChecked`,`Required`,`Interactive`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: true
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    hint: 'This will permanently delete the downloaded data.'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: true,
    hint: 'This will permanently delete the downloaded data.'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: true,
    disabled: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'I understand the consequences',
    required: true
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmCheckbox
    },
    setup() {
      const checked = ref(args.modelValue);
      return {
        args,
        checked
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <mm-checkbox
          v-bind="args"
          v-model="checked"
        />

        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          Checked: {{ checked ? 'Yes' : 'No' }}
        </p>
      </div>
    \`
  })
}`,...p.parameters?.docs?.source}}}})))()}h();export{s as Checked,l as CheckedWithHint,o as Default,u as Disabled,d as DisabledChecked,p as Interactive,f as Required,c as WithHint,m as __namedExportsOrder,a as default};