"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Stage.module.scss";
import { NOTICE_CLOSED_ATTR, NOTICE_CLOSED_EVENT } from "./constants";
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
    const hero = document.getElementById("top");

    // 첫 화면(히어로)만 커서가 짓고, 아래 섹션은 처음부터 다 보여 준다
    document.querySelectorAll<HTMLElement>("[data-build]").forEach((el) => {
      if (!hero?.contains(el)) el.dataset.built = "static";
    });
    document.querySelectorAll<HTMLElement>("[data-prompt-line]").forEach((line) => {
      line.textContent = line.closest<HTMLElement>("[data-prompt]")?.dataset.prompt ?? "";
      if (line.parentElement) line.parentElement.dataset.done = "";
    });
    html.setAttribute("data-build-on", "");
    html.setAttribute("data-build-ready", "");
    capsule.classList.add(styles.dock);

    const stage = createStage({
      terrain,
      agents,
      capsuleText,
      held: !html.hasAttribute(NOTICE_CLOSED_ATTR),
      // 에이전트를 끄면 마지막 움직임이 끝난 뒤에 해제한다
      onBuilt: () => {
        capsuleText.textContent = opening;
        window.setTimeout(() => html.removeAttribute("data-build-on"), 800);
      },
    });

    // 공지 팝업을 닫으면 그때 첫 화면을 짓는다
    window.addEventListener(NOTICE_CLOSED_EVENT, stage.release);

    stopRef.current = stage.stop;
    return () => {
      window.removeEventListener(NOTICE_CLOSED_EVENT, stage.release);
      stage.destroy();
    };
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
