(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{4228:function(e,t,n){Promise.resolve().then(n.t.bind(n,1749,23)),Promise.resolve().then(n.t.bind(n,5935,23)),Promise.resolve().then(n.t.bind(n,667,23)),Promise.resolve().then(n.bind(n,4237)),Promise.resolve().then(n.t.bind(n,4162,23))},3313:function(e,t){"use strict";let n;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{DOMAttributeNames:function(){return r},isEqualNode:function(){return o},default:function(){return a}});let r={acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv",noModule:"noModule"};function l(e){let{type:t,props:n}=e,l=document.createElement(t);for(let e in n){if(!n.hasOwnProperty(e)||"children"===e||"dangerouslySetInnerHTML"===e||void 0===n[e])continue;let o=r[e]||e.toLowerCase();"script"===t&&("async"===o||"defer"===o||"noModule"===o)?l[o]=!!n[e]:l.setAttribute(o,n[e])}let{children:o,dangerouslySetInnerHTML:a}=n;return a?l.innerHTML=a.__html||"":o&&(l.textContent="string"==typeof o?o:Array.isArray(o)?o.join(""):""),l}function o(e,t){if(e instanceof HTMLElement&&t instanceof HTMLElement){let n=t.getAttribute("nonce");if(n&&!e.getAttribute("nonce")){let r=t.cloneNode(!0);return r.setAttribute("nonce",""),r.nonce=n,n===e.nonce&&e.isEqualNode(r)}}return e.isEqualNode(t)}function a(){return{mountedInstances:new Set,updateHead:e=>{let t={};e.forEach(e=>{if("link"===e.type&&e.props["data-optimized-fonts"]){if(document.querySelector('style[data-href="'+e.props["data-href"]+'"]'))return;e.props.href=e.props["data-href"],e.props["data-href"]=void 0}let n=t[e.type]||[];n.push(e),t[e.type]=n});let r=t.title?t.title[0]:null,l="";if(r){let{children:e}=r.props;l="string"==typeof e?e:Array.isArray(e)?e.join(""):""}l!==document.title&&(document.title=l),["meta","base","link","style","script"].forEach(e=>{n(e,t[e]||[])})}}}n=(e,t)=>{let n=document.getElementsByTagName("head")[0],r=n.querySelector("meta[name=next-head-count]"),a=Number(r.content),i=[];for(let t=0,n=r.previousElementSibling;t<a;t++,n=(null==n?void 0:n.previousElementSibling)||null){var s;(null==n?void 0:null==(s=n.tagName)?void 0:s.toLowerCase())===e&&i.push(n)}let c=t.map(l).filter(e=>{for(let t=0,n=i.length;t<n;t++)if(o(i[t],e))return i.splice(t,1),!1;return!0});i.forEach(e=>{var t;return null==(t=e.parentNode)?void 0:t.removeChild(e)}),c.forEach(e=>n.insertBefore(e,r)),r.content=(a-i.length+c.length).toString()},("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5935:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{handleClientScriptLoad:function(){return m},initScriptLoader:function(){return y},default:function(){return v}});let r=n(6921),l=n(1884),o=n(7437),a=r._(n(4887)),i=l._(n(2265)),s=n(7484),c=n(3313),u=n(2185),d=new Map,f=new Set,p=["onLoad","onReady","dangerouslySetInnerHTML","children","onError","strategy","stylesheets"],h=e=>{if(a.default.preinit){e.forEach(e=>{a.default.preinit(e,{as:"style"})});return}if("undefined"!=typeof window){let t=document.head;e.forEach(e=>{let n=document.createElement("link");n.type="text/css",n.rel="stylesheet",n.href=e,t.appendChild(n)})}},_=e=>{let{src:t,id:n,onLoad:r=()=>{},onReady:l=null,dangerouslySetInnerHTML:o,children:a="",strategy:i="afterInteractive",onError:s,stylesheets:u}=e,_=n||t;if(_&&f.has(_))return;if(d.has(t)){f.add(_),d.get(t).then(r,s);return}let m=()=>{l&&l(),f.add(_)},y=document.createElement("script"),b=new Promise((e,t)=>{y.addEventListener("load",function(t){e(),r&&r.call(this,t),m()}),y.addEventListener("error",function(e){t(e)})}).catch(function(e){s&&s(e)});for(let[n,r]of(o?(y.innerHTML=o.__html||"",m()):a?(y.textContent="string"==typeof a?a:Array.isArray(a)?a.join(""):"",m()):t&&(y.src=t,d.set(t,b)),Object.entries(e))){if(void 0===r||p.includes(n))continue;let e=c.DOMAttributeNames[n]||n.toLowerCase();y.setAttribute(e,r)}"worker"===i&&y.setAttribute("type","text/partytown"),y.setAttribute("data-nscript",i),u&&h(u),document.body.appendChild(y)};function m(e){let{strategy:t="afterInteractive"}=e;"lazyOnload"===t?window.addEventListener("load",()=>{(0,u.requestIdleCallback)(()=>_(e))}):_(e)}function y(e){e.forEach(m),[...document.querySelectorAll('[data-nscript="beforeInteractive"]'),...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e=>{let t=e.id||e.getAttribute("src");f.add(t)})}function b(e){let{id:t,src:n="",onLoad:r=()=>{},onReady:l=null,strategy:c="afterInteractive",onError:d,stylesheets:p,...h}=e,{updateScripts:m,scripts:y,getIsSsr:b,appDir:v,nonce:g}=(0,i.useContext)(s.HeadManagerContext),x=(0,i.useRef)(!1);(0,i.useEffect)(()=>{let e=t||n;x.current||(l&&e&&f.has(e)&&l(),x.current=!0)},[l,t,n]);let E=(0,i.useRef)(!1);if((0,i.useEffect)(()=>{!E.current&&("afterInteractive"===c?_(e):"lazyOnload"===c&&("complete"===document.readyState?(0,u.requestIdleCallback)(()=>_(e)):window.addEventListener("load",()=>{(0,u.requestIdleCallback)(()=>_(e))})),E.current=!0)},[e,c]),("beforeInteractive"===c||"worker"===c)&&(m?(y[c]=(y[c]||[]).concat([{id:t,src:n,onLoad:r,onReady:l,onError:d,...h}]),m(y)):b&&b()?f.add(t||n):b&&!b()&&_(e)),v){if(p&&p.forEach(e=>{a.default.preinit(e,{as:"style"})}),"beforeInteractive"===c)return n?(a.default.preload(n,h.integrity?{as:"script",integrity:h.integrity}:{as:"script"}),(0,o.jsx)("script",{nonce:g,dangerouslySetInnerHTML:{__html:"(self.__next_s=self.__next_s||[]).push("+JSON.stringify([n,{...h,id:t}])+")"}})):(h.dangerouslySetInnerHTML&&(h.children=h.dangerouslySetInnerHTML.__html,delete h.dangerouslySetInnerHTML),(0,o.jsx)("script",{nonce:g,dangerouslySetInnerHTML:{__html:"(self.__next_s=self.__next_s||[]).push("+JSON.stringify([0,{...h,id:t}])+")"}}));"afterInteractive"===c&&n&&a.default.preload(n,h.integrity?{as:"script",integrity:h.integrity}:{as:"script"})}return null}Object.defineProperty(b,"__nextScript",{value:!0});let v=b;("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4237:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return m}});var r=n(7437),l=n(703),o=n(1835),a=n.n(o),i=n(8792),s=e=>{let{children:t,as:n,href:l="#",className:o,target:s}=e,c="".concat(a().btn," ").concat(o);return"a"===n?(0,r.jsx)(i.default,{href:l,className:c,target:s,children:t}):(0,r.jsx)("button",{type:"button",className:c,children:t})},c=n(5668),u=n.n(c),d=n(2265),f=(e,t)=>{let n=(0,d.useRef)({});(0,d.useEffect)(()=>{let r=new IntersectionObserver(t=>{var r;t.forEach(e=>{n.current[e.target.id]=e}),e(null===(r=Object.values(n.current).filter(e=>e.isIntersecting)[0])||void 0===r?void 0:r.target.id)},{rootMargin:"-180px 0px 0px -180px",threshold:[0,.5,1]});return[...document.querySelectorAll(t)].forEach(e=>r.observe(e)),()=>r.disconnect()},[e])},p=JSON.parse('{"GI":[{"pc":"행사 소개","mobile":"소개"},{"pc":"찾아오시는 길","mobile":"위치"},{"pc":"FAQ"}],"bU":{"link":null,"text":null}}');let h=p.GI,_=p.bU;var m=e=>{let{}=e,[t,n]=(0,d.useState)("section1");return f(n,".section"),(0,r.jsx)("header",{className:u().header,children:(0,r.jsxs)("div",{className:"max-wrap2",children:[(0,r.jsx)("h1",{className:u().pc,children:(0,r.jsx)("a",{href:"/",children:(0,r.jsx)(l.default,{src:"images/logo.svg",alt:"JEJU AI CONFERENCE",width:280,height:32,priority:!0})})}),(0,r.jsxs)("div",{className:u().links,children:[(0,r.jsx)(i.default,{href:"/",className:"".concat(u().mobile," ").concat("section1"===t?u().active:""),children:"홈"}),h.map((e,n)=>(0,r.jsxs)(i.default,{href:"#section".concat(n+2),className:t==="section".concat(n+2)?u().active:"",children:[(0,r.jsx)("span",{className:u().pc,children:e.pc}),(0,r.jsx)("span",{className:u().mobile,children:e.mobile?e.mobile:e.pc})]},n)),_.link&&(0,r.jsx)(s,{as:"a",href:_.link,className:u().pc,target:"_blank",children:_.text})]})]})})}},4162:function(){},1835:function(e){e.exports={btn:"Button_btn__ufDb_"}},667:function(e){e.exports={footer:"Footer_footer__M_1l_",logos:"Footer_logos__8wtJ9"}},5668:function(e){e.exports={header:"Header_header__GDTVa",links:"Header_links__Bh8VG",active:"Header_active__YsDcj",pc:"Header_pc__84IRf",mobile:"Header_mobile__3fC_e"}}},function(e){e.O(0,[607,971,69,744],function(){return e(e.s=4228)}),_N_E=e.O()}]);