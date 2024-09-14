import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import styles from "./test.module.css";
// import "./index.css";

const ExpenseTable = ({ expenses, setExpenses, onEdit, paginationData, itemsPerPage, setItemsPerPage, setPage }) => {
  return (
    <div className={`${styles['table-container']}`}>
      <table cellSpacing="0" className={styles.expenseTable}>
        <TableHeader />
        <TableBody expenses={expenses} setExpenses={setExpenses} onEdit={onEdit} />
      </table>
      <div id={styles.pagination}>
        <Pagination paginationData={paginationData} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} setPage={setPage} />
      </div>
    </div>
  );
};

export default ExpenseTable;