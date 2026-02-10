import styles from "./loginModal.module.css";
import KakaoIcon from "../../assets/kakao.svg";
import GoogleIcon from "../../assets/google.svg";

export default function LoginModal({ setShow, show }) {
  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShow(false);
  };

  const onKakaoLogin = () => {
    const url = `https://be-dosa.store/oauth2/authorization/kakao`;
    window.location.href = url;
  };

  const onGoogleLogin = () => {
    const url = `https://be-dosa.store/oauth2/authorization/google`;
    window.location.href = url;
  };

  return (
    <div
      className={styles.loginModal}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title">
      <div className={styles.loginModalContent}>
        <button
          type="button"
          className={styles.loginModalClose}
          onClick={() => setShow(false)}
          aria-label="닫기">
          ×
        </button>
        <h1 id="login-modal-title" className={styles.loginModalTitle}>
          로그인
        </h1>
        <p className={styles.loginModalDesc}>
          소셜 계정으로 간편하게 로그인하세요.
        </p>
        <div className={styles.loginModalButtons}>
          <button
            type="button"
            className={styles.kakaoButton}
            onClick={() => {
              onKakaoLogin();
              setShow(false);
            }}>
            <img src={KakaoIcon} alt="Kakao" />
            카카오 로그인
          </button>
          <button
            type="button"
            className={styles.googleButton}
            onClick={() => {
              onGoogleLogin();
              setShow(false);
            }}>
            <img src={GoogleIcon} alt="Google" />
            Google 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
