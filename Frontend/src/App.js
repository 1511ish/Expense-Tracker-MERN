import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/UI/Navbar/Navbar';
import Form from './components/Expense/Form';
import ExpenseTable from './components/Expense/Table';
import Leaderboard from './components/Leaderboard/LeaderBoard';
import Report from './components/Report/Report';
import SignInSignUp from './components/auth/SignInSignUp';
import styles from './components/Expense/test.module.css';

const App = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginationData, setPaginationData] = useState({});
  const [page, setPage] = useState(1);

  const getExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/get-expenses?page=${page}&pageSize=${itemsPerPage}`,
        { headers: { 'Authorization': token } })
        .then(({ data: { allExpenses, ...pageData } }) => {
          setExpenses(allExpenses);
          setPaginationData(pageData);
        })
        .catch((error) => console.error('Error fetching expenses:', error));
    } catch (e) {
      console.log(e);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/premiumstatus`, {
        headers: { "Authorization": token }
      });
      setIsPremiumUser(response.data.isPremium);
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getExpenses();
    }
  }, [isLoggedIn, itemsPerPage, page]);

  useEffect(() => {
    if (isLoggedIn) {
      checkPremiumStatus();
    }
  }, [isLoggedIn]);

  const lifting = async (expense) => {
    const token = localStorage.getItem('token');
    try {
      if (expenseToEdit) {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/update-expense/${expense.id}`,
          expense, { headers: { 'Authorization': token } });
        const edited_exp = response.data.expense;
        setExpenses(expenses.map(exp => exp._id === edited_exp._id ? edited_exp : exp));
        setExpenseToEdit(null);
      } else {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/add-expense`,
          expense, { headers: { 'Authorization': token } });
        setExpenses([...expenses, response.data.newExpenseDetail]);
      }
    } catch (error) {
      console.error('Error processing expense:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handlePremiumFeatureAccess = (featureName) => {
    if (!isPremiumUser) {
      return <b>You need to buy premium to access the {featureName} feature.</b>;
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar onLogout={handleLogout} isPremiumUser={isPremiumUser} />
          <div className={styles.container}>
            <Routes>
              <Route path="/" element={
                <div className={styles['main-content']}>
                  <Form onSubmit={lifting} expenseToEdit={expenseToEdit} setItemsPerPage={setItemsPerPage} />
                  <ExpenseTable
                    expenses={expenses}
                    setExpenses={setExpenses}
                    onEdit={(expense) => { setExpenseToEdit(expense) }}
                    paginationData={paginationData}
                    setItemsPerPage={setItemsPerPage}
                    itemsPerPage={itemsPerPage}
                    setPage={setPage}
                  />
                </div>
              } />
              <Route path="/report" element={isPremiumUser ? <Report /> : handlePremiumFeatureAccess('Report')} />
              <Route path="/leaderboard" element={isPremiumUser ? <Leaderboard /> : handlePremiumFeatureAccess('Leaderboard')} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<SignInSignUp afterLogin={(flag) => { setIsLoggedIn(flag) }} />} />
        </Routes>
      )}
    </>
  );
};

export default App;
