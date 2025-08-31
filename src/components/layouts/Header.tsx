"use client";
import Image from "next/image";
import Button from "../button/Button";
import styles from "./Header.module.scss";
import useIntersectionObservation from "@/utils/useIntersectionObservation";
type Props = {};

import data from "@/data/data.json";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
const MENU = data.menu;
const LINK = data.headerLink;

const Header = ({}: Props) => {
  const [activeId, setActiveId] = useState("section1");
  const pathname = usePathname();
  const isVSCodePage = pathname === "/vscode-devdays";
  
  useIntersectionObservation(setActiveId, ".section");

  return (
    <>
      <header className={styles.header}>
        <div className="max-wrap2">
          <h1 className={styles.pc}>
            <a href="/">
              <Image
                src="images/logo.svg"
                alt="JEJU AI CONFERENCE"
                width={280}
                height={32}
                priority={true}
              />
            </a>
          </h1>

          <div className={styles.links}>
            {isVSCodePage ? (
              <Link href="/" className={styles.active}>
                컨퍼런스 안내
              </Link>
            ) : (
              <>
                <Link
                  href="/"
                  className={`${styles.mobile} ${
                    activeId === "section1" ? styles.active : ""
                  }`}
                >
                  홈
                </Link>
                {MENU.map((v, i) => (
                  <Link
                    key={i}
                    href={`#section${i + 2}`}
                    className={activeId === `section${i + 2}` ? styles.active : ""}
                  >
                    <span className={styles.pc}>{v.pc}</span>

                    <span className={styles.mobile}>
                      {v.mobile ? v.mobile : v.pc}
                    </span>
                  </Link>
                ))}

                {LINK.link && (
                  <Button
                    as="a"
                    href={LINK.link}
                    className={styles.pc}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {LINK.text}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
