import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Navbar from './components/UI/Navbar/Navbar';
import Form from './components/Expense/Form';
import ExpenseTable from './components/Expense/Table';
import Leaderboard from './components/Leaderboard/LeaderBoard';
import Report from './components/Report/Report';
import SignInSignUp from './components/auth/SignInSignUp';

import styles from './components/Expense/test.module.css';
import { hydrateAuth } from "./context/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();

  const { isLoggedIn, token, isPremiumUser } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const [expenses, setExpenses] = useState([]);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginationData, setPaginationData] = useState({});
  const [page, setPage] = useState(1);

  const getExpenses = async () => {
    try {
      if (!token) return;
      const { data: { allExpenses, ...pageData } } = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/expense/get-expenses?page=${page}&pageSize=${itemsPerPage}`,
        { headers: { 'Authorization': token } }
      );
      setExpenses(allExpenses);
      setPaginationData(pageData);
    } catch (e) {
      console.error('Error fetching expenses:', e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) getExpenses();
  }, [isLoggedIn, itemsPerPage, page]);


  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);


  const lifting = async (expense) => {
    try {
      if (!token) return;
      if (expenseToEdit) {
        const { data } = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/expense/update-expense/${expense.id}`,
          expense,
          { headers: { 'Authorization': token } }
        );
        const edited_exp = data.expense;
        setExpenses(expenses.map(exp => exp._id === edited_exp._id ? edited_exp : exp));
        setExpenseToEdit(null);
      } else {
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/expense/add-expense`,
          expense,
          { headers: { 'Authorization': token } }
        );
        setExpenses([...expenses, data.newExpenseDetail]);
      }
    } catch (error) {
      console.error('Error processing expense:', error);
    }
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
          <Navbar />
          <div className={`${styles.container} ${theme === "light" ? styles.light : styles.dark}`}>
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
          <Route path="/" element={<SignInSignUp />} />
        </Routes>
      )}
    </>
  );
};

export default App;
