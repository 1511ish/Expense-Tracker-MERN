import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import "../public/css/leaderboard.css";
import styles from './leaderboard.module.css';

const Leaderboard = () => {
  const [data, setData] = useState([]); // Corrected typo: useSate to useState

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming you're fetching data from an API or another source
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/premium/showLeaderBoard', { headers: { 'Authorization': token } });
        const result = response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div id={styles['table-container']}>
      <h3>Leaderboard <i className={`fa-solid fa-trophy ${styles.trophy}`}></i></h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            {/* <th>Position</th> */}
            <th>Name</th>
            <th>Total Expenses(<i className={`fa-solid fa-indian-rupee-sign`}></i>)</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              let icon;
              switch (index) {
                case 0:
                  icon = <img src="/images/golden.png" alt="golden medal" className={styles['medal-icon']} />;
                  break;
                case 1:
                  icon = <img src="/images/silver.png" alt="silver medal" className={styles['medal-icon']} />;
                  break;
                case 2:
                  icon = <img src="/images/bronz.png" alt="bronze medal" className={styles['medal-icon']} />;
                  break;
                default:
                  icon = null;
              }
              return (
                <tr key={index}>
                  {icon ? (
                    <td className='l_td' style={{padding:'0px'}}>
                      {icon}
                    </td>
                  ) : (
                    <td className='l_td'>
                      {index + 1}
                    </td>
                  )}
                  <td className='l_td'>{item.name}</td>
                  <td className='l_td'>{item.totalexpenses}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
