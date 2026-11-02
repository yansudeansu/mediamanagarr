import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./MmTorrentCard-DH-Dt0k8.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),{fn:r}=__STORYBOOK_MODULE_TEST__,i={id:`a`.repeat(40),name:`Example Download (2026) 1080p WEB-DL`,statusLabel:`Downloading`,statusVariant:`downloading`,progress:42.5,progressLabel:`42.5%`,sizeLabel:`3.2 GiB / 7.5 GiB`,downloadSpeedLabel:`2.4 MiB/s`,uploadSpeedLabel:`122 KiB/s`,etaLabel:`1h 0m`,primaryActionLabel:`Stop`},a={title:`Molecules/TorrentCard`,component:n,tags:[`autodocs`],args:{torrent:i,pendingAction:null,disabled:!1,onPrimaryAction:r(),onRemove:r()},argTypes:{torrent:{control:`object`,description:`Formatted display data for the transfer.`},pendingAction:{control:`select`,options:[null,`primary`,`remove`],description:`Action currently in progress.`},disabled:{control:`boolean`,description:`Disable both actions.`},onPrimaryAction:{action:`primaryAction`,description:`Emitted when the primary action is requested.`},onRemove:{action:`remove`,description:`Emitted when removal is requested.`}},decorators:[()=>({template:`<div style="width: 340px; max-width: 100%;"><story /></div>`})]},o={},s={args:{torrent:{...i,statusLabel:`Stalled`,statusVariant:`neutral`,downloadSpeedLabel:`0 B/s`,etaLabel:`Unknown`}}},c={args:{torrent:{...i,statusLabel:`Seeding`,statusVariant:`seeding`,progress:100,progressLabel:`100.0%`,sizeLabel:`7.5 GiB / 7.5 GiB`,downloadSpeedLabel:`0 B/s`,uploadSpeedLabel:`781 KiB/s`,etaLabel:`Complete`}}},l={args:{torrent:{...i,statusLabel:`Stopped`,statusVariant:`stopped`,downloadSpeedLabel:`0 B/s`,uploadSpeedLabel:`0 B/s`,etaLabel:`Unknown`,primaryActionLabel:`Start`}}},u={args:{torrent:{...i,progress:98.7,progressLabel:`98.7%`,sizeLabel:`7.4 GiB / 7.5 GiB`,etaLabel:`2m 0s`}}},d={args:{torrent:{...i,statusLabel:`Error`,statusVariant:`error`,downloadSpeedLabel:`0 B/s`,uploadSpeedLabel:`0 B/s`,etaLabel:`Unknown`}}},f={args:{torrent:{...i,name:`Example Download (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing - 2160p HDR`}}},p={args:{pendingAction:`primary`}},m={args:{pendingAction:`remove`}},h={args:{disabled:!0}},g=[`Downloading`,`Stalled`,`Seeding`,`Stopped`,`NearlyComplete`,`Error`,`LongName`,`StopPending`,`RemovePending`,`Disabled`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      statusLabel: 'Stalled',
      statusVariant: 'neutral',
      downloadSpeedLabel: '0 B/s',
      etaLabel: 'Unknown'
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      statusLabel: 'Seeding',
      statusVariant: 'seeding',
      progress: 100,
      progressLabel: '100.0%',
      sizeLabel: '7.5 GiB / 7.5 GiB',
      downloadSpeedLabel: '0 B/s',
      uploadSpeedLabel: '781 KiB/s',
      etaLabel: 'Complete'
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      statusLabel: 'Stopped',
      statusVariant: 'stopped',
      downloadSpeedLabel: '0 B/s',
      uploadSpeedLabel: '0 B/s',
      etaLabel: 'Unknown',
      primaryActionLabel: 'Start'
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      progress: 98.7,
      progressLabel: '98.7%',
      sizeLabel: '7.4 GiB / 7.5 GiB',
      etaLabel: '2m 0s'
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      statusLabel: 'Error',
      statusVariant: 'error',
      downloadSpeedLabel: '0 B/s',
      uploadSpeedLabel: '0 B/s',
      etaLabel: 'Unknown'
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    torrent: {
      ...baseTorrent,
      name: 'Example Download (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing - 2160p HDR'
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    pendingAction: 'primary'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    pendingAction: 'remove'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as Disabled,o as Downloading,d as Error,f as LongName,u as NearlyComplete,m as RemovePending,c as Seeding,s as Stalled,p as StopPending,l as Stopped,g as __namedExportsOrder,a as default};