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

// 날짜를 고르지 않아도 둘째 날까지 보이도록 모든 날을 세로로 이어 보여 준다.
// 날마다 따로 쓰게 해서 스크롤해 그날이 화면에 들어올 때 적힌다
export const Program = ({ days, comingSoon, empty, notice }: ProgramProps) => (
  <div className={styles.program}>
    {days.map(({ label, time: dayTime, sessions }, dayIndex) => (
      <section
        key={label}
        className={styles.day}
        aria-labelledby={`program-day-${dayIndex}`}
        data-build={`${label} 프로그램`}
      >
        <h3 id={`program-day-${dayIndex}`} className={styles.dayTitle}>
          <span className={styles.dayNumber}>Day {dayIndex + 1}</span>
          {label}
        </h3>
        {sessions.length ? (
          <ol className={styles.sessions}>
            {sessions.map(({ time, tracks }) => (
              <li key={time}>
                <span className={styles.time}>{time}</span>
                <div className={styles.tracks}>
                  {/* 아직 정해지지 않은 칸은 빈 값 대신 Coming soon으로 채운다 */}
                  {tracks.map(({ room, title, speaker, note }, i) => (
                    <div key={i} className={styles.track}>
                      {room && <span className={styles.room}>{room}</span>}
                      {title ? (
                        <strong>{title}</strong>
                      ) : (
                        <strong className={styles.soon}>{comingSoon}</strong>
                      )}
                      {speaker && <span className={styles.speaker}>{speaker}</span>}
                      {note && <small className={styles.note}>{note}</small>}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.empty}>
            <strong>{dayTime}</strong>
            <p>{empty}</p>
          </div>
        )}
      </section>
    ))}

    {notice && (
      <p className={styles.notice} data-build="안내">
        {notice}
      </p>
    )}
  </div>
);
