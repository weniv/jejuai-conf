import styles from "./Glitch.module.scss";

export const Glitch = () => {
  return (
    <div className={styles.glitch}>
      <div className={`${styles.distortion} ${styles.base}`}></div>
      <div className={`${styles.distortion} ${styles.red}`}></div>
      <div className={`${styles.distortion} ${styles.cyan}`}></div>
      <div className={`${styles.distortion} ${styles.transparent}`}></div>
    </div>
  );
};
