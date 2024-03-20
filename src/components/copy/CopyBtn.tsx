"use client";

import { useState } from "react";
import SVGCopy from "./SVGCopy";
import SVGCheck from "./SVGCheck";

import styles from "./CopyBtn.module.scss";

export default function CopyBtn({ text }: { text: string }) {
  const TIME = 1500;
  const [isClick, setIsClick] = useState<boolean>(false);

  const handleClipBoard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setIsClick(true);

        setTimeout(() => {
          setIsClick(false);
        }, TIME);
      } catch (e) {
        alert("실패하였습니다. 다시 시도해주세요!");
      }
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.position = "fixed";

      // 흐름 4.
      document.body.appendChild(textarea);
      // focus() -> 사파리 브라우저 서포팅
      textarea.focus();
      // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
      textarea.select();
      // 흐름 5.
      document.execCommand("copy");
      // 흐름 6.
      document.body.removeChild(textarea);

      setIsClick(true);

      setTimeout(() => {
        setIsClick(false);
      }, TIME);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClipBoard}
      className={`${styles.copy_button} ${isClick ? styles.click : ""}`}
    >
      {isClick ? <SVGCheck /> : <SVGCopy />}
      <span className="a11y-hidden">{isClick ? "복사완료" : "복사하기"}</span>
    </button>
  );
}
