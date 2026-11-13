import {
  loadKv,
  MOBILE_WIDTH,
  placeKv,
  rasterize,
  Rect,
  SUMMIT,
} from "./kv";

const MINT = "#6df2cc";
const INK = "#120f2a";
// 손잡이 없이 화살촉만 남기고, 아래쪽 한 꼭짓점을 안으로 파낸 커서
const ARROW_PATH = "M0 0 L0 15.5 L4.8 11.2 L12 11 Z";
const SPRITE = { w: 26, h: 32 };

const COUNT = { pc: 10, mobile: 6 };
const COLORS = [MINT, "#b4f9e4", "#3fd6ae", "#eef0fa"];

// 오프닝(ms): 프롬프트 등장 → 타이핑 → 글자가 커서로 흩어짐
const TYPE_DELAY = 420;
const TYPE_TIME = 560;
const CHARGE_AT = 1080;
const BLAST_AT = 1300;
const GLYPH_TIME = 300;

// 작업(ms): 프롬프트 입력 → 출동 → 글자 쓰기 → 정상으로 귀환
const PROMPT_TIME = 360;
const FLIGHT = 460;
const LAUNCH_GAP = 22;
const NEXT_JOB = 170;
const RETURN = 440;
const WRITE_SPEED = 2.4;
const WRITE_MIN = 220;
const WRITE_MAX = 850;
const FORCE_AFTER = 2600;

type AgentState = "inside" | "flight" | "write" | "return";
type Cycle = "opening" | "ready" | "charging";

interface Line {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface Job {
  el: HTMLElement;
  left: number;
  top: number;
  lines: Line[];
  length: number;
}

interface Agent {
  name: string;
  index: number;
  color: string;
  state: AgentState;
  x: number;
  y: number;
  scale: number;
  rot: number;
  fromX: number;
  fromY: number;
  fromScale: number;
  start: number;
  duration: number;
  spin: number;
  glyph?: string;
  jobs: Job[];
  labelAlpha: number;
}

export interface StageOptions {
  terrain: HTMLCanvasElement;
  agents: HTMLCanvasElement;
  opening: string;
  isBuilding: boolean;
  capsuleText: HTMLElement;
  getGlyphs: () => { glyph: string; x: number; y: number }[];
  onCharge: () => void;
  onBlast: () => void;
  onBuilt: () => void;
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, p: number) => from + (to - from) * p;

// 캔버스 글자도 페이지와 같은 Pretendard로 쓴다
const pageFont = () => getComputedStyle(document.body).fontFamily || "sans-serif";

// 등고선을 세로로 가늘게 잘라 칸마다 높이를 달리 두면 선 전체가 위아래로 일렁인다
const COLUMN = 3;
const WAVE = 0.011;

// 스크롤하면 분화구에서 좌우로 잔잔한 물결이 한 번씩 퍼진다
const RIPPLE = 0.03;
const RIPPLE_GAP = 1400;
const RIPPLE_TIME = 2200;

const waveAt = (x: number, rect: Rect, now: number, ripples: number[]) => {
  let lift =
    (Math.sin(x * 0.011 + now * 0.0011) + 0.6 * Math.sin(x * 0.027 - now * 0.0008)) *
    WAVE *
    rect.h;
  const summit = rect.x + SUMMIT.u * rect.w;
  for (const start of ripples) {
    const age = (now - start) / RIPPLE_TIME;
    const gap = Math.abs(x - summit) / rect.w - age * 1.1;
    lift -= Math.exp(-(gap * gap) / 0.002) * (1 - age) * RIPPLE * rect.h;
  }
  return lift;
};

const drawColumns = (
  ctx: CanvasRenderingContext2D,
  raster: HTMLCanvasElement,
  rect: Rect,
  now: number,
  ripples: number[]
) => {
  const scale = raster.width / rect.w;
  for (let x = 0; x < rect.w; x += COLUMN) {
    const lift = waveAt(rect.x + x, rect, now, ripples);
    ctx.drawImage(
      raster,
      x * scale, 0, COLUMN * scale, raster.height,
      rect.x + x, rect.y + lift, COLUMN, rect.h
    );
  }
};

// 요소 안의 실제 글자 줄을 찾는다. 커서는 이 줄을 따라 글자를 드러낸다
const textLines = (el: HTMLElement) => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const lines: Line[] = [];

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    Array.from(range.getClientRects()).forEach((rect) => {
      if (rect.width < 1) return;
      const top = rect.top + window.scrollY;
      const bottom = rect.bottom + window.scrollY;
      const same = lines.find(
        (line) => top < line.bottom - 2 && bottom > line.top + 2
      );
      if (same) {
        same.left = Math.min(same.left, rect.left);
        same.right = Math.max(same.right, rect.right);
        same.top = Math.min(same.top, top);
        same.bottom = Math.max(same.bottom, bottom);
      } else {
        lines.push({ left: rect.left, right: rect.right, top, bottom });
      }
    });
  }
  return lines.sort((a, b) => a.top - b.top);
};

