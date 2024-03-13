import styles from "./Button.module.scss";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: "a";
  href?: string;
  className?: string;
};
const Button = ({ children, as, href = "#", className }: Props) => {
  const style = `${styles.btn} ${className}`;

  if (as === "a") {
    return (
      <Link href={href} className={style}>
        {children}
      </Link>
    );
  } else {
    return (
      <button type="button" className={style}>
        {children}
      </button>
    );
  }
};

export default Button;
