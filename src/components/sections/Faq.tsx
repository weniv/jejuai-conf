"use client";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "../accordion";

const Faq = ({ faqlist }: { faqlist: any }) => {
  return (
    <div className="max-wrap">
      <h3 className="section-title">FAQ</h3>
      <Accordion>
        {faqlist.map(
          (item: { question: string; answer: string }, index: number) => (
            <AccordionItem key={index} itemName={item.question}>
              <AccordionButton variant="faq" num={index + 1}>
                {item.question}
              </AccordionButton>
              <AccordionPanel> {item.answer}</AccordionPanel>
            </AccordionItem>
          )
        )}
      </Accordion>
    </div>
  );
};

export default Faq;
