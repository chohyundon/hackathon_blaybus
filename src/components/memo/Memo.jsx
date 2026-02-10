import { useState } from "react";
import { useMemoStore } from "../../store/useMemoStore";
import styles from "./memo.module.css";
import etc_Icon from "../../assets/etc.svg";

export default function Memo() {
  const [showModal, setShowModal] = useState(false);
  const memoStore = useMemoStore((state) => state.memos);
  const formatted = (date) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return String(date);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <div className={styles.scrollX}>
      <div className={styles.memoBox}>
        {memoStore.map((memo) => (
          <div className={styles.memoWrapper}>
            <div className={styles.memoSecondTitleContainer}>
              <p className={styles.memoSecondTitle}>{memo.object}</p>
              <img
                src={etc_Icon}
                alt="etc_Icon"
                onClick={handleShowModal}
                className={styles.etcIcon}
              />
            </div>
            <p className={styles.memoContent}>{memo.text}</p>
            <p className={styles.day}>{formatted(memo.date)}</p>
          </div>
        ))}
      </div>
      {showModal && (
        <div
          className={styles.modal}
          onClick={() => setShowModal(false)}
          role="presentation"
          aria-hidden="true">
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalItem}>수정</p>
            <p className={styles.modalItem}>삭제</p>
          </div>
        </div>
      )}
    </div>
  );
}
