import styles from "./Button.module.scss";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: "a" | "button";
  href?: string;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
};
const Button = ({ children, as, href = "#", className, target, rel, onClick }: Props) => {
  const style = `${styles.btn} ${className}`;

  if (as === "a") {
    return (
      <Link href={href} className={style} target={target} rel={rel}>
        {children}
      </Link>
    );
  } else {
    return (
      <button type="button" className={style} onClick={onClick}>
        {children}
      </button>
    );
  }
};

export default Button;
