import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./Partners.module.scss";

interface Logo {
  name: string;
  src: string;
  width: number;
  height: number;
  // 높이를 같게 맞추면 생김새에 따라 커 보이거나 작아 보여서 로고마다 눈대중으로 보정한다
  scale?: number;
  url?: string;
}

interface PartnersProps {
  logos: Logo[];
}

// 푸터의 협력 기관 로고. 주최·주관·후원을 나누지 않고 한두 줄로 모아 두며,
// 정해지기 전에는 그만한 빈 자리를 남겨 둔다
export const Partners = ({ logos }: PartnersProps) =>
  logos.length ? (
    <ul className={styles.partners}>
      {logos.map(({ name, src, width, height, scale = 1, url }) => {
        const image = <Image src={src} alt={name} width={width} height={height} />;
        return (
          <li
            key={name}
            className={styles.logo}
            style={{ "--scale": scale } as CSSProperties}
          >
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {image}
              </a>
            ) : (
              image
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <div className={styles.placeholder} aria-hidden="true" />
  );
