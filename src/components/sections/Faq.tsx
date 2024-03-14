"use client";

import Accordion from "@/components/accordion/Accordion";

const Faq = ({ faqlist }: { faqlist: any }) => {
  return (
    <div className="max-wrap">
      <h3 className="section-title">FAQ</h3>
      <Accordion data={faqlist} />
    </div>
  );
};

export default Faq;
