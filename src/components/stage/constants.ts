export const SEEN_KEY = "stage-seen";

// 첫 화면이 그려지기 전에 실행해 지어질 요소를 숨긴다.
// Stage가 뜨지 못하면 페이지가 가려진 채 남지 않도록 스스로 해제한다.
export const BUILD_SCRIPT = `try{var h=document.documentElement;if(location.pathname==="/"&&!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){h.setAttribute("data-build-on","");setTimeout(function(){if(!h.hasAttribute("data-build-ready"))h.removeAttribute("data-build-on")},6000)}}catch(e){}`;
