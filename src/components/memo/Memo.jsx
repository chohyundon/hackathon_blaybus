import { useMemoStore } from "../../store/useMemoStore";
import styles from "./memo.module.css";

export default function Memo() {
  const memoStore = useMemoStore((state) => state.memos);
  console.log(memoStore);

  return (
    <div className={styles.scrollX}>
      <div className={styles.memoBox}>
        {memoStore.map((memo) => (
          <div className={styles.memoWrapper}>
            <p className={styles.memoSecondTitle}>{memo.object}</p>
            <p className={styles.memoContent}>{memo.text}</p>
            <p className={styles.day}>{memo.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
