import ChatItem from "../chat/ChatItem";
import ChatList from "../chat/ChatList";
import styles from "./Intro.module.scss";
import Image from "next/image";

type Props = { chatlist: any };

const Intro = ({ chatlist }: Props) => {
  return (
    <div className={`${styles.intro} max-wrap2`}>
      <Image src="images/logo.svg" alt="" width={1145} height={132} />

      {chatlist && <ChatList chatlist={chatlist} variant="intro" />}
    </div>
  );
};

export default Intro;
