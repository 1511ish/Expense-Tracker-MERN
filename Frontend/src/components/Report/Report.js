import React, { useState } from 'react';
import Table from './Table';
import Form from './Form';
import Card from '../UI/Card/Card';
import styles from './report.module.css';
import ErrorModal from "../modal/ErrorModal";
import LoadingModal from "../modal/LoadingModal/LoadingModal";
import axios from 'axios';

const Report = () => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [dailyExpenses, setDailyExpense] = useState([]);
  const [monthlyExpenses, setMonthlyExpense] = useState([]);
  const [dailyTotalAmount, setDailyTotalAmount] = useState(0);
  const [monthlyTotalAmount, setMonthlyTotalAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState(false);
  const [showRecentlyReports, setShowRecentlyReports] = useState(false);
  const [recentlyDownloadedFiles, setRecentlyDownloadedFiles] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  const token = localStorage.getItem('token');


  const dailyFormHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/premium/dailyReport/${day}`, {
        headers: { 'Authorization': token }
      });
      const expense = response.data.allExpenses;
      let total = 0;
      for (let obj of expense) {
        total += obj.amount;
      }
      setDailyExpense(expense);
      setDailyTotalAmount(total);

    } catch (error) {
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        setErrorMsg("No expenses found for the selected date.");
      } else if (statusCode === 401) {
        setErrorMsg("Session expired. Please log in again.");
      } else {
        setErrorMsg("Something went wrong while fetching the report. Please try again.");
      }
    }
  };

  const monthlyFormHandler = async (event) => {
    event.preventDefault();
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/premium/monthlyReport/${month}`, { headers: { 'Authorization': token } });
    const expense = response.data.allExpenses;
    let total = 0;
    for (let obj of expense) {
      total += obj.amount;
    }
    setMonthlyExpense(expense);
    setMonthlyTotalAmount(total);
  };

  const changeDayHandler = (event) => {
    setDay(event.target.value);
  };

  const changeMonthHandler = (event) => {
    setMonth(event.target.value);
  };

  const downloadDailyReport = async () => {
    try {
      setIsDownloading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/premium/download/${day}`, {
        headers: { 'Authorization': token },
      });
      const fileURL = response.data.fileUrl;
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `Daily_Report_${day}.txt`);
      link.click();
    } catch (error) {
      const statusCode = error.response?.data?.err?.statusCode;
      if (statusCode === 403) {
        setErrorMsg("Download is temporarily unavailable as our cloud storage subscription is being renewed. We apologize for the inconvenience.");
      } else {
        setErrorMsg("Something went wrong. Please try again later.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadMonthlyReport = async () => {
    try {
      setIsDownloading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/premium/download/${month}`, {
        headers: { 'Authorization': token },
      });
      const fileURL = response.data.fileUrl;
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `Monthly_Report_${month}.txt`);
      link.click();
    } catch (error) {
      const statusCode = error.response?.data?.err?.statusCode;
      if (statusCode === 403) {
        setErrorMsg("Download is temporarily unavailable as our cloud storage subscription is being renewed. We apologize for the inconvenience.");
      } else {
        setErrorMsg("Something went wrong. Please try again later.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const recentlyDownloadedReport = async () => {
    try {
      setIsLoadingRecent(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/premium/get-downlodedFileUrls`, {
        headers: { 'Authorization': token },
      });
      setRecentlyDownloadedFiles(response.data.fileURL);
      setShowRecentlyReports(true);
    } catch (error) {
      console.error('Error fetching recently downloaded reports:', error);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  return (
    <>
      <Card>
        <Form title={"Daily Reports"} label={"Select date:"} type={"date"} onSubmit={dailyFormHandler} onChange={changeDayHandler} />
        <Table expenses={dailyExpenses} TotalAmount={dailyTotalAmount} onDownload={downloadDailyReport} onRecent={recentlyDownloadedReport} />
      </Card>
      <Card>
        <Form title={"Monthly Reports"} label={"Select month:"} type={"month"} onSubmit={monthlyFormHandler} onChange={changeMonthHandler} />
        <Table expenses={monthlyExpenses} TotalAmount={monthlyTotalAmount} onDownload={downloadMonthlyReport} onRecent={recentlyDownloadedReport} />
      </Card>

      {isDownloading && <LoadingModal message="Downloading your report..." />}
      {isLoadingRecent && <LoadingModal message="Loading your recent report..." />}

      {showRecentlyReports && (
        <>
          <div className={styles.backdrop} onClick={() => setShowRecentlyReports(false)}></div>
          <Card className={`${styles['recently_reports_card']}`}>
            <h2>Recently Downloaded Reports</h2>
            {
              recentlyDownloadedFiles.length ? (
                <ul className={`${styles['recently-reports']}`}>
                  {recentlyDownloadedFiles.map((file, index) => (
                    <li key={index}>
                      <a href={file.fileUrl}>{`Expense file ${index + 1}`}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nothing Downloaded Recently</p>
              )
            }
            <button onClick={() => setShowRecentlyReports(false)}>Close</button>
          </Card>
        </>
      )}

      {errorMsg && (
        <>
          <ErrorModal message={errorMsg} onClose={() => setErrorMsg("")} />
        </>
      )}
    </>
  );
};

export default Report;
