import React from 'react';
import axios from 'axios';
import TableRow from './TableRow';
// import styles from "../test.module.css";

const TableBody = ({ expenses, setExpenses ,onEdit}) => {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.BACKEND_BASE_URL}/expense/delete-expense/${id}`, {
        headers: { 'Authorization': token }
      });
      // Update the state to remove the deleted expense
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <tbody>
      {expenses.map((expense, index) => (
        <TableRow
          key={expense._id}
          item={expense}
          onDelete={handleDelete}
          onEdit={(expense) => {onEdit(expense)}}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
