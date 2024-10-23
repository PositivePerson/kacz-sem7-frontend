import React, { useState } from "react";
import axios from "axios";
import "./register.css";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("/assets/person/1.jpg"); // Default avatar
    const [error, setError] = useState("");

    // Array of avatar URLs (assuming they are stored in /assets/person)
    const avatars = [
        "/assets/person/1.jpg",
        "/assets/person/2.png",
        "/assets/person/3.png",
        "/assets/person/4.png",
        "/assets/person/5.png",
        "/assets/person/6.png",
        "/assets/person/7.jpg",
        "/assets/person/8.png",
        "/assets/person/9.png",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
                username,
                email,
                password,
                profilePicture: selectedAvatar, // Send the selected avatar along with registration data
            });
            console.log(res.data);
            alert("Registration successful");
        } catch (err) {
            console.error(err);
            setError("Registration failed. Please try again.");
        }
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
    };

    return (
        <div className="signupContainer">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                {/* Avatar selection */}
                <div className="avatarSelection">
                    <h3>Choose Your Avatar</h3>
                    <div className="avatarRow">
                        {avatars.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className={`avatar ${selectedAvatar === avatar ? "selected" : ""}`}
                                onClick={() => handleAvatarSelect(avatar)}
                            />
                        ))}
                    </div>
                </div>

                {/* Form fields */}
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Sign Up</button>
                <a href="/login">Already have an account?</a>
            </form>
        </div>
    );
}
