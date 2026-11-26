"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Stage.module.scss";
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
      const renderStill = () => drawStill(terrain);
      // 움직이는 화면처럼 본문 구간에서는 지형을 흐리게 둔다
      const dimStill = () => {
        const reading = window.scrollY > window.innerHeight * 0.5;
        const dim = window.innerWidth < 768 ? "0.24" : "0.7";
        terrain.style.opacity = reading ? dim : "";
      };
      renderStill();
      dimStill();
      setIsClosed(true);
      window.addEventListener("resize", renderStill);
      window.addEventListener("scroll", dimStill, { passive: true });
      return () => {
        window.removeEventListener("resize", renderStill);
        window.removeEventListener("scroll", dimStill);
      };
    }

    const html = document.documentElement;

    // 첫 화면은 그대로 보여 주고, 스크롤해서 들어오는 곳부터 짓는다
    capsuleText.textContent = opening;
    document.querySelectorAll<HTMLElement>("[data-build]").forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (bottom > 0 && top < window.innerHeight) el.dataset.built = "static";
    });
    html.setAttribute("data-build-on", "");
    capsule.classList.add(styles.dock);

    const stage = createStage({
      terrain,
      agents,
      capsuleText,
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
      const capsule = capsuleRef.current;
      if (!capsule) return;
      const reading = window.scrollY > window.innerHeight * 0.5;
      capsule.classList.toggle(styles.reading, reading);
      capsule.inert = reading;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
    <div>
      <canvas ref={terrainRef} className={styles.terrain} aria-hidden="true" />
      <canvas ref={agentsRef} className={styles.agents} aria-hidden="true" />
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
