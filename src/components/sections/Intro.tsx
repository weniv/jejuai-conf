"use client";
import styles from "./Intro.module.scss";
import Section from "../section/Section";
import { Glitch } from "../glitch/Glitch";
import ArrowSVG from "../accordion/ArrowSVG";
import { ChatList } from "../chat/ChatList";
import { ChatListTyping } from "../chat/ChatListTyping";
import { useEffect, useState } from "react";
import { chatType } from "@/utils/types";

interface SectionProps {
  id?: string;
  className?: string;
  data?: chatType[];
}

export const Intro = ({ id, data, className }: SectionProps) => {
  const [isSkip, setIsSkip] = useState(false);

  const onClickSkip = () => {
    setIsSkip(true);
    sessionStorage.setItem("isSkip1", "y");
  };

  const times = [1000, 1000 + 4000, 1000 + 4000 + 2000];

  useEffect(() => {
    const session =
      typeof window !== "undefined" && sessionStorage.getItem("isSkip1")
        ? true
        : false;
    setIsSkip(session);
  }, []);

  return (
    <Section id={id} className={`${className} ${styles.intro}`}>
      <div className={`max-wrap2 ${styles.introWrap}`}>
        <Glitch />
        <div className={styles.grow}>
          {isSkip ? (
            <ChatList data={data} intro />
          ) : (
            <ChatListTyping
              data={data}
              onClickSkip={onClickSkip}
              times={times}
              intro
            />
          )}
        </div>
      </div>
      <a href="#section2" className={styles.arrow}>
        <ArrowSVG />
        <span className="a11y-hidden">행사 소개</span>
      </a>
    </Section>
  );
};
