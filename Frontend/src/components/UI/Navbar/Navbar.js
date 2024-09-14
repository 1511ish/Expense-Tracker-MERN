import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../public/css/leaderboard.module.css';
import styles from './navbar.module.css';
import axios from 'axios';


const Navbar = ({ onLogout, isPremiumUser }) => {
  const [isLoading, setIsLoading] = useState(false);  // State for loading

  const handlePremiumClick = async () => {
    const token = localStorage.getItem('token');

    try {
      setIsLoading(true);  // Start loading
      // Fetch the order and key for the Razorpay payment
      const response = await axios.get('http://localhost:5000/purchase/premiummembership', {
        headers: { "Authorization": token }
      });

      const options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
          try {
            // Update the transaction status on successful payment
            const res = await axios.post('http://localhost:5000/purchase/updatetransactionstatus', {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } });

            // Notify user of success and update token
            alert('You are now a premium user.');
            localStorage.setItem('token', res.data.token);
            // setIsPremium(true);  // Update the state to reflect premium status
          } catch (error) {
            console.error('Error updating transaction:', error);
            alert('There was an issue updating the transaction. Please contact support.');
          }
          setIsLoading(false);  // Stop loading after successful payment
        }
      };

      // Open Razorpay payment interface
      const rzpl = new Razorpay(options);
      rzpl.open();

      // Handle payment failures
      rzpl.on('payment.failed', async function (response) {
        console.log(response);
        try {
          await axios.post('http://localhost:5000/purchase/updatefailedtransactionstatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          }, { headers: { "Authorization": token } });
          alert('Payment failed. Please try another payment method or contact your bank.');
        } catch (error) {
          console.error('Error updating failed transaction:', error);
          alert('Payment failed, and we couldn\'t update the transaction status. Please contact support.');
        }
        setIsLoading(false);  // Stop loading after failed payment
      });

    } catch (error) {
      console.error('Error fetching payment details:', error);
      alert('Could not initiate payment. Please try again later.');
      setIsLoading(false);  // Stop loading if an error occurs during initial API call
    }
  };

  return (
    <nav id={styles.navbar}>
      <ul>
        <img src="/images/expense.png" className={styles.logo} alt="Expense Tracker Logo" />
        <Link to="/"><li>Home <span className="fa-solid fa-house"></span></li></Link>
        <Link to="/report"><li>Report <span className={`fa-solid fa-crown ${styles.crown_icon}`}></span></li></Link>
        <Link to="/leaderboard"><li>Leaderboard <span className={`fa-solid fa-crown ${styles.crown_icon}`}></span></li></Link>
      </ul>
      <ul>
        {isPremiumUser ? (
          <li style={{ cursor: 'not-allowed', pointerEvents: 'none' }}>You are a Premium User <span className={`fa-solid fa-crown ${styles.crown_icon}`}></span></li>
        ) : (
          <li
            id="styles.rzp-button1"
            onClick={handlePremiumClick}
            disabled={isLoading}
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Processing...' : 'Buy Premium'} <span className={`fa-solid fa-crown ${styles.crown_icon}`}></span>
          </li>
        )}
        <li id="log_out" onClick={onLogout}>Logout <span className="fa-solid fa-arrow-right-from-bracket login_icon"></span></li>
      </ul>
    </nav>
  );
};

export default Navbar;


