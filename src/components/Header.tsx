"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.scss";
import { Registration, RegisterButton } from "./RegisterButton";

const MENU = [
  { href: "#about", label: "행사 소개" },
  { href: "#program", label: "프로그램 안내" },
  { href: "#location", label: "찾아오시는 길" },
  { href: "#faq", label: "FAQ" },
];

interface HeaderProps {
  registration: Registration;
}

export const Header = ({ registration }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 좁은 화면의 펼친 메뉴는 Esc나 넓어진 화면에서 닫는다
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    const wide = window.matchMedia("(min-width: 1080px)");
    const onWide = () => wide.matches && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <a href="#top" className={styles.brand} data-build="행사명" onClick={close}>
        <em>2026 JEJU</em> AI CONFERENCE
      </a>

      <button
        type="button"
        className={clsx(styles.toggle, isOpen && styles.toggleOpen)}
        aria-expanded={isOpen}
        aria-controls="site-menu"
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <i />
        <i />
      </button>

      <div id="site-menu" className={clsx(styles.menu, isOpen && styles.open)}>
        <nav aria-label="주요 메뉴">
          <ul>
            {MENU.map(({ href, label }) => (
              <li key={href}>
                <a href={href} onClick={close}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <RegisterButton registration={registration} className={styles.cta} />
      </div>
    </header>
  );
};
