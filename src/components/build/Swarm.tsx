"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Swarm.module.scss";
import { drawPixel, ISLAND_PIXELS, IslandPixel, pixelCenter } from "./islandPixels";
import {
  AGENT_COLORS,
  CODE_LINES,
  LAYER_RULES,
  SEEN_KEY,
} from "./swarmData";

const PROMPT = "2026 제주 AI 컨퍼런스 페이지 만들어줘";
const FINALE_TEXT = "12.08";

// 오프닝 타임라인(ms): 타이핑 → 응축 → 폭발 → 글자가 커서로 변함 → 빌드 시작
const TYPE_TIME = 750;
const CHARGE = 800;
const ENTER = 1000;
const BUILD_AT = ENTER + 750;
const INTRO_END = ENTER + 2500;
const GLYPH_TIME = 280;
const FOCAL = 520;
const SPRITE = { w: 26, h: 32 };

const TRAVEL = 340;
const DRAW = 420;
const FORCE_AFTER = 1600;
const CHUNK = 6;
const REST_AFTER = 8000;
const FORM_TIME = 1200;
const HOLD_TIME = 3200;
const EXIT_TIME = 1000;

const COUNT = {
  pc: { start: 64, max: 240, finale: 340 },
  mobile: { start: 24, max: 70, finale: 150 },
};

const ARROW_PATH = "M0 0 L0 15.5 L4.4 11.8 L7.3 18 L10 16.8 L7.2 10.8 L13 10.4 Z";

interface BoxJob {
  kind: "box";
  el: HTMLElement;
  label: string;
  weight: number;
  queuedAt: number;
}

interface PixelJob {
  kind: "pixels";
  pixels: IslandPixel[];
  weight: number;
  queuedAt: number;
}

type Job = BoxJob | PixelJob;

interface Agent {
  index: number;
  name: string;
  labelWidth: number;
  color: string;
  seed: number;
  glyph?: string;
  born: number;
  // 입체 표현: 깊이, 회전과 화면에 투영된 위치
  z: number;
  vz: number;
  rot: number;
  spin: number;
  sx: number;
  sy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: "idle" | "go" | "draw" | "form";
  job?: Job;
  start: number;
  fromX: number;
  fromY: number;
  // 작업 위치는 스크롤과 함께 움직이도록 문서 좌표로 기억한다
  pageX: number;
  pageY: number;
  w: number;
  h: number;
  painted: number;
  formX: number;
  formY: number;
}

interface Stroke {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  start: number;
  duration: number;
}

interface Flyer {
  angle: number;
  radius: number;
  start: number;
  life: number;
  text?: string;
}

interface Origin {
  x: number;
  y: number;
  glyph?: string;
}

interface Fade {
  pageX: number;
  pageY: number;
  w: number;
  h: number;
  start: number;
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const ease = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const lerp = (from: number, to: number, p: number) => from + (to - from) * p;

const collectLayers = () => {
  LAYER_RULES.forEach(([selector, label]) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      if (el.closest("[data-build]")) return;
      if (el.getBoundingClientRect().width < 2) return;
      el.dataset.build = label;
    });
  });

  const counts: Record<string, number> = {};
  return Array.from(document.querySelectorAll<HTMLElement>("[data-build]"))
    .filter((el) => el.getBoundingClientRect().width >= 2)
    .map((el) => {
      const name = el.dataset.build ?? "";
      counts[name] = (counts[name] ?? 0) + 1;
      const words = (el.textContent ?? "").trim().split(/\s+/).length;
      return {
        kind: "box" as const,
        el,
        label: `${name} ${String(counts[name]).padStart(2, "0")}`,
        weight: Math.min(Math.max(words, 1), 12),
        queuedAt: 0,
      };
    });
};

