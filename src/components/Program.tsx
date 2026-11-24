import type { CSSProperties } from "react";
import styles from "./Program.module.scss";

interface Track {
  room: string;
  title: string;
  speaker: string;
  note?: string;
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

const isSameTrack = (a?: Track, b?: Track) =>
  !!a &&
  !!b &&
  (a.title || a.speaker) !== "" &&
  a.room === b.room &&
  a.title === b.title &&
  a.speaker === b.speaker;

// 같은 룸에서 바로 앞 시간과 같은 세션이 이어지면 한 칸으로 합친다.
// 이어지는 시간 칸은 비우고(null), 첫 칸에는 몇 시간 동안 이어지는지(span)를 적어 둔다
const mergeSessions = (sessions: Session[]) =>
  sessions.map(({ tracks }, i) =>
    tracks.map((track, j) => {
      if (isSameTrack(sessions[i - 1]?.tracks[j], track)) return null;
      let span = 1;
      while (isSameTrack(sessions[i + span]?.tracks[j], track)) span++;
      return { ...track, span };
    }),
  );

const startOf = (time: string) => time.split("~")[0].trim();
const endOf = (time: string) => time.split("~")[1]?.trim() ?? "";

// 날짜를 고르지 않아도 둘째 날까지 보이도록 모든 날을 세로로 이어 보여 준다.
// 시간과 트랙 칸을 하나씩 따로 쓰게 해서, 화면에 들어온 칸만큼 여러 커서가 함께 나와 채운다
export const Program = ({ days, comingSoon, empty, notice }: ProgramProps) => (
  <div className={styles.program}>
    {days.map(({ label, time: dayTime, sessions }, dayIndex) => {
      const merged = mergeSessions(sessions);
      const columns = Math.max(1, ...sessions.map(({ tracks }) => tracks.length));

      return (
        <section
          key={label}
          className={styles.day}
          aria-labelledby={`program-day-${dayIndex}`}
        >
          <h3
            id={`program-day-${dayIndex}`}
            className={styles.dayTitle}
            data-build={`Day ${dayIndex + 1}`}
          >
            <span className={styles.dayNumber}>Day {dayIndex + 1}</span>
            {label}
          </h3>
          {sessions.length ? (
            // 넓은 화면에서는 하루 전체를 한 그리드로 깔고, 합친 칸이 여러 시간 줄에 걸치게 한다
            <ol
              className={styles.sessions}
              style={{ "--columns": columns } as CSSProperties}
            >
              {sessions.map(({ time }, i) => (
                <li key={time}>
                  <span
                    className={styles.time}
                    data-last={i === sessions.length - 1 || undefined}
                    data-build="시간"
                    style={{ "--row": i + 1 } as CSSProperties}
                  >
                    {time}
                  </span>
                  <div className={styles.tracks}>
                    {/* 아직 정해지지 않은 칸은 빈 값 대신 Coming soon으로 채운다 */}
                    {merged[i].map((track, j) => {
                      if (!track) return null;
                      const { room, title, speaker, note, span } = track;
                      const isWide = merged[i].length === 1;
                      return (
                        <div
                          key={j}
                          className={styles.track}
                          data-last={i + span === sessions.length || undefined}
                          data-build={room || "세션"}
                          style={
                            {
                              "--row": `${i + 1} / span ${span}`,
                              "--col": isWide ? "2 / -1" : j + 2,
                            } as CSSProperties
                          }
                        >
                          {room && <span className={styles.room}>{room}</span>}
                          {title ? (
                            <strong>{title}</strong>
                          ) : (
                            <strong className={styles.soon}>{comingSoon}</strong>
                          )}
                          {speaker && <span className={styles.speaker}>{speaker}</span>}
                          {span > 1 && (
                            <small className={styles.span}>
                              {startOf(time)} ~ {endOf(sessions[i + span - 1].time)} 연속 진행
                            </small>
                          )}
                          {note && <small className={styles.note}>{note}</small>}
                        </div>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className={styles.empty} data-build={label}>
              <strong>{dayTime}</strong>
              <p>{empty}</p>
            </div>
          )}
        </section>
      );
    })}

    {notice && (
      <p className={styles.notice} data-build="안내">
        {notice}
      </p>
    )}
  </div>
);
