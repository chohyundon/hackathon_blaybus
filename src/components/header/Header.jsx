import { useLocation, useNavigate } from "react-router";
import styles from "../../components/elements/scene/scene.module.css";
import logo from "../../assets/logo.svg";
import { useAuthStore } from "../../store/useAuthStore";
import { apiUrl } from "../../api/config";

export default function Header({
  showService,
  setShowService,
  selectedObject,
  setSelectedObject,
  handleLogin,
}) {
  const object = ["V4_Engine", "Robot Arm", "Drone", "Suspension"];
  const navigate = useNavigate();
  const pathname = useLocation();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = async () => {
    const provider = user?.email !== null ? "google" : "kakao";
    try {
      await fetch(apiUrl(`/auth/withdraw/${provider}`), {
        credentials: "include",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setUser(null);
    } catch (e) {
      console.warn("logout failed", e);
      setUser(null);
    }
  };

  const onLoginClick = () => {
    if (handleLogin) handleLogin();
    else navigate("/");
  };

  return (
    <nav className={styles.content}>
      <div className={styles.titleContainer}>
        <img src={logo} className={styles.img} />
        <p className={styles.title} onClick={() => navigate("/")}>
          SIMVEX
        </p>
        <div className={styles.descriptionSeparator}>|</div>
        <p
          className={
            !showService ? styles.descriptionActive : styles.description
          }
          onClick={() => {
            setShowService(false);
            navigate("/scene");
          }}>
          서비스 자세히
        </p>
        <p
          className={
            showService ? styles.descriptionActive : styles.description
          }
          onClick={() => {
            setShowService(true);
            navigate("/learn-list");
          }}>
          학습 리스트
        </p>
        {pathname.pathname === "/scene" && (
          <div className={styles.option}>
            {object.map((item, index) => (
              <p
                key={index}
                className={
                  selectedObject === item ? styles.item : styles.noneItem
                }
                onClick={() => setSelectedObject(item)}>
                {item}
              </p>
            ))}
          </div>
        )}
        <div className={styles.loginButton}>
          {user ? (
            <>
              <p className={styles.loginButtonText}>{user.nickname}님</p>
              <p
                className={styles.loginButtonText}
                onClick={handleLogout}
                style={{ cursor: "pointer", marginLeft: 8 }}>
                로그아웃
              </p>
            </>
          ) : (
            <p className={styles.loginButtonText} onClick={onLoginClick}>
              로그인
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}
