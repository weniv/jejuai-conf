"use client";
import { useEffect, useState } from "react";
import { SEEN_KEY } from "./constants";

const DAY = 1000 * 60 * 60 * 24;

export const Dday = ({ date }: { date: string }) => {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(Math.ceil((Date.parse(date) - Date.now()) / DAY));
  }, [date]);

  return days !== null && days > 0 ? <em>D-{days}</em> : null;
};

export const Replay = ({ className }: { className?: string }) => {
  const onClick = () => {
    sessionStorage.removeItem(SEEN_KEY);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.location.replace(window.location.pathname);
  };

  return (
    <button type="button" className={className} onClick={onClick}>
      <i aria-hidden="true">↻</i>
      <span>오프닝 다시 보기</span>
    </button>
  );
};
