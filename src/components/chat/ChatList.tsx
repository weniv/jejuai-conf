import ChatItem from "./ChatItem";
import styles from "./ChatList.module.scss";

type Props = {
  chatlist: any;
  variant?: string;
};

const ChatList = ({ chatlist, variant }: Props) => {
  return (
    <ul className={styles.chatlist}>
      {chatlist.map((item: any, i: number) => (
        <li key={i}>
          {item.you && <ChatItem speaker="you" content={item.you} />}
          {item.ai && (
            <ChatItem speaker="ai" content={item.ai} variant={variant} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
