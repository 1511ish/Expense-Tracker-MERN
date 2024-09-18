import React from 'react';
import TableHeader from './THeader';
import TableBody from './TBody';
import styles from './report.module.css';

const Table = ({ expenses,TotalAmount,onDownload,onRecent}) => {
  return (
      <table cellspacing="0" className={`${styles.table}`}>
        <TableHeader />
        <TableBody expenses={expenses} TotalAmount={TotalAmount} onDownload={onDownload} onRecent={onRecent} />
        {/* <div id="pagination"></div> */}
      </table>
  );
};

export default Table;