"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[703],{4703:function(e,t,a){a.r(t),a.d(t,{AbstractOverlay:function(){return O},Circle:function(){return R},CustomOverlayMap:function(){return I},CustomOverlayRoadview:function(){return _},DrawingManager:function(){return F},DrawingManagerContext:function(){return D},Ellipse:function(){return T},KakaoMapContext:function(){return f},KakaoMapMarkerClustererContext:function(){return h},KakaoRoadviewContext:function(){return z},Loader:function(){return d},LoaderStatus:function(){return l},Map:function(){return m},MapInfoWindow:function(){return E},MapMarker:function(){return M},MapTypeControl:function(){return C},MapTypeId:function(){return b},MarkerClusterer:function(){return v},Polygon:function(){return S},Polyline:function(){return P},Rectangle:function(){return A},Roadview:function(){return H},RoadviewInfoWindow:function(){return N},RoadviewMarker:function(){return Z},StaticMap:function(){return K},Toolbox:function(){return U},ZoomControl:function(){return x},useInjectKakaoMapApi:function(){return q},useKakaoLoader:function(){return G},useMap:function(){return k},useRoadview:function(){return j}});var n,o=a(2265);let r="undefined"!=typeof window&&"undefined"!=typeof document?o.useLayoutEffect:o.useEffect,s=(e,t,a)=>{r(()=>{if(!e||!a)return;let n=function(){for(var t=arguments.length,n=Array(t),o=0;o<t;o++)n[o]=arguments[o];return void 0===n?a(e):a(e,...n)};return kakao.maps.event.addListener(e,t,n),()=>{kakao.maps.event.removeListener(e,t,n)}},[e,t,a])},i="__react-kakao-maps-sdk__",l=((n={})[n.INITIALIZED=0]="INITIALIZED",n[n.LOADING=1]="LOADING",n[n.SUCCESS=2]="SUCCESS",n[n.FAILURE=3]="FAILURE",n),u=`${i}_Loader`;class d{static loadEventCallback=new Set;callbacks=[];done=!1;loading=!1;errors=[];constructor(e){let{appkey:t,id:a=u,libraries:n=[],nonce:o,retries:r=3,url:s="//dapi.kakao.com/v2/maps/sdk.js"}=e;if(this.id=a,this.appkey=t,this.libraries=n,this.nonce=o,this.retries=r,this.url=s,d.instance&&!d.equalOptions(this.options,d.instance.options)&&!d.equalOptions(this.options,d.instance.options)){if(d.instance.status===l.FAILURE)throw Error(`Loader must not be called again with different options. 
${JSON.stringify(this.options,null,2)}
!==
${JSON.stringify(d.instance.options,null,2)}`);d.instance.reset(),d.instance=this}return d.instance||(d.instance=this),d.instance}get options(){return{appkey:this.appkey,id:this.id,libraries:this.libraries,nonce:this.nonce,retries:this.retries,url:this.url}}static addLoadEventLisnter(e){return window.kakao&&window.kakao.maps&&window.kakao.maps.load(e),d.loadEventCallback.add(e),e}static removeLoadEventLisnter(e){return d.loadEventCallback.delete(e)}load(){return new Promise((e,t)=>{this.loadCallback(a=>{a?t(a):e(window.kakao)})})}get status(){return this.onEvent?l.FAILURE:this.done?l.SUCCESS:this.loading?l.LOADING:l.INITIALIZED}get failed(){return this.done&&!this.loading&&this.errors.length>=this.retries+1}loadCallback(e){this.callbacks.push(e),this.execute()}resetIfRetryingFailed(){this.failed&&this.reset()}reset(){this.deleteScript(),this.done=!0,this.loading=!1,this.errors=[],this.onEvent=void 0}execute(){if(this.resetIfRetryingFailed(),this.done)this.callback();else{if(window.kakao&&window.kakao.maps){console.warn("Kakao Maps이 이미 외부 요소에 의해 로딩되어 있습니다.설정한 옵션과 일치 하지 않을 수 있으며, 이에 따른 예상치 동작이 발생할 수 있습니다."),window.kakao.maps.load(this.callback);return}this.loading||(this.loading=!0,this.setScript())}}setScript(){document.getElementById(this.id)&&this.callback();let e=this.createUrl(),t=document.createElement("script");t.id=this.id,t.type="text/javascript",t.src=e,t.onerror=this.loadErrorCallback.bind(this),t.onload=this.callback.bind(this),t.defer=!0,t.async=!0,this.nonce&&(t.nonce=this.nonce),document.head.appendChild(t)}loadErrorCallback(e){if(this.errors.push(e),this.errors.length<=this.retries){let e=this.errors.length*2**this.errors.length;console.log(`Failed to load Kakao Maps script, retrying in ${e} ms.`),setTimeout(()=>{this.deleteScript(),this.setScript()},e)}else this.done=!0,this.loading=!1,this.onEvent=this.errors[this.errors.length-1],this.callbacks.forEach(e=>{e(this.onEvent)}),this.callbacks=[],d.loadEventCallback.forEach(e=>{e(this.onEvent)})}createUrl(){let e=this.url;return e+=`?appkey=${this.appkey}`,this.libraries.length&&(e+=`&libraries=${this.libraries.join(",")}`),e+="&autoload=false"}deleteScript(){let e=document.getElementById(this.id);e&&e.remove()}callback(){kakao.maps.load(()=>{d.instance.done=!0,d.instance.loading=!1,d.instance.callbacks.forEach(e=>{e(d.instance.onEvent)}),d.instance.callbacks=[],d.loadEventCallback.forEach(e=>{e(d.instance.onEvent)})})}static equalOptions(e,t){if(e.appkey!==t.appkey||e.id!==t.id||e.libraries.length!==t.libraries.length)return!1;for(let a=0;a<e.libraries.length;++a)if(e.libraries[a]!==t.libraries[a])return!1;return e.nonce===t.nonce&&e.retries===t.retries&&e.url===t.url}}let p=function(e,t){for(var a=arguments.length,n=Array(a>2?a-2:0),o=2;o<a;o++)n[o-2]=arguments[o];r(()=>{!e||n.every(e=>void 0===e)||e[t].call(e,...n)},[e,t,...n])};var c=a(7437);let f=o.createContext(void 0),m=o.forwardRef(function(e,t){let{id:a,as:n,children:l,center:u,isPanto:m=!1,padding:k=32,disableDoubleClick:g,disableDoubleClickZoom:w,draggable:h,zoomable:v,keyboardShortcuts:L,level:y,maxLevel:M,minLevel:E,mapTypeId:I,projectionId:C,scrollwheel:x,tileAnimation:b,onBoundsChanged:R,onCenterChanged:P,onClick:S,onDoubleClick:A,onDrag:T,onDragEnd:O,onDragStart:z,onIdle:H,onMaptypeidChanged:j,onMouseMove:_,onRightClick:Z,onTileLoaded:N,onZoomChanged:D,onZoomStart:$,onCreate:F,...U}=e,[K,G]=(0,o.useState)(!1),[q,J]=(0,o.useState)(),V=(0,o.useRef)(null);return r(()=>{let e=d.addLoadEventLisnter(e=>G(!e));return()=>{d.removeLoadEventLisnter(e)}},[]),r(()=>{if(!K)return;let e=V.current;if(!e)return;let t="lat"in u?new kakao.maps.LatLng(u.lat,u.lng):new kakao.maps.Coords(u.x,u.y);return J(new kakao.maps.Map(e,{center:t,disableDoubleClick:g,disableDoubleClickZoom:w,draggable:h,keyboardShortcuts:L,level:y,mapTypeId:"string"==typeof I?kakao.maps.MapTypeId[I]:I,projectionId:C,scrollwheel:x,tileAnimation:b})),()=>{e.innerHTML=""}},[K,g,w,b]),(0,o.useImperativeHandle)(t,()=>q,[q]),r(()=>{q&&F&&F(q)},[q,F]),r(()=>{if(!q)return;let e=q.getCenter();e instanceof kakao.maps.Coords&&(e=e.toLatLng());let t="lat"in u?new kakao.maps.LatLng(u.lat,u.lng):new kakao.maps.Coords(u.x,u.y);t instanceof kakao.maps.LatLng&&t.equals(e)||t instanceof kakao.maps.Coords&&t.toLatLng().equals(e)||(m?q.panTo(t,k):q.setCenter(t))},[q,u.lat,u.lng,u.x,u.y]),p(q,"setDraggable",h),p(q,"setZoomable",v),p(q,"setKeyboardShortcuts",L),p(q,"setLevel",y),p(q,"setMapTypeId",K?"string"==typeof I?kakao.maps.MapTypeId[I]:I:void 0),p(q,"setProjectionId",C),p(q,"setMinLevel",M),p(q,"setMaxLevel",E),s(q,"bounds_changed",R),s(q,"center_changed",P),s(q,"click",S),s(q,"dblclick",A),s(q,"drag",T),s(q,"dragstart",z),s(q,"dragend",O),s(q,"idle",H),s(q,"maptypeid_changed",j),s(q,"mousemove",_),s(q,"rightclick",Z),s(q,"tilesloaded",N),s(q,"zoom_changed",D),s(q,"zoom_start",$),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n||"div",{id:a||`${i}_Map`,...U,ref:V}),q&&(0,c.jsx)(f.Provider,{value:q,children:l})]})}),k=e=>{let t=(0,o.useContext)(f);if(!t)throw Error(`${e?e+" Component":"useMap"} must exist inside Map Component!`);return t};var g=a(4887);let w=o.forwardRef(function(e,t){let{map:a,position:n,marker:r,children:s,altitude:i,disableAutoPan:l,range:u,removable:d,zIndex:c,onCreate:f}=e,m=(0,o.useRef)(document.createElement("div")),k=(0,o.useMemo)(()=>{let e=new kakao.maps.InfoWindow({altitude:i,disableAutoPan:l,range:u,removable:d,zIndex:c,content:m.current,position:n});return m.current.style.display="none",e},[l,d]);return(0,o.useImperativeHandle)(t,()=>k,[k]),(0,o.useLayoutEffect)(()=>(k.open(a,r),()=>{k.close()}),[a,r]),(0,o.useLayoutEffect)(()=>{f&&f(k)},[k,f]),p(k,"setPosition",n),p(k,"setAltitude",i),p(k,"setRange",u),p(k,"setZIndex",c),m.current.parentElement&&g.createPortal(s,m.current.parentElement)}),h=o.createContext(void 0),v=o.forwardRef(function(e,t){let{onClusterclick:a,onClusterdblclick:n,onClustered:r,onClusterout:i,onClusterover:l,onClusterrightclick:u,onCreate:d,...f}=e,{children:m,averageCenter:g,calculator:w,clickable:v,disableClickZoom:y,gridSize:M,hoverable:E,minClusterSize:I,minLevel:C,styles:x,texts:b}=f,R=k("MarkerClusterer"),P=(0,o.useMemo)(()=>{if(!window.kakao.maps.MarkerClusterer){console.warn("clusterer 라이브러리를 별도 로드 해야 사용 가능합니다. `https://apis.map.kakao.com/web/guide/#loadlibrary`");return}return new kakao.maps.MarkerClusterer({averageCenter:g,calculator:w,clickable:v,disableClickZoom:y,gridSize:M,hoverable:E,minClusterSize:I,minLevel:C,styles:x,texts:b})},[]);return((0,o.useImperativeHandle)(t,()=>P,[P]),(0,o.useLayoutEffect)(()=>{if(P)return P.setMap(R),()=>{P.setMap(null)}},[R,P]),(0,o.useLayoutEffect)(()=>{P&&d&&d(P)},[P,d]),p(P,"setGridSize",M),p(P,"setMinClusterSize",I),p(P,"setAverageCenter",g),p(P,"setAverageCenter",g),p(P,"setMinLevel",C),p(P,"setTexts",b),p(P,"setCalculator",w),p(P,"setStyles",x),s(P,"clustered",r),s(P,"clusterclick",a),s(P,"clusterover",l),s(P,"clusterout",i),s(P,"clusterdblclick",n),s(P,"clusterrightclick",u),P)?(0,c.jsxs)(h.Provider,{value:P,children:[m,(0,c.jsx)(L,{...f})]}):null}),L=()=>{let e=(0,o.useContext)(h);return r(()=>{e.redraw()}),null},y=o.forwardRef(function(e,t){let{map:a,position:n,children:r,altitude:i,clickable:l,draggable:u,image:d,infoWindowOptions:f,onCreate:m,onClick:k,onDragEnd:g,onDragStart:v,onMouseOut:L,onMouseOver:y,opacity:M,range:E,title:I,zIndex:C}=e,x=(0,o.useContext)(h),b=(0,o.useMemo)(()=>d&&new kakao.maps.MarkerImage(d.src,new kakao.maps.Size(d.size.width,d.size.height),{alt:d.options?.alt,coords:d.options?.coords,offset:d.options?.offset&&new kakao.maps.Point(d.options?.offset.x,d.options?.offset.y),shape:d.options?.shape,spriteOrigin:d.options?.spriteOrigin&&new kakao.maps.Point(d.options?.spriteOrigin.x,d.options?.spriteOrigin.y),spriteSize:d.options?.spriteSize&&new kakao.maps.Size(d.options?.spriteSize.width,d.options?.spriteSize.height)}),[JSON.stringify(d)]),R=(0,o.useMemo)(()=>new kakao.maps.Marker({altitude:i,clickable:l,draggable:u,image:b,opacity:M,range:E,title:I,zIndex:C,position:n}),[]);return((0,o.useImperativeHandle)(t,()=>R,[R]),(0,o.useLayoutEffect)(()=>x?(x.addMarker(R,!0),()=>x.removeMarker(R,!0)):(R.setMap(a),()=>R.setMap(null)),[a,x,R]),(0,o.useLayoutEffect)(()=>{m&&m(R)},[R,m]),p(R,"setPosition",n),p(R,"setImage",b),p(R,"setAltitude",i),p(R,"setClickable",l),p(R,"setDraggable",u),p(R,"setOpacity",M),p(R,"setRange",E),p(R,"setRange",E),p(R,"setTitle",I),p(R,"setTitle",I),p(R,"setZIndex",C),s(R,"click",k),s(R,"dragstart",v),s(R,"dragend",g),s(R,"mouseout",L),s(R,"mouseover",y),r)?(0,c.jsx)(w,{position:n,map:a,marker:R,altitude:f?.altitude,disableAutoPan:f?.disableAutoPan,range:f?.range,removable:f?.removable,zIndex:f?.zIndex,children:r}):null}),M=o.forwardRef(function(e,t){let{position:a,...n}=e,r=k("MapMarker"),s=(0,o.useMemo)(()=>"lat"in a?new kakao.maps.LatLng(a.lat,a.lng):new kakao.maps.Coords(a.x,a.y).toLatLng(),[a.lat,a.lng,a.x,a.y]);return(0,c.jsx)(y,{map:r,position:s,...n,ref:t})}),E=o.forwardRef(function(e,t){let{position:a,children:n,disableAutoPan:r,removable:s,zIndex:i,onCreate:l}=e,u=k("MapInfoWindow"),d=(0,o.useMemo)(()=>new kakao.maps.LatLng(a.lat,a.lng),[a.lat,a.lng]);return(0,c.jsx)(w,{disableAutoPan:r,removable:s,zIndex:i,map:u,position:d,onCreate:l,ref:t,children:n})}),I=o.forwardRef(function(e,t){let{position:a,children:n,clickable:r,xAnchor:s,yAnchor:i,zIndex:l,onCreate:u}=e,d=(0,o.useContext)(h),c=k("CustomOverlayMap"),f=(0,o.useRef)(document.createElement("div")),m=(0,o.useMemo)(()=>new kakao.maps.LatLng(a.lat,a.lng),[a.lat,a.lng]),w=(0,o.useMemo)(()=>{let e=new kakao.maps.CustomOverlay({clickable:r,xAnchor:s,yAnchor:i,zIndex:l,position:m,content:f.current});return f.current.style.display="none",e},[r,s,i]);return(0,o.useImperativeHandle)(t,()=>w,[w]),(0,o.useLayoutEffect)(()=>{if(c)return d?d.addMarker(w,!0):w.setMap(c),()=>{d?d.removeMarker(w,!0):w.setMap(null)}},[c,d,w]),(0,o.useLayoutEffect)(()=>{u&&u(w)},[w,u]),p(w,"setPosition",m),p(w,"setZIndex",l),f.current.parentElement&&g.createPortal(n,f.current.parentElement)}),C=o.forwardRef(function(e,t){let{position:a=kakao.maps.ControlPosition.TOPRIGHT}=e,n=k("MapTypeControl"),r="string"==typeof a?kakao.maps.ControlPosition[a]:a,s=(0,o.useMemo)(()=>new kakao.maps.MapTypeControl,[]);return(0,o.useImperativeHandle)(t,()=>s,[s]),(0,o.useLayoutEffect)(()=>(n.addControl(s,r),()=>{n.removeControl(r)}),[n,s,r]),null}),x=o.forwardRef(function(e,t){let{position:a=kakao.maps.ControlPosition.RIGHT}=e,n=k("ZoomControl"),r="string"==typeof a?kakao.maps.ControlPosition[a]:a,s=(0,o.useMemo)(()=>new kakao.maps.ZoomControl,[]);return(0,o.useImperativeHandle)(t,()=>s,[s]),(0,o.useLayoutEffect)(()=>(n.addControl(s,r),()=>{n.removeControl(s)}),[n,r,s]),null}),b=e=>{let{type:t}=e,a=k("MapTypeId"),n="string"==typeof t?kakao.maps.MapTypeId[t]:t;return(0,o.useLayoutEffect)(()=>(a.addOverlayMapTypeId(n),()=>{a.removeOverlayMapTypeId(n)}),[a,n]),null},R=o.forwardRef(function(e,t){let{center:a,radius:n,fillColor:r,fillOpacity:i,strokeColor:l,strokeOpacity:u,strokeStyle:d,strokeWeight:c,zIndex:f,onMouseover:m,onMouseout:g,onMousemove:w,onMousedown:h,onClick:v,onCreate:L}=e,y=k("Circle"),M=(0,o.useMemo)(()=>new kakao.maps.LatLng(a.lat,a.lng),[a.lat,a.lng]),E=(0,o.useMemo)(()=>new kakao.maps.Circle({center:M,radius:n,fillColor:r,fillOpacity:i,strokeColor:l,strokeOpacity:u,strokeStyle:d,strokeWeight:c,zIndex:f}),[]);return(0,o.useImperativeHandle)(t,()=>E,[E]),(0,o.useLayoutEffect)(()=>(E.setMap(y),()=>{E.setMap(null)}),[y,E]),(0,o.useLayoutEffect)(()=>{L&&L(E)},[E,L]),p(E,"setPosition",M),p(E,"setRadius",n),p(E,"setZIndex",f),(0,o.useLayoutEffect)(()=>{E.setOptions({fillColor:r,fillOpacity:i,strokeColor:l,strokeOpacity:u,strokeStyle:d,strokeWeight:c})},[E,r,i,l,u,d,c]),s(E,"mouseover",m),s(E,"mouseout",g),s(E,"mousemove",w),s(E,"mousedown",h),s(E,"click",v),null}),P=o.forwardRef(function(e,t){let{path:a,endArrow:n,onClick:r,onMousedown:i,onMousemove:l,onMouseout:u,onMouseover:d,onCreate:c,strokeColor:f,strokeOpacity:m,strokeStyle:g,strokeWeight:w,zIndex:h}=e,v=k("Polyline"),L=(0,o.useMemo)(()=>a.every(e=>e instanceof Array)?a.map(e=>e.map(e=>new kakao.maps.LatLng(e.lat,e.lng))):a.map(e=>new kakao.maps.LatLng(e.lat,e.lng)),[a]),y=(0,o.useMemo)(()=>new kakao.maps.Polyline({path:L,endArrow:n,strokeColor:f,strokeOpacity:m,strokeStyle:g,strokeWeight:w,zIndex:h}),[]);return(0,o.useImperativeHandle)(t,()=>y,[y]),(0,o.useLayoutEffect)(()=>(y.setMap(v),()=>y.setMap(null)),[v,y]),(0,o.useLayoutEffect)(()=>{c&&c(y)},[y,c]),(0,o.useLayoutEffect)(()=>{y.setOptions({endArrow:n,strokeColor:f,strokeOpacity:m,strokeStyle:g,strokeWeight:w})},[y,n,f,m,g,w]),p(y,"setPath",L),p(y,"setZIndex",h),s(y,"mouseover",d),s(y,"mouseout",u),s(y,"mousemove",l),s(y,"mousedown",i),s(y,"click",r),null}),S=o.forwardRef(function(e,t){let{path:a,onClick:n,onMousedown:r,onMousemove:i,onMouseout:l,onMouseover:u,onCreate:d,strokeColor:c,strokeOpacity:f,strokeStyle:m,strokeWeight:g,fillColor:w,fillOpacity:h,zIndex:v}=e,L=k("Polygon"),y=(0,o.useMemo)(()=>a.every(e=>e instanceof Array)?a.map(e=>e.map(e=>new kakao.maps.LatLng(e.lat,e.lng))):a.map(e=>new kakao.maps.LatLng(e.lat,e.lng)),[a]),M=(0,o.useMemo)(()=>new kakao.maps.Polygon({path:y,fillColor:w,fillOpacity:h,strokeColor:c,strokeOpacity:f,strokeStyle:m,strokeWeight:g,zIndex:v}),[]);return(0,o.useImperativeHandle)(t,()=>M,[M]),(0,o.useLayoutEffect)(()=>(M.setMap(L),()=>M.setMap(null)),[L,M]),(0,o.useLayoutEffect)(()=>{d&&d(M)},[M,d]),(0,o.useLayoutEffect)(()=>{M.setOptions({fillColor:w,fillOpacity:h,strokeColor:c,strokeOpacity:f,strokeStyle:m,strokeWeight:g})},[M,w,h,c,f,m,g]),p(M,"setPath",y),p(M,"setZIndex",v),s(M,"mouseover",u),s(M,"mouseout",l),s(M,"mousemove",i),s(M,"mousedown",r),s(M,"click",n),null}),A=o.forwardRef(function(e,t){let{bounds:a,onClick:n,onMousedown:r,onMousemove:i,onMouseout:l,onMouseover:u,onCreate:d,strokeColor:c,strokeOpacity:f,strokeStyle:m,strokeWeight:g,fillColor:w,fillOpacity:h,zIndex:v}=e,L=k("Rectangle"),y=(0,o.useMemo)(()=>new kakao.maps.LatLngBounds(new kakao.maps.LatLng(a.sw.lat,a.sw.lng),new kakao.maps.LatLng(a.ne.lat,a.ne.lng)),[a]),M=(0,o.useMemo)(()=>new kakao.maps.Rectangle({bounds:y,fillColor:w,fillOpacity:h,strokeColor:c,strokeOpacity:f,strokeStyle:m,strokeWeight:g,zIndex:v}),[]);return(0,o.useImperativeHandle)(t,()=>M,[M]),(0,o.useLayoutEffect)(()=>(M.setMap(L),()=>M.setMap(null)),[L,M]),(0,o.useLayoutEffect)(()=>{d&&d(M)},[M,d]),(0,o.useLayoutEffect)(()=>{M.setOptions({fillColor:w,fillOpacity:h,strokeColor:c,strokeOpacity:f,strokeStyle:m,strokeWeight:g})},[M,w,h,c,f,m,g]),p(M,"setBounds",y),p(M,"setZIndex",v),s(M,"mouseover",u),s(M,"mouseout",l),s(M,"mousemove",i),s(M,"mousedown",r),s(M,"click",n),null}),T=o.forwardRef(function(e,t){let{center:a,rx:n,ry:r,fillColor:i,fillOpacity:l,strokeColor:u,strokeOpacity:d,strokeStyle:c,strokeWeight:f,zIndex:m,onMouseover:g,onMouseout:w,onMousemove:h,onMousedown:v,onClick:L,onCreate:y}=e,M=k("Ellipse"),E=(0,o.useMemo)(()=>new kakao.maps.LatLng(a.lat,a.lng),[a.lat,a.lng]),I=(0,o.useMemo)(()=>new kakao.maps.Ellipse({center:E,rx:n,ry:r,fillColor:i,fillOpacity:l,strokeColor:u,strokeOpacity:d,strokeStyle:c,strokeWeight:f,zIndex:m}),[]);return(0,o.useImperativeHandle)(t,()=>I,[I]),(0,o.useLayoutEffect)(()=>(I.setMap(M),()=>{I.setMap(null)}),[M,I]),(0,o.useLayoutEffect)(()=>{y&&y(I)},[I,y]),p(I,"setPosition",E),p(I,"setRadius",n,r),p(I,"setZIndex",m),(0,o.useLayoutEffect)(()=>{I.setOptions({fillColor:i,fillOpacity:l,strokeColor:u,strokeOpacity:d,strokeStyle:c,strokeWeight:f})},[I,i,l,u,d,c,f]),s(I,"mouseover",g),s(I,"mouseout",w),s(I,"mousemove",h),s(I,"mousedown",v),s(I,"click",L),null}),O=o.forwardRef(function(e,t){let{draw:a,onAdd:n,onRemove:r,onCreate:s}=e,i=k(),l=(0,o.useMemo)(()=>{class e extends kakao.maps.AbstractOverlay{constructor(e,t,a){super(),this.draw=e,this.onAdd=t,this.onRemove=a}}return new e(a,n,r)},[a,n,r]);return(0,o.useImperativeHandle)(t,()=>l,[l]),(0,o.useLayoutEffect)(()=>(l.setMap(i),()=>{l.setMap(null)}),[i,l]),(0,o.useLayoutEffect)(()=>{s&&s(l)},[l,s]),null}),z=o.createContext(void 0),H=o.forwardRef(function(e,t){let{id:a,as:n,children:l,position:u,pan:p,panoId:f,panoX:m,panoY:k,tilt:g,zoom:w,onCreate:h,onInit:v,onPanoidChange:L,onPositionChanged:y,onViewpointChange:M,onErrorGetNearestPanoId:E,...I}=e,[C,x]=(0,o.useState)(!1),[b,R]=(0,o.useState)(!0),[P,S]=(0,o.useState)(),A=(0,o.useRef)(null);return r(()=>{let e=d.addLoadEventLisnter(e=>x(!e));return()=>{d.removeLoadEventLisnter(e)}},[]),r(()=>{if(!C)return;let e=A.current;if(e)return S(new kakao.maps.Roadview(e,{pan:p,panoId:f,panoX:m,panoY:k,tilt:g,zoom:w})),()=>{e.innerHTML=""}},[C,m,k,w]),(0,o.useImperativeHandle)(t,()=>P,[P]),r(()=>{P&&h&&h(P)},[P,h]),r(()=>{if(!P||f||P.getPosition().getLat()===u.lat&&P.getPosition().getLng()===u.lng)return;let e=new kakao.maps.LatLng(u.lat,u.lng);new kakao.maps.RoadviewClient().getNearestPanoId(e,u.radius,t=>{null===t&&E?E(P):P.setPanoId(t,e)})},[P,f,u.lat,u.lng,u.radius,E]),r(()=>{if(!P||!f||f===P.getPanoId()||P.getPosition().getLat()===u.lat&&P.getPosition().getLng()===u.lng)return;let e=new kakao.maps.LatLng(u.lat,u.lng);P.setPanoId(f,e)},[P,f,u.lat,u.lng]),r(()=>{if(!P)return;let e=P.getViewpoint();(e.pan!==p||e.tilt!==g)&&(p&&(e.pan=p),g&&(e.tilt=g),P.setViewpoint(e))},[P,p,g]),s(P,"init",e=>{R(!1),v&&v(e)}),s(P,"panoid_changed",L),s(P,"viewpoint_changed",M),s(P,"position_changed",y),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n||"div",{ref:A,id:a||`${i}_Roadview`,...I}),P&&!b&&(0,c.jsx)(z.Provider,{value:P,children:l})]})}),j=e=>{let t=(0,o.useContext)(z);if(!t)throw Error(`${e?e+" Component":"useRoadview"} must exist inside Roadview Component!`);return t},_=o.forwardRef(function(e,t){let{position:a,children:n,clickable:r,xAnchor:s,yAnchor:i,zIndex:l,altitude:u,range:d,onCreate:c}=e,f=j("CustomOverlayRoadview"),m=(0,o.useRef)(document.createElement("div")),k=(0,o.useMemo)(()=>"lat"in a?new kakao.maps.LatLng(a.lat,a.lng):new kakao.maps.Viewpoint(a.pan,a.tilt,a.zoom,a.panoId),[a.lat,a.lng,a.pan,a.tilt,a.zoom,a.panoId]),w=(0,o.useMemo)(()=>{let e=new kakao.maps.CustomOverlay({clickable:r,xAnchor:s,yAnchor:i,zIndex:l,position:k,content:m.current});return m.current.style.display="none",e},[r,s,i]);return(0,o.useImperativeHandle)(t,()=>w,[w]),(0,o.useLayoutEffect)(()=>{if(f)return w.setMap(f),()=>{w.setMap(null)}},[w,f]),(0,o.useLayoutEffect)(()=>{c&&c(w)},[w,c]),p(w,"setPosition",k),p(w,"setZIndex",l),p(w,"setAltitude",u),p(w,"setRange",d),m.current.parentElement&&g.createPortal(n,m.current.parentElement)}),Z=o.forwardRef(function(e,t){let{position:a,...n}=e,r=j("RoadviewMarker"),s=(0,o.useMemo)(()=>"lat"in a?new kakao.maps.LatLng(a.lat,a.lng):"x"in a?new kakao.maps.Coords(a.x,a.y).toLatLng():new kakao.maps.Viewpoint(a.pan,a.tilt,a.zoom,a.panoId),[a.lat,a.lng,a.x,a.y,a.pan,a.tilt,a.zoom,a?.panoId]);return(0,c.jsx)(y,{map:r,position:s,...n,ref:t})}),N=o.forwardRef(function(e,t){let{position:a,children:n,altitude:r,disableAutoPan:s,range:i,removable:l,zIndex:u,onCreate:d}=e,p=j("RoadviewInfoWindow"),f=(0,o.useMemo)(()=>"lat"in a?new kakao.maps.LatLng(a.lat,a.lng):new kakao.maps.Viewpoint(a.pan,a.tilt,a.zoom,a.panoId),[a.lat,a.lng,a.pan,a.tilt,a.zoom,a.panoId]);return(0,c.jsx)(w,{altitude:r,disableAutoPan:s,range:i,removable:l,zIndex:u,map:p,position:f,onCreate:d,ref:t,children:n})}),D=o.createContext(void 0);function $(e,t,a){(0,o.useLayoutEffect)(()=>{e&&a&&e.addListener(t,function(){for(var t=arguments.length,n=Array(t),o=0;o<t;o++)n[o]=arguments[o];return void 0===AbortSignal?a(e):a(e,...n)})},[a,e,t])}let F=o.forwardRef(function(e,t){let{arrowOptions:a,circleOptions:n,ellipseOptions:r,markerOptions:s,polygonOptions:i,polylineOptions:l,rectangleOptions:u,drawingMode:d,guideTooltip:p,onSelect:f,onDrawstart:m,onDraw:g,onDrawend:w,onDrawnext:h,onCancle:v,onRemove:L,onStateChanged:y,onCreate:M,children:E}=e,I=k("Toolbox"),C=(0,o.useMemo)(()=>{if(!window.kakao.maps.drawing){console.warn("drawing 라이브러리를 별도 로드 해야 사용 가능합니다. `https://apis.map.kakao.com/web/guide/#loadlibrary`");return}return new kakao.maps.drawing.DrawingManager({map:I,drawingMode:d,guideTooltip:p,arrowOptions:a,circleOptions:n,ellipseOptions:r,markerOptions:s,polygonOptions:i,polylineOptions:l,rectangleOptions:u})},[]);return((0,o.useImperativeHandle)(t,()=>C,[C]),(0,o.useLayoutEffect)(()=>{C&&M&&M(C)},[C,M]),$(C,"select",f),$(C,"drawstart",m),$(C,"draw",g),$(C,"drawend",w),$(C,"drawnext",h),$(C,"cancel",v),$(C,"remove",L),$(C,"state_changed",y),C)?(0,c.jsx)(D.Provider,{value:C,children:E}):null}),U=o.forwardRef(function(e,t){let{position:a=kakao.maps.ControlPosition.TOP}=e,n="string"==typeof a?kakao.maps.ControlPosition[a]:a,r=k("Toolbox"),s=(0,o.useContext)(D);if(!s)throw Error("Toolbox must exist inside DrawingManager Component!`");let i=(0,o.useMemo)(()=>new kakao.maps.drawing.Toolbox({drawingManager:s}),[s]);return(0,o.useImperativeHandle)(t,()=>i,[i]),(0,o.useLayoutEffect)(()=>{let e=i.getElement();return r.addControl(e,n),()=>{r.removeControl(e)}},[r,i,n]),null}),K=o.forwardRef(function(e,t){let{as:a,id:n,center:s,marker:i,level:l,mapTypeId:u,onCreate:f,...m}=e,[k,g]=(0,o.useState)(!1),[w,h]=(0,o.useState)(),v=(0,o.useRef)(null);return r(()=>{let e=d.addLoadEventLisnter(e=>g(!e));return()=>{d.removeLoadEventLisnter(e)}},[]),r(()=>{if(!k)return;let e=v.current;if(!e)return;let t=Array.isArray(i)?i.map(e=>({...e,position:new kakao.maps.LatLng(e.position.lat,e.position.lng)})):"object"==typeof i&&i.position?{...i,position:new kakao.maps.LatLng(i.position.lat,i.position.lng)}:i;return h(new kakao.maps.StaticMap(e,{center:new kakao.maps.LatLng(s.lat,s.lng),level:l,mapTypeId:"string"==typeof u?kakao.maps.MapTypeId[u]:u,marker:t})),()=>{e.innerHTML=""}},[k,JSON.stringify(i)]),(0,o.useImperativeHandle)(t,()=>w,[w]),r(()=>{w&&f&&f(w)},[w,f]),r(()=>{w&&w.setCenter(new kakao.maps.LatLng(s.lat,s.lng))},[w,s.lat,s.lng]),p(w,"setLevel",l),p(w,"setMapTypeId",k?"string"==typeof u?kakao.maps.MapTypeId[u]:u:void 0),(0,c.jsx)(a||"div",{id:n,...m,ref:v})}),G=e=>{let[t,a]=(0,o.useState)([!0,void 0]);return(0,o.useEffect)(()=>{new d({...e}).load().then(()=>a([!1,void 0])).catch(e=>{a([!1,e])})},[JSON.stringify(e)]),t},q=G}}]);