import React from "react";
import styles from "./SignInSignUp.module.css";

const overlay = ({ data }) => {
    return (
        <>
            <h2>{data.head}</h2>
            <p>{data.para}</p>
            <button id={styles.signIn} onClick={() => data.setRightPanelActive(data.overlay === "right" ? true : false)}>
                {data.button}
            </button>
        </>
    );
}

export default overlay;