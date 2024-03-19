import styles from "./Program.module.scss";
import Section from "../section/Section";

interface SectionProps {
  id?: string;
}

export const Program = ({ id }: SectionProps) => {
  return (
    <Section id={id} className={styles.program}>
      SectionProgram
    </Section>
  );
};
