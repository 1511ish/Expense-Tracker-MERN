import React from 'react';
import TableHeader from './THeader';
import TableBody from './TBody';

const Table = ({ expenses,TotalAmount,onDownload,onRecent}) => {
  return (
      <table cellspacing="0">
        <TableHeader />
        <TableBody expenses={expenses} TotalAmount={TotalAmount} onDownload={onDownload} onRecent={onRecent} />
        {/* <div id="pagination"></div> */}
      </table>
  );
};

export default Table;