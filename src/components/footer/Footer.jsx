import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h1 className={styles.footerTitle}>SIMVEX</h1>
      </div>
      <p className={styles.footerText}>
        Copyright © 2026 SIMVEX All rights reserved.
      </p>
    </footer>
  );
}
