type Props = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

import styles from "./Section.module.scss";

const Section = ({ id, children, className }: Props) => {
  return (
    <section id={id} className={`${styles.section} ${className}`}>
      {children}
    </section>
  );
};

export default Section;
