import clsx from "clsx";
import styles from "./RegisterButton.module.scss";

export interface Registration {
  url: string;
  open: string;
  pending: string;
}

interface RegisterButtonProps {
  registration: Registration;
  size?: "small" | "large";
  className?: string;
}

// 신청 링크가 생기기 전에는 누를 수 없는 안내로만 보여 준다
export const RegisterButton = ({
  registration,
  size = "small",
  className,
}: RegisterButtonProps) =>
  registration.url ? (
    <a
      className={clsx(styles.button, styles[size], styles.open, className)}
      href={registration.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {registration.open}
    </a>
  ) : (
    <span className={clsx(styles.button, styles[size], styles.pending, className)}>
      {registration.pending}
    </span>
  );
