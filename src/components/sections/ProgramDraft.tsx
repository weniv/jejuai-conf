import Section from "../section/Section";
import programStyles from "./Program.module.scss";
import styles from "./ProgramDraft.module.scss";
import { programDraftType } from "@/utils/types";

interface SectionProps {
  id?: string;
  data: programDraftType[];
}

const SESSIONS = [1, 2, 3, 4];

export const ProgramDraft = ({ id, data }: SectionProps) => {
  return (
    <Section id={id} className={programStyles.program}>
      <div className="max-wrap2">
        <h2 className="section-title">프로그램 안내</h2>
        <p className={styles.notice}>
          세션과 연사를 준비하고 있습니다. 확정되는 대로 이곳에 공개합니다.
        </p>

        <div className={styles.days}>
          {data.map(({ day, date, note }, i) => (
            <div key={day} className={styles.day}>
              <h3>
                {day} <span>{date}</span>
              </h3>
              <p>{note}</p>
              <ul aria-hidden="true">
                {SESSIONS.map((session) => (
                  <li key={session}>
                    SESSION {i * SESSIONS.length + session}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
