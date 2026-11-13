import Image from "next/image";
import styles from "./Partners.module.scss";

interface Logo {
  name: string;
  src: string;
  url?: string;
}

interface Group {
  label: string;
  logos: Logo[];
}

interface PartnersProps {
  groups: Group[];
  slots: number;
}

// 푸터의 주최·주관·후원 로고. 정해지기 전에는 같은 크기의 빈 자리를 남겨 둔다
export const Partners = ({ groups, slots }: PartnersProps) => (
  <div className={styles.partners}>
    {groups.map(({ label, logos }) => (
      <div key={label} className={styles.group}>
        <p className={styles.label}>{label}</p>
        <ul>
          {logos.length
            ? logos.map(({ name, src, url }) => (
                <li key={name} className={styles.logo}>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <Image src={src} alt={name} fill sizes="14rem" />
                    </a>
                  ) : (
                    <span>
                      <Image src={src} alt={name} fill sizes="14rem" />
                    </span>
                  )}
                </li>
              ))
            : Array.from({ length: slots }, (_, i) => (
                <li key={i} className={styles.slot} aria-hidden="true" />
              ))}
        </ul>
      </div>
    ))}
  </div>
);
