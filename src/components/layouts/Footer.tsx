import Image from "next/image";
import styles from "./Footer.module.scss";
import data from "@/data/data.json";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        <span>주관: {data.footer["주관"]}</span>{" "}
        <span>후원/협찬: {data.footer["후원/협찬"]}</span>
      </p>
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
          className={styles.reflow}
        />
        <Image
          src="/images/halla.svg"
          alt=""
          width={90}
          height={40}
          className={styles.halla}
        />
      </div>
    </footer>
  );
};

export default Footer;
