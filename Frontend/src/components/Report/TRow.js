import React from 'react';

const ReportTableRow = ({ item }) => {
  return (
    <tr>
      <td>{item.date}</td>
      <td>{item.category}</td>
      <td>{item.description}</td>
      <td>{item.amount}</td>
      {/* <td>
        <button className="edit_btn">Edit</button>
        <button className="delete_btn">Delete</button>
      </td> */}
    </tr>
  );
};

export default ReportTableRow;