import Image from "next/image";
import styles from "./Chat.module.scss";
import Typewriter from "typewriter-effect";
import { Fragment } from "react";

interface ChatItemProps {
  data?: any;
  type?: string;
  last?: boolean;
}

export const ChatItemTyping = ({ data, type = "ai", last }: ChatItemProps) => {
  const chatName = type === "ai" ? "Conf AI" : "You";
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

  const Typing = (text: string) => {
    return (
      <Typewriter
        options={{
          delay: 30,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString(text)
            .start()
            .callFunction(function (state) {
              state.elements.cursor.style.display = "none";

              if (last) {
                state.elements.container
                  .closest("ul")
                  ?.nextElementSibling?.classList.add(styles.fadeOut);
              }
            });
        }}
      />
    );
  };

  let content;

  switch (typeof data) {
    case "object":
      content = Typing(
        `${data[0].string}<br/>
        <span class="list">${data[1]?.ul[0]}</span><br/>
        <span class="list">${data[1]?.ul[1]}</span><br/>
        ${data[2].string}<br/>
        <a href=${data[3]?.link.url} class="link-btn" target="_blank">${data[3]?.link.text}</a>`
      );
      break;
    default:
      content = Typing(data);
  }
  return (
    <div className={`${styles.chat} ${type === "ai" ? styles.ai : styles.you}`}>
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
