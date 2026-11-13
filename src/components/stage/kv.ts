// 키비주얼의 제주 등고선 그래픽(피그마 원본 벡터)을 화면에 그린다.
// 민트 "AI" 글자는 원본 SVG 안의 마스크에 이미 들어 있다.
export const KV_SRC = "/images/kv-terrain.svg";
const KV = { w: 2105.97, h: 1298.1 };

// 원본에서 한라산 분화구(민트 삼각형)가 놓인 자리
export const SUMMIT = { u: 935 / KV.w, v: 395 / KV.h };

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MOBILE_WIDTH = 768;

export const loadKv = () =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = KV_SRC;
  });

// 그래픽의 가로 폭을 정하면 세로는 원본 비율을 따른다
const rectAt = (cx: number, cy: number, w: number): Rect => {
  const h = (w * KV.h) / KV.w;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
};

// 히어로에서는 제목 오른쪽 아래에 섬 전체를 두고, 본문으로 내려가면 오른쪽으로 작게 비켜난다
export const placeKv = (width: number, height: number, scroll: number): Rect => {
  const lerp = (from: number, to: number) => from + (to - from) * scroll;
  if (width < MOBILE_WIDTH) {
    const w = width * 0.95 * lerp(1, 0.84);
    return rectAt(lerp(width * 0.5, width * 0.88), lerp(height * 0.25, height * 0.38), w);
  }
  const w = Math.min(width * 0.56, height * 1.07) * lerp(1, 0.78);
  return rectAt(lerp(width * 0.73, width * 0.78), lerp(height * 0.6, height * 0.5), w);
};

export const rasterize = (image: HTMLImageElement, width: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round((width * KV.h) / KV.w));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
};
