import styles from "./Section.module.scss";

import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}
export default function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${className}`}>
      {children}
    </section>
  );
}
