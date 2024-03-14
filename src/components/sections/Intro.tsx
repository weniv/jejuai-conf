"use client";
import { useState } from "react";
import ChatList from "../chat/ChatList";
import styles from "./Intro.module.scss";

type Props = { chatlist: any };

import useIntersectionObservation from "@/utils/useIntersectionObservation";

const Intro = ({ chatlist }: Props) => {
  const [activeId, setActiveId] = useState("section1");
  useIntersectionObservation(setActiveId, ".section");

  return (
    <div className={`${styles.intro} max-wrap2`}>
      <div className="image-glitch">
        <div className="image-distortion" id="base"></div>
        <div className="image-distortion" id="red"></div>
        <div className="image-distortion" id="cyan"></div>
        <div className="image-distortion" id="transparent"></div>
      </div>

      {chatlist && <ChatList chatlist={chatlist} variant="intro" />}
    </div>
  );
};

export default Intro;
