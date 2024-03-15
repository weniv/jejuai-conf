"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";

import Typewriter from "typewriter-effect";
import styles from "./ChatItem.module.scss";
import Button from "../button/Button";

type Props = {
  content: any;
  speaker: string;
  delay?: number;
  className?: string;
  variant?: string;
  index?: number;
};
const ChatItem = ({
  content,
  speaker,
  className,
  variant,
  delay = 1000,
  index,
}: Props) => {
  return (
    <div className={`${styles.chat} ${styles[speaker]} ${className}`}>
      <div className={styles.icon}>
        <Image
          src={
            speaker === "you"
              ? "/images/icon-you.svg"
              : variant === "intro"
              ? "/images/icon-ai2.svg"
              : "/images/icon-ai.svg"
          }
          alt=""
          width={40}
          height={40}
        />
      </div>

      <div className={styles.content}>
        <strong className={variant === "intro" ? styles.color : ""}>
          {speaker === "you" ? "You" : "Conf AI"}
        </strong>

        {typeof content === "string" ? (
          <>
            {variant === "intro" && index === 0 ? (
              <>
                {" "}
                <Typewriter
                  options={{
                    delay: 30,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(delay)
                      .typeString(
                        `AI, 모두를 위한 미래, 지식을 넘어 혁신으로 <strong class="strong">"2024 제주 AI Conference"</strong>입니다.`
                      )
                      .start()
                      .callFunction(function (state) {
                        state.elements.cursor.style.display = "none";
                      });
                  }}
                />
              </>
            ) : (
              <>
                <Typewriter
                  options={{
                    delay: 30,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(delay)
                      .typeString(content)
                      .start()
                      .callFunction(function (state) {
                        state.elements.cursor.style.display = "none";
                      });
                  }}
                />
              </>
            )}
          </>
        ) : (
          <>
            {content.length <= 2 ? (
              <Typewriter
                options={{
                  delay: 30,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(delay)
                    .typeString(
                      `${content[0].string}<br/><a href="${content[1].link}" target="_blank" class="link-btn solid">${content[1].text}</a>`
                    )
                    .start()
                    .callFunction(function (state) {
                      state.elements.cursor.style.display = "none";
                    });
                }}
              />
            ) : (
              <>
                <Typewriter
                  options={{
                    delay: 30,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(delay)

                      .typeString(
                        `${content[0].string}<br/>
                        <span class="list">${content[1].ul[0]}</span><br/>
                        <span class="list">${content[1].ul[1]}</span><br/>
                        ${content[2].string}<br/>
                        <a href="${content[3].link}" target="_blank" class="link-btn">${content[3].text}</a>`
                      )
                      .start()
                      .callFunction(function (state) {
                        state.elements.cursor.style.display = "none";
                      });
                  }}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
