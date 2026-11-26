"use client";
import { MouseEvent, useEffect, useRef } from "react";
import styles from "./Notice.module.scss";
import { NOTICE_CLOSED_ATTR, NOTICE_CLOSED_EVENT } from "./stage/constants";

// 팝업이 없어지면 첫 화면 짓기(커서 애니메이션)를 시작하게 알린다
const notifyClosed = () => {
  document.documentElement.setAttribute(NOTICE_CLOSED_ATTR, "");
  window.dispatchEvent(new Event(NOTICE_CLOSED_EVENT));
};

export interface NoticeContent {
  title: string[];
  body: string[];
  close: string;
  hide: string;
}

// 들어올 때마다 띄우고, '다시 보지 않기'를 누른 브라우저에서만 감춘다.
// 제목을 열쇠에 넣어 새 공지로 바꾸면 다시 보인다
export const Notice = ({ title, body, close, hide }: NoticeContent) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hiddenKey = `notice-hidden:${title.join(" ")}`;

  useEffect(() => {
    let isHidden = false;
    try {
      isHidden = !!localStorage.getItem(hiddenKey);
    } catch {}
    const dialog = dialogRef.current;
    if (isHidden || !dialog) {
      notifyClosed();
      return;
    }
    if (dialog.open) return;
    dialog.showModal();
    // 첫 단추에 초점 테두리가 생기지 않게 창 자체에 초점을 둔다 (Tab을 누르면 단추로 간다)
    dialog.focus();
  }, [hiddenKey]);

  const onClose = () => {
    notifyClosed();
    if (dialogRef.current?.returnValue !== "hide") return;
    try {
      localStorage.setItem(hiddenKey, "y");
    } catch {}
  };

  // 상자 바깥(어두운 배경)을 눌러도 닫는다
  const onClickBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  };

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className={styles.notice}
      aria-labelledby="notice-title"
      onClose={onClose}
      onClick={onClickBackdrop}
    >
      <div className={styles.box}>
        <h2 id="notice-title">
          {title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p>
          {body.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <form method="dialog" className={styles.actions}>
          <button type="submit" value="hide" className={styles.hide}>
            {hide}
          </button>
          <button type="submit" value="close" className={styles.close}>
            {close}
          </button>
        </form>
      </div>
    </dialog>
  );
};
