import Image from "next/image";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        주관: 제주지역혁신플랫폼(RIS) 지능형서비스사업단,
        (재)제주창조경제혁신센터, GDG Jeju, (주)위니브 | 협찬: 제주 한라수
      </p>
      <div className={styles.logos}>
        <Image src="/images/RIS.svg" alt="" width={166} height={46} />
        <Image src="/images/ccei.svg" alt="" width={193} height={32} />
        <Image src="/images/GDG.svg" alt="" width={229} height={31} />
        <Image src="/images/weniv.svg" alt="" width={144} height={30} />
      </div>
    </footer>
  );
};

export default Footer;
