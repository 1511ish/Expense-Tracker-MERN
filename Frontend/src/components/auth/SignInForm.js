import React, { useState } from "react";

import axios from "axios";
import styles from "./SignInSignUp.module.css";

import { useDispatch } from "react-redux";
import { login } from "../../context/slices/authSlice"; // adjust path if needed

const SignInForm = ({ afterLogin }) => {
    const dispatch = useDispatch();

    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/login`, signInData);
            // localStorage.setItem("token", response.data.token);
            // localStorage.setItem("isPremium", response.data.isPremium);
            console.log("user: ", response.data.user);
            const token = response.data.token;
            const isPremiumUser = response.data.user.ispremiumuser;
            dispatch(login({ token, isPremiumUser }));
            alert(response.data.message);
            // afterLogin(true);
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
    );
}

export default SignInForm;