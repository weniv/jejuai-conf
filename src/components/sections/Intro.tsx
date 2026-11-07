"use client";
import styles from "./Intro.module.scss";
import Section from "../section/Section";
import { Glitch } from "../glitch/Glitch";
import ArrowSVG from "../accordion/ArrowSVG";
import { Island } from "../build/Island";
import { SEEN_KEY } from "../build/swarmData";
import { useEffect, useState } from "react";
import { heroType } from "@/utils/types";

interface SectionProps {
  id?: string;
  className?: string;
  data: heroType;
}

const DAY = 1000 * 60 * 60 * 24;

export const Intro = ({ id, data, className }: SectionProps) => {
  const [dday, setDday] = useState<number | null>(null);

  useEffect(() => {
    const days = Math.ceil((Date.parse(data.eventStart) - Date.now()) / DAY);
    setDday(days > 0 ? days : null);
  }, [data.eventStart]);

  const onClickReplay = () => {
    sessionStorage.removeItem(SEEN_KEY);
    window.location.replace(window.location.pathname);
  };

  return (
    <Section id={id} className={`${className} ${styles.intro}`}>
      <Island />

      <div className={`max-wrap2 ${styles.introWrap}`}>
        <div className={styles.logo} data-build="LOGO">
          <Glitch />
        </div>
        <p className={styles.status} data-build="STATUS">
          <i />
          {data.status}
          {dday !== null && <span>D-{dday}</span>}
        </p>
        <h2 className={styles.title} data-build="TITLE">
          {data.title}
        </h2>
        <dl className={styles.rows}>
          {data.rows.map((row) => (
            <div
              key={row.label}
              className={row.pending ? styles.pending : ""}
              data-build={row.pending ? "TBD" : "DATE"}
            >
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <button type="button" className={styles.replay} onClick={onClickReplay}>
          빌드 다시 보기
        </button>
      </div>
      <a href="#section2" className={styles.arrow} data-build="NEXT">
        <ArrowSVG />
        <span className="a11y-hidden">행사 소개</span>
      </a>
    </Section>
  );
};
