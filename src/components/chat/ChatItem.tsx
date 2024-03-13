"use client";

import { Fragment } from "react";
import styles from "./ChatItem.module.scss";
import Link from "next/link";
import Button from "../button/Button";

type Props = {
  content: any;
  speaker: string;
  delay?: number;
  className?: string;
  variant?: string;
};
const ChatItem = ({ content, speaker, className, variant }: Props) => {
  return (
    <div className={`${styles.chat} ${styles[speaker]} ${className}`}>
      <div className={styles.icon}></div>

      <div className={styles.content}>
        <strong className={variant === "intro" ? styles.color : ""}>
          {speaker === "you" ? "You" : "Conf AI"}
        </strong>
        {typeof content === "string" ? (
          content
        ) : (
          <>
            {content.map((item: any, i: number) => (
              <Fragment key={i}>
                {item.string ? (
                  <p>{item.string}</p>
                ) : item.ul ? (
                  <ul>
                    {item.ul.map((text: string, i: number) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                ) : (
                  <Button
                    as="a"
                    href={item.link}
                    className={variant !== "intro" ? styles.solidBtn : ""}
                  >
                    {item.text}
                  </Button>
                )}
              </Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
