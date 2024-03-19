import Section from "../section/Section";
import Accordion from "../accordion/Accordion";

interface SectionProps {
  id?: string;
  className?: string;
  data: any;
}

export const FAQ = ({ id, className, data }: SectionProps) => {
  return (
    <Section id={id} className={className}>
      <div className="max-wrap">
        <h3 className="section-title">FAQ</h3>
        <Accordion data={data} />
      </div>
    </Section>
  );
};
