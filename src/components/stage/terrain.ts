// 제주도 해안선(경도, 위도). 제주항에서 시계 방향으로 돈다.
const COAST: [number, number][] = [
  [126.53, 33.522],
  [126.585, 33.527],
  [126.625, 33.545],
  [126.668, 33.546],
  [126.7, 33.553],
  [126.725, 33.558],
  [126.76, 33.562],
  [126.795, 33.558],
  [126.815, 33.553],
  [126.86, 33.527],
  [126.89, 33.52],
  [126.905, 33.495],
  [126.9, 33.475],
  [126.925, 33.466],
  [126.94, 33.472],
  [126.945, 33.458],
  [126.932, 33.448],
  [126.922, 33.45],
  [126.93, 33.425],
  [126.918, 33.42],
  [126.905, 33.4],
  [126.875, 33.375],
  [126.84, 33.325],
  [126.77, 33.292],
  [126.72, 33.275],
  [126.665, 33.265],
  [126.625, 33.25],
  [126.56, 33.238],
  [126.515, 33.235],
  [126.48, 33.225],
  [126.43, 33.235],
  [126.41, 33.238],
  [126.37, 33.235],
  [126.33, 33.235],
  [126.31, 33.232],
  [126.297, 33.198],
  [126.275, 33.205],
  [126.25, 33.215],
  [126.23, 33.232],
  [126.195, 33.262],
  [126.163, 33.29],
  [126.162, 33.305],
  [126.18, 33.345],
  [126.205, 33.365],
  [126.24, 33.395],
  [126.265, 33.41],
  [126.305, 33.45],
  [126.315, 33.467],
  [126.36, 33.475],
  [126.4, 33.485],
  [126.43, 33.5],
  [126.49, 33.515],
];

// 부속 섬: 경도, 위도, 반지름(도)
const ISLETS: [number, number, number][] = [
  [126.952, 33.503, 0.017],
  [126.227, 33.407, 0.008],
  [126.273, 33.168, 0.011],
  [126.267, 33.118, 0.006],
];

const SUMMIT: [number, number] = [126.533, 33.361];
const SPAN = 0.36;
const LON_SCALE = Math.cos((33.4 * Math.PI) / 180);
const FOCAL = 4.2;

// 한라산이 세계의 원점이라 화면 중앙에 놓인다
const toWorld = ([lon, lat]: [number, number]) => ({
  x: ((lon - SUMMIT[0]) * LON_SCALE) / SPAN,
  z: -(lat - SUMMIT[1]) / SPAN,
});

const COAST_WORLD = COAST.map(toWorld);
const ISLET_WORLD = ISLETS.map(([lon, lat, size]) => ({
  ...toWorld([lon, lat]),
  size: (size * LON_SCALE) / SPAN,
}));

// 높이에 따라 회색에서 흰색으로 이어지는 점 색
const LOW = [58, 60, 54];
const HIGH = [244, 241, 232];
const STEPS = 32;

export const BUCKETS = Array.from({ length: STEPS }, (_, i) => {
  const p = i / (STEPS - 1);
  const [r, g, b] = LOW.map((low, c) => Math.round(low + (HIGH[c] - low) * p));
  return `rgb(${r}, ${g}, ${b})`;
});
const COAST_BUCKET = 21;

export interface Dot {
  x: number;
  y: number;
  z: number;
  // 분화구에서 떨어진 거리
  d: number;
  bucket: number;
  // 열 경계를 흩뿌리는 데 쓰는 점별 난수
  grain: number;
}

export interface Camera {
  yaw: number;
  pitch: number;
  cx: number;
  cy: number;
  radius: number;
}

export interface Point {
  x: number;
  y: number;
  scale: number;
}

const isMainland = (x: number, z: number) => {
  let inside = false;
  const count = COAST_WORLD.length;
  for (let i = 0, j = count - 1; i < count; j = i++) {
    const a = COAST_WORLD[i];
    const b = COAST_WORLD[j];
    if (a.z > z !== b.z > z) {
      if (x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) inside = !inside;
    }
  }
  return inside;
};

const isIslet = (x: number, z: number) =>
  ISLET_WORLD.some((islet) => Math.hypot(x - islet.x, z - islet.z) < islet.size);

const coastDistance = (x: number, z: number) => {
  let nearest = Infinity;
  const count = COAST_WORLD.length;
  for (let i = 0, j = count - 1; i < count; j = i++) {
    const a = COAST_WORLD[j];
    const b = COAST_WORLD[i];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const t = ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz);
    const p = Math.min(Math.max(t, 0), 1);
    nearest = Math.min(nearest, Math.hypot(x - a.x - p * dx, z - a.z - p * dz));
  }
  return nearest;
};

// 한라산: 넓은 자락이 허리에서 잘록해지며 오르는 오목한 곡선에
// 정상은 평탄하게 자르고 백록담을 판다
export const MOUNTAIN_BASE = 0.46;

const SUMMIT_FLAT = 0.03;

const heightAt = (d: number) => {
  const slope = 0.42 * Math.exp(-Math.pow(Math.max(d, SUMMIT_FLAT) / 0.2, 0.8));
  return slope - 0.024 * Math.exp(-Math.pow(d / 0.02, 2));
};

export const createDots = (step: number) => {
  const dots: Dot[] = [];
  const rowGap = step * 0.86;

  for (let z = -0.56; z <= 0.72; z += rowGap) {
    const row = Math.round((z + 0.56) / rowGap);
    for (let x = -1.02; x <= 1.08; x += step) {
      const px = x + (row % 2 ? step / 2 : 0);
      const isMain = isMainland(px, z);
      if (!isMain && !isIslet(px, z)) continue;

      const d = Math.hypot(px, z);
      const y = heightAt(d);
      const level = Math.min(
        Math.floor(Math.pow(y / 0.32, 0.9) * STEPS),
        STEPS - 1
      );
      // 해안선을 밝혀 멀리서도 제주의 윤곽이 읽히게 한다
      const isCoast = !isMain || coastDistance(px, z) < step * 1.15;
      dots.push({
        x: px,
        y,
        z,
        d,
        bucket: isCoast ? Math.max(level, COAST_BUCKET) : level,
        grain: Math.random(),
      });
    }
  }
  // 색이 같은 점끼리 모아 두면 그릴 때 색을 덜 바꿔도 된다
  return dots.sort((a, b) => a.bucket - b.bucket);
};

export const project = (
  x: number,
  y: number,
  z: number,
  camera: Camera,
  out: Point
) => {
  const cosYaw = Math.cos(camera.yaw);
  const sinYaw = Math.sin(camera.yaw);
  const cosPitch = Math.cos(camera.pitch);
  const sinPitch = Math.sin(camera.pitch);

  const x1 = x * cosYaw - z * sinYaw;
  const z1 = x * sinYaw + z * cosYaw;
  const y2 = y * cosPitch - z1 * sinPitch;
  const z2 = -z1 * cosPitch - y * sinPitch;
  const scale = FOCAL / (FOCAL + z2);

  out.x = camera.cx + x1 * scale * camera.radius;
  out.y = camera.cy - y2 * scale * camera.radius;
  out.scale = scale;
  return out;
};

export const CRATER = { x: 0, y: heightAt(SUMMIT_FLAT), z: 0 };
