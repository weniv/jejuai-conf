import {
  BUCKETS,
  Camera,
  CRATER,
  createDots,
  MOUNTAIN_BASE,
  Point,
  project,
} from "./terrain";

const ORANGE = "#ff7a1a";
const INK = "#10110f";
const ARROW_PATH =
  "M0 0 L0 15.5 L4.4 11.8 L7.3 18 L10 16.8 L7.2 10.8 L13 10.4 Z";
const SPRITE = { w: 26, h: 32 };

const MOBILE_WIDTH = 768;
const COUNT = { pc: 24, mobile: 14 };
const COLORS = [ORANGE, "#ffc16e", "#ff9b50", "#f2efe6"];

// 오프닝(ms): 프롬프트 등장 → 타이핑 → 빛을 모음 → 폭발
const TYPE_DELAY = 420;
const TYPE_TIME = 560;
const CHARGE_AT = 1080;
const BLAST_AT = 1300;
const RING_TIME = 640;
const GLYPH_TIME = 300;

// 작업(ms): 프롬프트 입력과 과열 → 분화 → 글자 쓰기 → 화산으로 귀환
const HEAT_TIME = 360;
const FLIGHT = 460;
const LAUNCH_GAP = 22;
const NEXT_JOB = 170;
const RETURN = 440;
const WRITE_SPEED = 2.4;
const WRITE_MIN = 220;
const WRITE_MAX = 850;
const FORCE_AFTER = 2600;
const TAIL_LENGTH = 12;
const SHAKE_TIME = 340;
const COLUMN_TIME = 460;
const IDLE_INTERVAL = 6200;
const IDLE_CHARGE = 780;
const SCROLL_INTERVAL = 1700;
const SWARM_TIME = 3800;

type AgentState = "inside" | "flight" | "write" | "swarm" | "return";
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
  tail: number[];
  labelAlpha: number;
  land: { x: number; y: number; z: number };
}

