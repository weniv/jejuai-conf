import Section from "../section/Section";
import styles from "./Recruit.module.scss";
interface SectionProps {
  id?: string;
  data?: any;
}

export const Recruit = ({ id, data }: SectionProps) => {
  return (
    <Section id={id} className={styles.recruit}>
      <div className="max-wrap2">
        <h2 className="section-title">기업 채용</h2>
        <p className={styles.content}>
          채용을 희망하는 기업의 채용 공고 QR을 게시하고 있습니다.
          <br />
          채용을 희망하는 기업은 메일로 연락 부탁드립니다.
          <span>(문의 메일: paul-lab@naver.com)</span>
          <br />
        </p>

        <ul className={styles.recruit_ul}>
          {data.map((item: any, index: number) => (
            <li key={index}>
              <div className={styles.wrap}>
                <h3 className={styles.title}>{item.company}</h3>

                <p className={styles.description}>{item.description}</p>
                <p className={styles.tag}>
                  {item["모집직군"].map((text: string, index: number) => (
                    <span key="index">{text}</span>
                  ))}
                </p>
                <a href={item.link}>
                  <span className="a11y-hidden">{item.company} </span>채용공고
                  보기
                </a>
              </div>
              <img
                className={styles.qr}
                src={item.qr}
                alt={`${item.company} QR 코드`}
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};
