"use client";
import { useState } from "react";
import ChatList from "../chat/ChatList";
import styles from "./Info.module.scss";
import useIntersectionObservation from "@/utils/useIntersectionObservation";

type Props = { chatlist: any };

const Info = ({ chatlist }: Props) => {
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
    <div className={`max-wrap ${styles.info}`}>
      {chatlist && <ChatList chatlist={chatlist} times={times} />}
    </div>
  );
};

export default Info;
