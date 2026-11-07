import {
  BUCKETS,
  Camera,
  CRATER,
  createDots,
  Dot,
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
const COUNT = { pc: 12, mobile: 8 };

// 오프닝(ms): 프롬프트 등장 → 타이핑 → 빛을 모음 → 폭발
const TYPE_DELAY = 420;
const TYPE_TIME = 560;
const CHARGE_AT = 1080;
const BLAST_AT = 1300;
const RING_TIME = 640;
const GLYPH_TIME = 300;

// 순환(ms): 프롬프트 입력 → 분화 → 작업 → 분화구로 귀환
const CHAR_TIME = 34;
const TYPE_HOLD = 400;
const LINE_TYPE = 340;
const VIA_FLIGHT = 340;
const FLIGHT = 460;
const LAUNCH_GAP = 22;
const TRACE = 300;
const WORK_TIME = 3600;
const RETURN = 460;
const RETURN_GAP = 28;
const REST = 220;
const FORCE_AFTER = 1200;
const CLAIM_GRACE = 300;
const QUICK_FLIGHT = 300;
const NEXT_JOB = 170;
const TAIL_LENGTH = 7;
const SHAPE_STEPS = 40;
const SHAKE_TIME = 340;
const COLUMN_TIME = 460;

type AgentState = "inside" | "flight" | "trace" | "walk" | "return";
type Cycle = "opening" | "typing" | "out" | "gather" | "rest";

type Shape = "rect" | "ellipse" | "wave" | "zigzag" | "underline" | "hatch";

// 에이전트마다 다른 도형을 맡긴다
const SHAPES: Shape[] = ["rect", "ellipse", "wave", "zigzag", "underline", "hatch"];

interface Job {
  el: HTMLElement;
  pageX: number;
  pageY: number;
  w: number;
  h: number;
  shape: Shape;
}

interface Agent {
  name: string;
  state: AgentState;
  x: number;
  y: number;
  scale: number;
  rot: number;
  fromX: number;
  fromY: number;
  start: number;
  duration: number;
  spin: number;
  glyph?: string;
  jobs: Job[];
  dot: Dot;
  nextDot: Dot;
  tail: number[];
  labelAlpha: number;
  fade: number;
  // 내용으로 가기 전에 들르는 프롬프트 위치
  hasVia: boolean;
  viaX: number;
  viaY: number;
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

interface Trail {
  job: Job;
  start: number;
}

export interface StageOptions {
  terrain: HTMLCanvasElement;
  agents: HTMLCanvasElement;
  opening: string;
  idlePrompts: string[];
  isBuilding: boolean;
  capsuleText: HTMLElement;
  getGlyphs: () => { glyph: string; x: number; y: number }[];
  onCharge: () => void;
  onBlast: () => void;
  onBuilt: () => void;
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, p: number) => from + (to - from) * p;
const ease = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

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

// 도형을 따라 그리는 경로. p는 0에서 1까지의 진행률이다
const shapePoint = ({ pageX: x, w, h, shape }: Job, top: number, p: number) => {
  if (shape === "ellipse") {
    const angle = p * Math.PI * 2 - Math.PI / 2;
    return {
      x: x + w / 2 + (Math.cos(angle) * w) / 2,
      y: top + h / 2 + (Math.sin(angle) * h) / 2,
    };
  }
  if (shape === "wave") {
    return {
      x: x + w * p,
      y: top + h / 2 + Math.sin(p * Math.PI * 6) * h * 0.32,
    };
  }
  if (shape === "zigzag") {
    const edge = p * 3;
    if (edge < 1) return { x: x + w * edge, y: top };
    if (edge < 2) return { x: x + w * (2 - edge), y: top + h * (edge - 1) };
    return { x: x + w * (edge - 2), y: top + h };
  }
  if (shape === "underline") return { x: x + w * p, y: top + h };
  if (shape === "hatch") {
    const phase = (p * 5) % 1;
    return {
      x: x + w * p,
      y: top + h * (phase < 0.5 ? phase * 2 : 2 - phase * 2),
    };
  }

  const edge = p * 2 * (w + h);
  if (edge < w) return { x: x + edge, y: top };
  if (edge < w + h) return { x: x + w, y: top + edge - w };
  if (edge < 2 * w + h) return { x: x + w - (edge - w - h), y: top + h };
  return { x, y: top + h - (edge - 2 * w - h) };
};

const shade = (color: string, amount: number) => {
  const value = parseInt(color.slice(1), 16);
  const channel = (shift: number) =>
    Math.round(((value >> shift) & 255) * amount);
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
};

// 측면을 겹쳐 그려 두께가 있는 입체 커서를 미리 만들어 둔다
const createSprite = () => {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE.w * 2;
  canvas.height = SPRITE.h * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const arrow = new Path2D(ARROW_PATH);
  ctx.scale(2.5, 2.5);
  ctx.translate(1, 1);

  ctx.fillStyle = shade(ORANGE, 0.4);
  for (let depth = 5; depth > 0; depth--) {
    ctx.save();
    ctx.translate(depth * 0.5, depth * 0.5);
    ctx.fill(arrow);
    ctx.restore();
  }

  const face = ctx.createLinearGradient(0, 0, 10, 18);
  face.addColorStop(0, "#ffe2c4");
  face.addColorStop(0.4, ORANGE);
  face.addColorStop(1, shade(ORANGE, 0.75));
  ctx.fillStyle = face;
  ctx.fill(arrow);
  return canvas;
};

export const createStage = (options: StageOptions) => {
  const { terrain, agents: agentCanvas, opening, idlePrompts } = options;
  const groundCtx = terrain.getContext("2d");
  const ctx = agentCanvas.getContext("2d");
  if (!groundCtx || !ctx) return { stop: () => {}, destroy: () => {} };

  const isMobile = window.innerWidth < MOBILE_WIDTH;
  const dots = createDots(isMobile ? 0.021 : 0.0135);
  const landDots = dots.filter((dot) => dot.d > 0.1);
  const sprite = createSprite();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const camera: Camera = { yaw: 0, pitch: 1, cx: 0, cy: 0, radius: 0 };
  const point: Point = { x: 0, y: 0, scale: 1 };
  const crater: Point = { x: 0, y: 0, scale: 1 };
  const hot = new Float32Array(dots.length * 3);

  const buildable = Array.from(
    document.querySelectorAll<HTMLElement>("[data-build]")
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-prompt]")
  );
  const lines = Array.from(
    document.querySelectorAll<HTMLElement>("[data-prompt-line]")
  );
  const writes = new Map<
    HTMLElement,
    { text: string; start: number; time: number }
  >();
  const visible = new Map<HTMLElement, number>();
  const claimed = new Set<HTMLElement>();
  const parts = new Map<HTMLElement, number>();
  const ripples: Ripple[] = [];
  const sparks: Spark[] = [];
  const trails: Trail[] = [];
  let workers: Agent[] = [];

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

  let cycle: Cycle = options.isBuilding ? "opening" : "rest";
  let cycleEnd = 0;
  let prompt = "";
  let typeStart = 0;
  let typeTime = 0;
  let typeTarget = options.capsuleText;
  let idleIndex = 0;

  // 일을 마친 커서는 글자가 있는 구역을 피해 섬 위에만 머문다
  const isClearOfText = (dot: Dot) => {
    project(dot.x, dot.y, dot.z, camera, point);
    if (width < MOBILE_WIDTH) return point.y < height * 0.44;
    return point.x > width * (cameraScroll < 0.2 ? 0.44 : 0.58);
  };

  const randomLand = () => {
    let dot = landDots[0];
    for (let i = 0; i < 24; i++) {
      dot = landDots[Math.floor(Math.random() * landDots.length)];
      if (isClearOfText(dot)) break;
    }
    return dot;
  };

  const nearLand = (from: Dot) => {
    let best = randomLand();
    let bestGap = Infinity;
    for (let i = 0; i < 14; i++) {
      const dot = randomLand();
      const gap = Math.abs(Math.hypot(dot.x - from.x, dot.z - from.z) - 0.18);
      if (gap < bestGap) {
        best = dot;
        bestGap = gap;
      }
    }
    return best;
  };

  // 모바일 본문에서는 글자와 커서가 겹칠 수밖에 없어 쉬는 커서를 흐리게 한다
  const isQuiet = (agent: Agent) =>
    width < MOBILE_WIDTH && cameraScroll > 0.3 && !agent.jobs.length;

  const createAgents = () => {
    const count = isMobile ? COUNT.mobile : COUNT.pc;
    workers = Array.from({ length: count }, (_, i) => {
      const dot = randomLand();
      return {
        name: `Agent ${i + 1}`,
        state: "inside" as AgentState,
        x: 0,
        y: 0,
        scale: 0,
        rot: 0,
        fromX: 0,
        fromY: 0,
        start: 0,
        duration: FLIGHT,
        spin: 0,
        jobs: [],
        dot,
        nextDot: dot,
        tail: [],
        labelAlpha: 0,
        fade: 1,
        hasVia: false,
        viaX: 0,
        viaY: 0,
      };
    });
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    [terrain, agentCanvas].forEach((canvas) => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    });
  };

  const updateCamera = (now: number) => {
    const target = clamp(window.scrollY / (height * 0.8));
    cameraScroll += (target - cameraScroll) * 0.08;
    const p = cameraScroll;
    const hero = heroCamera(width, height);

    // 북쪽이 위로 오도록 회전은 살짝 흔들리는 정도로만 둔다
    camera.yaw = Math.sin(now * 0.00012) * 0.05 + p * 0.2;
    camera.pitch = lerp(hero.pitch, 1.02, p);
    if (width < MOBILE_WIDTH) {
      camera.cx = hero.cx;
      camera.cy = lerp(hero.cy, height * 0.5, p);
      camera.radius = hero.radius;
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
    groundCtx.globalAlpha = lerp(1, isNarrow ? 0.3 : 0.7, cameraScroll);

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

  const toJob = (el: HTMLElement): Job => {
    const { left, top, width: w, height: h } = el.getBoundingClientRect();
    return { el, pageX: left, pageY: top + window.scrollY, w, h, shape: "rect" };
  };

  // 요소가 일손보다 적으면 면적에 맞춰 나눠 전원이 각자의 조각을 맡는다
  const splitJobs = (jobs: Job[], crew: number) => {
    const counts = jobs.map(() => 1);
    for (let total = jobs.length; total < crew; total++) {
      let widest = 0;
      jobs.forEach(({ w, h }, i) => {
        const best = jobs[widest];
        if ((w * h) / counts[i] > (best.w * best.h) / counts[widest]) widest = i;
      });
      counts[widest]++;
    }

    return jobs.flatMap((job, i) => {
      const count = counts[i];
      const rows = job.h > 110 && count > 2 ? 2 : 1;
      const columns = Math.ceil(count / rows);
      const w = job.w / columns;
      const h = job.h / rows;
      parts.set(job.el, count);

      return Array.from({ length: count }, (_, part): Job => ({
        ...job,
        pageX: job.pageX + (part % columns) * w + 3,
        pageY: job.pageY + Math.floor(part / columns) * h + 3,
        w: w - 6,
        h: h - 6,
      }));
    });
  };

  const assignJobs = (jobs: Job[], crew: Agent[]) => {
    splitJobs(jobs, crew.length).forEach((job, i) => {
      const index = i % crew.length;
      job.shape = SHAPES[index % SHAPES.length];
      crew[index].jobs.push(job);
    });
  };

  const finishElement = (el: HTMLElement) => {
    el.dataset.built = "";
    visible.delete(el);
    claimed.delete(el);
    parts.delete(el);
  };

  const takeJobs = (now: number, limit = Infinity) => {
    const jobs: Job[] = [];
    visible.forEach((_, el) => {
      if (claimed.has(el) || jobs.length >= limit) return;
      claimed.add(el);
      // 맡은 커서가 날아갈 시간만큼만 강제 표시를 미룬다
      visible.set(el, now + CLAIM_GRACE);
      jobs.push(toJob(el));
    });
    return jobs.sort((a, b) => a.pageY - b.pageY);
  };

  // 프롬프트 자리: 각 섹션 바로 위, 히어로는 하단 캡슐
  const lineOf = (el: Element) =>
    el
      .closest("[data-prompt]")
      ?.querySelector<HTMLElement>("[data-prompt-line]") ?? options.capsuleText;

  // 지금 읽고 있는 섹션
  const activeSection = () =>
    sections.find((section) => {
      const { top, bottom } = section.getBoundingClientRect();
      return top <= height * 0.4 && bottom > height * 0.4;
    });

  const updateWrites = (now: number) => {
    writes.forEach(({ text, start, time }, el) => {
      const p = clamp((now - start) / time);
      el.textContent = text.slice(0, Math.ceil(p * text.length));
      if (p >= 1) writes.delete(el);
    });
  };

  const emitSparks = (now: number) => {
    for (let i = 0; i < 80; i++) {
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

  const fly = (agent: Agent, now: number, delay: number) => {
    agent.state = "flight";
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.start = now + delay;
    agent.duration = FLIGHT;
    agent.spin = (Math.random() < 0.5 ? -1 : 1) * (2.5 + Math.random() * 3);
  };

  const flightTarget = (agent: Agent) => {
    if (agent.hasVia) return { x: agent.viaX, y: agent.viaY - window.scrollY };
    const job = agent.jobs[0];
    if (job) return shapePoint(job, job.pageY - window.scrollY, 0);
    return project(agent.dot.x, agent.dot.y, agent.dot.z, camera, point);
  };

  const beginTyping = (now: number) => {
    const section = activeSection();
    const pool = section?.dataset.idle?.split("|") ?? idlePrompts;
    prompt = pool[idleIndex++ % pool.length];
    typeTarget = section ? lineOf(section) : options.capsuleText;
    cycle = "typing";
    typeStart = now;
    typeTime = prompt.length * CHAR_TIME;
    typeTarget.textContent = "";
  };

  // 새 내용이 화면에 들어오면 그 위에 프롬프트를 치고,
  // 한라산에서 나온 커서가 프롬프트를 거쳐 내용으로 흩어진다
  const dispatch = (now: number) => {
    const first = Array.from(visible.keys()).find((el) => !claimed.has(el));
    const free = workers.filter((agent) => agent.state !== "trace");
    if (!first || !free.length) return false;

    const line = lineOf(first);
    const text = first.closest<HTMLElement>("[data-prompt]")?.dataset.prompt;
    const box = (line.parentElement ?? line).getBoundingClientRect();
    const spread = Math.min((text ?? "").length * 13 + 30, box.width);
    const jobs = takeJobs(now);

    writes.set(line, { text: text ?? "", start: now, time: LINE_TYPE });
    if (workers.some((agent) => agent.state === "inside")) {
      flashAt = now;
      shakeUntil = now + SHAKE_TIME;
      ripples.push({ start: now }, { start: now + 150 });
      emitSparks(now);
    }

    free.forEach((agent, i) => {
      const isInside = agent.state === "inside";
      if (isInside) {
        agent.x = crater.x;
        agent.y = crater.y;
        agent.dot = randomLand();
      }
      agent.viaX = box.left + (spread * (i + 0.5)) / free.length;
      agent.viaY = box.top + box.height / 2 + window.scrollY;
      agent.hasVia = true;
      fly(agent, now, isInside ? i * 12 : 0);
      agent.duration = VIA_FLIGHT;
    });
    assignJobs(jobs, free);

    heat = 0;
    cycle = "out";
    cycleEnd = now + WORK_TIME;
    return true;
  };

  const erupt = (now: number) => {
    cycle = "out";
    cycleEnd = now + WORK_TIME;
    heat = 0;
    flashAt = now;
    shakeUntil = now + SHAKE_TIME;
    ripples.push({ start: now }, { start: now + 150 });

    const jobs = takeJobs(now);
    workers.forEach((agent, i) => {
      agent.x = crater.x;
      agent.y = crater.y;
      agent.dot = randomLand();
      agent.jobs = [];
      fly(agent, now, i * LAUNCH_GAP);
    });
    assignJobs(jobs, workers);

    emitSparks(now);
  };

  const blast = (now: number) => {
    const glyphs = options.getGlyphs();
    const step = Math.max(glyphs.length / workers.length, 1);
    const jobs = takeJobs(now);

    workers.forEach((agent, i) => {
      const glyph = glyphs[Math.floor(i * step)];
      agent.x = glyph?.x ?? width / 2;
      agent.y = glyph?.y ?? height / 2;
      agent.glyph = glyph?.glyph;
      agent.scale = 1;
      agent.jobs = [];
      fly(agent, now, i * 8);
    });
    assignJobs(jobs, workers);

    flashAt = now;
    blastAt = now;
    shakeUntil = now + SHAKE_TIME;
    ripples.push({ start: now }, { start: now + 150 });
    options.onBlast();
    cycle = "out";
    cycleEnd = now + 2800;
  };

  const gather = (now: number) => {
    cycle = "gather";
    workers.forEach((agent, i) => {
      agent.state = "return";
      agent.fromX = agent.x;
      agent.fromY = agent.y;
      agent.start = now + i * RETURN_GAP;
      agent.duration = RETURN;
    });
  };

  const startWalking = (agent: Agent, now: number) => {
    agent.state = "walk";
    agent.nextDot = nearLand(agent.dot);
    agent.start = now;
    agent.duration = 380 + Math.random() * 360;
  };

  const updateAgent = (agent: Agent, now: number) => {
    if (agent.state === "inside") return;

    // 맡은 요소가 화면을 벗어났거나 이미 나타났으면 그 일은 내려놓는다
    while (agent.jobs[0] && !visible.has(agent.jobs[0].el)) agent.jobs.shift();
    if (agent.state === "trace" && !agent.jobs.length) {
      fly(agent, now, 0);
      return;
    }

    const p = clamp((now - agent.start) / agent.duration);

    if (agent.state === "flight") {
      if (now < agent.start) return;
      const target = flightTarget(agent);
      const tx = target.x;
      const ty = target.y;
      const apex = Math.min(agent.fromY, ty) - height * 0.4;
      // 분화구에서 튕겨 나가듯 처음에 가장 빠르다
      const e = 1 - Math.pow(1 - p, 3);
      const midX = (agent.fromX + tx) / 2;

      agent.x = (1 - e) * (1 - e) * agent.fromX + 2 * (1 - e) * e * midX + e * e * tx;
      agent.y = (1 - e) * (1 - e) * agent.fromY + 2 * (1 - e) * e * apex + e * e * ty;
      agent.scale = 1 + Math.sin(p * Math.PI) * 1.3;
      agent.rot = (1 - p) * agent.spin;

      if (p >= 1) {
        if (agent.hasVia) {
          agent.hasVia = false;
          fly(agent, now, 0);
          agent.duration = QUICK_FLIGHT;
          return;
        }

        agent.start = now;
        agent.rot = 0;
        agent.scale = 1;
        if (agent.jobs.length) {
          agent.state = "trace";
          agent.duration = TRACE;
        } else {
          startWalking(agent, now);
        }
      }
      return;
    }

    if (agent.state === "trace") {
      const job = agent.jobs[0];
      const { x, y } = shapePoint(job, job.pageY - window.scrollY, p);
      agent.x = x;
      agent.y = y;

      if (p >= 1) {
        trails.push({ job, start: now });
        const rest = (parts.get(job.el) ?? 1) - 1;
        parts.set(job.el, rest);
        if (rest <= 0) finishElement(job.el);
        agent.jobs.shift();
        if (agent.jobs.length) {
          fly(agent, now, 0);
          agent.duration = NEXT_JOB;
        } else {
          fly(agent, now, 0);
        }
      }
      return;
    }

    if (agent.state === "walk") {
      const from = project(agent.dot.x, agent.dot.y, agent.dot.z, camera, point);
      const fromX = from.x;
      const fromY = from.y;
      const to = project(
        agent.nextDot.x,
        agent.nextDot.y,
        agent.nextDot.z,
        camera,
        point
      );
      agent.x = lerp(fromX, to.x, ease(p));
      agent.y = lerp(fromY, to.y, ease(p));

      if (p >= 1) {
        agent.dot = agent.nextDot;
        startWalking(agent, now + 120 + Math.random() * 260);
      }
      return;
    }

    if (now < agent.start) return;
    // 분화구로 빨려 들어가듯 끝으로 갈수록 빨라진다
    const e = p * p * p;
    const midY = Math.min(agent.fromY, crater.y) - height * 0.12;
    const midX = (agent.fromX + crater.x) / 2;
    agent.x =
      (1 - e) * (1 - e) * agent.fromX + 2 * (1 - e) * e * midX + e * e * crater.x;
    agent.y =
      (1 - e) * (1 - e) * agent.fromY + 2 * (1 - e) * e * midY + e * e * crater.y;
    agent.scale = lerp(1, 0.08, e);
    if (p >= 1) {
      agent.state = "inside";
      agent.scale = 0;
    }
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

    if (reveal < 9) reveal += 0.03;

    updateWrites(now);
    if (dispatch(now)) return;

    if (cycle === "rest") {
      if (now >= cycleEnd) beginTyping(now);
      return;
    }

    if (cycle === "typing") {
      const p = clamp((now - typeStart) / typeTime);
      typeTarget.textContent = prompt.slice(0, Math.ceil(p * prompt.length));
      heat = clamp((now - typeStart) / (typeTime + TYPE_HOLD));
      if (now - typeStart >= typeTime + TYPE_HOLD) erupt(now);
      return;
    }

    if (cycle === "out") {
      const isBusy = workers.some(
        (agent) => agent.jobs.length || agent.state === "flight"
      );
      if (now >= cycleEnd && !isBusy) gather(now);
      return;
    }

    if (workers.every((agent) => agent.state === "inside")) {
      cycle = "rest";
      cycleEnd = now + REST;
    }
  };

  // 일손이 닿지 못한 내용은 오래 숨겨 두지 않고 바로 보여 준다
  const forceReveal = (now: number) => {
    if (cycle === "opening") return;
    visible.forEach((seenAt, el) => {
      if (now - seenAt >= FORCE_AFTER) finishElement(el);
    });
  };

  const drawShape = (job: Job, progress: number, alpha: number) => {
    const top = job.pageY - window.scrollY;
    const start = shapePoint(job, top, 0);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    for (let i = 1; i <= SHAPE_STEPS; i++) {
      const p = (i / SHAPE_STEPS) * progress;
      const { x, y } = shapePoint(job, top, p);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
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
    const offset = () => (Math.random() - 0.5) * 14 * power;
    const value = power > 0 ? `translate(${offset()}px, ${offset()}px)` : "";
    terrain.style.transform = value;
    agentCanvas.style.transform = value;
  };

  // 빠르게 나는 동안에만 잔상을 남긴다
  const drawTail = (agent: Agent) => {
    const { tail } = agent;
    const isFast = agent.state === "flight" || agent.state === "return";
    if (isFast) tail.push(agent.x, agent.y);
    if (tail.length > TAIL_LENGTH * 2 || !isFast) tail.splice(0, 2);
    if (tail.length < 4 || isQuiet(agent)) return;

    ctx.strokeStyle = ORANGE;
    ctx.lineCap = "round";
    for (let i = 2; i < tail.length; i += 2) {
      const p = i / tail.length;
      ctx.globalAlpha = p * 0.55;
      ctx.lineWidth = 1 + p * 3;
      ctx.beginPath();
      ctx.moveTo(tail[i - 2], tail[i - 1]);
      ctx.lineTo(tail[i], tail[i + 1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const drawAgent = (agent: Agent, now: number) => {
    if (agent.state === "inside" || now < agent.start - 1) {
      if (agent.state !== "walk" && agent.state !== "return") return;
    }

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
    agent.fade += ((isQuiet(agent) ? 0.14 : 1) - agent.fade) * 0.1;
    ctx.globalAlpha = (1 - glyph) * agent.fade;
    ctx.drawImage(sprite, -1, -1, SPRITE.w, SPRITE.h);
    ctx.globalAlpha = 1;
  };

  const drawLabel = (agent: Agent) => {
    const isWorking = agent.state === "walk" || agent.state === "trace";
    const target = isWorking && !isQuiet(agent) ? 1 : 0;
    agent.labelAlpha += (target - agent.labelAlpha) * 0.2;
    if (agent.labelAlpha < 0.02 || agent.state === "inside") return;

    const label = agent.name;
    const labelWidth = ctx.measureText(label).width + 10;
    ctx.globalAlpha = agent.labelAlpha;
    ctx.fillStyle = ORANGE;
    ctx.fillRect(agent.x + 13, agent.y + 19, labelWidth, 15);
    ctx.fillStyle = INK;
    ctx.fillText(label, agent.x + 18, agent.y + 30);
    ctx.globalAlpha = 1;
  };

  const drawOverlay = (now: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    for (let i = trails.length - 1; i >= 0; i--) {
      const trail = trails[i];
      const p = (now - trail.start) / 450;
      if (p >= 1) trails.splice(i, 1);
      else drawShape(trail.job, 1, 1 - p);
    }

    workers.forEach((agent) => {
      if (agent.state !== "trace") return;
      const p = clamp((now - agent.start) / agent.duration);
      drawShape(agent.jobs[0], p, 1);
    });

    drawColumn(now);
    drawRing(now);

    ctx.fillStyle = ORANGE;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      const age = now - spark.born;
      if (age > 1300) {
        sparks.splice(i, 1);
        continue;
      }
      spark.vy += 0.16;
      spark.x += spark.vx;
      spark.y += spark.vy;
      ctx.globalAlpha = 1 - age / 1300;
      ctx.fillRect(spark.x, spark.y, 3.5, 3.5);
    }
    ctx.globalAlpha = 1;

    workers.forEach(drawTail);
    workers.forEach((agent) => drawAgent(agent, now));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = "600 10px ui-monospace, Menlo, Consolas, monospace";
    workers.forEach(drawLabel);
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (!startTime) startTime = now;

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

  const observer = new IntersectionObserver(
    (entries) => {
      const now = performance.now();
      entries.forEach(({ isIntersecting, target }) => {
        const el = target as HTMLElement;
        if (!isIntersecting || el.hasAttribute("data-built")) return;
        if (!visible.has(el)) visible.set(el, now);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  // 화면을 완전히 벗어난 요소는 되돌려 두었다가 돌아오면 다시 짓는다
  const leaveObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) return;
      const el = target as HTMLElement;

      if (el.hasAttribute("data-prompt-line")) {
        writes.delete(el);
        el.textContent = "";
        return;
      }

      visible.delete(el);
      claimed.delete(el);
      delete el.dataset.built;
    });
  });

  resize();
  createAgents();
  window.addEventListener("resize", resize);
  buildable.forEach((el) => {
    observer.observe(el);
    leaveObserver.observe(el);
  });
  lines.forEach((line) => leaveObserver.observe(line));
  frame = requestAnimationFrame(tick);

  const stop = () => {
    isStopped = true;
    reveal = 9;
    heat = 0;
    observer.disconnect();
    leaveObserver.disconnect();
    buildable.forEach((el) => {
      el.dataset.built = "";
    });
    writes.clear();
    lines.forEach((line) => {
      line.textContent =
        line.closest<HTMLElement>("[data-prompt]")?.dataset.prompt ?? "";
    });
    options.onBuilt();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
  };

  const destroy = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    leaveObserver.disconnect();
    window.removeEventListener("resize", resize);
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