const toJob = (el: HTMLElement): Job => {
  const box = el.getBoundingClientRect();
  const top = box.top + window.scrollY;
  const found = textLines(el);
  const lines = found.length
    ? found
    : [{ left: box.left, right: box.right, top, bottom: top + box.height }];

  return {
    el,
    left: box.left,
    top,
    lines,
    length: lines.reduce((sum, line) => sum + line.right - line.left, 0),
  };
};

// 진행률 p가 닿은 글자 위치
const penAt = ({ lines, length }: Job, p: number) => {
  let rest = p * length;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const size = line.right - line.left;
    if (rest <= size || i === lines.length - 1) {
      return { index: i, line, x: line.left + Math.min(rest, size) };
    }
    rest -= size;
  }
  return { index: 0, line: lines[0], x: lines[0].left };
};

// 지나온 줄은 전부, 지금 줄은 커서가 있는 곳까지만 보이게 자른다
const revealTo = (job: Job, p: number) => {
  const { index, line, x } = penAt(job, p);
  const cut = x - job.left;
  const top = index === 0 ? 0 : line.top - job.top;
  const bottom = line.bottom - job.top + 8;
  job.el.style.clipPath = `polygon(0 0, 100% 0, 100% ${top}px, ${cut}px ${top}px, ${cut}px ${bottom}px, 0 ${bottom}px)`;
};

// 입체감도 테두리도 없는 단색의 납작한 커서
const createSprite = (color: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE.w * 2;
  canvas.height = SPRITE.h * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const arrow = new Path2D(ARROW_PATH);
  ctx.scale(2.5, 2.5);
  ctx.translate(1, 1);
  ctx.fillStyle = color;
  ctx.fill(arrow);
  return canvas;
};

