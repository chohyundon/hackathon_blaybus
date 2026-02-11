import styles from "./home.module.css";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import MainImage1 from "../../assets/left.svg";
import MainImage2 from "../../assets/left1.svg";
import MainImage3 from "../../assets/left2.svg";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.svg";
// Swiper 스타일 import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  droneImages,
  robotArmImages,
  slides,
  suspensionImages,
  v4Images,
} from "../mock/slides";
import LoginModal from "../modal/LoginModal";
import { useAuthStore } from "../../store/useAuthStore";
import { apiUrl } from "../../api/config";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const [featuresSwiper, setFeaturesSwiper] = useState(null);
  const featuresSwiperPrevRef = useRef(null);
  const featuresSwiperNextRef = useRef(null);

  const mainFeatures = [
    {
      image: MainImage1,
      text: "3D 시각화",
      description: `각 부품에 대한 핵심 설명, 용도, 작동 원리
를 확인 할 수 있습니다.`,
    },
    {
      image: MainImage2,
      text: "AI 어시스턴트",
      description: `3D 오브젝트 학습과 함께,
AI를 통해 궁금한 내용을 질문해보세요`,
    },
    {
      image: MainImage3,
      text: "메모",
      description: `3D 오브젝트 학습과 함께,
궁금한 내용 및 아이디어를 메모해보세요`,
    },
  ];

  const componentImagesBySlide = {
    V4_Engine: v4Images,
    Drone: droneImages,
    "Robot Arm": robotArmImages,
    Suspension: suspensionImages,
  };
  const currentComponentImages = (
    componentImagesBySlide[slides[activeIndex].name] ?? []
  ).slice(0, 6);

  const handleLogin = () => {
    setShow(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tokenRes = await fetch(apiUrl("/auth/token"), {
          credentials: "include",
          method: "POST",
        });
        const contentType = tokenRes.headers.get("content-type");
        if (!tokenRes.ok || !contentType?.includes("application/json")) {
          setUser(null);
          return;
        }
        const data = await tokenRes.json();
        if (data?.accessToken) {
          const meRes = await fetch(apiUrl("/users/me"), {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.accessToken}`,
            },
            method: "GET",
          });
          if (
            !meRes.ok ||
            !meRes.headers.get("content-type")?.includes("application/json")
          ) {
            setUser(null);
            return;
          }
          const userData = await meRes.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.warn("fetchUser failed", e);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  console.log(user);

  const handleLogout = async () => {
    // const provider = user?.email?.includes("gmail.com") ? "google" : "kakao";
    // try {
    //   await fetch(apiUrl(`/auth/withdraw/${provider}`), {
    //     credentials: "include",
    //     method: "DELETE",
    //   });
    //   setUser(null);
    // } catch (e) {
    //   console.warn("logout failed", e);
    //   setUser(null);
    // }
  };

  return (
    <main className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <header className={styles.homeHeader}>
          <img src={logo} alt="Logo" />
          <h1 className={styles.homeTitle}>SIMVEX</h1>
          <p className={styles.homeDescription}>학습 리스트</p>
          {user ? (
            <div>
              <p
                className={
                  styles.homeUserName
                }>{`${user.nickname}님 환영합니다.`}</p>
              <button className={styles.homeButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className={styles.homeButton} onClick={handleLogin}>
              로그인
            </button>
          )}
        </header>
        {show && <LoginModal setShow={setShow} show={show} />}
        <section className={styles.homeSection}>
          <h2 className={styles.homeSectionTitle}>
            {slides[activeIndex].name}
          </h2>
          <Swiper
            className={styles.homeSectionSwiper}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}>
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <img
                  src={slide.image}
                  alt={slide.name}
                  className={
                    slide.name === "Drone"
                      ? styles.homeSectionImageDrone
                      : styles.homeSectionImage
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={styles.homeSectionDescription}>
            <p className={styles.homeSectionDescriptionText}>
              {slides[activeIndex].description}
            </p>
            <button
              className={styles.homeSectionButton}
              onClick={() => {
                navigate("/scene");
              }}>
              바로 학습하기
            </button>
          </div>
          <div className={styles.homeSectionComponents}>
            <h3 className={styles.homeSectionComponentsTitle}>구성 부품</h3>
            <div className={styles.homeSectionComponentsItemContainer}>
              <div className={styles.homeSectionComponentsItem}>
                {currentComponentImages.map((image, index) => (
                  <img
                    src={image}
                    alt={slides[activeIndex].name}
                    className={styles.homeSectionComponentsItemImage}
                    key={index}
                  />
                ))}
              </div>
              <div
                className={styles.homeSectionComponentsGradient}
                aria-hidden="true"
              />
              <button
                className={styles.homeSectionComponentsItemButton}
                onClick={() => {
                  navigate("/scene");
                }}>
                자세히 보러가기
              </button>
            </div>
          </div>
        </section>
        <div className={styles.homeMiddleSection}>
          <p className={styles.homeMiddleSectionTitle}>SIMVEX</p>
          <p className={styles.homeMiddleSectionDescription}>
            공학 분야 학생 및 연구자를 위한 3D 시각화
            <br />
            시뮬레이션 기반 학습/연구개발 조합 소프트웨어
          </p>
          <div className={styles.homeMiddleSectionFeatures}>
            <p className={styles.homeMiddleSectionFeaturesItem}>
              # 복잡한 기계 3D 시각화
            </p>
            <p className={styles.homeMiddleSectionFeaturesItem}>
              # AI 실시간 학습/연구 보조
            </p>
            <div className={styles.homeMiddleSectionFeaturesButton}>
              <button
                ref={featuresSwiperPrevRef}
                type="button"
                className={styles.homeMiddleSectionFeaturesButtonItemLeft}
                aria-label="이전 슬라이드"
                onClick={() => featuresSwiper?.slidePrev()}>
                {"<"}
              </button>
              <button
                ref={featuresSwiperNextRef}
                type="button"
                className={styles.homeMiddleSectionFeaturesButtonItemRight}
                aria-label="다음 슬라이드"
                onClick={() => featuresSwiper?.slideNext()}>
                {">"}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.homeMiddleSectionFeaturesList}>
          <Swiper
            className={styles.homeMiddleSectionFeaturesListSwiper}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={32}
            slidesPerView={3.2}
            pagination={{ clickable: true }}
            loop={true}
            navigation={true}
            onSwiper={setFeaturesSwiper}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = featuresSwiperPrevRef.current;
              swiper.params.navigation.nextEl = featuresSwiperNextRef.current;
            }}
            onInit={(swiper) => {
              swiper.navigation.init();
              swiper.navigation.update();
            }}>
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className={styles.homeMiddleSectionFeaturesListItem}>
                  <img
                    src={slide.image}
                    alt={slide.name}
                    className={styles.homeMiddleSectionFeaturesListImage}
                  />
                  <p className={styles.homeMiddleSectionFeaturesListImageText}>
                    {slide.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.homeMiddleSectionFeaturesListTitle}>
          <h1 className={styles.homeMiddleSectionFeaturesListTitleText}>
            핵심 기능
          </h1>
          <div className={styles.homeMiddleSectionFeaturesListTitleItem}>
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className={styles.homeMiddleSectionFeaturesListTitleItemBox}>
                <div
                  className={
                    styles.homeMiddleSectionFeaturesListTitleItemImages
                  }>
                  <img
                    src={feature.image}
                    alt={feature.text}
                    className={
                      styles.homeMiddleSectionFeaturesListTitleItemImage
                    }
                  />
                </div>
                <div
                  className={
                    styles.homeMiddleSectionFeaturesListTitleItemTextBlock
                  }>
                  <h1
                    className={
                      styles.homeMiddleSectionFeaturesListTitleItemText
                    }>
                    {feature.text}
                  </h1>
                  <p
                    className={
                      styles.homeMiddleSectionFeaturesListTitleItemDescription
                    }>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
