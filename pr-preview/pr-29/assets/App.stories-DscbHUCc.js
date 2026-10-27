import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{B as t,D as n,E as r,F as i,I as a,M as o,N as s,O as c,R as l,T as u,_ as d,a as f,d as p,f as m,g as h,h as g,l as _,m as v,p as y,u as b,v as x}from"./iframe-DS2CIQsU.js";import{n as S,t as C}from"./MmButton-Brgp6FHf.js";import{n as w,t as T}from"./_plugin-vue_export-helper-ktEZWxTd.js";import{n as E,t as D}from"./MmHeader-C5BBP8Pv.js";import{n as O,t as k}from"./MmNavigation-D6BtQVWh.js";import{n as A,t as j}from"./MmFooter-CX2KXaSr.js";import{n as M,t as N}from"./MmRequestsTemplate-FB3AyHK7.js";import{n as P,t as F}from"./MmRequestCard-DLu1B-s4.js";import{n as I,t as L}from"./MmPagination-CJRPHsED.js";import{n as R,t as ee}from"./MmFilterGroup-CN--6zWe.js";import{n as z,t as B}from"./MmUpNextTemplate-lQHKkz5j.js";import{n as te,t as V}from"./MmArrivalCard-CNTpG1_y.js";import{n as ne,t as re}from"./MmCalendarTemplate-DA7-r0DV.js";import{a as ie,c as H,n as ae,o as oe,r as se,s as ce,t as U}from"./calendar-date-eYd9mfWA.js";import{n as le,t as ue}from"./MmCalendarHeader-DmUyqJjh.js";import{n as de,t as fe}from"./MmCalendarGrid-BWd5Tm62.js";import{n as pe,t as me}from"./MmCalendarDetails-CSXGivYS.js";import{n as he,t as ge}from"./MmDownloadsTemplate-xiPOWMRM.js";import{o as _e,s as ve}from"./qbittorrent-format-CXFQV4mN.js";import{n as ye,t as be}from"./MmTransferStats-CxVV4jg-.js";import{n as xe,t as Se}from"./MmTorrentConfirmation-DiHd8b9y.js";import{n as Ce,t as we}from"./MmTorrentList-W-OcIL-j.js";import{n as Te,t as Ee}from"./MmSettingsTemplate-DHCfnGP3.js";import{n as De,r as Oe,t as ke}from"./service-DG4ddwt3.js";import{n as Ae,t as je}from"./MmServiceSelector-D7CiuaWf.js";import{a as Me,n as Ne,r as Pe,t as Fe}from"./MmServiceForm-DIngtBsj.js";async function W(e){if(typeof chrome>`u`||!chrome.runtime?.sendMessage)throw Error(`Background messaging is unavailable.`);return chrome.runtime.sendMessage(e)}var Ie,Le,Re,ze,G;function Be(){return(Be=e((()=>{f(),M(),P(),I(),R(),S(),Ie={key:0,class:`request-view__message`,role:`status`},Le={key:1,class:`request-view__error`,role:`alert`},Re={key:2,class:`request-view__message`},ze=10,G=x({__name:`MmRequestView`,setup(e){let r=[{label:`All`,value:`all`},{label:`Pending`,value:`pending`},{label:`Approved`,value:`approved`}],a=i([]),o=i(`all`),l=i(1),f=i(0),y=i(!1),x=i(``),S=b(()=>Math.max(1,Math.ceil(f.value/ze))),w=0;function T(e){return e instanceof Error?e.message:`An unexpected error occurred.`}async function E(){let e=++w,t=l.value,n=o.value;y.value=!0,x.value=``;try{let r=await W({type:`GET_SEERR_REQUESTS`,page:t,pageSize:ze,filter:n});if(e!==w)return;if(!r.success)throw Error(r.error);a.value=r.requests.items,f.value=r.requests.total}catch(t){if(e!==w)return;a.value=[],f.value=0,x.value=T(t)}finally{e===w&&(y.value=!1)}}function D(e){(e===`all`||e===`pending`||e===`approved`)&&o.value!==e&&(o.value=e,l.value=1,E())}function O(e){!Number.isInteger(e)||e<1||e>S.value||e===l.value||(l.value=e,E())}function k(){y.value||E()}return u(()=>{E()}),(e,i)=>(n(),m(N,null,g({actions:s(()=>[d(C,{variant:`secondary`,size:`small`,icon:`refresh`,loading:y.value,disabled:y.value,onClick:k},{default:s(()=>[...i[0]||=[h(` Refresh `,-1)]]),_:1},8,[`loading`,`disabled`])]),filters:s(()=>[d(ee,{"model-value":o.value,options:r,"aria-label":`Request status filters`,"onUpdate:modelValue":D},null,8,[`model-value`])]),default:s(()=>[y.value?(n(),v(`p`,Ie,`Loading requests…`)):x.value?(n(),v(`div`,Le,[p(`p`,null,t(x.value),1),d(C,{variant:`secondary`,size:`small`,onClick:k},{default:s(()=>[...i[1]||=[h(` Retry `,-1)]]),_:1})])):a.value.length===0?(n(),v(`p`,Re,`No requests found.`)):(n(!0),v(_,{key:3},c(a.value,e=>(n(),m(F,{key:e.id,request:e},null,8,[`request`]))),128))]),_:2},[!y.value&&!x.value&&S.value>1?{name:`pagination`,fn:s(()=>[d(L,{page:l.value,"total-pages":S.value,"onUpdate:page":O},null,8,[`page`,`total-pages`])]),key:`0`}:void 0]),1024))}})})))()}var Ve;function He(){return(He=e((()=>{Be(),w(),Ve=T(G,[[`__scopeId`,`data-v-faa6b9f7`]]),G.__docgenInfo=Object.assign({displayName:G.name??G.__name},{exportName:`default`,displayName:`MmRequestView`,description:``,tags:{},sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/views/MmRequestView.vue`]})})))()}var Ue,We,Ge,Ke,qe,K;function Je(){return(Je=e((()=>{f(),z(),te(),I(),R(),S(),Ue={key:0,class:`up-next-view__message`,role:`status`},We={key:1,class:`up-next-view__error`,role:`alert`},Ge={key:0,class:`up-next-view__action-error`,role:`alert`},Ke={key:1,class:`up-next-view__message`},qe=10,K=x({__name:`MmUpNextView`,setup(e){let r=[{label:`All`,value:`all`},{label:`New`,value:`new`}],a=i([]),o=i({}),l=i([]),f=i(`all`),x=i(1),S=i(0),w=i(0),T=i(0),E=i(!1),D=i(!1),O=i(``),k=i(``),A=b(()=>Math.max(1,Math.ceil(S.value/qe))),j=b(()=>T.value>0?`${T.value} new · ${w.value} unwatched items`:`${w.value} unwatched items`),M=0;function N(e){return e instanceof Error?e.message:`An unexpected error occurred.`}async function P(e,t){if(!Object.hasOwn(o.value,e.imageId))try{let n=await W({type:`GET_JELLYFIN_IMAGE`,itemId:e.imageId,imageTag:e.imageTag});if(t!==M)return;o.value[e.imageId]=n.success?n.image:null}catch{t===M&&(o.value[e.imageId]=null)}}async function F(){let e=++M;E.value=!0,O.value=``,k.value=``;try{let t=await W({type:`GET_JELLYFIN_ARRIVALS`,page:x.value,pageSize:qe,filter:f.value});if(e!==M)return;if(!t.success)throw Error(t.error);a.value=t.arrivals.items,S.value=t.arrivals.total,T.value=t.unreadCount,f.value===`all`&&(w.value=t.arrivals.total);for(let n of t.arrivals.items)P(n,e)}catch(t){if(e!==M)return;a.value=[],S.value=0,O.value=N(t)}finally{e===M&&(E.value=!1)}}function I(e){(e===`all`||e===`new`)&&e!==f.value&&(f.value=e,x.value=1,F())}function R(e){!Number.isInteger(e)||e<1||e>A.value||e===x.value||(x.value=e,F())}function z(){E.value||F()}async function te(e,t){if(!l.value.includes(e)){l.value=[...l.value,e],k.value=``;try{let n=await W({type:`SET_JELLYFIN_ARRIVAL_UNREAD`,itemId:e,unread:t});if(!n.success)throw Error(n.error);if(T.value=n.unreadCount,f.value===`new`&&!t){let e=Math.max(1,Math.ceil(n.unreadCount/qe));x.value=Math.min(x.value,e),await F()}else a.value=a.value.map(n=>n.id===e?{...n,unread:t}:n)}catch(e){k.value=N(e)}finally{l.value=l.value.filter(t=>t!==e)}}}async function ne(){if(!(D.value||T.value===0)){D.value=!0,k.value=``;try{let e=await W({type:`CLEAR_JELLYFIN_NOTIFICATIONS`});if(!e.success)throw Error(e.error);T.value=e.unreadCount,f.value===`new`?(x.value=1,await F()):a.value=a.value.map(e=>({...e,unread:!1}))}catch(e){k.value=N(e)}finally{D.value=!1}}}return u(()=>{F()}),(e,i)=>(n(),m(B,null,g({description:s(()=>[h(t(j.value),1)]),actions:s(()=>[T.value>0?(n(),m(C,{key:0,variant:`secondary`,size:`small`,loading:D.value,disabled:E.value||D.value,onClick:ne},{default:s(()=>[...i[0]||=[h(` Clear notifications `,-1)]]),_:1},8,[`loading`,`disabled`])):y(``,!0),d(C,{variant:`secondary`,size:`small`,icon:`refresh`,loading:E.value,disabled:E.value||D.value,onClick:z},{default:s(()=>[...i[1]||=[h(` Refresh `,-1)]]),_:1},8,[`loading`,`disabled`])]),filters:s(()=>[d(ee,{"model-value":f.value,options:r,"aria-label":`Arrival filters`,"onUpdate:modelValue":I},null,8,[`model-value`])]),default:s(()=>[E.value?(n(),v(`p`,Ue,`Loading arrivals…`)):O.value?(n(),v(`div`,We,[p(`p`,null,t(O.value),1),d(C,{variant:`secondary`,size:`small`,onClick:z},{default:s(()=>[...i[2]||=[h(` Retry `,-1)]]),_:1})])):(n(),v(_,{key:2},[k.value?(n(),v(`p`,Ge,t(k.value),1)):y(``,!0),a.value.length===0?(n(),v(`p`,Ke,t(f.value===`new`?`No new items right now.`:`Nothing unwatched in your recent library.`),1)):y(``,!0),(n(!0),v(_,null,c(a.value,e=>(n(),m(V,{key:e.id,arrival:e,image:o.value[e.imageId],busy:l.value.includes(e.id),onToggleUnread:te},null,8,[`arrival`,`image`,`busy`]))),128))],64))]),_:2},[!E.value&&!O.value&&A.value>1?{name:`pagination`,fn:s(()=>[d(L,{page:x.value,"total-pages":A.value,"onUpdate:page":R},null,8,[`page`,`total-pages`])]),key:`0`}:void 0]),1024))}})})))()}var Ye;function Xe(){return(Xe=e((()=>{Je(),w(),Ye=T(K,[[`__scopeId`,`data-v-b79fb0a7`]]),K.__docgenInfo=Object.assign({displayName:K.name??K.__name},{exportName:`default`,displayName:`MmUpNextView`,description:``,tags:{},sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/views/MmUpNextView.vue`]})})))()}var Ze,Qe,$e,et,q;function tt(){return(tt=e((()=>{f(),ne(),le(),de(),pe(),R(),S(),Ze={key:0,class:`calendar-view__message`,role:`status`},Qe={key:1,class:`calendar-view__error`,role:`alert`},$e={key:0,class:`calendar-view__message`},et=`mediaManagarrCalendarPosition`,q=x({__name:`MmCalendarView`,setup(e){let r=[{label:`All`,value:`all`},{label:`TV`,value:`tv`},{label:`Movies`,value:`movie`}],l=U(new Date),f=i(U(H(new Date))),x=i(l),S=i(`all`),w=i([]),T=i([]),E=i(!1),D=i(``),O=i({}),k=new Map,A=new Map,j=0,M=b(()=>S.value===`all`?w.value:w.value.filter(e=>e.type===S.value)),N=b(()=>M.value.filter(e=>ae(e.date)===x.value)),P=b(()=>{let e=f.value.slice(0,7);return M.value.filter(t=>ae(t.date)?.startsWith(e)).length}),F=b(()=>P.value===1?`1 release this month`:`${P.value} releases this month`),I=b(()=>T.value.filter(e=>e.state===`failed`).map(e=>({service:e.service===`sonarr`?`Sonarr`:`Radarr`,message:e.error??`Unable to load calendar releases.`}))),L=b(()=>T.value.length>0&&T.value.every(e=>e.state===`not-configured`));function R(e){return e instanceof Error?e.message:`An unexpected error occurred.`}function z(){return oe(f.value)??H(new Date)}async function B(){try{await chrome.storage.local.set({[et]:{month:f.value,selectedDate:x.value}})}catch{}}async function te(){try{let e=(await chrome.storage.local.get(et))[et];if(!e)return;let t=oe(e.month),n=oe(e.selectedDate);if(!t||!n)return;let r=U(H(t));if(e.selectedDate.slice(0,7)!==r.slice(0,7))return;f.value=r,x.value=U(n)}catch{}}async function V(){let e=++j,{start:t,end:n}=se(z());E.value=!0,D.value=``;try{let r=await W({type:`GET_CALENDAR`,start:U(t),end:U(n)});if(e!==j)return;if(!r.success)throw Error(r.error);w.value=r.calendar.items,T.value=r.calendar.services}catch(t){if(e!==j)return;w.value=[],T.value=[],D.value=R(t)}finally{e===j&&(E.value=!1)}}async function ne(e){let t=e.posterMediaId;if(typeof t!=`number`||!Number.isSafeInteger(t)||t<1)return;let n=`${e.source}-${t}`;if(k.has(n)){O.value[e.id]=k.get(n)??null;return}let r=A.get(n);r||(r=(async()=>{try{let n=await W({type:`GET_CALENDAR_IMAGE`,service:e.source,mediaId:t});return n.success?n.image:null}catch{return null}})(),A.set(n,r));try{let t=await r;k.set(n,t),O.value[e.id]=t}finally{A.get(n)===r&&A.delete(n)}}o(N,e=>{for(let t of e)t.posterUrl&&t.posterMediaId&&ne(t)},{immediate:!0});function le(e){(e===`all`||e===`tv`||e===`movie`)&&(S.value=e)}function de(e){let t=oe(e);if(!t)return;x.value=e;let n=U(H(t));n!==f.value&&(f.value=n,V()),B()}function pe(){f.value=U(ce(z())),x.value=f.value,B(),V()}function he(){f.value=U(ie(z())),x.value=f.value,B(),V()}function ge(){let e=U(new Date),t=U(H(new Date));x.value=e,f.value!==t&&(f.value=t,V()),B()}function _e(){E.value||V()}return u(async()=>{await te(),await V()}),(e,i)=>(n(),m(re,null,g({description:s(()=>[h(t(F.value),1)]),filters:s(()=>[d(ee,{"model-value":S.value,options:r,"aria-label":`Calendar filters`,"onUpdate:modelValue":le},null,8,[`model-value`])]),actions:s(()=>[d(C,{variant:`secondary`,size:`small`,onClick:ge},{default:s(()=>[...i[0]||=[h(` Today `,-1)]]),_:1}),d(C,{variant:`secondary`,size:`small`,icon:`refresh`,"icon-only":``,"aria-label":`Refresh calendar`,title:`Refresh calendar`,disabled:E.value,onClick:_e},null,8,[`disabled`])]),navigation:s(()=>[d(ue,{month:f.value,onPrevious:pe,onNext:he},null,8,[`month`])]),default:s(()=>[!E.value&&!D.value?(n(),v(_,{key:0},[L.value?(n(),v(`p`,$e,` Connect Sonarr or Radarr in Settings to see upcoming releases. `)):y(``,!0),d(fe,{month:f.value,"selected-date":x.value,today:a(l),items:M.value,onSelect:de},null,8,[`month`,`selected-date`,`today`,`items`])],64)):y(``,!0)]),_:2},[E.value||D.value||I.value.length>0?{name:`status`,fn:s(()=>[E.value?(n(),v(`p`,Ze,`Loading calendar…`)):y(``,!0),D.value?(n(),v(`div`,Qe,[p(`p`,null,t(D.value),1),d(C,{variant:`secondary`,size:`small`,onClick:_e},{default:s(()=>[...i[1]||=[h(` Retry `,-1)]]),_:1})])):y(``,!0),(n(!0),v(_,null,c(I.value,e=>(n(),v(`div`,{key:e.service,class:`calendar-view__warning`,role:`status`},[p(`strong`,null,t(e.service)+`:`,1),h(` `+t(e.message),1)]))),128))]),key:`0`}:void 0,!E.value&&!D.value&&!L.value?{name:`details`,fn:s(()=>[d(me,{date:x.value,items:N.value,images:O.value},null,8,[`date`,`items`,`images`])]),key:`1`}:void 0]),1024))}})})))()}var nt;function rt(){return(rt=e((()=>{tt(),w(),nt=T(q,[[`__scopeId`,`data-v-c66b4867`]]),q.__docgenInfo=Object.assign({displayName:q.name??q.__name},{exportName:`default`,displayName:`MmCalendarView`,description:``,tags:{},sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/views/MmCalendarView.vue`]})})))()}var it,at,ot,st,ct,lt,J;function ut(){return(ut=e((()=>{f(),he(),ye(),xe(),Ce(),S(),_e(),it={key:0,class:`downloads-view__message`,role:`status`},at={key:1,class:`downloads-view__error`,role:`alert`},ot={key:0,class:`downloads-view__error`,role:`alert`},st=5e3,ct=500,lt=8,J=x({__name:`MmDownloadsView`,setup(e){let a=i({torrents:[],downloadSpeed:0,uploadSpeed:0}),o=i(1),c=i(!0),l=i(!1),f=i(``),x=i(``),S=i(null),w=i(null),T=b(()=>a.value.torrents),E=!1,D=null,O=!1,k=0,A=b(()=>S.value?.action===`remove`);function j(e){return e instanceof Error?e.message:`An unexpected error occurred.`}function M(e){return new Promise(t=>{setTimeout(t,e)})}async function N(){let e=await W({type:`GET_QBITTORRENT_DOWNLOADS`});if(!e.success)throw Error(e.error);return e.downloads}function P(e){a.value=e;let t=Math.max(1,Math.ceil(e.torrents.length/10));o.value>t&&(o.value=t)}async function F(e=!1){if(!E||O||S.value)return;let t=k;O=!0,e?c.value=!0:l.value=!0;try{let e=await N();if(!E||t!==k)return;P(e),f.value=``}catch(e){if(!E||t!==k)return;f.value=j(e)}finally{O=!1,E&&t===k&&(c.value=!1,l.value=!1)}}function I(){c.value||l.value||S.value||F()}function L(e){!Number.isInteger(e)||e<1||(o.value=e)}function R(e){S.value||(w.value=T.value.find(t=>t.hash===e)??null,x.value=``)}function ee(){S.value||(w.value=null)}async function z(e,t,n=!1){let r;switch(e){case`start`:r=await W({type:`START_QBITTORRENT_TORRENT`,hash:t});break;case`stop`:r=await W({type:`STOP_QBITTORRENT_TORRENT`,hash:t});break;case`remove`:r=await W({type:`DELETE_QBITTORRENT_TORRENT`,hash:t,deleteFiles:n})}if(!r.success)throw Error(r.error)}function B(e,t,n){let r=n.torrents.find(e=>e.hash===t);return e===`remove`?r===void 0:r?e===`stop`?ve(r.state):!ve(r.state):!1}async function te(e,t,n){for(let r=0;r<lt;r+=1){if(!E||n!==k||(await M(ct),!E||n!==k))return!1;try{let r=await N();if(!E||n!==k)return!1;if(P(r),f.value=``,B(e,t,r))return!0}catch{}}return!1}async function V(e,t,n=!1){if(!E||S.value||O)return;let r=k;S.value={hash:t,action:e},x.value=``;try{if(await z(e,t,n),!E||r!==k)return;let i=await te(e,t,r);if(!E||r!==k)return;if(!i)throw Error(`qBittorrent did not confirm that the torrent was ${e===`remove`?`removed`:e===`start`?`started`:`stopped`}.`);e===`remove`&&(w.value=null)}catch(e){if(!E||r!==k)return;x.value=j(e)}finally{E&&r===k&&(S.value=null)}}function ne(e){V(`start`,e)}function re(e){V(`stop`,e)}function ie(e){w.value?.hash===e.hash&&V(`remove`,e.hash,e.deleteFiles)}return u(()=>{E=!0,k+=1,F(!0),D=setInterval(()=>{c.value||l.value||S.value||F()},st)}),r(()=>{E=!1,k+=1,D!==null&&(clearInterval(D),D=null)}),(e,r)=>(n(),m(ge,null,g({actions:s(()=>[d(C,{variant:`secondary`,size:`small`,icon:`refresh`,loading:c.value||l.value,disabled:c.value||l.value||S.value!==null,onClick:I},{default:s(()=>[...r[0]||=[h(` Refresh `,-1)]]),_:1},8,[`loading`,`disabled`])]),default:s(()=>[c.value?(n(),v(`p`,it,`Loading downloads…`)):f.value?(n(),v(`div`,at,[p(`p`,null,t(f.value),1),d(C,{variant:`secondary`,size:`small`,onClick:I},{default:s(()=>[...r[1]||=[h(` Retry `,-1)]]),_:1})])):(n(),v(_,{key:2},[x.value?(n(),v(`div`,ot,[p(`p`,null,t(x.value),1)])):y(``,!0),d(we,{torrents:T.value,page:o.value,"pending-action":S.value,disabled:S.value!==null,"onUpdate:page":L,onStart:ne,onStop:re,onRemove:R},null,8,[`torrents`,`page`,`pending-action`,`disabled`])],64))]),_:2},[!c.value&&!f.value?{name:`stats`,fn:s(()=>[d(be,{"download-speed":a.value.downloadSpeed,"upload-speed":a.value.uploadSpeed},null,8,[`download-speed`,`upload-speed`])]),key:`0`}:void 0,w.value&&!c.value?{name:`confirmation`,fn:s(()=>[d(Se,{torrent:w.value,loading:A.value,onConfirm:ie,onCancel:ee},null,8,[`torrent`,`loading`])]),key:`1`}:void 0]),1024))}})})))()}var dt;function ft(){return(ft=e((()=>{ut(),w(),dt=T(J,[[`__scopeId`,`data-v-9da037c4`]]),J.__docgenInfo=Object.assign({displayName:J.name??J.__name},{exportName:`default`,displayName:`MmDownloadsView`,description:``,tags:{},sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/views/MmDownloadsView.vue`]})})))()}var pt;function mt(){return(mt=e((()=>{f(),Te(),Ae(),Ne(),Oe(),pt=x({__name:`SettingsView`,setup(e){let t=i(`jellyfin`),r=i({}),a=i({}),o=i({}),c=i({}),l=i({}),f=i({}),p=i([]),h=i(``),g=i(!1),_=i(!1),v=i(``),y=i(``),x=b(()=>r.value[t.value]?.url??``),S=b(()=>r.value[t.value]?.configured??!1),C=b(()=>o.value[t.value]??!1),w=b(()=>c.value[t.value]??!1),T=b(()=>l.value[t.value]??``),E=b(()=>f.value[t.value]??``);function D(e){return e instanceof Error?e.message:`An unexpected error occurred.`}function O(e){l.value[e]=``,f.value[e]=``}function k(){v.value=``,y.value=``}function A(){p.value=[],h.value=``,k()}async function j(){if(!r.value.jellyfin?.configured)A();else{g.value=!0,k();try{let e=await W({type:`GET_JELLYFIN_USERS`});if(!e.success)throw Error(e.error);p.value=e.users,h.value=e.selectedUserId}catch(e){p.value=[],h.value=``,v.value=D(e)}finally{g.value=!1}}}async function M(e){if(!(_.value||g.value||c.value.jellyfin||o.value.jellyfin||!r.value.jellyfin?.configured)){_.value=!0,k();try{let t=await W({type:`SET_JELLYFIN_USER`,userId:e});if(!t.success)throw Error(t.error);h.value=t.userId,y.value=`Jellyfin user saved successfully.`}catch(e){v.value=D(e)}finally{_.value=!1}}}async function N(){try{let e=await W({type:`GET_SERVICE_CONFIGS`});if(!e.success)throw Error(e.error);r.value=e.configs;for(let t of ke)a.value[t]=e.configs[t]?.configured?`configured`:`not-configured`;e.configs.jellyfin?.configured?await j():A()}catch(e){l.value[t.value]=D(e)}}async function P(e){let{serviceId:t}=e;if(!(o.value[t]||c.value[t])){o.value[t]=!0,O(t),t===`jellyfin`&&k();try{let n=Me(e.url),i=Pe(n);if(!await chrome.permissions.request({origins:[i]}))throw Error(`Server access was not granted.`);let o=await W({type:`CONNECT_SERVICE`,serviceId:t,config:{url:n,apiKey:e.apiKey}});if(!o.success)throw Error(o.error);r.value[t]={url:n,configured:!0},a.value[t]=`connected`,f.value[t]=`Connected to ${De[t].name} successfully.`,t===`jellyfin`&&await j()}catch(e){a.value[t]=`failed`,l.value[t]=D(e)}finally{o.value[t]=!1}}}async function F(e){if(!(o.value[e]||c.value[e]||!r.value[e]?.configured)&&(e!==`jellyfin`||!_.value&&!g.value)){c.value[e]=!0,O(e),e===`jellyfin`&&k();try{let t=await W({type:`REMOVE_SERVICE`,serviceId:e});if(!t.success)throw Error(t.error);delete r.value[e],a.value[e]=`not-configured`,e===`jellyfin`&&A(),f.value[e]=`${De[e].name} server removed successfully.`}catch(t){l.value[e]=D(t)}finally{c.value[e]=!1}}}return u(()=>{N()}),(e,r)=>(n(),m(Ee,null,{selector:s(()=>[d(je,{modelValue:t.value,"onUpdate:modelValue":r[0]||=e=>t.value=e,statuses:a.value},null,8,[`modelValue`,`statuses`])]),configuration:s(()=>[d(Fe,{"service-id":t.value,url:x.value,configured:S.value,loading:C.value,removing:w.value,error:T.value,success:E.value,"jellyfin-users":p.value,"jellyfin-user-id":h.value,"jellyfin-users-loading":g.value,"jellyfin-user-saving":_.value,"jellyfin-users-error":v.value,"jellyfin-user-success":y.value,onConnect:P,onRemove:F,onEdit:r[1]||=e=>O(t.value),onSelectJellyfinUser:M},null,8,[`service-id`,`url`,`configured`,`loading`,`removing`,`error`,`success`,`jellyfin-users`,`jellyfin-user-id`,`jellyfin-users-loading`,`jellyfin-user-saving`,`jellyfin-users-error`,`jellyfin-user-success`])]),_:1}))}})})))()}var ht;function gt(){return(gt=e((()=>{mt(),ht=pt,pt.__docgenInfo=Object.assign({displayName:pt.name??pt.__name},{exportName:`default`,displayName:`SettingsView`,description:``,tags:{},sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/views/SettingsView.vue`]})})))()}function _t(){return globalThis.browser}async function vt(){let e=_t();if(e?.sidebarAction?.open)await e.sidebarAction.open();else if(typeof chrome<`u`&&chrome.sidePanel?.open){let e=await chrome.windows.getCurrent();if(e.id===void 0)throw Error(`Unable to determine the current browser window.`);await chrome.sidePanel.open({windowId:e.id})}else throw Error(`Native sidebar support is unavailable in this browser.`)}function yt(){let e=globalThis;return e.browser?.runtime?.getManifest()?.version??e.chrome?.runtime?.getManifest()?.version??`0.3.0`}function bt(e){if(typeof e!=`object`||!e||Array.isArray(e))return!1;let t=e;return Tt.some(e=>e===t.activeView)&&typeof t.settingsOpen==`boolean`}async function xt(){let e=(await chrome.storage.session.get(Ct))[Ct];return bt(e)?e:{...wt}}async function St(e){await chrome.storage.session.set({[Ct]:e})}var Ct,wt,Tt;function Et(){return(Et=e((()=>{Ct=`workspaceNavigationState`,wt={activeView:`requests`,settingsOpen:!1},Tt=[`requests`,`up-next`,`calendar`,`downloads`]})))()}var Dt,Ot;function kt(){return(kt=e((()=>{f(),E(),O(),A(),He(),Xe(),rt(),ft(),gt(),Et(),Dt={key:0,class:`workspace-error`,role:`alert`},Ot=x({__name:`App`,setup(e){let r=i(!1),s=i(`requests`),c=new URLSearchParams(window.location.search).get(`workspace`),f=i(c===`detached`?`detached`:c===`sidebar`?`sidebar`:`popup`),h=i(``),g=i(!1),_=i(!1),b=yt();function x(){return typeof chrome<`u`&&typeof chrome.storage?.session?.get==`function`&&typeof chrome.storage?.session?.set==`function`}u(async()=>{try{if(x()){let e=await xt();s.value=e.activeView,r.value=e.settingsOpen}}catch(e){console.warn(`MediaManagarr: Unable to restore workspace navigation:`,e)}finally{_.value=!0}}),o([s,r],async()=>{if(_.value&&x())try{await St({activeView:s.value,settingsOpen:r.value})}catch(e){console.warn(`MediaManagarr: Unable to save workspace navigation:`,e)}});async function S(){if(!g.value){h.value=``,g.value=!0;try{x()&&await St({activeView:s.value,settingsOpen:r.value});let e=await W({type:`OPEN_DETACHED_WORKSPACE`});e.success||(h.value=e.error)}catch(e){h.value=e instanceof Error?e.message:`Unable to open the detached workspace.`}finally{g.value=!1}}}async function C(){if(!g.value){h.value=``,g.value=!0;try{x()&&await St({activeView:s.value,settingsOpen:r.value}),await vt(),window.close()}catch(e){h.value=e instanceof Error?e.message:`Unable to open the browser sidebar.`}finally{g.value=!1}}}function w(){window.close()}return(e,i)=>(n(),v(`div`,{class:l([`app-shell`,{"app-shell--detached":f.value===`detached`,"app-shell--sidebar":f.value===`sidebar`}])},[d(D,{mode:r.value?`settings`:`main`,"window-mode":f.value,onSettings:i[0]||=e=>r.value=!0,onBack:i[1]||=e=>r.value=!1,onDetach:S,onAttach:w,onSidebar:C},null,8,[`mode`,`window-mode`]),h.value?(n(),v(`p`,Dt,t(h.value),1)):y(``,!0),r.value?y(``,!0):(n(),m(k,{key:1,"active-view":s.value,onNavigate:i[2]||=e=>s.value=e},null,8,[`active-view`])),p(`main`,{class:l([`app-content`,{"app-content--settings":r.value}])},[r.value?(n(),m(ht,{key:0})):s.value===`requests`?(n(),m(Ve,{key:1})):s.value===`up-next`?(n(),m(Ye,{key:2})):s.value===`calendar`?(n(),m(nt,{key:3})):s.value===`downloads`?(n(),m(dt,{key:4})):y(``,!0)],2),d(j,{version:a(b)},null,8,[`version`])],2))}})})))()}var At;function jt(){return(jt=e((()=>{kt(),w(),At=T(Ot,[[`__scopeId`,`data-v-da74b0e8`]]),Ot.__docgenInfo=Object.assign({displayName:Ot.name??Ot.__name},{exportName:`default`,displayName:`App`,description:``,tags:{},sourceFiles:[`/home/runner/work/mediamanagarr/mediamanagarr/src/App.vue`]})})))()}function Mt(e){let t=new Date;return t.setHours(12,0,0,0),t.setDate(t.getDate()+e),t.toISOString()}function Nt(){return Array.from({length:18},(e,t)=>{let n=t+1,r=t%3==0,i=t%5==0?`Pending`:t%7==0?`Declined`:`Approved`,a=i===`Pending`?`Pending`:t%4==0?`Available`:t%3==0?`Partially Available`:`Processing`;return{id:n,type:r?`tv`:`movie`,title:r?`TV Show ${n}`:`Movie ${n}`,status:i,mediaStatus:a,requestedBy:`Test User ${t%4+1}`,createdAt:Mt(-n),posterPath:null}})}function Pt(){return Array.from({length:15},(e,t)=>{let n=t+1,r=t%3==1;return{id:`arrival-${n}`,type:r?`Episode`:`Movie`,title:r?`TV Show ${n}`:`Movie ${n}`,subtitle:r?`Season 1 · Episode ${n}`:`Movie · 2026`,dateAdded:Mt(-Math.floor(t/2)),imageId:`mock-image-${n}`,imageTag:null,unread:t%3!=2}})}function Ft(){return[{source:`sonarr`,offset:-3,releaseType:`air`},{source:`radarr`,offset:-1,releaseType:`digital`},{source:`sonarr`,offset:0,releaseType:`air`},{source:`radarr`,offset:1,releaseType:`digital`},{source:`sonarr`,offset:3,releaseType:`air`},{source:`radarr`,offset:5,releaseType:`physical`},{source:`sonarr`,offset:8,releaseType:`air`},{source:`radarr`,offset:12,releaseType:`digital`},{source:`sonarr`,offset:16,releaseType:`air`},{source:`radarr`,offset:21,releaseType:`digital`}].map((e,t)=>{let n=t+1,r=e.source===`sonarr`;return{id:`calendar-${n}`,source:e.source,type:r?`tv`:`movie`,title:r?`TV Show ${n}`:`Movie ${n}`,subtitle:r?`S01E${String(n).padStart(2,`0`)} · Episode ${n}`:e.releaseType===`physical`?`Physical release`:`Digital release`,date:Mt(e.offset),releaseType:e.releaseType,posterUrl:null,posterMediaId:null}})}function It(e,t,n,r){let i=4*1024**3;return{hash:e.repeat(40),name:t,state:n,progress:r,downloadSpeed:n===`downloading`?2*1024**2:0,uploadSpeed:n===`uploading`?262144:0,eta:n===`downloading`?1800:-1,size:i,downloaded:Math.floor(i*r)}}function Lt(){return[It(`a`,`Movie 1 (2026) 1080p`,`downloading`,.48),It(`b`,`TV Show 1 S01E01 1080p`,`stoppedDL`,.72),It(`c`,`Movie 2 (2026) 2160p`,`uploading`,1),It(`d`,`Movie 3 (2026) 1080p`,`stalledDL`,.18)]}function Rt(e,t=1,n=10){let r=Math.max(1,Math.floor(t)),i=Math.max(1,Math.floor(n)),a=(r-1)*i;return{items:e.slice(a,a+i),total:e.length}}function zt(e={}){let t=e.downloads??`populated`,n=Nt(),r=Ft(),i=Pt(),a=t===`empty`?[]:Lt(),o=`mock-user-1`,s=[{id:`mock-user-1`,name:`Test User 1`},{id:`mock-user-2`,name:`Test User 2`}],c=Object.fromEntries(ke.map(e=>[e,{url:`https://${e}.storybook.invalid`,configured:!0}])),l=[];function u(){return i.filter(e=>e.unread).length}function d(){return{success:!0,downloads:{torrents:a.map(e=>({...e})),downloadSpeed:a.reduce((e,t)=>e+t.downloadSpeed,0),uploadSpeed:a.reduce((e,t)=>e+t.uploadSpeed,0)}}}function f(e){switch(e.type){case`OPEN_DETACHED_WORKSPACE`:return{success:!0,windowId:42};case`GET_SERVICE_CONFIGS`:return{success:!0,configs:{...c}};case`CONNECT_SERVICE`:return c[e.serviceId]={url:e.config.url,configured:!0},{success:!0,serviceId:e.serviceId};case`REMOVE_SERVICE`:return delete c[e.serviceId],{success:!0,serviceId:e.serviceId};case`GET_JELLYFIN_USERS`:return{success:!0,users:[...s],selectedUserId:o};case`SET_JELLYFIN_USER`:return o=e.userId,{success:!0,userId:e.userId};case`GET_JELLYFIN_ARRIVALS`:return{success:!0,arrivals:Rt(e.filter===`new`?i.filter(e=>e.unread):i,e.page,e.pageSize),unreadCount:u()};case`GET_JELLYFIN_IMAGE`:case`GET_CALENDAR_IMAGE`:return{success:!0,image:null};case`SET_JELLYFIN_ARRIVAL_UNREAD`:return i=i.map(t=>t.id===e.itemId?{...t,unread:e.unread}:t),{success:!0,unreadCount:u()};case`CLEAR_JELLYFIN_NOTIFICATIONS`:return i=i.map(e=>({...e,unread:!1})),{success:!0,unreadCount:0};case`GET_SEERR_REQUESTS`:return{success:!0,requests:Rt(n.filter(t=>e.filter===`pending`?t.status===`Pending`:e.filter!==`approved`||t.status===`Approved`),e.page,e.pageSize)};case`GET_CALENDAR`:{let t=new Date(e.start).getTime(),n=new Date(e.end).getTime();return{success:!0,calendar:{items:r.filter(e=>{let r=new Date(e.date).getTime();return r>=t&&r<=n}),services:[{service:`sonarr`,state:`connected`},{service:`radarr`,state:`connected`}]}}}case`GET_QBITTORRENT_DOWNLOADS`:return t===`error`?{success:!1,error:`Storybook: qBittorrent is unavailable.`}:d();case`START_QBITTORRENT_TORRENT`:return l.push({type:e.type,hash:e.hash}),a=a.map(t=>t.hash===e.hash?{...t,state:`downloading`,downloadSpeed:2*1024**2,uploadSpeed:0,eta:1800}:t),{success:!0,completed:!0};case`STOP_QBITTORRENT_TORRENT`:return l.push({type:e.type,hash:e.hash}),a=a.map(t=>t.hash===e.hash?{...t,state:`stoppedDL`,downloadSpeed:0,uploadSpeed:0,eta:-1}:t),{success:!0,completed:!0};case`DELETE_QBITTORRENT_TORRENT`:return l.push({type:e.type,hash:e.hash,deleteFiles:e.deleteFiles}),a=a.filter(t=>t.hash!==e.hash),{success:!0,completed:!0};default:throw Error(`Unhandled background message: ${String(e)}`)}}return{handle:f,actions:l,getTorrents:()=>a.map(e=>({...e})),getUnreadCount:u}}function Bt(){return(Bt=e((()=>{Oe()})))()}var Vt,Ht,Ut,Wt,Y,X,Z,Q,$,Gt;function Kt(){return(Kt=e((()=>{f(),jt(),Bt(),{userEvent:Vt,within:Ht}=__STORYBOOK_MODULE_TEST__,Ut=`mediamanagarr:storybook-workspace`,Wt={title:`App/MediaManagarr`,component:At,tags:[`autodocs`],parameters:{layout:`centered`,docs:{source:{type:`code`,code:`<App />`}}}},Y={beforeEach:()=>{let e=zt(),t=globalThis.chrome,n=window.close,r=window.location.href,i=new Map,a=null,o=new URL(r);o.searchParams.delete(`workspace`),window.history.replaceState(null,``,o.toString());function s(e){a=e,window.dispatchEvent(new CustomEvent(Ut,{detail:e}))}return Object.defineProperty(globalThis,"chrome",{configurable:!0,value:{...t,storage:{...t?.storage,session:{get:async e=>{let t=e===null?Array.from(i.keys()):typeof e==`string`?[e]:e;return Object.fromEntries(t.filter(e=>i.has(e)).map(e=>[e,i.get(e)]))},set:async e=>{for(let[t,n]of Object.entries(e))i.set(t,n)},remove:async e=>{let t=typeof e==`string`?[e]:e;for(let e of t)i.delete(e)}}},windows:{...t?.windows,getCurrent:async()=>({id:1})},sidePanel:{...t?.sidePanel,open:async()=>{s(`sidebar`)}},runtime:{...t?.runtime,getManifest:()=>({manifest_version:3,name:`MediaManagarr`,version:`0.1.0`}),sendMessage:async t=>{let n=e.handle(t);return t.type===`OPEN_DETACHED_WORKSPACE`&&n.success&&s(`detached`),n}}}}),Object.defineProperty(window,"close",{configurable:!0,value:()=>{a===null?s(`popup`):a=null}}),()=>{window.history.replaceState(null,``,r),Object.defineProperty(globalThis,"chrome",{configurable:!0,value:t}),Object.defineProperty(window,"close",{configurable:!0,value:n})}},render:()=>x({name:`InteractiveWorkspaceStory`,components:{App:At},setup(){let e=i(`popup`),t=i(0);function n(n){let r=n.detail;if(e.value===r)return;e.value=r;let i=new URL(window.location.href);r===`popup`?i.searchParams.delete(`workspace`):i.searchParams.set(`workspace`,r),window.history.replaceState(null,``,i.toString()),t.value+=1}return u(()=>{window.addEventListener(Ut,n)}),r(()=>{window.removeEventListener(Ut,n)}),{workspaceMode:e,workspaceKey:t}},template:`
        <div
          :style="{
            width: workspaceMode === 'detached'
              ? '780px'
              : workspaceMode === 'sidebar'
                ? '340px'
                : '380px',
            height: workspaceMode === 'popup' ? '480px' : '700px',
            maxWidth: '100%',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'var(--background)'
          }"
        >
          <App :key="workspaceKey" />
        </div>
      `})},X={...Y,play:async({canvasElement:e})=>{let t=Ht(e);await Vt.click(t.getByRole(`button`,{name:`Up Next`}))}},Z={...Y,play:async({canvasElement:e})=>{let t=Ht(e);await Vt.click(t.getByRole(`button`,{name:`Calendar`}))}},Q={...Y,play:async({canvasElement:e})=>{let t=Ht(e);await Vt.click(t.getByRole(`button`,{name:`Downloads`}))}},$={...Y,play:async({canvasElement:e})=>{let t=Ht(e);await Vt.click(t.getByRole(`button`,{name:`Open settings`}))}},Gt=[`Default`,`UpNext`,`Calendar`,`Downloads`,`Settings`],Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  beforeEach: () => {
    const mock = createMockBackground();
    const originalChrome = globalThis.chrome;
    const originalClose = window.close;
    const originalUrl = window.location.href;

    // Storybook-only replacement for chrome.storage.session.
    // Values survive App remounts when switching workspaces.
    const sessionStorage = new Map<string, unknown>();

    // Tracks which workspace is being opened so window.close()
    // does not immediately return the preview to popup mode.
    let pendingWorkspaceMode: WorkspaceMode | null = null;
    const initialUrl = new URL(originalUrl);
    initialUrl.searchParams.delete('workspace');
    window.history.replaceState(null, '', initialUrl.toString());
    function dispatchWorkspaceMode(mode: WorkspaceMode): void {
      pendingWorkspaceMode = mode;
      window.dispatchEvent(new CustomEvent<WorkspaceMode>(WORKSPACE_EVENT, {
        detail: mode
      }));
    }
    Object.defineProperty(globalThis, 'chrome', {
      configurable: true,
      value: {
        ...originalChrome,
        storage: {
          ...originalChrome?.storage,
          session: {
            get: async (keys: string | string[] | null) => {
              const requestedKeys = keys === null ? Array.from(sessionStorage.keys()) : typeof keys === 'string' ? [keys] : keys;
              return Object.fromEntries(requestedKeys.filter(key => sessionStorage.has(key)).map(key => [key, sessionStorage.get(key)]));
            },
            set: async (items: Record<string, unknown>) => {
              for (const [key, value] of Object.entries(items)) {
                sessionStorage.set(key, value);
              }
            },
            remove: async (keys: string | string[]) => {
              const requestedKeys = typeof keys === 'string' ? [keys] : keys;
              for (const key of requestedKeys) {
                sessionStorage.delete(key);
              }
            }
          }
        },
        windows: {
          ...originalChrome?.windows,
          getCurrent: async () => ({
            id: 1
          })
        },
        sidePanel: {
          ...originalChrome?.sidePanel,
          open: async () => {
            dispatchWorkspaceMode('sidebar');
          }
        },
        runtime: {
          ...originalChrome?.runtime,
          getManifest: () => ({
            manifest_version: 3,
            name: 'MediaManagarr',
            version: '0.1.0'
          }),
          sendMessage: async (message: BackgroundMessage) => {
            const response = mock.handle(message);
            if (message.type === 'OPEN_DETACHED_WORKSPACE' && response.success) {
              dispatchWorkspaceMode('detached');
            }
            return response;
          }
        }
      }
    });
    Object.defineProperty(window, 'close', {
      configurable: true,
      value: () => {
        if (pendingWorkspaceMode !== null) {
          pendingWorkspaceMode = null;
          return;
        }
        dispatchWorkspaceMode('popup');
      }
    });
    return () => {
      window.history.replaceState(null, '', originalUrl);
      Object.defineProperty(globalThis, 'chrome', {
        configurable: true,
        value: originalChrome
      });
      Object.defineProperty(window, 'close', {
        configurable: true,
        value: originalClose
      });
    };
  },
  render: () => defineComponent({
    name: 'InteractiveWorkspaceStory',
    components: {
      App
    },
    setup() {
      const workspaceMode = ref<WorkspaceMode>('popup');
      const workspaceKey = ref(0);
      function changeWorkspaceMode(event: Event): void {
        const mode = (event as CustomEvent<WorkspaceMode>).detail;
        if (workspaceMode.value === mode) {
          return;
        }
        workspaceMode.value = mode;
        const url = new URL(window.location.href);
        if (mode === 'popup') {
          url.searchParams.delete('workspace');
        } else {
          url.searchParams.set('workspace', mode);
        }
        window.history.replaceState(null, '', url.toString());

        // Remount App to simulate opening the selected workspace.
        // Mocked session storage survives this remount.
        workspaceKey.value += 1;
      }
      onMounted(() => {
        window.addEventListener(WORKSPACE_EVENT, changeWorkspaceMode);
      });
      onUnmounted(() => {
        window.removeEventListener(WORKSPACE_EVENT, changeWorkspaceMode);
      });
      return {
        workspaceMode,
        workspaceKey
      };
    },
    template: \`
        <div
          :style="{
            width: workspaceMode === 'detached'
              ? '780px'
              : workspaceMode === 'sidebar'
                ? '340px'
                : '380px',
            height: workspaceMode === 'popup' ? '480px' : '700px',
            maxWidth: '100%',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'var(--background)'
          }"
        >
          <App :key="workspaceKey" />
        </div>
      \`
  })
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  ...Default,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Up Next'
    }));
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  ...Default,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Calendar'
    }));
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  ...Default,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Downloads'
    }));
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  ...Default,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Open settings'
    }));
  }
}`,...$.parameters?.docs?.source}}}})))()}Kt();export{Z as Calendar,Y as Default,Q as Downloads,$ as Settings,X as UpNext,Gt as __namedExportsOrder,Wt as default};