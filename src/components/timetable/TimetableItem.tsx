import { ProgramType } from "@/utils/types";
import styles from "./Timetable.module.scss";
import Button from "../button/Button";

export default function TimetableItem({
  item,
  index,
  day,
}: {
  item: ProgramType;
  index: number;
  day: string;
}) {
  const row = item.times > 1 ? `${index - 2}/${index - 2 + item.times}` : null;

  let grid_Column;
  
  // 모든 뷰에서 2열 레이아웃 사용
  if (item.times === 0) {
    grid_Column = `1 / span 2`;
  } else {
    // 자동으로 배치되도록 설정하지 않음
    grid_Column = undefined;
  }

  return (
    <li
      style={{ gridColumn: grid_Column, gridRow: `auto / span ${item.times}` }}
      className={item.times === 0 ? styles.col2 : ""}
    >
      <div className={styles.spaceTime}>
        <p
          className={`${styles.space} ${
            item.space === "라운지" && styles.space2
          } ${item.space === "로비" && styles.space3} ${
            item.space === "펀치룸" && styles.space4
          }`}
        >
          {item.space}
        </p>
        <p className={styles.time}>{item.time}</p>
      </div>
      <h4 className={styles.title}>
        {item.title}
        {item.subtitle && <span>{item.subtitle}</span>}
      </h4>

      {day === "Day2" && item.title?.includes("바이브 코딩") && 
        item.speaker === "유저스틴, 이보라" && (
        <div style={{ marginBottom: "0.5rem" }}>
          <Button as="a" href="/vscode-devdays" className={styles.detailButton}>
            상세보기
          </Button>
        </div>
      )}
      <p className={styles.speaker}>
        <strong>{item.speaker}</strong>
        {item.affiliated && <span>{item.affiliated}</span>}
      </p>
    </li>
  );
}
