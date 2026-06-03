import React from "react";
import styles from "./LoadingModal.module.css";

const LoadingModal = ({message = "Downloading, please wait..." }) => {

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;