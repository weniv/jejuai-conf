import Image from "next/image";
import styles from "./Footer.module.scss";
import data from "@/data/data.json";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>{data.footer}</p>
      <div className={styles.logos}>
        <Image
          src="/images/RIS.svg"
          alt=""
          width={166}
          height={46}
          className={styles.ris}
        />
        <Image
          src="/images/ccei.svg"
          alt=""
          width={193}
          height={32}
          className={styles.ccei}
        />
        <Image
          src="/images/GDG.svg"
          alt=""
          width={229}
          height={31}
          className={styles.gdg}
        />
        <Image
          src="/images/weniv.svg"
          alt=""
          width={144}
          height={30}
          className={styles.weniv}
        />
        <Image
          src="/images/reflow.svg"
          alt=""
          width={126}
          height={40}
          className={styles.weniv}
        />
      </div>
    </footer>
  );
};

export default Footer;