const islandJobs = (): PixelJob[] => {
  const ordered = [...ISLAND_PIXELS].sort((a, b) =>
    a.col === b.col ? (a.col % 2 ? -1 : 1) * (a.row - b.row) : a.col - b.col
  );
  const jobs: PixelJob[] = [];
  for (let i = 0; i < ordered.length; i += CHUNK) {
    jobs.push({
      kind: "pixels",
      pixels: ordered.slice(i, i + CHUNK),
      weight: 1,
      queuedAt: 0,
    });
  }
  return jobs;
};

// 화면을 가로지르는 안내선
const createStrokes = (): Stroke[] => {
  const { innerWidth: width, innerHeight: height } = window;
  const random = (max: number) => Math.random() * max;
  const snap = (value: number) => Math.round(value / 24) * 24;

  return Array.from({ length: 70 }, (_, i) => {
    const start = ENTER + 80 + random(1200);
    const duration = 160 + random(280);

    if (i % 2) {
      const y = snap(random(height));
      return { x0: 0, y0: y, x1: width, y1: y, start, duration };
    }

    const x = snap(random(width));
    return { x0: x, y0: 0, x1: x, y1: height, start, duration };
  });
};

// 중심에서 카메라 쪽으로 날아오는 빛줄기와 코드 조각
const createFlyers = (): Flyer[] =>
  Array.from({ length: 190 }, (_, i) => ({
    angle: Math.random() * Math.PI * 2,
    radius: 24 + Math.random() * 170,
    start: ENTER + Math.random() * 1300,
    life: 520 + Math.random() * 520,
    text:
      i % 4 === 0
        ? CODE_LINES[Math.floor(Math.random() * CODE_LINES.length)]
        : undefined,
  }));

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

  ctx.fillStyle = shade(color, 0.38);
  for (let depth = 5; depth > 0; depth--) {
    ctx.save();
    ctx.translate(depth * 0.5, depth * 0.5);
    ctx.fill(arrow);
    ctx.restore();
  }

  const face = ctx.createLinearGradient(0, 0, 10, 18);
  face.addColorStop(0, "#ffffff");
  face.addColorStop(0.35, color);
  face.addColorStop(1, shade(color, 0.72));
  ctx.fillStyle = face;
  ctx.fill(arrow);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 0.6;
  ctx.stroke(arrow);
  return canvas;
};

