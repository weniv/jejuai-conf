"use client";
import { useEffect, useRef } from "react";
import styles from "./PointerHighlight.module.scss";

export const PointerHighlight = () => {
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointer = pointerRef.current;
    if (!pointer) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      pointer.style.opacity = "1";
      pointer.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const target = e.target as Element | null;
      pointer.classList.toggle(
        styles.over,
        !!target?.closest?.("a, button, summary")
      );
    };
    const onDown = () => pointer.classList.add(styles.down);
    const onUp = () => pointer.classList.remove(styles.down);
    const onLeave = () => {
      pointer.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={pointerRef} className={styles.pointer} aria-hidden="true" />;
};
