"use client";
import styles from "./Program.module.scss";
import Section from "../section/Section";
import { TabButton } from "../tabButton/TabButton";
import { useEffect, useState } from "react";
import Timetable from "../timetable/Timetable";

interface SectionProps {
  id?: string;
  data?: any;
}

export const Program = ({ id, data }: SectionProps) => {
  const BREAK_POINT = 1024;
  const [tabList, setTabList] = useState<string[]>(["All", "Day1", "Day2"]);
  const [day, setDay] = useState<string>("All");
  const [winWidth, setWinWidth] = useState<number | null>(null);

  const onClickTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.textContent;
    value && setDay(value);
  };

  useEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;

      if (windowWidth < BREAK_POINT) {
        if (day !== "Day2") {
          setDay("Day1");
        }
        setTabList(["Day1", "Day2"]);
      } else {
        setTabList(["All", "Day1", "Day2"]);
      }
      setWinWidth(windowWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [day]);

  return (
    <Section id={id} className={styles.program}>
      <div className="max-wrap2">
        <h3 className="section-title">프로그램 안내</h3>

        <TabButton onClickTab={onClickTab} day={day} tabList={tabList} />

        <div role="tabpanel">
          {winWidth && winWidth > BREAK_POINT - 1 && day === "All" ? (
            <div className={styles.all}>
              <Timetable data={data.day1} day="Day1" />
              <Timetable data={data.day2} day="Day2" />
            </div>
          ) : (
            <>
              {day === "Day2" ? (
                <Timetable data={data.day2} day="Day2" />
              ) : (
                <Timetable data={data.day1} day="Day1" />
              )}
            </>
          )}
          <p className={styles.notice}>
            프로그램은 상황에 따라 일부 변경될 수 있습니다.
          </p>
        </div>
      </div>
    </Section>
  );
};
