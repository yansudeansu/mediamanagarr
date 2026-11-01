import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-CS7GQ-tH.js";import{n as r,t as i}from"./MmTorrentConfirmation-BvMuGOy3.js";var a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),r(),{fn:a}=__STORYBOOK_MODULE_TEST__,o={id:`a`.repeat(40),name:`Example Download (2026) 1080p WEB-DL`},s={id:`b`.repeat(40),name:`Another Download S01E01 1080p WEB-DL`},c={title:`Molecules/TorrentConfirmation`,component:i,tags:[`autodocs`],args:{item:o,loading:!1,title:`Remove item?`,description:`This will remove the item. Its associated files will be kept unless you choose to delete them below.`,deleteFilesLabel:`Also delete associated files`,deleteFilesHint:`Permanently delete the associated files from disk.`,deleteFilesWarning:`Warning: Associated files will also be deleted. This cannot be undone.`,onConfirm:a(),onCancel:a()},argTypes:{item:{control:`object`,description:`The item selected for removal, or null to hide the confirmation.`},loading:{control:`boolean`,description:`Whether the removal operation is processing.`},title:{control:`text`,description:`Confirmation heading.`},description:{control:`text`,description:`Explanation of the removal operation.`},deleteFilesLabel:{control:`text`,description:`Label for the optional file-deletion checkbox.`},deleteFilesHint:{control:`text`,description:`Additional explanation of the file-deletion option.`},deleteFilesWarning:{control:`text`,description:`Warning displayed when file deletion is selected.`},onConfirm:{description:`Emitted with the item ID and deleteFiles choice.`},onCancel:{description:`Emitted when the user cancels removal.`}},decorators:[()=>({template:`<div style="width: 380px; max-width: 100%;"><story /></div>`})]},l={},u={args:{loading:!0}},d={args:{item:{...o,name:`Example Download (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing 2160p HDR`}}},f={args:{item:null}},p={args:{title:`Remove download?`,description:`This download will be removed from the service. Downloaded files will be kept unless you select the option below.`,deleteFilesLabel:`Also delete downloaded files`,deleteFilesHint:`Permanently delete the downloaded data from disk.`,deleteFilesWarning:`Warning: Downloaded files will also be deleted. This cannot be undone.`}},m={render:e=>({components:{MmTorrentConfirmation:i},setup(){let n=t(o);function r(){n.value=null,e.onCancel?.()}function i(t){e.onConfirm?.(t),n.value=null}return{args:e,selectedItem:n,item:o,anotherItem:s,handleCancel:r,handleConfirm:i}},template:`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button
            type="button"
            @click="selectedItem = item"
          >
            Open first item
          </button>

          <button
            type="button"
            @click="selectedItem = anotherItem"
          >
            Open second item
          </button>
        </div>

        <mm-torrent-confirmation
          :item="selectedItem"
          :loading="args.loading"
          :title="args.title"
          :description="args.description"
          :delete-files-label="args.deleteFilesLabel"
          :delete-files-hint="args.deleteFilesHint"
          :delete-files-warning="args.deleteFilesWarning"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
    `})},h=[`Default`,`Loading`,`LongTorrentName`,`Hidden`,`CustomCopy`,`Interactive`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      ...item,
      name: 'Example Download (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing 2160p HDR'
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    item: null
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Remove download?',
    description: 'This download will be removed from the service. Downloaded files will be kept unless you select the option below.',
    deleteFilesLabel: 'Also delete downloaded files',
    deleteFilesHint: 'Permanently delete the downloaded data from disk.',
    deleteFilesWarning: 'Warning: Downloaded files will also be deleted. This cannot be undone.'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      MmTorrentConfirmation
    },
    setup() {
      const selectedItem = ref<ConfirmationItem | null>(item);
      function handleCancel(): void {
        selectedItem.value = null;
        args.onCancel?.();
      }
      function handleConfirm(payload: {
        id: string;
        deleteFiles: boolean;
      }): void {
        args.onConfirm?.(payload);
        selectedItem.value = null;
      }
      return {
        args,
        selectedItem,
        item,
        anotherItem,
        handleCancel,
        handleConfirm
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button
            type="button"
            @click="selectedItem = item"
          >
            Open first item
          </button>

          <button
            type="button"
            @click="selectedItem = anotherItem"
          >
            Open second item
          </button>
        </div>

        <mm-torrent-confirmation
          :item="selectedItem"
          :loading="args.loading"
          :title="args.title"
          :description="args.description"
          :delete-files-label="args.deleteFilesLabel"
          :delete-files-hint="args.deleteFilesHint"
          :delete-files-warning="args.deleteFilesWarning"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
    \`
  })
}`,...m.parameters?.docs?.source},description:{story:`Demonstrates opening, cancelling, and reopening the confirmation.

The delete-files checkbox must be unchecked every time the
confirmation is reopened or a different item is selected.`,...m.parameters?.docs?.description}}}})))()}g();export{p as CustomCopy,l as Default,f as Hidden,m as Interactive,u as Loading,d as LongTorrentName,h as __namedExportsOrder,c as default};