import React from "react";
// import "../../public/css/report.css"
import styles from "./report.module.css";
const Form = (props) => {
    return (
        <form action="#" className={styles.report_form} onSubmit={props.onSubmit}>
            <h2>{props.title}</h2>
            <label htmlFor="daily_date">{props.label}</label>
            <input type={props.type} onChange={props.onChange} />
            <button className={styles.btn} id="daily_btn">
                Show
            </button>
        </form>
    );
}

export default Form;