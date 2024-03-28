import Section from "../section/Section";
import Accordion from "../accordion/Accordion";
import { FaqType } from "@/utils/types";

interface SectionProps {
  id?: string;
  className?: string;
  data: FaqType[];
}

export const Faq = ({ id, className, data }: SectionProps) => {
  return (
    <Section id={id} className={className}>
      <div className="max-wrap">
        <h2 className="section-title">FAQ</h2>
        <Accordion data={data} />
      </div>
    </Section>
  );
};
