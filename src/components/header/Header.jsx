import { useLocation, useNavigate } from "react-router";
import styles from "../../components/elements/scene/scene.module.css";

export default function Header({
  showService,
  setShowService,
  selectedObject,
  setSelectedObject,
}) {
  const object = ["V4_Engine", "Robot Arm", "Drone", "Suspension"];
  const navigate = useNavigate();
  const pathname = useLocation();
  console.log(pathname);

  return (
    <nav className={styles.content}>
      <div className={styles.titleContainer}>
        <img src="/" className={styles.img} />
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
      </div>
    </nav>
  );
}
