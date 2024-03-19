"use client";
import styles from "./Intro.module.scss";
import Section from "../section/Section";
import { Glitch } from "../glitch/Glitch";
import ArrowSVG from "../accordion/ArrowSVG";
import { ChatList } from "../chat/ChatList";
import { ChatListTyping } from "../chat/ChatListTyping";
import { useEffect, useState } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  data?: any;
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
      <div>
        <Glitch />
        {isSkip ? (
          <ChatList data={data} />
        ) : (
          <ChatListTyping data={data} onClickSkip={onClickSkip} times={times} />
        )}
        <a href="#section2" className={styles.arrow}>
          <ArrowSVG />
        </a>
      </div>
    </Section>
  );
};
