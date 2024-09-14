import React, { useState, useEffect } from 'react';
import styles from "./test.module.css";

const Form = ({ onSubmit, expenseToEdit, setItemsPerPage }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setDescription(expenseToEdit.description);
      setCategory(expenseToEdit.category);
    }
  }, [expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let expense = { amount, description, category };
    if (expenseToEdit) {
      expense = { ...expense, id: expenseToEdit._id };
    }
    onSubmit(expense);
    setAmount('');
    setDescription('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.expense_form}>
      <div>
        <select
          className={styles.options}
          id={styles.rowsPerPage}
          onChange={(e) => setItemsPerPage(e.target.value)}
        >
          <option value="" disabled className={styles.rows}>Row Per Page</option> {/* Default label */}
          <option value="1" className={styles.rows}>1</option>
          <option value="2" className={styles.rows}>2</option>
          <option value="3" className={styles.rows}>3</option>
          <option value="5" className={styles.rows}>5</option>
          <option value="10" className={styles.rows}>10</option>
          <option value="15" className={styles.rows}>15</option>
          <option value="20" className={styles.rows}>20</option>
        </select>
      </div>
      <div>
        <label htmlFor="amount">Amount(<i className={`fa-solid fa-indian-rupee-sign`}></i>):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
      </div>
      <div>
        <label htmlFor="options">Choose Category:</label>
        <select className={styles.options} id={styles.options} name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}>
          <option value="movie" className={styles.category}>Movie</option>
          <option value="food" className={styles.category}>Food</option>
          <option value="fuel" className={styles.category}>Fuel</option>
          <option value="shoping" className={styles.category}>Shoping</option>
          <option value="phone" className={styles.category}>Phone</option>
          <option value="electricity_bill" className={styles.category}>Electricity</option>
          <option value="others" className={styles.category}>Others</option>
        </select>
      </div>
      <button type="submit" id={styles.add}> {expenseToEdit ? 'Edit' : 'Add'} Expense</button>
    </form>
  );
};

export default Form;
