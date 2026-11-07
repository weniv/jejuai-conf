import Section from "../section/Section";
import { ChatList } from "../chat/ChatList";

import styles from "./Info.module.scss";
import { chatType } from "@/utils/types";
interface SectionProps {
  id?: string;
  data?: chatType[];
}
export const Info = ({ id, data }: SectionProps) => {
  return (
    <Section id={id} className={`max-wrap ${styles.info}`}>
      <h2 className="a11y-hidden">행사 소개</h2>
      <div>
        <ChatList data={data} />
      </div>
    </Section>
  );
};
