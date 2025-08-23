import { ProgramType } from "@/utils/types";
import styles from "./Timetable.module.scss";
import TimetableItem from "./TimetableItem";

export default function Timetable({
  data,
  day,
}: {
  data?: ProgramType[];
  day: string;
}) {
  return (
    <div className={`${styles.fadeIn}`}>
      <h3 className={styles.tit}>
        {day} <span>2025.10.{day === "Day1" ? "10(금)" : "11(토)"}</span>
      </h3>
      <ul
        className={`${styles.section_cont} ${styles.column2}`}
      >
        {data?.map((value: ProgramType, index: number) => (
          <TimetableItem key={index} item={value} index={index} day={day} />
        ))}
      </ul>
    </div>
  );
}
