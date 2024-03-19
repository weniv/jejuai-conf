import styles from "./Chat.module.scss";
import { ChatItem } from "./ChatItem";
interface ChatListProps {
  data?: any;
}
export const ChatList = ({ data }: ChatListProps) => {
  return (
    <>
      {data && (
        <ul className={styles.chatlist}>
          {data.map((chat: any, index: number) => (
            <li key={index} className={styles.fadeIn}>
              <>
                {chat.ai ? (
                  <ChatItem data={chat.ai} type="ai" />
                ) : (
                  <ChatItem data={chat.you} type="you" />
                )}
              </>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
