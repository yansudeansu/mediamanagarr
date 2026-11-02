import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,a as n}from"./iframe-CS7GQ-tH.js";import{n as r,t as i}from"./MmTransferStats-DtlE1Btr.js";var a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),r(),a={title:`Molecules/TransferStats`,component:i,tags:[`autodocs`],args:{downloadSpeed:13107200,uploadSpeed:2411724.8},argTypes:{downloadSpeed:{control:`number`,description:`Overall download speed in bytes per second.`},uploadSpeed:{control:`number`,description:`Overall upload speed in bytes per second.`}},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},o={},s={args:{downloadSpeed:0,uploadSpeed:0}},c={args:{downloadSpeed:26214400,uploadSpeed:524288}},l={args:{downloadSpeed:0,uploadSpeed:8388608}},u={args:{downloadSpeed:1.5*1024**3,uploadSpeed:125*1024**2}},d={args:{downloadSpeed:512,uploadSpeed:128}},f={args:{downloadSpeed:-1024,uploadSpeed:NaN}},p={render:()=>({components:{MmTransferStats:i},setup(){let e=t(0),n=t(0);function r(){e.value=0,n.value=0}function i(){e.value=26214400,n.value=524288}function a(){e.value=0,n.value=8388608}return{downloadSpeed:e,uploadSpeed:n,setIdle:r,setDownloading:i,setSeeding:a}},template:`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <button type="button" @click="setIdle">Idle</button>
          <button type="button" @click="setDownloading">Downloading</button>
          <button type="button" @click="setSeeding">Seeding</button>
        </div>

        <mm-transfer-stats
          :download-speed="downloadSpeed"
          :upload-speed="uploadSpeed"
        />
      </div>
    `})},m=[`Default`,`Idle`,`Downloading`,`Seeding`,`HighSpeed`,`LowSpeed`,`InvalidSpeeds`,`ReactiveUpdates`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    downloadSpeed: 0,
    uploadSpeed: 0
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    downloadSpeed: 25 * 1024 * 1024,
    uploadSpeed: 512 * 1024
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    downloadSpeed: 0,
    uploadSpeed: 8 * 1024 * 1024
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    downloadSpeed: 1.5 * 1024 ** 3,
    uploadSpeed: 125 * 1024 ** 2
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    downloadSpeed: 512,
    uploadSpeed: 128
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    downloadSpeed: -1024,
    uploadSpeed: Number.NaN
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      MmTransferStats
    },
    setup() {
      const downloadSpeed = ref(0);
      const uploadSpeed = ref(0);
      function setIdle(): void {
        downloadSpeed.value = 0;
        uploadSpeed.value = 0;
      }
      function setDownloading(): void {
        downloadSpeed.value = 25 * 1024 * 1024;
        uploadSpeed.value = 512 * 1024;
      }
      function setSeeding(): void {
        downloadSpeed.value = 0;
        uploadSpeed.value = 8 * 1024 * 1024;
      }
      return {
        downloadSpeed,
        uploadSpeed,
        setIdle,
        setDownloading,
        setSeeding
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <button type="button" @click="setIdle">Idle</button>
          <button type="button" @click="setDownloading">Downloading</button>
          <button type="button" @click="setSeeding">Seeding</button>
        </div>

        <mm-transfer-stats
          :download-speed="downloadSpeed"
          :upload-speed="uploadSpeed"
        />
      </div>
    \`
  })
}`,...p.parameters?.docs?.source}}}})))()}h();export{o as Default,c as Downloading,u as HighSpeed,s as Idle,f as InvalidSpeeds,d as LowSpeed,p as ReactiveUpdates,l as Seeding,m as __namedExportsOrder,a as default};