export const SEEN_KEY = "build-seen";

// 첫 화면이 그려지기 전에 실행해 빌드 대상 요소를 숨긴다.
// Swarm이 뜨지 못하면 페이지가 가려진 채 남지 않도록 스스로 해제한다.
export const BUILD_SCRIPT = `try{var h=document.documentElement;if(location.pathname==="/"&&!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){h.setAttribute("data-build-on","");setTimeout(function(){if(!h.hasAttribute("data-build-ready"))h.removeAttribute("data-build-on")},6000)}}catch(e){}`;

export const AGENT_COLORS = [
  "#6df2cc",
  "#b58bf0",
  "#65e783",
  "#ffa63d",
  "#ff7aa8",
  "#6fb7ff",
  "#ffd84d",
];

// 전송 직후 화면에 쏟아지는 코드 줄
export const CODE_LINES = [
  'const conf = { year: 2026, city: "Jeju" };',
  'date: "2026-12-08 ~ 2026-12-09 18:00",',
  'status: "준비중",',
  '<header className="nav">',
  '<section id="hero">',
  "<h2>2026 제주 AI 컨퍼런스</h2>",
  "await agents.spawn(64);",
  "island.paint(hallasan);",
  "for (const layer of page) build(layer);",
  ".hero { min-height: 100vh; }",
  "grid-template-columns: repeat(3, 1fr);",
  '<Program day="Day1" />',
  "<Faq items={faq} />",
  'git commit -m "feat: 2026"',
  "export default function Home() {",
  "return <main>{sections}</main>;",
];

// [선택자, 와이어프레임 이름표]. 앞쪽 규칙이 먼저 잡고 안쪽 요소는 건너뛴다.
export const LAYER_RULES: [string, string][] = [
  ["main .section-title", "TITLE"],
  ["main li", "ITEM"],
  ["main h3, main p", "COPY"],
  ["footer p", "COPY"],
  ["footer img", "LOGO"],
];