// 글자를 그려 보고 칠해진 지점을 커서들의 집결 좌표로 쓴다
const finalePoints = (count: number) => {
  const { innerWidth: width, innerHeight: height } = window;
  const canvas = document.createElement("canvas");
  canvas.width = 520;
  canvas.height = 170;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.font = `700 150px ${getComputedStyle(document.body).fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(FINALE_TEXT, 260, 88);

  const { data } = ctx.getImageData(0, 0, 520, 170);
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < 170; y += 3) {
    for (let x = 0; x < 520; x += 3) {
      if (data[(y * 520 + x) * 4 + 3] > 128) points.push({ x, y });
    }
  }

  const scale = Math.min((width * 0.82) / 520, (height * 0.5) / 170);
  const step = Math.max(points.length / count, 1);
  return Array.from({ length: count }, (_, i) => {
    const point = points[Math.floor(i * step) % points.length];
    return {
      x: width / 2 + (point.x - 260) * scale,
      y: height * 0.44 + (point.y - 85) * scale,
    };
  });
};

export const Swarm = () => {
  const [isOn, setIsOn] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const swarmRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agentsRef = useRef<HTMLElement>(null);
  const layersRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const promptTextRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    if (html.hasAttribute("data-build-on")) {
      setIsOn(true);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!isOn || !canvas || !ctx) return;

    const html = document.documentElement;
    html.setAttribute("data-build-ready", "");
    const sprites = new Map(
      AGENT_COLORS.map((color) => [color, createSprite(color)])
    );
    const count = window.innerWidth < 768 ? COUNT.mobile : COUNT.pc;
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const layers = collectLayers();
    const island = document.querySelector<HTMLCanvasElement>(
      "[data-build-island]"
    );
    const islandCtx = island?.getContext("2d");
    const pixelJobs = island ? islandJobs() : [];
    const total =
      layers.reduce((sum, { weight }) => sum + weight, 0) + pixelJobs.length;

    const queue: BoxJob[] = [];
    const pixelQueue: PixelJob[] = [];
    const fades: Fade[] = [];
    const agents: Agent[] = [];
    const strokes = createStrokes();
    const flyers = createFlyers();

    let built = 0;
    let reach = 0;
    let frame = 0;
    let startTime = 0;
    let lastScroll = window.scrollY;
    let lastActive = performance.now();
    let finaleAt = 0;
    let isClosed = false;
    let hasEntered = false;
    let isObserving = false;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();

    const spawn = (origin?: Origin, now = 0) => {
      const index = agents.length;
      const { innerWidth: width, innerHeight: height } = window;
      const x = origin?.x ?? (Math.random() < 0.5 ? -30 : width + 30);
      const y = origin?.y ?? height * (0.4 + Math.random() * 0.6);
      const angle =
        Math.atan2(y - height / 2, x - width / 2) + (Math.random() - 0.5) * 1.4;
      const force = origin ? 26 + Math.random() * 44 : 0;

      agents.push({
        index,
        name: `Agent ${index + 1}`,
        labelWidth: 0,
        color: AGENT_COLORS[index % AGENT_COLORS.length],
        seed: Math.random(),
        glyph: origin?.glyph,
        born: now,
        z: 0,
        vz: origin ? -(12 + Math.random() * 62) : 0,
        rot: 0,
        spin: origin ? (Math.random() - 0.5) * 1.3 : 0,
        sx: x,
        sy: y,
        x,
        y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force,
        state: "idle",
        start: 0,
        fromX: 0,
        fromY: 0,
        pageX: 0,
        pageY: 0,
        w: 0,
        h: 0,
        painted: 0,
        formX: 0,
        formY: 0,
      });
    };

    const complete = (job: Job) => {
      built += job.weight;
      if (job.kind === "box") job.el.dataset.built = "";
    };

    const paintAll = () => {
      if (!island || !islandCtx) return;
      const rect = { x: 0, y: 0, w: island.getBoundingClientRect().width };
      islandCtx.clearRect(0, 0, island.width, island.height);
      ISLAND_PIXELS.forEach((pixel) => drawPixel(islandCtx, pixel, rect));
    };

    const finish = () => {
      if (isClosed) return;
      isClosed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      layers.forEach(({ el }) => (el.dataset.built = ""));
      paintAll();
      html.removeAttribute("data-build-on");
      try {
        sessionStorage.setItem(SEEN_KEY, "y");
      } catch {}
      setIsDone(true);
    };
    closeRef.current = finish;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          if (target === island) {
            pixelQueue.push(...pixelJobs);
            return;
          }
          const layer = layers.find(({ el }) => el === target);
          if (layer) {
            layer.queuedAt = now;
            queue.push(layer);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px" }
    );

    const assign = (agent: Agent, job: Job, now: number) => {
      agent.job = job;
      agent.state = "go";
      agent.start = now;
      agent.fromX = agent.x;
      agent.fromY = agent.y;
      agent.painted = 0;

      if (job.kind === "box") {
        const { left, top, width, height } = job.el.getBoundingClientRect();
        agent.pageX = left;
        agent.pageY = top + window.scrollY;
        agent.w = width;
        agent.h = height;
        return;
      }

      const box = island?.getBoundingClientRect();
      if (!box) return;
      const { x, y } = pixelCenter(job.pixels[0], {
        x: box.left,
        y: box.top + window.scrollY,
        w: box.width,
      });
      agent.pageX = x;
      agent.pageY = y;
    };

    const updateWorker = (agent: Agent, now: number, scrollY: number) => {
      const { job } = agent;
      if (!job) return;

      if (agent.state === "go") {
        const p = clamp((now - agent.start) / TRAVEL);
        agent.x = lerp(agent.fromX, agent.pageX, ease(p));
        agent.y = lerp(agent.fromY, agent.pageY - scrollY, ease(p));
        if (p >= 1) {
          agent.state = "draw";
          agent.start = now;
        }
        return;
      }

      const p = clamp((now - agent.start) / DRAW);
      if (job.kind === "box") {
        agent.x = agent.pageX + agent.w * ease(p);
        agent.y = agent.pageY - scrollY + agent.h * ease(p);
      } else if (island && islandCtx) {
        const box = island.getBoundingClientRect();
        const rect = { x: 0, y: 0, w: box.width };
        const target = Math.ceil(p * job.pixels.length);
        for (; agent.painted < target; agent.painted++) {
          drawPixel(islandCtx, job.pixels[agent.painted], rect);
        }
        const { x, y } = pixelCenter(job.pixels[Math.max(target - 1, 0)], rect);
        agent.x = box.left + x;
        agent.y = box.top + y;
      }

      if (p >= 1) {
        complete(job);
        if (job.kind === "box") {
          fades.push({
            pageX: agent.pageX,
            pageY: agent.pageY,
            w: agent.w,
            h: agent.h,
            start: now,
          });
        }
        agent.job = undefined;
        agent.state = "idle";
        agent.vx = 0;
        agent.vy = 0;
      }
    };

    // 쉬는 커서는 화면 아래쪽에 모여 있고, 스크롤하면 관성으로 밀려난다
    const updateIdle = (agent: Agent, now: number, scrollDelta: number) => {
      const { innerWidth: width, innerHeight: height } = window;
      const wave = now * 0.0005 + agent.seed * 40;
      const homeX = width * agent.seed + Math.sin(wave) * 40;
      const homeY = height * (0.66 + ((agent.seed * 7) % 1) * 0.26);
      agent.vx = (agent.vx + (homeX - agent.x) * 0.006) * 0.9;
      agent.vy = (agent.vy + (homeY + Math.cos(wave) * 14 - agent.y) * 0.006) * 0.9;
      agent.vy -= scrollDelta * (0.03 + agent.seed * 0.05);
      agent.x += agent.vx;
      agent.y += agent.vy;
    };

    const startFinale = (now: number) => {
      finaleAt = now;
      while (agents.length < count.finale) spawn();
      const points = finalePoints(agents.length);
      agents.forEach((agent, i) => {
        agent.state = "form";
        agent.job = undefined;
        agent.start = now + (i % 40) * 8;
        agent.fromX = agent.x;
        agent.fromY = agent.y;
        agent.formX = points[i]?.x ?? agent.x;
        agent.formY = points[i]?.y ?? agent.y;
      });
    };

    const updateForm = (agent: Agent, now: number) => {
      const p = ease(clamp((now - agent.start) / FORM_TIME));
      agent.x = lerp(agent.fromX, agent.formX, p);
      agent.y = lerp(agent.fromY, agent.formY, p);
      agent.z = lerp(-320, 0, p);

      const exit = (now - finaleAt - FORM_TIME - HOLD_TIME) / EXIT_TIME;
      if (exit > 0) {
        agent.y = lerp(agent.formY, -40, ease(clamp(exit - agent.seed * 0.3)));
      }
    };

    const drawWire = (
      x: number,
      y: number,
      w: number,
      h: number,
      alpha: number
    ) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(109, 242, 204, 0.12)";
      ctx.strokeStyle = "#2fbf98";
      ctx.lineWidth = 1;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x + 0.5, y + 0.5, w, h);
      ctx.globalAlpha = 1;
    };

    const drawIntro = (t: number) => {
      const { innerWidth: width, innerHeight: height } = window;
      const centerX = width / 2;
      const centerY = height / 2;
      const reach = Math.hypot(width, height) * 0.7;

      ctx.strokeStyle = "#6df2cc";
      ctx.lineWidth = 1;
      strokes.forEach(({ x0, y0, x1, y1, start, duration }) => {
        const age = t - start;
        if (age < 0 || age > duration + 500) return;
        const p = ease(clamp(age / duration));
        ctx.globalAlpha = 0.6 * (1 - clamp((age - duration) / 500));
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(lerp(x0, x1, p), lerp(y0, y1, p));
        ctx.stroke();
      });

      flyers.forEach(({ angle, radius, start, life, text }) => {
        const p = (t - start) / life;
        if (p < 0 || p >= 1) return;
        const near = radius / (1.06 - p);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        ctx.globalAlpha = Math.sin(p * Math.PI) * 0.9;

        if (text) {
          const size = Math.min(10 + p * p * 34, 40);
          ctx.font = `600 ${size}px ui-monospace, Menlo, Consolas, monospace`;
          ctx.fillStyle = "#6df2cc";
          ctx.fillText(text, centerX + cos * near, centerY + sin * near);
          return;
        }

        const far = radius / (1.24 - p);
        ctx.lineWidth = 0.6 + p * 2.4;
        ctx.beginPath();
        ctx.moveTo(centerX + cos * far, centerY + sin * far);
        ctx.lineTo(centerX + cos * near, centerY + sin * near);
        ctx.stroke();
      });

      [0, 110, 240].forEach((delay) => {
        const p = (t - ENTER - delay) / 720;
        if (p <= 0 || p >= 1) return;
        ctx.globalAlpha = 1 - p;
        ctx.strokeStyle = delay === 110 ? "#ffd84d" : "#6df2cc";
        ctx.lineWidth = (1 - p) * 16;
        ctx.beginPath();
        ctx.arc(centerX, centerY, (1 - Math.pow(1 - p, 3)) * reach, 0, 7);
        ctx.stroke();
      });
      ctx.strokeStyle = "#6df2cc";

      const flash = 1 - clamp((t - ENTER) / 240);
      if (flash > 0) {
        ctx.globalAlpha = flash * 0.9;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.globalAlpha = 1;
    };

    const drawAgent = (agent: Agent, now: number) => {
      const { innerWidth: width, innerHeight: height } = window;
      const scale = FOCAL / (FOCAL + agent.z);
      agent.sx = width / 2 + (agent.x - width / 2) * scale;
      agent.sy = height / 2 + (agent.y - height / 2) * scale;

      // 세로축 회전은 폭을 줄이고, 평면 회전은 기울기로 표현한다
      const turn = agent.rot * 0.45;
      const squeeze = Math.max(Math.abs(Math.cos(agent.rot)), 0.12);
      const size = scale * dpr;
      ctx.setTransform(
        Math.cos(turn) * squeeze * size,
        Math.sin(turn) * squeeze * size,
        -Math.sin(turn) * size,
        Math.cos(turn) * size,
        agent.sx * dpr,
        agent.sy * dpr
      );

      const age = now - agent.born;
      const glyph = agent.glyph ? 1 - clamp(age / GLYPH_TIME) : 0;
      const fog = 1 - clamp(agent.z / 620) * 0.55;

      if (glyph > 0) {
        ctx.globalAlpha = glyph;
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 22px ${fontFamily}`;
        ctx.fillText(agent.glyph as string, -9, 8);
      }
      const sprite = sprites.get(agent.color);
      if (sprite) {
        ctx.globalAlpha = (1 - glyph) * fog;
        ctx.drawImage(sprite, -1, -1, SPRITE.w, SPRITE.h);
      }
      ctx.globalAlpha = 1;
    };

    const drawLabel = (agent: Agent) => {
      const { name, sx, sy, color, state } = agent;
      if (state === "idle") {
        ctx.globalAlpha = 0.85 - clamp(agent.z / 620) * 0.45;
        ctx.fillStyle = color;
        ctx.fillText(name, sx + 15, sy + 26);
        ctx.globalAlpha = 1;
        return;
      }

      if (!agent.labelWidth) agent.labelWidth = ctx.measureText(name).width + 12;
      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(sx + 12, sy + 18, agent.labelWidth, 17, [2, 8, 8, 8]);
      } else {
        ctx.rect(sx + 12, sy + 18, agent.labelWidth, 17);
      }
      ctx.fill();
      ctx.fillStyle = "#160e26";
      ctx.fillText(name, sx + 18, sy + 30);
    };

    const render = (now: number, scrollY: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const t = now - startTime;
      if (t < INTRO_END) drawIntro(t);

      for (let i = fades.length - 1; i >= 0; i--) {
        const fade = fades[i];
        const p = (now - fade.start) / 500;
        if (p >= 1) fades.splice(i, 1);
        else drawWire(fade.pageX, fade.pageY - scrollY, fade.w, fade.h, 1 - p);
      }

      agents.forEach((agent) => {
        const { job } = agent;
        if (agent.state !== "draw" || job?.kind !== "box") return;
        const p = ease(clamp((now - agent.start) / DRAW));
        const y = agent.pageY - scrollY;
        drawWire(agent.pageX, y, agent.w * p, agent.h * p, 1);
        ctx.fillStyle = "#2fbf98";
        ctx.fillRect(agent.pageX + 3, y + 3, 54, 13);
        ctx.fillStyle = "#160e26";
        ctx.font = "700 9px ui-monospace, Menlo, Consolas, monospace";
        ctx.fillText(job.label, agent.pageX + 6, y + 13);
      });

      // 멀리 있는 커서부터 그려 가까운 커서가 앞에 보이게 한다
      [...agents]
        .sort((a, b) => b.z - a.z)
        .forEach((agent) => drawAgent(agent, now));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `600 11px ${fontFamily}`;
      agents.forEach((agent) => {
        if (agent.state === "form" || now - agent.born < GLYPH_TIME * 2) return;
        drawLabel(agent);
      });
    };

    const updateHud = () => {
      const percent = clamp(built / total);
      if (agentsRef.current) {
        agentsRef.current.textContent = `${agents.length} agents`;
      }
      if (layersRef.current) {
        layersRef.current.textContent = `${Math.min(built, total)} / ${total} layers`;
      }
      if (barRef.current) barRef.current.style.width = `${percent * 100}%`;
      if (statusRef.current) {
        const isWorking =
          queue.length || pixelQueue.length || agents.some(({ job }) => job);
        statusRef.current.textContent = finaleAt
          ? "완료"
          : isWorking
          ? "짓는 중"
          : "스크롤";
      }
    };

    // 프롬프트의 글자 위치를 재서 그 자리에서 커서가 태어나게 한다
    const glyphOrigins = () => {
      const node = promptTextRef.current?.firstChild;
      if (!node) return [];
      const range = document.createRange();
      const origins: Origin[] = [];
      PROMPT.split("").forEach((glyph, i) => {
        if (glyph === " ") return;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const { left, top, width, height } = range.getBoundingClientRect();
        origins.push({ glyph, x: left + width / 2, y: top + height / 2 });
      });
      return origins;
    };

    const enter = (now: number) => {
      hasEntered = true;
      const origins = glyphOrigins();
      const box = promptRef.current?.getBoundingClientRect();

      sheetRef.current?.classList.add(styles.off);
      promptRef.current?.classList.add(styles.off);
      hudRef.current?.classList.add(styles.on);

      for (let i = 0; i < count.start; i++) {
        const left = box?.left ?? window.innerWidth / 2;
        const top = box?.top ?? window.innerHeight / 2;
        const edge = Math.random() < 0.5 ? 0 : box?.height ?? 0;
        spawn(
          origins[i] ?? {
            x: left + Math.random() * (box?.width ?? 0),
            y: top + edge,
          },
          now
        );
      }
    };

    const shake = (t: number) => {
      const node = swarmRef.current;
      if (!node) return;
      const power = 1 - clamp((t - ENTER) / 420);
      if (power <= 0) {
        node.style.transform = "";
        return;
      }
      const offset = () => (Math.random() - 0.5) * 26 * power;
      node.style.transform = `translate(${offset()}px, ${offset()}px)`;
    };

    const updateDepth = (agent: Agent) => {
      if (agent.state === "form") return;
      const target = agent.state === "idle" ? agent.seed * 300 : 0;
      agent.vz = (agent.vz + (target - agent.z) * 0.012) * 0.92;
      agent.z = Math.max(agent.z + agent.vz, -390);
      if (agent.state !== "idle") agent.z *= 0.82;
      agent.spin *= 0.95;
      agent.rot = (agent.rot + agent.spin) * 0.96;
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!startTime) startTime = now;
      const t = now - startTime;

      if (promptTextRef.current && t < ENTER) {
        const length = Math.ceil(clamp(t / TYPE_TIME) * PROMPT.length);
        promptTextRef.current.textContent = PROMPT.slice(0, length);
      }
      if (t >= CHARGE) promptRef.current?.classList.add(styles.charge);
      if (t < ENTER) return;
      if (!hasEntered) enter(now);
      if (t < INTRO_END) shake(t);
      if (!isObserving && t >= BUILD_AT) {
        isObserving = true;
        layers.forEach(({ el }) => observer.observe(el));
        if (island) observer.observe(island);
      }

      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScroll;
      lastScroll = scrollY;

      const isBusy =
        t < INTRO_END ||
        queue.length ||
        pixelQueue.length ||
        agents.some(({ state }) => state !== "idle");
      if (scrollDelta || isBusy) lastActive = now;
      if (now - lastActive > REST_AFTER) return;

      const maxScroll = html.scrollHeight - window.innerHeight;
      reach = Math.max(reach, clamp(scrollY / Math.max(maxScroll, 1)));
      const wanted = Math.round(lerp(count.start, count.max, reach));
      while (!finaleAt && agents.length < wanted) spawn();

      // 섬이 화면 밖으로 나가면 남은 칸은 바로 채우고 커서를 내용 쪽에 쓴다
      if (pixelQueue.length && island && islandCtx) {
        const { bottom, width } = island.getBoundingClientRect();
        if (bottom < 0) {
          pixelQueue.splice(0).forEach((job) => {
            complete(job);
            job.pixels.forEach((pixel) =>
              drawPixel(islandCtx, pixel, { x: 0, y: 0, w: width })
            );
          });
        }
      }

      for (const agent of agents) {
        if (!queue.length && !pixelQueue.length) break;
        if (agent.state !== "idle") continue;
        assign(agent, (queue.shift() ?? pixelQueue.shift()) as Job, now);
      }

      // 일손이 모자라도 내용이 오래 숨어 있지 않게 바로 보여 준다
      while (queue.length && now - queue[0].queuedAt > FORCE_AFTER) {
        complete(queue.shift() as BoxJob);
      }

      agents.forEach((agent) => {
        if (agent.state === "form") updateForm(agent, now);
        else if (agent.state === "idle") updateIdle(agent, now, scrollDelta);
        else updateWorker(agent, now, scrollY);
        updateDepth(agent);
      });

      if (!finaleAt && built >= total) startFinale(now);
      if (finaleAt && now - finaleAt > FORM_TIME + HOLD_TIME + EXIT_TIME * 1.4) {
        finish();
        return;
      }

      render(now, scrollY);
      updateHud();
    };

    const onPointerMove = () => {
      lastActive = performance.now();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [isOn]);

  if (!isOn || isDone) return null;

  return (
    <div ref={swarmRef} className={styles.swarm} aria-hidden="true">
      <div ref={sheetRef} className={styles.sheet} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={promptRef} className={styles.prompt}>
        <span className={styles.mark}>&gt;</span>
        <span ref={promptTextRef} />
        <i className={styles.caret} />
      </div>
      <div ref={hudRef} className={styles.hud}>
        <div className={styles.bar}>
          <span className={styles.avatars}>
            {AGENT_COLORS.slice(0, 5).map((color) => (
              <i key={color} style={{ backgroundColor: color }} />
            ))}
          </span>
          <strong ref={agentsRef} />
          <span ref={layersRef} className={styles.layers} />
          <span className={styles.track}>
            <i ref={barRef} />
          </span>
          <em ref={statusRef} />
          <button
            type="button"
            onClick={() => closeRef.current()}
            aria-label="빌드 효과 끄기"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
