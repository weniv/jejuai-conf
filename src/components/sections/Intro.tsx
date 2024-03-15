"use client";

import ArrowSVG from "../accordion/ArrowSVG";
import ChatList from "../chat/ChatList";
import styles from "./Intro.module.scss";

type Props = { chatlist: any };

const Intro = ({ chatlist }: Props) => {
  const times = [1000, 1000 + 4000, 1000 + 4000 + 2000];

  return (
    <div className={`${styles.intro} max-wrap2`}>
      <div className="image-glitch">
        <div className="image-distortion" id="base"></div>
        <div className="image-distortion" id="red"></div>
        <div className="image-distortion" id="cyan"></div>
        <div className="image-distortion" id="transparent"></div>
      </div>

      {chatlist && (
        <ChatList chatlist={chatlist} variant="intro" times={times} />
      )}

      <span className={styles.arrow}>
        <ArrowSVG />
      </span>
    </div>
  );
};

export default Intro;
