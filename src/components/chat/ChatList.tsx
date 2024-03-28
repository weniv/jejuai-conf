import { chatType } from "@/utils/types";
import styles from "./Chat.module.scss";
import { ChatItem } from "./ChatItem";
interface ChatListProps {
  data?: chatType[];
  intro?: boolean;
}
export const ChatList = ({ data, intro }: ChatListProps) => {
  return (
    <>
      {data && (
        <ul className={styles.chatlist}>
          {data.map((chat: chatType, index: number) => (
            <li key={index} className={styles.fadeIn}>
              <>
                {chat.ai ? (
                  <ChatItem data={chat.ai} type={intro ? "ai2" : "ai"} />
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
