// 제주도 해안선(경도, 위도)을 픽셀 격자로 옮긴 데이터
const COAST: [number, number][] = [
  [126.16, 33.3],
  [126.24, 33.39],
  [126.27, 33.42],
  [126.32, 33.46],
  [126.42, 33.49],
  [126.52, 33.52],
  [126.6, 33.53],
  [126.67, 33.545],
  [126.76, 33.56],
  [126.81, 33.56],
  [126.87, 33.52],
  [126.93, 33.48],
  [126.945, 33.455],
  [126.9, 33.42],
  [126.84, 33.32],
  [126.72, 33.27],
  [126.56, 33.235],
  [126.41, 33.235],
  [126.29, 33.2],
  [126.24, 33.22],
];
const HALLASAN: [number, number] = [126.53, 33.36];
const UDO: [number, number] = [126.955, 33.505];

const LON = [126.14, 126.98];
const LAT = [33.18, 33.58];
const LON_SCALE = Math.cos((33.4 * Math.PI) / 180);

export const GRID_W = 64;
export const GRID_H = Math.round(
  (GRID_W * (LAT[1] - LAT[0])) / ((LON[1] - LON[0]) * LON_SCALE)
);

export interface IslandPixel {
  col: number;
  row: number;
  level: number;
}

export interface IslandRect {
  x: number;
  y: number;
  w: number;
}

const isInside = (lon: number, lat: number) => {
  let inside = false;
  for (let i = 0, j = COAST.length - 1; i < COAST.length; j = i++) {
    const [xi, yi] = COAST[i];
    const [xj, yj] = COAST[j];
    if (yi > lat !== yj > lat) {
      if (lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
};

const distance = (lon: number, lat: number, [x, y]: [number, number]) =>
  Math.hypot((lon - x) * LON_SCALE, lat - y);

const createPixels = () => {
  const pixels: IslandPixel[] = [];
  for (let col = 0; col < GRID_W; col++) {
    for (let row = 0; row < GRID_H; row++) {
      const lon = LON[0] + ((col + 0.5) / GRID_W) * (LON[1] - LON[0]);
      const lat = LAT[1] - ((row + 0.5) / GRID_H) * (LAT[1] - LAT[0]);
      if (!isInside(lon, lat) && distance(lon, lat, UDO) > 0.012) continue;

      // 한라산에 가까울수록 밝게 칠해 등고선처럼 보이게 한다
      const summit = distance(lon, lat, HALLASAN);
      const level = summit < 0.03 ? 3 : summit < 0.07 ? 2 : summit < 0.12 ? 1 : 0;
      pixels.push({ col, row, level });
    }
  }
  return pixels;
};

export const ISLAND_PIXELS = createPixels();

const LEVEL_COLORS = [
  "rgba(109, 242, 204, 0.16)",
  "rgba(109, 242, 204, 0.26)",
  "rgba(109, 242, 204, 0.42)",
  "rgba(109, 242, 204, 0.68)",
];

export const pixelCenter = (pixel: IslandPixel, rect: IslandRect) => {
  const cell = rect.w / GRID_W;
  return {
    x: rect.x + (pixel.col + 0.5) * cell,
    y: rect.y + (pixel.row + 0.5) * cell,
  };
};

export const drawPixel = (
  ctx: CanvasRenderingContext2D,
  pixel: IslandPixel,
  rect: IslandRect,
  color = LEVEL_COLORS[pixel.level]
) => {
  const cell = rect.w / GRID_W;
  ctx.fillStyle = color;
  ctx.fillRect(
    rect.x + pixel.col * cell,
    rect.y + pixel.row * cell,
    cell * 0.82,
    cell * 0.82
  );
};