interface Ripple {
  start: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
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

// 히어로에서는 글자 오른쪽에 섬 전체가 들어오게 둔다
const heroCamera = (width: number, height: number): Camera =>
  width < MOBILE_WIDTH
    ? { yaw: 0, pitch: 0.84, cx: width * 0.5, cy: height * 0.3, radius: width * 0.47 }
    : {
        yaw: 0,
        pitch: 0.84,
        cx: width * 0.7,
        cy: height * 0.52,
        radius: Math.min(width * 0.29, height * 0.56),
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

const shade = (color: string, amount: number) => {
  const value = parseInt(color.slice(1), 16);
  const channel = (shift: number) =>
    Math.round(((value >> shift) & 255) * amount);
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
};

// 측면을 겹쳐 그려 두께가 있는 입체 커서를 미리 만들어 둔다
const createSprite = (color: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE.w * 2;
  canvas.height = SPRITE.h * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const arrow = new Path2D(ARROW_PATH);
  ctx.scale(2.5, 2.5);
  ctx.translate(1, 1);

  ctx.fillStyle = shade(color, 0.4);
  for (let depth = 5; depth > 0; depth--) {
    ctx.save();
    ctx.translate(depth * 0.5, depth * 0.5);
    ctx.fill(arrow);
    ctx.restore();
  }

  const face = ctx.createLinearGradient(0, 0, 10, 18);
  face.addColorStop(0, "#ffe2c4");
  face.addColorStop(0.4, color);
  face.addColorStop(1, shade(color, 0.75));
  ctx.fillStyle = face;
  ctx.fill(arrow);
  return canvas;
};

export const createStage = (options: StageOptions) => {
  const { terrain, agents: agentCanvas, opening } = options;
  const groundCtx = terrain.getContext("2d");
  const ctx = agentCanvas.getContext("2d");
  if (!groundCtx || !ctx) return { stop: () => {}, destroy: () => {} };

  const isMobile = window.innerWidth < MOBILE_WIDTH;
  const dots = createDots(isMobile ? 0.021 : 0.0135);
  const landDots = dots.filter((dot) => dot.d > 0.13 && dot.d < 0.78);
  const sprites = COLORS.map(createSprite);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const camera: Camera = { yaw: 0, pitch: 1, cx: 0, cy: 0, radius: 0 };
  const point: Point = { x: 0, y: 0, scale: 1 };
  const crater: Point = { x: 0, y: 0, scale: 1 };
  const hot = new Float32Array(dots.length * 3);

  const buildable = Array.from(
    document.querySelectorAll<HTMLElement>("[data-build]")
  );
  const lines = Array.from(
    document.querySelectorAll<HTMLElement>("[data-prompt-line]")
  );
  const writes = new Map<HTMLElement, { text: string; start: number }>();
  const visible = new Map<HTMLElement, number>();
  const claimed = new Set<HTMLElement>();
  const ripples: Ripple[] = [];
  const sparks: Spark[] = [];

  let width = 0;
  let height = 0;
  let frame = 0;
  let cameraScroll = 0;
  let isStopped = false;
  let reveal = options.isBuilding ? 0 : 9;
  let heat = 0;
  let flashAt = -9999;
  let shakeUntil = 0;
  let blastAt = -9999;
  let startTime = 0;
  let cycle: Cycle = options.isBuilding ? "opening" : "ready";
  let chargeStart = 0;
  let chargeDuration = HEAT_TIME;
  let lastBurst = performance.now();
  let lastScroll = 0;
  let lastScrollY = window.scrollY;
  let scrollEnergy = 0;
  let lastWave = 0;
  let lastFrame = 0;
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
      tail: [],
      labelAlpha: 0,
      land: landDots[(i * 137) % landDots.length],
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
      agent.tail.length = 0;
    });
  };

  const onScroll = () => {
    const now = performance.now();
    const distance = Math.abs(window.scrollY - lastScrollY);
    scrollEnergy = clamp(scrollEnergy + distance / 280);
    lastScrollY = window.scrollY;
    lastScroll = now;
    if (!isStopped && distance > 5 && now - lastWave > 850) {
      ripples.push({ start: now });
      lastWave = now;
    }
  };

  const updateCamera = (now: number) => {
    const target = clamp(window.scrollY / (height * 0.8));
    cameraScroll += (target - cameraScroll) * (1 - Math.pow(0.92, frameDelta));
    const p = cameraScroll;
    const hero = heroCamera(width, height);

    // 북쪽이 위로 오도록 회전은 살짝 흔들리는 정도로만 둔다
    camera.yaw = Math.sin(now * 0.00012) * 0.05 + p * 0.2 + scrollEnergy * 0.09;
    camera.pitch = lerp(hero.pitch, 1.02, p) + scrollEnergy * 0.035;
    if (width < MOBILE_WIDTH) {
      camera.cx = lerp(hero.cx, width * 0.88, p);
      camera.cy = lerp(hero.cy, height * 0.38, p);
      camera.radius = hero.radius * lerp(1, 0.84, p);
    } else {
      camera.cx = lerp(hero.cx, width * 0.78, p);
      camera.cy = lerp(hero.cy, height * 0.5, p);
      camera.radius = hero.radius * lerp(1, 0.78, p);
    }
    project(CRATER.x, CRATER.y, CRATER.z, camera, crater);
  };

  const drawTerrain = (now: number) => {
    groundCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    groundCtx.clearRect(0, 0, width, height);

    const isNarrow = width < MOBILE_WIDTH;
    groundCtx.globalAlpha = lerp(1, isNarrow ? 0.24 : 0.7, cameraScroll);

    for (let i = ripples.length - 1; i >= 0; i--) {
      if (now - ripples[i].start > 2200) ripples.splice(i, 1);
    }

    let bucket = -1;
    let hotCount = 0;
    const tremor = heat > 0.7 ? (heat - 0.7) * 0.03 : 0;

    // 열은 산기슭에서 시작해 경사면을 타고 정상까지 올라온다
    const heatFront = MOUNTAIN_BASE * Math.pow(1 - heat, 2.6);
    const heatBand = 0.08 + heatFront * 0.5;

    for (const dot of dots) {
      if (dot.d > reveal) continue;

      let lift = 0;
      for (const ripple of ripples) {
        const reach = ((now - ripple.start) / 1000) * 1.1;
        const gap = dot.d - reach;
        if (reach > 0 && Math.abs(gap) < 0.16) {
          lift += Math.exp((-gap * gap) / 0.004) * Math.max(1 - reach / 1.7, 0);
        }
      }

      const shake = dot.d < 0.3 ? (Math.random() - 0.5) * tremor : 0;
      project(dot.x, dot.y + lift * 0.14 + shake, dot.z, camera, point);
      const size = (1.1 + dot.y * 4) * point.scale;

      // 앞쪽 경계는 빽빽하고 지나온 자리로 갈수록 흩어진다
      const behind = (dot.d - heatFront) / heatBand;
      const isHeated =
        heat > 0.01 && behind >= 0 && behind < 1 && dot.grain > behind;

      if (lift > 0.12 || isHeated) {
        hot[hotCount * 3] = point.x;
        hot[hotCount * 3 + 1] = point.y;
        hot[hotCount * 3 + 2] = size + lift * 1.4;
        hotCount++;
        continue;
      }

      if (dot.bucket !== bucket) {
        bucket = dot.bucket;
        groundCtx.fillStyle = BUCKETS[bucket];
      }
      groundCtx.fillRect(point.x, point.y, size, size);
    }

    groundCtx.fillStyle = ORANGE;
    for (let i = 0; i < hotCount; i++) {
      const size = hot[i * 3 + 2];
      groundCtx.fillRect(hot[i * 3], hot[i * 3 + 1], size, size);
    }

    // 분화구는 프롬프트가 입력될수록 달아오른다
    const flash = 1 - clamp((now - flashAt) / 700);
    const glow = Math.max(Math.pow(heat, 5) * 0.6, flash);
    if (glow > 0.01) {
      const size = camera.radius * (0.1 + glow * 0.34);
      const light = groundCtx.createRadialGradient(
        crater.x,
        crater.y,
        0,
        crater.x,
        crater.y,
        size
      );
      light.addColorStop(0, `rgba(255, 170, 90, ${glow})`);
      light.addColorStop(0.35, `rgba(255, 122, 26, ${glow * 0.5})`);
      light.addColorStop(1, "rgba(255, 122, 26, 0)");
      groundCtx.fillStyle = light;
      groundCtx.fillRect(crater.x - size, crater.y - size, size * 2, size * 2);
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
    agent.spin = (Math.random() < 0.5 ? -1 : 1) * (2.5 + Math.random() * 3);
    agent.tail.length = 0;
  };

  // 커서는 섬을 탐색한 뒤 분화구로 모여 다음 출동을 기다린다.
  const goHome = (agent: Agent, now: number) => {
    agent.state = "return";
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.start = now;
    agent.fromScale = agent.scale;
    agent.duration = RETURN;
  };

  const swarm = (agent: Agent, now: number, delay = 0) => {
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.state = "swarm";
    agent.start = now + delay;
    agent.duration = SWARM_TIME + (agent.index % 5) * 180;
    agent.spin = (agent.index % 2 ? 1 : -1) * 2.4;
    agent.land = landDots[Math.floor(Math.random() * landDots.length)];
    agent.tail.length = 0;
  };

  const emitSparks = (now: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const force = 4 + Math.random() * 13;
      sparks.push({
        x: crater.x,
        y: crater.y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force,
        born: now,
      });
    }
  };

  // 지을 내용이 생기면 프롬프트를 치는 동안 열이 정상까지 오른다
  const beginCharge = (first: HTMLElement | undefined, now: number) => {
    if (first) {
      const line = lineOf(first);
      const text = first.closest<HTMLElement>("[data-prompt]")?.dataset.prompt;
      delete promptBox(line).dataset.done;
      if (text) writes.set(line, { text, start: now });
    }
    chargeDuration = first ? HEAT_TIME : IDLE_CHARGE;
    cycle = "charging";
    chargeStart = now;
  };

  // 글을 짓는 커서와 섬을 탐색하는 커서가 한 무리로 출동한다.
  const erupt = (now: number) => {
    heat = 0;
    cycle = "ready";

    const jobs = takeJobs(now);
    const crew = workers.filter(
      ({ state }) => state === "inside" || state === "return" || state === "swarm"
    );
    if (!crew.length) {
      jobs.forEach((job) => claimed.delete(job.el));
      return;
    }

    jobs.forEach((job, i) => crew[i % crew.length].jobs.push(job));
    crew.forEach((agent, i) => {
      const isInside = agent.state === "inside";
      if (isInside) {
        agent.x = crater.x;
        agent.y = crater.y;
      }
      const delay = i * LAUNCH_GAP;
      if (agent.jobs.length) fly(agent, now, delay);
      else swarm(agent, now, delay);
    });

    lastBurst = now;
    flashAt = now;
    shakeUntil = now + SHAKE_TIME;
    ripples.push({ start: now }, { start: now + 150 });
    emitSparks(now, width < MOBILE_WIDTH ? 44 : 88);
  };

  // 프롬프트의 글자가 커서로 변해 글과 섬으로 퍼져 나간다.
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
      if (agent.jobs.length) {
        fly(agent, now, 0);
      } else {
        swarm(agent, now, (i % 4) * LAUNCH_GAP);
      }
    });

    flashAt = now;
    blastAt = now;
    shakeUntil = now + SHAKE_TIME;
    lastBurst = now;
    emitSparks(now, width < MOBILE_WIDTH ? 36 : 72);
    ripples.push({ start: now }, { start: now + 150 });
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
    const apex = Math.min(agent.fromY, ty) - height * 0.4;
    // 분화구에서 튕겨 나가듯 처음에 가장 빠르다
    const e = 1 - Math.pow(1 - p, 3);
    const midX = (agent.fromX + tx) / 2;

    agent.x = (1 - e) * (1 - e) * agent.fromX + 2 * (1 - e) * e * midX + e * e * tx;
    agent.y = (1 - e) * (1 - e) * agent.fromY + 2 * (1 - e) * e * apex + e * e * ty;
    agent.scale = 1 + Math.sin(p * Math.PI) * 1.3;
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
        swarm(agent, now);
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
      agent.tail.length = 0;
    }
  };

  const updateSwarm = (agent: Agent, now: number, p: number) => {
    const mobile = width < MOBILE_WIDTH;
    const { land, index } = agent;
    const angle = now * 0.00055 + index * 2.39996;
    project(land.x, land.y, land.z, camera, point);
    const spread = mobile ? 16 : 32;
    // 데스크톱의 본문 왼쪽과 모바일 히어로 아래쪽은 비워 둔다.
    const left = mobile ? 18 : width * lerp(0.48, 0.62, cameraScroll);
    const tx = Math.min(width - 32, Math.max(left, point.x + Math.cos(angle) * spread));
    const ty = Math.max(90, Math.min(
      height * (mobile ? lerp(0.39, 0.6, cameraScroll) : 0.78),
      point.y + Math.sin(angle * 1.3) * spread - 18
    ));
    const arrival = clamp(p / 0.24);
    const e = 1 - Math.pow(1 - arrival, 3);
    const arc = Math.sin(arrival * Math.PI) * (mobile ? 65 : 140);
    agent.x = lerp(agent.fromX, tx, e);
    agent.y = lerp(agent.fromY, ty, e) - arc;
    agent.scale = (mobile ? 0.68 : 0.82) + Math.sin(arrival * Math.PI) * 0.65;
    agent.rot = (1 - arrival) * agent.spin + Math.sin(angle) * 0.12;
    if (p >= 1) goHome(agent, now);
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
    else if (agent.state === "swarm") updateSwarm(agent, now, p);
    else updateReturn(agent, p);
  };

  const updateWrites = (now: number) => {
    writes.forEach(({ text, start }, el) => {
      const p = clamp((now - start) / HEAT_TIME);
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
      heat = clamp((now - chargeStart) / chargeDuration);
      if (heat >= 1) erupt(now);
      return;
    }

    const first = nextPending();
    if (first) {
      beginCharge(first, now);
    } else if (
      (scrollEnergy > 0.12 && now - lastBurst > SCROLL_INTERVAL) ||
      (now - lastBurst > IDLE_INTERVAL && now - lastScroll > 650)
    ) {
      beginCharge(undefined, now);
    }
  };

  // 일손이 끝내 닿지 못한 내용은 오래 숨겨 두지 않는다
  const forceReveal = (now: number) => {
    if (cycle === "opening") return;
    visible.forEach((seenAt, el) => {
      if (el.hasAttribute("data-writing")) return;
      if (now - seenAt >= FORCE_AFTER) finishElement(el);
    });
  };

  // 분화 순간 한라산에서 솟구치는 빛기둥
  const drawColumn = (now: number) => {
    const p = (now - flashAt) / COLUMN_TIME;
    if (p < 0 || p >= 1) return;

    const top = crater.y - height * 0.55 * (1 - Math.pow(1 - p, 3));
    const size = camera.radius * 0.035 * (1 - p);
    const beam = ctx.createLinearGradient(0, crater.y, 0, top);
    beam.addColorStop(0, `rgba(255, 226, 190, ${1 - p})`);
    beam.addColorStop(0.5, `rgba(255, 122, 26, ${(1 - p) * 0.7})`);
    beam.addColorStop(1, "rgba(255, 122, 26, 0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(crater.x - size, crater.y);
    ctx.lineTo(crater.x + size, crater.y);
    ctx.lineTo(crater.x, top);
    ctx.fill();
  };

  // 프롬프트가 터질 때 화면 중앙에서 퍼지는 충격파
  const drawRing = (now: number) => {
    const p = (now - blastAt) / RING_TIME;
    if (p < 0 || p >= 1) return;

    ctx.globalAlpha = 1 - p;
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = (1 - p) * 6;
    ctx.beginPath();
    ctx.arc(
      width / 2,
      height / 2,
      (1 - Math.pow(1 - p, 3)) * Math.hypot(width, height) * 0.56,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // 지형만 흔들어 글자는 계속 또렷하게 둔다
  const shakeGround = (now: number) => {
    const power = (shakeUntil - now) / SHAKE_TIME;
    const offset = () => (Math.random() - 0.5) * (width < MOBILE_WIDTH ? 5 : 9) * power;
    const value = power > 0 ? `translate(${offset()}px, ${offset()}px)` : "";
    terrain.style.transform = value;
    agentCanvas.style.transform = value;
  };

  // 빠르게 나는 동안에만 잔상을 남긴다
  const drawTail = (agent: Agent, now: number) => {
    if (agent.state === "inside" || now < agent.start) return;
    const { tail } = agent;
    const isFast = agent.state === "flight" || agent.state === "return" ||
      (agent.state === "swarm" && (now - agent.start) / agent.duration < 0.24);
    const moved = !tail.length || Math.hypot(
      agent.x - tail[tail.length - 2], agent.y - tail[tail.length - 1]
    ) > 1.5;
    if (isFast && moved) tail.push(agent.x, agent.y);
    if (tail.length > TAIL_LENGTH * 2 || !isFast) tail.splice(0, 2);
    if (tail.length < 4) return;

    ctx.strokeStyle = agent.color;
    ctx.lineCap = "round";
    for (let i = 2; i < tail.length; i += 2) {
      const p = i / tail.length;
      ctx.globalAlpha = p * (width < MOBILE_WIDTH && cameraScroll > 0.3 ? 0.18 : 0.45);
      ctx.lineWidth = 1 + p * 3;
      ctx.beginPath();
      ctx.moveTo(tail[i - 2], tail[i - 1]);
      ctx.lineTo(tail[i], tail[i + 1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
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
      ctx.font = "700 22px Pretendard, sans-serif";
      ctx.fillText(agent.glyph as string, -9, 8);
    } else {
      agent.glyph = undefined;
    }
    const quiet = width < MOBILE_WIDTH && cameraScroll > 0.3 && !agent.jobs.length;
    ctx.globalAlpha = (1 - glyph) * (quiet ? 0.38 : 1);
    ctx.drawImage(sprites[agent.index % COLORS.length], -1, -1, SPRITE.w, SPRITE.h);
    ctx.globalAlpha = 1;
  };

  // 탐색 중에도 Agent의 존재가 보이도록 짧은 이름표를 유지한다.
  const drawLabel = (agent: Agent, now: number) => {
    if (now < agent.start) return;
    const job = agent.jobs[0];
    const roaming = agent.state === "swarm";
    const mobile = width < MOBILE_WIDTH;
    const show = job ? 1 : roaming && (!mobile || cameraScroll < 0.3) ? 0.72 : 0;
    agent.labelAlpha += (show - agent.labelAlpha) * (1 - Math.pow(0.8, frameDelta));
    if (agent.labelAlpha < 0.02 || agent.state === "inside") return;
    if (mobile && !job && agent.index % 3 !== 0) return;

    const label = job ? `${agent.name} · ${job.el.dataset.build}` : agent.name;
    const labelWidth = ctx.measureText(label).width + 10;
    const x = Math.max(8, Math.min(agent.x + 13, width - labelWidth - 8));
    const y = Math.max(80, Math.min(agent.y + 19, height - 24));
    ctx.globalAlpha = agent.labelAlpha;
    ctx.fillStyle = job ? agent.color : "rgba(16, 17, 15, 0.88)";
    ctx.beginPath();
    ctx.roundRect(x, y, labelWidth, 17, 4);
    ctx.fill();
    ctx.fillStyle = job ? INK : agent.color;
    ctx.fillText(label, x + 5, y + 12);
    ctx.globalAlpha = 1;
  };

  const drawConnections = (now: number) => {
    const mobile = width < MOBILE_WIDTH;
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 0.65;
    workers.forEach((agent, i) => {
      if (agent.state !== "swarm" || now < agent.start) return;
      let links = 0;
      for (let j = i + 1; j < workers.length && links < 2; j++) {
        const other = workers[j];
        if (other.state !== "swarm" || now < other.start) continue;
        const gap = Math.hypot(agent.x - other.x, agent.y - other.y);
        const reach = mobile ? 90 : 150;
        if (gap < 25 || gap > reach) continue;
        ctx.globalAlpha = (1 - gap / reach) * (mobile ? 0.14 : 0.26);
        ctx.beginPath();
        ctx.moveTo(agent.x, agent.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
        links++;
      }
    });
    ctx.globalAlpha = 1;
  };

  const drawCraterRings = (now: number) => {
    const age = now - flashAt;
    if (age < 0 || age > 1400) return;
    for (let i = 0; i < 3; i++) {
      const p = (age - i * 130) / 1000;
      if (p <= 0 || p >= 1) continue;
      ctx.globalAlpha = (1 - p) * 0.45;
      ctx.strokeStyle = i === 0 ? "#ffc16e" : ORANGE;
      ctx.lineWidth = (1 - p) * 2;
      ctx.beginPath();
      ctx.ellipse(crater.x, crater.y + p * 12,
        camera.radius * p * 0.8, camera.radius * p * 0.24, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const drawOverlay = (now: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    drawColumn(now);
    drawRing(now);
    drawCraterRings(now);
    drawConnections(now);

    ctx.fillStyle = ORANGE;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      const age = now - spark.born;
      if (age > 1300) {
        sparks.splice(i, 1);
        continue;
      }
      spark.vy += 0.16 * frameDelta;
      spark.x += spark.vx * frameDelta;
      spark.y += spark.vy * frameDelta;
      ctx.globalAlpha = (1 - age / 1300) * (width < MOBILE_WIDTH ? 0.65 : 1);
      const size = 1.5 + (1 - age / 1300) * 2;
      ctx.fillRect(spark.x, spark.y, size, size);
    }
    ctx.globalAlpha = 1;

    workers.forEach((agent) => drawTail(agent, now));
    workers.forEach((agent) => drawAgent(agent, now));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = "600 10px ui-monospace, Menlo, Consolas, monospace";
    workers.forEach((agent) => drawLabel(agent, now));
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (!startTime) startTime = now;
    frameDelta = lastFrame ? Math.min((now - lastFrame) / (1000 / 60), 2) : 1;
    lastFrame = now;
    scrollEnergy *= Math.pow(0.965, frameDelta);

    updateCamera(now);
    if (!isStopped) {
      updateCycle(now);
      forceReveal(now);
      workers.forEach((agent) => updateAgent(agent, now));
      drawOverlay(now);
      shakeGround(now);
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

      if (el.hasAttribute("data-prompt-line")) {
        writes.delete(el);
        el.textContent = "";
        delete promptBox(el).dataset.done;
        return;
      }

      visible.delete(el);
      claimed.delete(el);
      clearWriting(el);
      delete el.dataset.built;
    });
  }, { rootMargin: "0px 0px 10% 0px" });

  resize();
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
    heat = 0;
    shakeUntil = 0;
    terrain.style.transform = "";
    agentCanvas.style.transform = "";
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
export const drawStill = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < MOBILE_WIDTH;
  const camera = heroCamera(width, height);
  const point: Point = { x: 0, y: 0, scale: 1 };

  canvas.width = width;
  canvas.height = height;
  createDots(isMobile ? 0.021 : 0.0135).forEach((dot) => {
    project(dot.x, dot.y, dot.z, camera, point);
    const size = (1.1 + dot.y * 4) * point.scale;
    ctx.fillStyle = BUCKETS[dot.bucket];
    ctx.fillRect(point.x, point.y, size, size);
  });
};
