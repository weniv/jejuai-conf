import { ProgramType } from "@/utils/types";
import styles from "./Timetable.module.scss";

export default function TimetableItem({
  item,
  index,
}: {
  item: ProgramType;
  index: number;
}) {
  const row = item.times > 1 ? `${index - 2}/${index - 2 + item.times}` : null;

  let grid_Column;
  if (item.times === 0) {
    grid_Column = `1 / span 6`;
  } else {
    if (item.space === "트랙룸") {
      if (index === 9) {
        grid_Column = `1 / span 2`;
      } else {
        grid_Column = `1 / span 3`;
      }
    } else if (item.space === "라운지") {
      if (index === 10) {
        grid_Column = `3 / span 2`;
      } else {
        grid_Column = `4 / span 3`;
      }
    } else {
      grid_Column = `5 / span 2`;
    }
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

      <p className={styles.speaker}>
        <strong>{item.speaker}</strong>
        {item.affiliated && <span>{item.affiliated}</span>}
      </p>
    </li>
  );
}
