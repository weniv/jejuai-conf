"use client";
import Section from "../section/Section";
import { ChatList } from "../chat/ChatList";

import styles from "./Info.module.scss";
import { ChatListTyping } from "../chat/ChatListTyping";
import { useEffect, useState } from "react";
import useIntersectionObservation from "@/utils/useIntersectionObservation";
interface SectionProps {
  id?: string;
  data?: any;
}
export const Info = ({ id, data }: SectionProps) => {
  const [isSkip, setIsSkip] = useState(false);
  const [activeId, setActiveId] = useState("section1");
  useIntersectionObservation(setActiveId, ".section");

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (activeId === "section2") {
      setIsShow(true);
    }
  }, [activeId]);

  const onClickSkip = () => {
    setIsSkip(true);
    sessionStorage.setItem("isSkip2", "y");
  };

  useEffect(() => {
    const session =
      typeof window !== "undefined" && sessionStorage.getItem("isSkip2")
        ? true
        : false;
    setIsSkip(session);
  }, []);

  const times = [
    1000,
    1000 + 2500,
    1000 + 2500 + 7000,
    1000 + 2500 + 7000 + 2000,
    1000 + 2500 + 7000 + 2000 + 6000,
    1000 + 2500 + 7000 + 2000 + 6000 + 1500,
    1000 + 2500 + 7000 + 2000 + 6000 + 1500 + 7500,
    1000 + 2500 + 7000 + 2000 + 6000 + 1500 + 7500 + 1600,
  ];

  return (
    <Section id={id} className={`max-wrap ${styles.info}`}>
      <div>
        {isSkip ? (
          <ChatList data={data} />
        ) : (
          <>
            {isShow && (
              <ChatListTyping
                data={data}
                onClickSkip={onClickSkip}
                times={times}
              />
            )}
          </>
        )}
      </div>
    </Section>
  );
};
