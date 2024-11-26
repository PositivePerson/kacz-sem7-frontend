import React, { useState } from "react";
import "./login.css";
import axios from "axios";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
                email: email,
                password: password
            }, {
                withCredentials: true  // Sends cookies along with the request
            });
            localStorage.setItem("authToken", res.data.token);  // Store JWT in localStorage
            console.log(res.data);
            alert("Login successful");
            window.location.replace("/");
        } catch (err) {
            console.error(err);
            if (err.status === 429) {
                setError(err.response.statusText);
            } else {
                setError("Login failed. Please check your credentials.");
            }
        }
    };

    return (
        <div className="signinContainer">
            <h2>Sign In</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
                <a href="/register">Dont have account?</a>
            </form>
        </div >
    );
}
