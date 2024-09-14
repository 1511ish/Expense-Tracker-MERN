import React from 'react';
import styles from "./test.module.css";

const TableRow = ({ item, onDelete, onEdit }) => {
  
  const reverseString = (str) => {
        // Step 1. Use the split() method to return a new array
        var splitString = str.split("-"); // var splitString = "hello".split("");
        // ["h", "e", "l", "l", "o"]
    
        // Step 2. Use the reverse() method to reverse the new created array
        var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
        // ["o", "l", "l", "e", "h"]
    
        // Step 3. Use the join() method to join all elements of the array into a string
        var joinArray = reverseArray.join("-"); // var joinArray = ["o", "l", "l", "e", "h"].join("");
        // "olleh"
    
        //Step 4. Return the reversed string
        return joinArray; // "olleh"
  }
  return (
    <tr>
      <td>{reverseString(item.date.substring(0, 10))}</td>
      <td>{item.amount}</td>
      <td>{item.description}</td>
      <td>{item.category}</td>
      <td>
      <button className={styles.edit_btn} onClick={() => onEdit(item)}>Edit</button>
      <button className={styles.delete_btn} onClick={() => onDelete(item._id)}>Delete</button>
      </td>
    </tr>
  );
};

export default TableRow;