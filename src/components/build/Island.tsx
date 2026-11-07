"use client";
import { useEffect, useRef } from "react";
import styles from "./Island.module.scss";
import { drawPixel, ISLAND_PIXELS } from "./islandPixels";

export const Island = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let drawnWidth = 0;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === drawnWidth) return;

      const isFirst = drawnWidth === 0;
      const isBuilding =
        document.documentElement.hasAttribute("data-build-on");
      drawnWidth = width;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 빌드 중이면 커서들이 직접 칠하므로 처음에는 비워 둔다
      if (isFirst && isBuilding) return;
      ISLAND_PIXELS.forEach((pixel) =>
        drawPixel(ctx, pixel, { x: 0, y: 0, w: width })
      );
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.island} data-build-island="" />
  );
};
