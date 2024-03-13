import ChatList from "../chat/ChatList";
import styles from "./Info.module.scss";
import Image from "next/image";

type Props = { chatlist: any };

const Info = ({ chatlist }: Props) => {
  return (
    <div className={`${styles.info} max-wrap`}>
      {chatlist && <ChatList chatlist={chatlist} />}
    </div>
  );
};

export default Info;
