"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Stage.module.scss";
import { SEEN_KEY } from "./constants";
import { createStage, drawStill } from "./engine";

interface StageProps {
  opening: string;
}

export const Stage = ({ opening }: StageProps) => {
  const terrainRef = useRef<HTMLCanvasElement>(null);
  const agentsRef = useRef<HTMLCanvasElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const stopRef = useRef<() => void>(() => {});
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const terrain = terrainRef.current;
    const agents = agentsRef.current;
    const capsule = capsuleRef.current;
    const capsuleText = textRef.current;
    if (!terrain || !agents || !capsule || !capsuleText) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawStill(terrain);
      setIsClosed(true);
      return;
    }

    const html = document.documentElement;
    let isSeen = false;
    try {
      isSeen = !!sessionStorage.getItem(SEEN_KEY);
    } catch {}
    const isBuilding = !isSeen && html.hasAttribute("data-build-on");

    // 재방문은 지금 보이는 화면을 그대로 두고, 스크롤하는 곳부터 짓는다
    if (!isBuilding) {
      document.querySelectorAll<HTMLElement>("[data-build]").forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (bottom > 0 && top < window.innerHeight) el.dataset.built = "static";
      });
      html.setAttribute("data-build-on", "");
    }
    html.setAttribute("data-build-ready", "");
    capsule.classList.add(isBuilding ? styles.center : styles.dock);

    // 프롬프트 글자 위치를 재서 그 자리에서 커서가 태어나게 한다
    const getGlyphs = () => {
      const node = textRef.current?.firstChild;
      if (!node) return [];
      const range = document.createRange();
      return opening.split("").flatMap((glyph, i) => {
        if (glyph === " ") return [];
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const { left, top, width, height } = range.getBoundingClientRect();
        return [{ glyph, x: left + width / 2, y: top + height / 2 }];
      });
    };

    const stage = createStage({
      terrain,
      agents,
      opening,
      isBuilding,
      capsuleText,
      getGlyphs,
      onCharge: () => capsule.classList.add(styles.charge),
      onBlast: () => {
        capsule.classList.remove(styles.center, styles.charge);
        capsule.classList.add(styles.dock);
        try {
          sessionStorage.setItem(SEEN_KEY, "y");
        } catch {}
      },
      // 에이전트를 끄면 마지막 움직임이 끝난 뒤에 해제한다
      onBuilt: () => {
        window.setTimeout(() => html.removeAttribute("data-build-on"), 800);
      },
    });

    stopRef.current = stage.stop;
    return stage.destroy;
  }, [opening]);

  // 본문을 읽는 구간에서는 프롬프트가 글자를 가리지 않게 비켜난다
  useEffect(() => {
    const onScroll = () => {
      capsuleRef.current?.classList.toggle(
        styles.reading,
        window.scrollY > window.innerHeight * 0.5
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClickClose = () => {
    capsuleRef.current?.classList.add(styles.closing);
    agentsRef.current?.classList.add(styles.closing);
    window.setTimeout(() => {
      stopRef.current();
      setIsClosed(true);
    }, 300);
  };

  return (
    <div aria-hidden="true">
      <canvas ref={terrainRef} className={styles.terrain} />
      <canvas ref={agentsRef} className={styles.agents} />
      {!isClosed && (
        <div ref={capsuleRef} className={styles.capsule}>
          <span className={styles.mark}>&gt;</span>
          <span ref={textRef} className={styles.text} />
          <i className={styles.caret} />
          <button type="button" onClick={onClickClose} aria-label="에이전트 끄기">
            ×
          </button>
        </div>
      )}
    </div>
  );
};
