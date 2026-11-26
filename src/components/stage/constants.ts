// 공지 팝업이 닫히면(또는 띄우지 않으면) html에 붙이고 알리는 신호.
// 첫 화면 짓기는 이 신호를 받은 뒤에 시작한다
export const NOTICE_CLOSED_ATTR = "data-notice-closed";
export const NOTICE_CLOSED_EVENT = "notice-closed";

// 첫 화면이 그려지기 전에 실행해 지어질 요소를 숨긴다.
// Stage가 뜨지 못하면 페이지가 가려진 채 남지 않도록 스스로 해제한다.
export const BUILD_SCRIPT = `try{var h=document.documentElement;if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){h.setAttribute("data-build-on","");setTimeout(function(){if(!h.hasAttribute("data-build-ready"))h.removeAttribute("data-build-on")},6000)}}catch(e){}`;
