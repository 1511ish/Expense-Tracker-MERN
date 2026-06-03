import React from "react";
import styles from "./ErrorModal.module.css";

const ErrorModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label="Error"
      >
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
            <path
              d="M12 7v5M12 16h.01"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>{message}</p>

        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
