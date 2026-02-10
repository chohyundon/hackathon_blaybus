import { useMemoStore } from "../../store/useMemoStore";
import styles from "./memo.module.css";
import etc_Icon from "../../assets/etc_Icon.svg";

export default function Memo() {
  const memoStore = useMemoStore((state) => state.memos);
  const formatted = (date) => {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <div className={styles.scrollX}>
      <div className={styles.memoBox}>
        {memoStore.map((memo) => (
          <div className={styles.memoWrapper}>
            <div className={styles.memoSecondTitleContainer}>
              <p className={styles.memoSecondTitle}>{memo.object}</p>
              <img src={etc_Icon} alt="etc_Icon" />
            </div>
            <p className={styles.memoContent}>{memo.text}</p>
            <p className={styles.day}>{formatted(memo.date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
