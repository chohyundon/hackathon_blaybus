import React from "react";
import styles from "./footer.module.css";
import logo from "../../assets/logo.svg";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.containerFooter}>
        <img src={logo} alt="logo" />
        <h1 className={styles.footerTitle}>SIMVEX</h1>
      </div>
      <p className={styles.footerText}>
        Copyright © 2026 SIMVEX All rights reserved.
      </p>
    </footer>
  );
}
