interface FAQ {
  question: string;
  answer: string;
}

type Props = {
  data: FAQ[];
};

import Link from "next/link";
import styles from "./Accordion.module.scss";
import ArrowSVG from "./ArrowSVG";
const Accordion = ({ data }: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const targetPannel = target.nextElementSibling as HTMLDivElement;
    const targetPanelHeight = targetPannel.querySelector("div")?.offsetHeight;

    if (target.classList.contains(`${styles.active}`)) {
      targetPannel.style.height = "0";
    } else {
      targetPannel.style.height = `${targetPanelHeight}px`;
    }
    target.classList.toggle(`${styles.active}`);
  };
  return (
    <ul className={styles.accordion}>
      {data.map((item, index: number) => (
        <li key={index}>
          <button type="button" onClick={handleClick} className={styles.button}>
            <span className={styles.title}>
              <strong>Q{index + 1}.</strong>
              {item.question}
            </span>
            <span className={styles.icon}>
              <ArrowSVG />
            </span>
          </button>
          <div className={styles.panel}>
            <div>
              {typeof item.answer === "string" ? (
                <>{item.answer}</>
              ) : (
                <>
                  {item.answer.string.map((text: string, index: number) => (
                    <p key={index}>{text}</p>
                  ))}
                  {item.answer.link && (
                    <div className={styles.links}>
                      {item.answer.link.map((link, index: number) => (
                        <Link
                          href={link.url}
                          target="_blank"
                          className={styles.link}
                          key={index}
                        >
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Accordion;
