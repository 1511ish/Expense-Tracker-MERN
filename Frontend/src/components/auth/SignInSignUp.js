import React, { useState } from "react";
import styles from "./SignInSignUp.module.css";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import Overlay from "./Overlay";

const SignInSignUp = ({ afterLogin }) => {

  const [rightPanelActive, setRightPanelActive] = useState(false);

  return (
    <div className={styles.container}>
      <h4>Tracking expenses is directly proportional to saving money.</h4>
      <div className={`${styles.mainContainer} ${rightPanelActive ? styles.rightPanelActive : ""}`}>
        <div className={styles.signUp}>
          <SignUpForm setRightPanelActive={setRightPanelActive} />
        </div>

        <div className={styles.signIn}>
          <SignInForm afterLogin={afterLogin} />
        </div>

        <div className={styles.overlayLeft}>
          <Overlay data={{
            head: "Welcome Back!",
            para: "To keep connected with us, please login with your personal info.",
            button: "Sign In",
            overlay: "left",
            setRightPanelActive
          }} />
        </div>

        <div className={styles.overlayRight}>
          <Overlay data={{
            head: "Hello, Friend!",
            para: "Enter your personal details and start your journey with us.",
            button: "Sign Up",
            overlay: "right",
            setRightPanelActive
          }} />
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
