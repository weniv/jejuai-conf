import { Fragment, useEffect, useState } from "react";
import styles from "./Chat.module.scss";
import { ChatItemTyping } from "./ChatItemTyping";
interface ChatListProps {
  data?: any;
  onClickSkip?: any;
  times: number[];
  intro?: boolean;
}
export const ChatListTyping = ({
  data,
  times,
  onClickSkip,
  intro,
}: ChatListProps) => {
  const [showItems, setShowItems] = useState<boolean[]>(
    new Array(data.length).fill(false)
  );
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    data.forEach((item: any, i: number) => {
      const delay = times[i];

      const timeoutId = setTimeout(() => {
        setShowItems((prev) => {
          const newShowItems = [...prev];
          newShowItems[i] = true;
          return newShowItems;
        });
      }, delay);

      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [data]);

  return (
    <div className={styles.wrap}>
      {data && (
        <ul className={styles.chatlist}>
          {data.map((chat: any, index: number) => (
            <Fragment key={index}>
              {showItems[index] && (
                <li className={styles.fadeIn}>
                  <>
                    {chat.ai ? (
                      <ChatItemTyping
                        data={chat.ai}
                        type={intro ? "ai2" : "ai"}
                        last={data.length === index + 1}
                      />
                    ) : (
                      <ChatItemTyping
                        data={chat.you}
                        type="you"
                        last={data.length === index + 1}
                      />
                    )}
                  </>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      )}

      <button type="button" className={styles.skipBtn} onClick={onClickSkip}>
        대화 건너뛰기
      </button>
    </div>
  );
};
