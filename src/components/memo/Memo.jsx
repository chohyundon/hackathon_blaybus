import { useState, useRef, useEffect } from "react";
import { useMemoStore } from "../../store/useMemoStore";
import { useAuthStore } from "../../store/useAuthStore";
import { apiUrl } from "../../api/config";
import styles from "./memo.module.css";
import etc_Icon from "../../assets/etc.svg";

export default function Memo() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const modalContentRef = useRef(null);
  const memoStore = useMemoStore((state) => state.memos);
  const setMemos = useMemoStore((state) => state.setMemos);
  const user = useAuthStore((state) => state.user);
  const userId = user?.userId;

  // 모달 바깥 클릭 시 닫기 (모달이 카드 안에 있어서 document 리스너로 처리)
  useEffect(() => {
    if (!showModal) return;
    const handleClickOutside = (e) => {
      if (modalContentRef.current?.contains(e.target)) return;
      setShowModal(false);
      setSelectedMemo(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const formatted = (date) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return String(date);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  const handleShowModal = (memo) => {
    setSelectedMemo(memo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMemo(null);
  };

  const handleDeleteMemo = async () => {
    if (!selectedMemo?.id) return;
    try {
      const res = await fetch(
        apiUrl(`/memonote/${selectedMemo.id}?userId=${userId}`),
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) return;
      setMemos(memoStore.filter((m) => m.id !== selectedMemo.id));
      handleCloseModal();
    } catch (e) {
      console.warn("delete memo failed", e);
    }
  };

  const isSelected = (memo) =>
    selectedMemo &&
    (memo.id != null ? memo.id === selectedMemo.id : memo === selectedMemo);

  return (
    <div className={styles.scrollX}>
      <div className={styles.memoBox}>
        {memoStore.map((memo, index) => (
          <div key={memo.id ?? index} className={styles.memoWrapper}>
            <div className={styles.memoSecondTitleContainer}>
              <p className={styles.memoSecondTitle}>{memo.object}</p>
              <img
                src={etc_Icon}
                alt="etc_Icon"
                onClick={() => handleShowModal(memo)}
                className={styles.etcIcon}
              />
            </div>
            <p className={styles.memoContent}>{memo.text}</p>
            <p className={styles.day}>{formatted(memo.date)}</p>
            {showModal && isSelected(memo) && (
              <div
                className={styles.modal}
                role="presentation"
                aria-hidden="true">
                <div ref={modalContentRef} className={styles.modalContent}>
                  <p className={styles.modalItem}>수정</p>
                  <p className={styles.modalItem} onClick={handleDeleteMemo}>
                    삭제
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
