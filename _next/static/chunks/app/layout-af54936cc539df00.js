(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{2142:function(e,t,n){Promise.resolve().then(n.t.bind(n,1749,23)),Promise.resolve().then(n.t.bind(n,5935,23)),Promise.resolve().then(n.t.bind(n,667,23)),Promise.resolve().then(n.bind(n,4919)),Promise.resolve().then(n.t.bind(n,4162,23)),Promise.resolve().then(n.t.bind(n,5358,23))},3313:function(e,t){"use strict";let n;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{DOMAttributeNames:function(){return r},isEqualNode:function(){return i},default:function(){return a}});let r={acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv",noModule:"noModule"};function o(e){let{type:t,props:n}=e,o=document.createElement(t);for(let e in n){if(!n.hasOwnProperty(e)||"children"===e||"dangerouslySetInnerHTML"===e||void 0===n[e])continue;let i=r[e]||e.toLowerCase();"script"===t&&("async"===i||"defer"===i||"noModule"===i)?o[i]=!!n[e]:o.setAttribute(i,n[e])}let{children:i,dangerouslySetInnerHTML:a}=n;return a?o.innerHTML=a.__html||"":i&&(o.textContent="string"==typeof i?i:Array.isArray(i)?i.join(""):""),o}function i(e,t){if(e instanceof HTMLElement&&t instanceof HTMLElement){let n=t.getAttribute("nonce");if(n&&!e.getAttribute("nonce")){let r=t.cloneNode(!0);return r.setAttribute("nonce",""),r.nonce=n,n===e.nonce&&e.isEqualNode(r)}}return e.isEqualNode(t)}function a(){return{mountedInstances:new Set,updateHead:e=>{let t={};e.forEach(e=>{if("link"===e.type&&e.props["data-optimized-fonts"]){if(document.querySelector('style[data-href="'+e.props["data-href"]+'"]'))return;e.props.href=e.props["data-href"],e.props["data-href"]=void 0}let n=t[e.type]||[];n.push(e),t[e.type]=n});let r=t.title?t.title[0]:null,o="";if(r){let{children:e}=r.props;o="string"==typeof e?e:Array.isArray(e)?e.join(""):""}o!==document.title&&(document.title=o),["meta","base","link","style","script"].forEach(e=>{n(e,t[e]||[])})}}}n=(e,t)=>{let n=document.getElementsByTagName("head")[0],r=n.querySelector("meta[name=next-head-count]"),a=Number(r.content),l=[];for(let t=0,n=r.previousElementSibling;t<a;t++,n=(null==n?void 0:n.previousElementSibling)||null){var s;(null==n?void 0:null==(s=n.tagName)?void 0:s.toLowerCase())===e&&l.push(n)}let c=t.map(o).filter(e=>{for(let t=0,n=l.length;t<n;t++)if(i(l[t],e))return l.splice(t,1),!1;return!0});l.forEach(e=>{var t;return null==(t=e.parentNode)?void 0:t.removeChild(e)}),c.forEach(e=>n.insertBefore(e,r)),r.content=(a-l.length+c.length).toString()},("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5935:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{handleClientScriptLoad:function(){return m},initScriptLoader:function(){return b},default:function(){return v}});let r=n(6921),o=n(1884),i=n(7437),a=r._(n(4887)),l=o._(n(2265)),s=n(7484),c=n(3313),u=n(2185),d=new Map,f=new Set,p=["onLoad","onReady","dangerouslySetInnerHTML","children","onError","strategy","stylesheets"],_=e=>{if(a.default.preinit){e.forEach(e=>{a.default.preinit(e,{as:"style"})});return}if("undefined"!=typeof window){let t=document.head;e.forEach(e=>{let n=document.createElement("link");n.type="text/css",n.rel="stylesheet",n.href=e,t.appendChild(n)})}},h=e=>{let{src:t,id:n,onLoad:r=()=>{},onReady:o=null,dangerouslySetInnerHTML:i,children:a="",strategy:l="afterInteractive",onError:s,stylesheets:u}=e,h=n||t;if(h&&f.has(h))return;if(d.has(t)){f.add(h),d.get(t).then(r,s);return}let m=()=>{o&&o(),f.add(h)},b=document.createElement("script"),y=new Promise((e,t)=>{b.addEventListener("load",function(t){e(),r&&r.call(this,t),m()}),b.addEventListener("error",function(e){t(e)})}).catch(function(e){s&&s(e)});for(let[n,r]of(i?(b.innerHTML=i.__html||"",m()):a?(b.textContent="string"==typeof a?a:Array.isArray(a)?a.join(""):"",m()):t&&(b.src=t,d.set(t,y)),Object.entries(e))){if(void 0===r||p.includes(n))continue;let e=c.DOMAttributeNames[n]||n.toLowerCase();b.setAttribute(e,r)}"worker"===l&&b.setAttribute("type","text/partytown"),b.setAttribute("data-nscript",l),u&&_(u),document.body.appendChild(b)};function m(e){let{strategy:t="afterInteractive"}=e;"lazyOnload"===t?window.addEventListener("load",()=>{(0,u.requestIdleCallback)(()=>h(e))}):h(e)}function b(e){e.forEach(m),[...document.querySelectorAll('[data-nscript="beforeInteractive"]'),...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e=>{let t=e.id||e.getAttribute("src");f.add(t)})}function y(e){let{id:t,src:n="",onLoad:r=()=>{},onReady:o=null,strategy:c="afterInteractive",onError:d,stylesheets:p,..._}=e,{updateScripts:m,scripts:b,getIsSsr:y,appDir:v,nonce:g}=(0,l.useContext)(s.HeadManagerContext),x=(0,l.useRef)(!1);(0,l.useEffect)(()=>{let e=t||n;x.current||(o&&e&&f.has(e)&&o(),x.current=!0)},[o,t,n]);let E=(0,l.useRef)(!1);if((0,l.useEffect)(()=>{!E.current&&("afterInteractive"===c?h(e):"lazyOnload"===c&&("complete"===document.readyState?(0,u.requestIdleCallback)(()=>h(e)):window.addEventListener("load",()=>{(0,u.requestIdleCallback)(()=>h(e))})),E.current=!0)},[e,c]),("beforeInteractive"===c||"worker"===c)&&(m?(b[c]=(b[c]||[]).concat([{id:t,src:n,onLoad:r,onReady:o,onError:d,..._}]),m(b)):y&&y()?f.add(t||n):y&&!y()&&h(e)),v){if(p&&p.forEach(e=>{a.default.preinit(e,{as:"style"})}),"beforeInteractive"===c)return n?(a.default.preload(n,_.integrity?{as:"script",integrity:_.integrity}:{as:"script"}),(0,i.jsx)("script",{nonce:g,dangerouslySetInnerHTML:{__html:"(self.__next_s=self.__next_s||[]).push("+JSON.stringify([n,{..._,id:t}])+")"}})):(_.dangerouslySetInnerHTML&&(_.children=_.dangerouslySetInnerHTML.__html,delete _.dangerouslySetInnerHTML),(0,i.jsx)("script",{nonce:g,dangerouslySetInnerHTML:{__html:"(self.__next_s=self.__next_s||[]).push("+JSON.stringify([0,{..._,id:t}])+")"}}));"afterInteractive"===c&&n&&a.default.preload(n,_.integrity?{as:"script",integrity:_.integrity}:{as:"script"})}return null}Object.defineProperty(y,"__nextScript",{value:!0});let v=y;("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4696:function(e,t,n){"use strict";var r=n(7437),o=n(1835),i=n.n(o),a=n(8792);t.Z=e=>{let{children:t,as:n,href:o="#",className:l,target:s}=e,c="".concat(i().btn," ").concat(l);return"a"===n?(0,r.jsx)(a.default,{href:o,className:c,target:s,children:t}):(0,r.jsx)("button",{type:"button",className:c,children:t})}},4919:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return _}});var r=n(7437),o=n(703),i=n(4696),a=n(5668),l=n.n(a),s=n(3672),c=JSON.parse('{"GI":[{"pc":"행사 소개","mobile":"소개"},{"pc":"프로그램 안내","mobile":"프로그램"},{"pc":"찾아오시는 길","mobile":"위치"},{"pc":"FAQ"}],"bU":{"link":"https://forms.gle/LDsqqq8bmAw8LST8A","text":"대기 신청하기"}}'),u=n(8792),d=n(2265);let f=c.GI,p=c.bU;var _=e=>{let{}=e,[t,n]=(0,d.useState)("section1");return(0,s.Z)(n,".section"),(0,r.jsx)("header",{className:l().header,children:(0,r.jsxs)("div",{className:"max-wrap2",children:[(0,r.jsx)("h1",{className:l().pc,children:(0,r.jsx)("a",{href:"/",children:(0,r.jsx)(o.default,{src:"images/logo.svg",alt:"JEJU AI CONFERENCE",width:280,height:32,priority:!0})})}),(0,r.jsxs)("div",{className:l().links,children:[(0,r.jsx)(u.default,{href:"/",className:"".concat(l().mobile," ").concat("section1"===t?l().active:""),children:"홈"}),f.map((e,n)=>(0,r.jsxs)(u.default,{href:"#section".concat(n+2),className:t==="section".concat(n+2)?l().active:"",children:[(0,r.jsx)("span",{className:l().pc,children:e.pc}),(0,r.jsx)("span",{className:l().mobile,children:e.mobile?e.mobile:e.pc})]},n)),p.link&&(0,r.jsx)(i.Z,{as:"a",href:p.link,className:l().pc,target:"_blank",children:p.text})]})]})})}},3672:function(e,t,n){"use strict";var r=n(2265);t.Z=(e,t)=>{let n=(0,r.useRef)({});(0,r.useEffect)(()=>{let r=window.innerWidth,o=new IntersectionObserver(t=>{var r;t.forEach(e=>{n.current[e.target.id]=e}),e(null===(r=Object.values(n.current).filter(e=>e.isIntersecting)[0])||void 0===r?void 0:r.target.id)},{rootMargin:"-80px 0px -80px 0px",threshold:r>640?[.4,1]:[0,.5,1]});return[...document.querySelectorAll(t)].forEach(e=>o.observe(e)),()=>o.disconnect()},[e])}},4162:function(){},1835:function(e){e.exports={btn:"Button_btn__ufDb_"}},667:function(e){e.exports={footer:"Footer_footer__M_1l_",logos:"Footer_logos__8wtJ9",ris:"Footer_ris__H5uQF",ccei:"Footer_ccei__RB8RL",gdg:"Footer_gdg__Pf22A",weniv:"Footer_weniv__ARWkd",reflow:"Footer_reflow__fb4zR",halla:"Footer_halla__FJu9E"}},5668:function(e){e.exports={header:"Header_header__GDTVa",links:"Header_links__Bh8VG",active:"Header_active__YsDcj",pc:"Header_pc__84IRf",mobile:"Header_mobile__3fC_e"}},5358:function(e){e.exports={style:{fontFamily:"'__pretendard_22f10c', '__pretendard_Fallback_22f10c'"},className:"__className_22f10c"}}},function(e){e.O(0,[607,971,69,744],function(){return e(e.s=2142)}),_N_E=e.O()}]);