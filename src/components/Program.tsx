"use client";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Program.module.scss";

interface Track {
  room: string;
  title: string;
  speaker: string;
}

interface Session {
  time: string;
  tracks: Track[];
}

interface Day {
  label: string;
  time: string;
  sessions: Session[];
}

interface ProgramProps {
  days: Day[];
  comingSoon: string;
  empty: string;
  notice: string;
}

// 날짜 탭을 고르면 그날의 시간대별 세션을 트랙끼리 나란히 보여 준다
export const Program = ({ days, comingSoon, empty, notice }: ProgramProps) => {
  const [active, setActive] = useState(0);
  const day = days[active];

  return (
    <div className={styles.program}>
      <div className={styles.tabs} role="tablist" aria-label="행사 날짜">
        {days.map(({ label }, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            id={`program-tab-${i}`}
            aria-selected={i === active}
            aria-controls="program-panel"
            className={clsx(styles.tab, i === active && styles.tabActive)}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>

      <div id="program-panel" role="tabpanel" aria-labelledby={`program-tab-${active}`}>
        {day.sessions.length ? (
          <ol className={styles.sessions}>
            {day.sessions.map(({ time, tracks }) => (
              <li key={time}>
                <span className={styles.time}>{time}</span>
                <div className={styles.tracks}>
                  {/* 아직 정해지지 않은 칸은 빈 값 대신 Coming soon으로 채운다 */}
                  {tracks.map(({ room, title, speaker }, i) => (
                    <div key={i} className={styles.track}>
                      {room && <span className={styles.room}>{room}</span>}
                      {title ? (
                        <strong>{title}</strong>
                      ) : (
                        <strong className={styles.soon}>{comingSoon}</strong>
                      )}
                      {speaker && <span className={styles.speaker}>{speaker}</span>}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.empty}>
            <strong>{day.time}</strong>
            <p>{empty}</p>
          </div>
        )}
      </div>

      {notice && <p className={styles.notice}>{notice}</p>}
    </div>
  );
};
