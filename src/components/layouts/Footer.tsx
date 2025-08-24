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
          src="/images/jejusan.svg"
          alt="제주산학융합원"
          width={172}
          height={44}
          className={styles.jejusan}
        />
        <Image
          src="/images/ccei.svg"
          alt="CCEI"
          width={194}
          height={40}
          className={styles.ccei}
        />
        <Image
          src="/images/jsa.png"
          alt="제주스타트업협회"
          width={150}
          height={40}
          className={styles.jsa}
        />
        <Image
          src="/images/kova.png"
          alt="벤처기업협회 제주지회"
          width={150}
          height={40}
          className={styles.kova}
        />
        <Image
          src="/images/weniv.svg"
          alt="위니브"
          width={145}
          height={40}
          className={styles.weniv}
        />
        <Image
          src="/images/modu.svg"
          alt="모두연"
          width={81}
          height={32}
          className={styles.modu}
        />
        <Image
          src="/images/ms.png"
          alt="Microsoft"
          width={192}
          height={41}
          className={styles.ms}
        />
        <Image
          src="/images/GDG.svg"
          alt="GDG Jeju"
          width={230}
          height={40}
          className={styles.gdg}
        />
      </div>
    </footer>
  );
};

export default Footer;
