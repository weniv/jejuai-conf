"use client";

//
import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import styles from "./ChatList.module.scss";
import useIntersectionObservation from "@/utils/useIntersectionObservation";

type Props = {
  chatlist: any[];
  variant?: string;
  times: number[];
};
const ChatList = ({ chatlist, variant, times }: Props) => {
  const [showItems, setShowItems] = useState<boolean[]>([]);

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    chatlist.forEach((item: any, i: number) => {
      const delay = times[i];

      const timeoutId = setTimeout(() => {
        setShowItems((prev) => [...prev.slice(0, i), true]);
      }, delay);

      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [, chatlist]);

  return (
    <ul className={styles.chatlist}>
      {chatlist.map((item: any, i: number) => (
        <li
          key={i}
          className={`${styles.fadeIn} ${showItems[i] ? styles.show : ""}`}
        >
          {item.you && (
            <ChatItem
              speaker="you"
              content={item.you}
              delay={times[i] + 1000}
            />
          )}
          {item.ai && (
            <ChatItem
              speaker="ai"
              content={item.ai}
              variant={variant}
              index={i}
              delay={times[i] + 1000}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
