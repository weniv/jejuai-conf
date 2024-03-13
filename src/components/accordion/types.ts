import * as React from "react";

export type AccordionProps = {
  defaultActiveItems?: string[];
  children: React.ReactNode | React.ReactNode[];
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export type AccordionItemProps = {
  itemName: string;
  children: React.ReactNode[];
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export type AccordionButtonProps = {
  num?: number;
  variant?: "faq" | "curriculum";
  itemName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type AccordionPanelProps = {
  itemName?: string;
} & React.HTMLAttributes<HTMLDivElement>;
