import React, { useState } from "react";
import axios from "axios";
import styles from "./SignInSignUp.module.css";

const SignInSignUp = ({ afterLogin }) => {

  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/signup`, signUpData);
      if (response.status === 201) {
        alert("User signed up successfully.");
        setRightPanelActive(false);
      } else {
        console.log("it is working..");
        throw new Error("Failed to sign up.");
      }
    } catch (err) {
      if (err.status === 400) {
        alert('Bad parameters, Please fill all fields..');
      }
      else
        alert(err.message);
    }
    setSignUpData({ name: "", email: "", password: "" });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/login`, signInData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isPremium", response.data.isPremium);
      alert(response.data.message);
      afterLogin(true);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "An error occurred during login.");
    }
    setSignInData({ email: "", password: "" });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (signInData.email) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/password/forgotpassword`, {
          email: signInData.email,
        });
        alert(response.data.message);
      } catch (err) {
        console.log(err);
        alert("Failed to send reset password email.");
      }
    } else {
      alert("Please fill in the email input first before pressing reset password!");
    }
  };

  return (
    <div className={styles.container}>
      <h4>Tracking expenses is directly proportional to saving money.</h4>
      <div className={`${styles.mainContainer} ${rightPanelActive ? styles.rightPanelActive : ""}`}>
        <div className={styles.signUp}>
          <form onSubmit={handleSignUpSubmit}>
            <h2>Create Account</h2>
            <p>Please set a strong password!</p>
            <input
              type="text"
              name="name"
              value={signUpData.name}
              onChange={handleSignUpChange}
              required
              placeholder="Enter Name"
            />
            <input
              type="email"
              name="email"
              value={signUpData.email}
              onChange={handleSignUpChange}
              required
              placeholder="Enter Email"
            />
            <input
              type="password"
              name="password"
              value={signUpData.password}
              onChange={handleSignUpChange}
              required
              placeholder="Set Password"
            />
            <button type="submit" id={styles.SignUp}>Sign Up</button>
          </form>
        </div>

        <div className={styles.signIn}>
          <form onSubmit={handleSignInSubmit}>
            <h2>Sign In</h2>
            <p>Use your previous credentials.</p>
            <input
              type="email"
              name="email"
              value={signInData.email}
              onChange={handleSignInChange}
              required
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              value={signInData.password}
              onChange={handleSignInChange}
              required
              placeholder="Password"
            />
            <a href="#" id={styles.forgot_password} onClick={handlePasswordReset}>
              Forget your Password? Reset
            </a>
            <button type="submit" id={styles.SignIn}>Sign In</button>
          </form>
        </div>

        <div className={styles.overlayLeft}>
          <h2>Welcome Back!</h2>
          <p>To keep connected with us, please login with your personal info.</p>
          <button id={styles.signIn} onClick={() => setRightPanelActive(false)}>
            Sign In
          </button>
        </div>

        <div className={styles.overlayRight}>
          <h2>Hello, Friend!</h2>
          <p>Enter your personal details and start your journey with us.</p>
          <button id={styles.signUp} onClick={() => setRightPanelActive(true)}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
