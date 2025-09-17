import React, { useState } from "react";
import axios from "axios";
import styles from "./SignInSignUp.module.css";

const SignUpForm = ({setRightPanelActive}) => {
    const [signUpData, setSignUpData] = useState({
        name: "",
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

    return (
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
    )
}

export default SignUpForm;
