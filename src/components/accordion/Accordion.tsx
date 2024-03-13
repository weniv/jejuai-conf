import styles from "./Accordion.module.scss";
import { Ref, forwardRef, useState } from "react";

import { clsx } from "clsx";

import { AccordionProps } from "./types";
import AccordionContext from "./AccordionContext";

const Accordion = (props: AccordionProps, ref: Ref<HTMLDivElement>) => {
  const { defaultActiveItems = [], children, className, ...rest } = props;
  const [activeItems, setActiveItems] = useState<string[]>(defaultActiveItems);

  const handleSetActiveItem = (item: string) => {
    if (activeItems.includes(item)) {
      setActiveItems(activeItems.filter((activeItem) => activeItem !== item));
    } else {
      setActiveItems([...activeItems, item]);
    }
  };

  return (
    <AccordionContext.Provider
      value={{
        activeItems,
        setActiveItem: handleSetActiveItem,
      }}
    >
      <div {...rest} ref={ref} className={clsx([styles.accordion, className])}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const _Accordion = forwardRef(Accordion);
export { _Accordion as Accordion };
