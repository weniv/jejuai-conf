import styles from "./Timetable.module.scss";
import TimetableItem from "./TimetableItem";

export default function Timetable({ data, day }: { data: any; day: string }) {
  return (
    <div className={styles.fadeIn}>
      <h2 className={styles.tit}>
        {day} <span>2024.04.{day === "Day1" ? "12(금)" : "13(토)"}</span>
      </h2>
      <ul className={styles.section_cont}>
        {data.map((value: any, index: number) => (
          <TimetableItem key={index} item={value} index={index} />
        ))}
      </ul>
    </div>
  );
}
