import styles from "./Accordion.module.scss";

import { Ref, forwardRef, useCallback } from "react";

import { clsx } from "clsx";

import { AccordionButtonProps } from "./types";
import { useAccordionContext } from "./AccordionContext";

const AccordionButton = (
  props: AccordionButtonProps,
  ref: Ref<HTMLButtonElement>
) => {
  const {
    variant,
    className,
    itemName = "",
    onClick,
    children,
    num,
    ...rest
  } = props;
  const { activeItems, setActiveItem } = useAccordionContext();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setActiveItem(itemName);
      onClick?.(event);
    },
    [itemName, setActiveItem]
  );

  return (
    <button
      type="button"
      ref={ref}
      onClick={handleClick}
      className={clsx([styles.button, className])}
      {...rest}
    >
      <span className="title">
        {variant === "faq" && (
          <strong className={styles.strong}>Q{num}.</strong>
        )}
        {children}
      </span>

      {/* <Icon
        name="down"
        color="grayLv3"
        className={clsx([
          "icon",
          arrowStyle,
          activeItems.includes(itemName) && "open",
        ])}
      /> */}
    </button>
  );
};
const _AccordionButton = forwardRef(AccordionButton);
export { _AccordionButton as AccordionButton };
