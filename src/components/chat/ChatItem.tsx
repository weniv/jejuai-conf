import Image from "next/image";
import styles from "./Chat.module.scss";
import { Fragment } from "react";
import Button from "../button/Button";

interface ChatItemProps {
  data?: any;
  type?: string;
}

export const ChatItem = ({ data, type = "ai" }: ChatItemProps) => {
  const chatName = type === "you" ? "You" : "Conf AI";
  let imgSrc;
  switch (type) {
    case "ai":
      imgSrc = "/images/icon-ai.svg";
      break;
    case "ai2":
      imgSrc = "/images/icon-ai2.svg";
      break;
    default:
      imgSrc = "/images/icon-you.svg";
  }

  let content;

  switch (typeof data) {
    case "object":
      content = data.map((item: any, index: number) => (
        <Fragment key={index}>
          {item.string && <p>{item.string}</p>}
          {item.ul && (
            <ul>
              {item.ul.map((li: string, index: number) => (
                <li key={index} className="list">
                  {li}
                </li>
              ))}
            </ul>
          )}
          {item.link && (
            <Button
              as="a"
              href={item.link.url}
              target="_blank"
              className="link-btn"
            >
              {item.link.text}
            </Button>
          )}
        </Fragment>
      ));
      break;
    default:
      const strongArr = data
        .match(/([^<]*)<strong>([^<]*)<\/strong>([^<]*)/)
        ?.slice(1);

      content = (
        <p>
          {strongArr
            ? strongArr.map((text: string, index: number) => (
                <Fragment key={index}>
                  {index % 2 === 1 ? <strong>{text} </strong> : <>{text}</>}
                </Fragment>
              ))
            : data}
        </p>
      );
  }

  return (
    <div
      className={`${styles.chat} ${type === "you" ? styles.you : styles.ai}`}
    >
      <div className={styles.icon}>
        <Image src={imgSrc} alt="" width={40} height={40} />
      </div>

      <div className={styles.content}>
        <strong className={styles.color}>{chatName}</strong>
        {content}
      </div>
    </div>
  );
};
