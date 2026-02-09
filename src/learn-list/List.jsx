import React, { useState } from "react";
import Header from "../components/header/Header";
import styles from "./list.module.css";
import V4Engine from "../assets/V4.svg";
import RobotArm from "../assets/RobotArm.svg";
import Drone from "../assets/Drone.svg";
import Suspension from "../assets/Suspension.svg";

export default function LearnList() {
  const [showService, setShowService] = useState(true); // 학습 리스트 페이지이므로 true
  const [selectedObject, setSelectedObject] = useState("V4_Engine");

  const items = [
    {
      name: "V4_Engine",
      image: V4Engine,
      description:
        "V자 배열된 4개의 실린더가 연소 에너지를 회전 운동으로 변환하는 내연기관 구조를 학습합니다. 크랭크축, 피스톤, 커넥팅 로드의 연동 관계와 동력 전달 원리를 입체적으로 이해할 수 있습니다.",
    },
    {
      name: "Robot Arm",
      image: RobotArm,
      description:
        "관절과 링크 구조로 구성된 로봇 팔의 회전·이동 메커니즘을 학습합니다. 각 관절의 자유도와 구동 방식이 전체 동작에 어떻게 영향을 주는지 확인할 수 있습니다.",
    },
    {
      name: "Suspension",
      image: Suspension,
      description:
        "노면 충격을 흡수하고 차체 안정성을 유지하는 서스펜션 구조를 분석합니다. 스프링과 댐퍼의 역할, 하중 분산 원리를 시각적으로 이해할 수 있습니다.",
    },
    {
      name: "Drone",
      image: Drone,
      description:
        "프로펠러와 모터, 프레임으로 구성된 드론의 비행 원리를 학습합니다. 추력 생성과 균형 제어를 통해 공중에서 안정적으로 움직이는 구조를 살펴봅니다.",
    },
  ];

  return (
    <main className={styles.mainContainer}>
      <Header
        showService={showService}
        setShowService={setShowService}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
      />
      <div className={styles.listContainer}>
        <div className={styles.listItem}>
          {items.map((item) => (
            <article key={item.name} className={styles.card}>
              <div className={styles.listItemImage}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={styles.listItemText}>
                <div className={styles.listItemMemoBox}>
                  <h3 className={styles.listItemTitle}>{item.name}</h3>
                  <button className={styles.listItemButton}>학습하기</button>
                </div>
                <p className={styles.listItemDescriptionText}>핵심 설명</p>
                <p className={styles.listItemDescription}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
