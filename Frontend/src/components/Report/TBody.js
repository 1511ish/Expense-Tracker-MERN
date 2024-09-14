import React from "react";
import ReportTableRow from "./TRow";
import styles from "./report.module.css";

const ReportTableBody = ({ expenses, TotalAmount, onDownload, onRecent }) => {
    function downloadReport(e) {
        e.preventDefault();
    }
    return (
        <tbody id="tbody">
            {expenses.map((expense, index) => (
                <ReportTableRow key={index} item={expense} />
            ))}

            {expenses.length > 0 && (
                <tr>
                    <td> <button className={styles.download_btn} onClick={onRecent}>Recently downloaded report</button> </td>
                    <td><button className={styles.download_btn} onClick={onDownload}>Download report</button></td>
                    <td><h3>Total:</h3></td>
                    <td>{TotalAmount}</td>
                </tr>
            )}
        </tbody>
    );
}

export default ReportTableBody;