export const createStage = (options: StageOptions) => {
  const { terrain, agents: agentCanvas, opening } = options;
  const groundCtx = terrain.getContext("2d");
  const ctx = agentCanvas.getContext("2d");
  if (!groundCtx || !ctx) return { stop: () => {}, destroy: () => {} };

  const isMobile = window.innerWidth < MOBILE_WIDTH;
  const sprites = COLORS.map(createSprite);
  const font = pageFont();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const crater = { x: 0, y: 0 };
  let rect: Rect = { x: 0, y: 0, w: 0, h: 0 };

  let image: HTMLImageElement | null = null;
  let raster: HTMLCanvasElement | null = null;

  const buildable = Array.from(
    document.querySelectorAll<HTMLElement>("[data-build]")
  );
  const lines = Array.from(
    document.querySelectorAll<HTMLElement>("[data-prompt-line]")
  );
  const writes = new Map<HTMLElement, { text: string; start: number }>();
  const visible = new Map<HTMLElement, number>();
  const claimed = new Set<HTMLElement>();
  const ripples: number[] = [];

  let width = 0;
  let height = 0;
  let frame = 0;
  let cameraScroll = 0;
  let isStopped = false;
  let reveal = options.isBuilding ? 0 : 9;
  let startTime = 0;
  let cycle: Cycle = options.isBuilding ? "opening" : "ready";
  let chargeStart = 0;
  let lastFrame = 0;
  let lastScrollY = window.scrollY;
  let lastWave = 0;
  let frameDelta = 1;

  const workers: Agent[] = Array.from(
    { length: isMobile ? COUNT.mobile : COUNT.pc },
    (_, i) => ({
      name: `Agent ${i + 1}`,
      index: i,
      color: COLORS[i % COLORS.length],
      state: "inside",
      x: 0,
      y: 0,
      scale: 0,
      rot: 0,
      fromX: 0,
      fromY: 0,
      fromScale: 1,
      start: 0,
      duration: FLIGHT,
      spin: 0,
      jobs: [],
      labelAlpha: 0,
    })
  );

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    [terrain, agentCanvas].forEach((canvas) => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    });
    workers.forEach((agent) => {
      agent.jobs = agent.jobs.map(({ el }) => toJob(el));
    });
    if (image) raster = rasterize(image, placeKv(width, height, 0).w * dpr);
  };

  const addRipple = (now: number) => {
    ripples.push(now);
    lastWave = now;
  };

  // 스크롤하면 섬에 잔잔한 물결이 한 번씩 퍼진다
  const onScroll = () => {
    const now = performance.now();
    const distance = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    if (!isStopped && distance > 5 && now - lastWave > RIPPLE_GAP) addRipple(now);
  };

  const updateCamera = () => {
    const target = clamp(window.scrollY / (height * 0.8));
    cameraScroll += (target - cameraScroll) * (1 - Math.pow(0.92, frameDelta));
    rect = placeKv(width, height, cameraScroll);
    crater.x = rect.x + SUMMIT.u * rect.w;
    crater.y = rect.y + SUMMIT.v * rect.h;
  };

  const drawTerrain = (now: number) => {
    groundCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    groundCtx.clearRect(0, 0, width, height);

    const isNarrow = width < MOBILE_WIDTH;
    groundCtx.globalAlpha = lerp(1, isNarrow ? 0.24 : 0.7, cameraScroll);

    for (let i = ripples.length - 1; i >= 0; i--) {
      if (now - ripples[i] > RIPPLE_TIME) ripples.splice(i, 1);
    }

    if (raster) {
      // 오프닝에서는 분화구를 중심으로 둥글게 번지며 드러난다
      groundCtx.save();
      if (reveal < 9) {
        const r = reveal * rect.w;
        groundCtx.beginPath();
        groundCtx.ellipse(crater.x, crater.y, r, r * 0.62, 0, 0, Math.PI * 2);
        groundCtx.clip();
      }
      drawColumns(groundCtx, raster, rect, now, ripples);
      groundCtx.restore();
    }
    groundCtx.globalAlpha = 1;

    // 본문 구간에서는 글자 쪽 섬을 지워 읽기 방해를 없앤다
    if (!isNarrow && cameraScroll > 0.01) {
      const fade = groundCtx.createLinearGradient(width * 0.34, 0, width * 0.6, 0);
      fade.addColorStop(0, `rgba(0, 0, 0, ${cameraScroll})`);
      fade.addColorStop(1, "rgba(0, 0, 0, 0)");
      groundCtx.globalCompositeOperation = "destination-out";
      groundCtx.fillStyle = fade;
      groundCtx.fillRect(0, 0, width * 0.6, height);
      groundCtx.globalCompositeOperation = "source-over";
    }
  };

  // 프롬프트 자리: 각 섹션 바로 위, 히어로는 하단 캡슐
  const lineOf = (el: Element) =>
    el
      .closest("[data-prompt]")
      ?.querySelector<HTMLElement>("[data-prompt-line]") ?? options.capsuleText;

  const promptBox = (line: HTMLElement) => line.parentElement ?? line;

  const clearWriting = (el: HTMLElement) => {
    delete el.dataset.writing;
    el.style.clipPath = "";
  };

  const finishElement = (el: HTMLElement) => {
    clearWriting(el);
    el.dataset.built = "";
    visible.delete(el);
    claimed.delete(el);

    // 섹션의 내용이 모두 나오면 프롬프트에 완료를 표시한다
    const section = el.closest("[data-prompt]");
    if (section && !section.querySelector("[data-build]:not([data-built])")) {
      promptBox(lineOf(section)).dataset.done = "";
    }
  };

  const nextPending = () =>
    Array.from(visible.keys()).find((el) => !claimed.has(el));

  const takeJobs = (now: number) => {
    const jobs: Job[] = [];
    visible.forEach((_, el) => {
      if (claimed.has(el)) return;
      claimed.add(el);
      visible.set(el, now);
      jobs.push(toJob(el));
    });
    return jobs.sort((a, b) => a.top - b.top);
  };

  const fly = (agent: Agent, now: number, delay: number) => {
    agent.state = "flight";
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.start = now + delay;
    agent.duration = FLIGHT;
    agent.spin = (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.3);
  };

  // 일을 마친 커서는 곧장 분화구로 돌아가 다음 출동까지 쉰다
  const goHome = (agent: Agent, now: number) => {
    agent.state = "return";
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.start = now;
    agent.fromScale = agent.scale;
    agent.duration = RETURN;
  };

  // 지을 내용이 생기면 섹션 프롬프트를 먼저 입력한다
  const beginCharge = (first: HTMLElement, now: number) => {
    const line = lineOf(first);
    const text = first.closest<HTMLElement>("[data-prompt]")?.dataset.prompt;
    delete promptBox(line).dataset.done;
    if (text) writes.set(line, { text, start: now });
    cycle = "charging";
    chargeStart = now;
  };

  // 쓸 내용이 있는 만큼만 커서가 나가고, 나머지는 분화구에 머문다
  const dispatch = (now: number) => {
    cycle = "ready";

    const jobs = takeJobs(now);
    const crew = workers.filter(
      ({ state }) => state === "inside" || state === "return"
    );
    if (!crew.length) {
      jobs.forEach((job) => claimed.delete(job.el));
      return;
    }

    jobs.forEach((job, i) => crew[i % crew.length].jobs.push(job));
    crew
      .filter((agent) => agent.jobs.length)
      .forEach((agent, i) => {
        if (agent.state === "inside") {
          agent.x = crater.x;
          agent.y = crater.y;
        }
        fly(agent, now, i * LAUNCH_GAP);
      });
    addRipple(now);
  };

  // 프롬프트의 글자가 커서로 변해, 일을 받은 커서는 글로 가고 나머지는 분화구로 들어간다
  const blast = (now: number) => {
    const glyphs = options.getGlyphs();
    const step = Math.max(glyphs.length / workers.length, 1);
    const jobs = takeJobs(now);
    jobs.forEach((job, i) => workers[i % workers.length].jobs.push(job));
    workers.forEach((agent, i) => {
      const glyph = glyphs[Math.floor(i * step)];
      agent.x = glyph?.x ?? width / 2;
      agent.y = glyph?.y ?? height / 2;
      agent.glyph = glyph?.glyph;
      agent.scale = 1;
      if (agent.jobs.length) fly(agent, now, 0);
      else goHome(agent, now);
    });

    addRipple(now);
    options.onBlast();
    cycle = "ready";
  };

  const updateFlight = (agent: Agent, now: number, p: number) => {
    const job = agent.jobs[0];
    if (!job) {
      goHome(agent, now);
      return;
    }

    const { line } = penAt(job, 0);
    const tx = line.left;
    const ty = (line.top + line.bottom) / 2 - window.scrollY;
    const apex = Math.min(agent.fromY, ty) - height * 0.16;
    const e = 1 - Math.pow(1 - p, 3);
    const midX = (agent.fromX + tx) / 2;

    agent.x = (1 - e) * (1 - e) * agent.fromX + 2 * (1 - e) * e * midX + e * e * tx;
    agent.y = (1 - e) * (1 - e) * agent.fromY + 2 * (1 - e) * e * apex + e * e * ty;
    agent.scale = 1 + Math.sin(p * Math.PI) * 0.25;
    agent.rot = (1 - p) * agent.spin;

    if (p >= 1) {
      agent.rot = 0;
      agent.scale = 1;
      agent.state = "write";
      agent.start = now;
      agent.duration = Math.min(
        Math.max(job.length / WRITE_SPEED, WRITE_MIN),
        WRITE_MAX
      );
      revealTo(job, 0);
      job.el.dataset.writing = "";
    }
  };

  const updateWrite = (agent: Agent, now: number, p: number) => {
    const job = agent.jobs[0];
    const { line, x } = penAt(job, p);
    revealTo(job, p);
    agent.x = x;
    agent.y = (line.top + line.bottom) / 2 - window.scrollY;

    if (p >= 1) {
      finishElement(job.el);
      agent.jobs.shift();
      if (agent.jobs.length) {
        fly(agent, now, 0);
        agent.duration = NEXT_JOB;
      } else {
        goHome(agent, now);
      }
    }
  };

  const updateReturn = (agent: Agent, p: number) => {
    // 분화구로 빨려 들어가듯 끝으로 갈수록 빨라진다
    const e = p * p * p;
    const midY = Math.min(agent.fromY, crater.y) - height * 0.12;
    const midX = (agent.fromX + crater.x) / 2;
    agent.x =
      (1 - e) * (1 - e) * agent.fromX + 2 * (1 - e) * e * midX + e * e * crater.x;
    agent.y =
      (1 - e) * (1 - e) * agent.fromY + 2 * (1 - e) * e * midY + e * e * crater.y;
    agent.scale = lerp(agent.fromScale, 0.08, e);
    if (p >= 1) {
      agent.state = "inside";
      agent.scale = 0;
    }
  };

  const updateAgent = (agent: Agent, now: number) => {
    if (agent.state === "inside") return;

    // 맡은 요소가 화면을 벗어나면 그 일은 내려놓는다
    const previousJob = agent.jobs[0];
    while (agent.jobs[0] && !visible.has(agent.jobs[0].el)) agent.jobs.shift();
    if (agent.jobs[0] && previousJob !== agent.jobs[0]) {
      fly(agent, now, 0);
      agent.duration = NEXT_JOB;
      return;
    }
    if (agent.state === "write" && !agent.jobs.length) {
      goHome(agent, now);
      return;
    }

    if (now < agent.start) return;
    const p = clamp((now - agent.start) / agent.duration);
    if (agent.state === "flight") updateFlight(agent, now, p);
    else if (agent.state === "write") updateWrite(agent, now, p);
    else updateReturn(agent, p);
  };

  const updateWrites = (now: number) => {
    writes.forEach(({ text, start }, el) => {
      const p = clamp((now - start) / PROMPT_TIME);
      el.textContent = text.slice(0, Math.ceil(p * text.length));
      if (p >= 1) writes.delete(el);
    });
  };

  const updateCycle = (now: number) => {
    const t = now - startTime;

    if (cycle === "opening") {
      const p = clamp((t - TYPE_DELAY) / TYPE_TIME);
      options.capsuleText.textContent = opening.slice(
        0,
        Math.ceil(p * opening.length)
      );
      if (t >= CHARGE_AT) options.onCharge();
      if (t >= BLAST_AT) blast(now);
      return;
    }

    if (reveal < 9) reveal += 0.03 * frameDelta;
    updateWrites(now);

    if (cycle === "charging") {
      if (now - chargeStart >= PROMPT_TIME) dispatch(now);
      return;
    }

    // 새로 지을 내용이 있을 때만 움직이고, 그 밖에는 조용히 둔다
    const first = nextPending();
    if (first) beginCharge(first, now);
  };

  // 일손이 끝내 닿지 못한 내용은 오래 숨겨 두지 않는다
  const forceReveal = (now: number) => {
    if (cycle === "opening") return;
    visible.forEach((seenAt, el) => {
      if (el.hasAttribute("data-writing")) return;
      if (now - seenAt >= FORCE_AFTER) finishElement(el);
    });
  };

  const drawAgent = (agent: Agent, now: number) => {
    if (agent.state === "inside" || now < agent.start) return;

    const turn = agent.rot * 0.4;
    const squeeze = Math.max(Math.abs(Math.cos(agent.rot)), 0.14);
    const size = agent.scale * dpr;
    ctx.setTransform(
      Math.cos(turn) * squeeze * size,
      Math.sin(turn) * squeeze * size,
      -Math.sin(turn) * size,
      Math.cos(turn) * size,
      agent.x * dpr,
      agent.y * dpr
    );

    const glyph = agent.glyph
      ? 1 - clamp((now - agent.start) / GLYPH_TIME)
      : 0;
    if (glyph > 0) {
      ctx.globalAlpha = glyph;
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 22px ${font}`;
      ctx.fillText(agent.glyph as string, -9, 8);
    } else {
      agent.glyph = undefined;
    }
    const quiet = width < MOBILE_WIDTH && cameraScroll > 0.3 && !agent.jobs.length;
    ctx.globalAlpha = (1 - glyph) * (quiet ? 0.38 : 1);
    ctx.drawImage(sprites[agent.index % COLORS.length], -1, -1, SPRITE.w, SPRITE.h);
    ctx.globalAlpha = 1;
  };

  // 이름표는 글자를 쓰는 동안에만 붙여 화면을 어지럽히지 않는다
  const drawLabel = (agent: Agent, now: number) => {
    if (now < agent.start) return;
    const job = agent.jobs[0];
    const show = job ? 1 : 0;
    agent.labelAlpha += (show - agent.labelAlpha) * (1 - Math.pow(0.8, frameDelta));
    if (agent.labelAlpha < 0.02 || agent.state === "inside") return;

    const label = job ? `${agent.name} · ${job.el.dataset.build}` : agent.name;
    const labelWidth = ctx.measureText(label).width + 10;
    const x = Math.max(8, Math.min(agent.x + 13, width - labelWidth - 8));
    const y = Math.max(80, Math.min(agent.y + 19, height - 24));
    ctx.globalAlpha = agent.labelAlpha;
    ctx.fillStyle = job ? agent.color : "rgba(18, 15, 42, 0.88)";
    ctx.beginPath();
    ctx.roundRect(x, y, labelWidth, 18, 4);
    ctx.fill();
    ctx.fillStyle = job ? INK : agent.color;
    ctx.fillText(label, x + 5, y + 13);
    ctx.globalAlpha = 1;
  };

  const drawOverlay = (now: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);


    workers.forEach((agent) => drawAgent(agent, now));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `600 11px ${font}`;
    workers.forEach((agent) => drawLabel(agent, now));
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (!startTime) startTime = now;
    frameDelta = lastFrame ? Math.min((now - lastFrame) / (1000 / 60), 2) : 1;
    lastFrame = now;

    updateCamera();
    if (!isStopped) {
      updateCycle(now);
      forceReveal(now);
      workers.forEach((agent) => updateAgent(agent, now));
      drawOverlay(now);
    }
    drawTerrain(now);
  };

  const onVisibility = () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) {
      lastFrame = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  // 진입과 이탈을 한 observer에서 처리해 화면 회전 때 상태가 엇갈리지 않게 한다.
  // 아래쪽 내용을 조금 일찍 준비해 스크롤 중 빈 공간이 보이는 시간도 줄인다.
  const observer = new IntersectionObserver((entries) => {
    const now = performance.now();
    entries.forEach(({ isIntersecting, target }) => {
      const el = target as HTMLElement;
      if (isIntersecting) {
        if (!el.hasAttribute("data-prompt-line") && !el.hasAttribute("data-built")) {
          if (!visible.has(el)) visible.set(el, now);
        }
        return;
      }

      // 한 번 적힌 내용은 그대로 두고, 쓰다 만 내용은 마저 보여 준다.
      // 다시 돌아와도 같은 내용을 또 쓰지 않는다.
      if (el.hasAttribute("data-prompt-line")) {
        const text = writes.get(el)?.text;
        if (text) {
          el.textContent = text;
          writes.delete(el);
        }
        return;
      }
      if (visible.has(el)) finishElement(el);
    });
  }, { rootMargin: "0px 0px 10% 0px" });

  resize();
  loadKv().then((loaded) => {
    image = loaded;
    raster = rasterize(loaded, placeKv(width, height, 0).w * dpr);
  });
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  buildable.forEach((el) => {
    observer.observe(el);
  });
  lines.forEach((line) => observer.observe(line));
  frame = requestAnimationFrame(tick);

  const stop = () => {
    isStopped = true;
    reveal = 9;
    observer.disconnect();
    buildable.forEach((el) => {
      clearWriting(el);
      el.dataset.built = "";
    });
    writes.clear();
    lines.forEach((line) => {
      line.textContent =
        line.closest<HTMLElement>("[data-prompt]")?.dataset.prompt ?? "";
      promptBox(line).dataset.done = "";
    });
    options.onBuilt();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
  };

  const destroy = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
  };

  return { stop, destroy };
};

// 움직임을 줄인 환경에서는 지형을 한 번만 그린다
export const drawStill = async (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const image = await loadKv();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const rect = placeKv(width, height, 0);
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
};
