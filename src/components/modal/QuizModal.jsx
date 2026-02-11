import React, { useMemo, useState } from "react";
import styles from "./quizModal.module.css";
import { quiz } from "../mock/quiz";

const CATEGORY_LABELS = {
  suspension: "서스펜션",
  v4_engine: "V4 엔진",
  robot_arm: "로봇 팔",
  drone: "드론",
};

/** 오브젝트 이름(V4_Engine, Robot Arm 등) → quiz 키(suspension, v4_engine 등) */
const OBJECT_TO_QUIZ_KEY = {
  V4_Engine: "v4_engine",
  "Robot Arm": "robot_arm",
  Suspension: "suspension",
  Drone: "drone",
};

function pickOneRandom(arr) {
  if (!arr?.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function QuizModal({ showQuiz, setShowQuiz, singleCategory }) {
  const [userAnswers, setUserAnswers] = useState({});

  const questionsByCategory = useMemo(() => {
    if (!showQuiz || !quiz[0]) return [];
    const data = quiz[0];
    const quizKey = singleCategory ? OBJECT_TO_QUIZ_KEY[singleCategory] : null;

    if (quizKey && data[quizKey]) {
      const one = pickOneRandom(data[quizKey]);
      if (!one?.question) return [];
      return [
        {
          categoryKey: quizKey,
          categoryLabel: CATEGORY_LABELS[quizKey] ?? singleCategory,
          ...one,
        },
      ];
    }

    return Object.entries(data)
      .filter(([, list]) => Array.isArray(list) && list.length > 0)
      .map(([key, list]) => ({
        categoryKey: key,
        categoryLabel: CATEGORY_LABELS[key] ?? key,
        ...pickOneRandom(list),
      }))
      .filter((q) => q.question);
  }, [showQuiz, singleCategory]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowQuiz(false);
  };

  const handleSelectOption = (categoryKey, optionIndex) => {
    setUserAnswers((prev) => ({ ...prev, [categoryKey]: optionIndex }));
  };

  const handleClose = () => {
    setUserAnswers({});
    setShowQuiz(false);
  };

  if (!showQuiz) return null;

  return (
    <div
      className={styles.quizModal}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title">
      <div
        className={styles.quizModalContent}
        onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.quizModalClose}
          onClick={handleClose}
          aria-label="닫기">
          ×
        </button>
        <div className={styles.quizModalHeader}>
          <div className={styles.quizModalIcon}>📝</div>
          <h1 id="quiz-modal-title" className={styles.quizModalTitle}>
            {singleCategory
              ? `${
                  CATEGORY_LABELS[OBJECT_TO_QUIZ_KEY[singleCategory]] ??
                  singleCategory
                } 퀴즈`
              : "카테고리별 퀴즈"}
          </h1>
          <p className={styles.quizModalSubtitle}>
            {singleCategory
              ? "무작위 1문항"
              : `무작위 1문제씩 · 총 ${questionsByCategory.length}문항`}
          </p>
        </div>
        <div className={styles.quizModalBody}>
          <div className={styles.quizModalList}>
            {questionsByCategory.map((item) => {
              const selected = userAnswers[item.categoryKey];
              const correctIndex = (item.answer ?? 1) - 1;
              const isAnswered = selected !== undefined;

              return (
                <div key={item.categoryKey} className={styles.quizModalCard}>
                  <span className={styles.quizModalCategory}>
                    {item.categoryLabel}
                  </span>
                  <p className={styles.quizModalQuestion}>{item.question}</p>
                  <div className={styles.quizModalOptions}>
                    {item.options?.map((opt, idx) => {
                      const isSelected = selected === idx;
                      const isCorrect = idx === correctIndex;
                      let optionClass = styles.quizModalOption;
                      if (isAnswered) {
                        if (isCorrect)
                          optionClass = styles.quizModalOptionCorrect;
                        else if (isSelected && !isCorrect)
                          optionClass = styles.quizModalOptionWrong;
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          className={optionClass}
                          disabled={isAnswered}
                          onClick={() =>
                            handleSelectOption(item.categoryKey, idx)
                          }>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && item.explanation && (
                    <p className={styles.quizModalExplanation}>
                      💡 {item.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className={styles.quizModalButtons}>
            <button
              type="button"
              className={styles.quizModalButtonSecondary}
              onClick={handleClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
