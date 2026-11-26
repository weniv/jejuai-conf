"use client";
import { useEffect, useState } from "react";

const DAY = 1000 * 60 * 60 * 24;

export const Dday = ({ date }: { date: string }) => {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(Math.ceil((Date.parse(date) - Date.now()) / DAY));
  }, [date]);

  return days !== null && days > 0 ? <em>D-{days}</em> : null;
};
