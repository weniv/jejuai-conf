"use client";
import { MouseEvent, useRef } from "react";
import styles from "./Faq.module.scss";

const OPTIONS = { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };

interface FaqEntry {
  question: string;
  answer: string;
}

interface FaqItemProps extends FaqEntry {
  order: number;
}

const FaqItem = ({ question, answer, order }: FaqItemProps) => {
  const itemRef = useRef<HTMLDetailsElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  // details를 유지해 스크립트 없이도 열리고, 있을 때만 움직임을 더한다
  const onClick = (e: MouseEvent) => {
    const item = itemRef.current;
    const body = bodyRef.current;
    if (!item || !body) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();

    const isOpening = item.dataset.open === undefined;
    const from = item.open ? body.offsetHeight : 0;
    animationRef.current?.cancel();

    if (isOpening) {
      item.dataset.open = "";
      item.open = true;
    } else {
      delete item.dataset.open;
    }

    const animation = body.animate(
      {
        height: [`${from}px`, isOpening ? `${body.scrollHeight}px` : "0px"],
        opacity: [isOpening ? 0 : 1, isOpening ? 1 : 0],
      },
      OPTIONS
    );
    animationRef.current = animation;
    animation.onfinish = () => {
      if (!isOpening) item.open = false;
      animationRef.current = null;
    };
  };

  return (
    <details ref={itemRef} className={styles.item} data-build={`질문 ${order}`}>
      <summary onClick={onClick}>
        {question}
        <i aria-hidden="true" />
      </summary>
      <div ref={bodyRef} className={styles.body}>
        <p>{answer}</p>
      </div>
    </details>
  );
};

interface FaqProps {
  items: FaqEntry[];
}

export const Faq = ({ items }: FaqProps) => {
  return (
    <div>
      {items.map((item, i) => (
        <FaqItem key={item.question} order={i + 1} {...item} />
      ))}
    </div>
  );
};
