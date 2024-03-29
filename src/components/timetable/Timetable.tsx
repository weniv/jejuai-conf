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
        {day} <span>2024.04.{day === "Day1" ? "12(금)" : "13(토)"}</span>
      </h3>
      <ul
        className={`${styles.section_cont}  ${
          day === "Day2" ? styles.column2 : styles.column3
        }`}
      >
        {data?.map((value: ProgramType, index: number) => (
          <TimetableItem key={index} item={value} index={index} />
        ))}
      </ul>
    </div>
  );
}
