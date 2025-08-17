import Image from "next/image";
import styles from "./Footer.module.scss";
import data from "@/data/data.json";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        <span>주관: {data.footer["주관"]}</span>{" "}
      </p>
      <div className={styles.logos}>
        <Image
          src="/images/ccei.svg"
          alt=""
          width={193}
          height={32}
          className={styles.ccei}
        />
        <Image
          src="/images/weniv.svg"
          alt=""
          width={144}
          height={30}
          className={styles.weniv}
        />
      </div>
    </footer>
  );
};

export default Footer;
