import React, { useState } from "react";
import "./share.css";
import { PermMedia } from "@material-ui/icons";

export default function Share({ user }) {
    const [inputText, setInputText] = useState("");
    const [photo, setPhoto] = useState(null); // Store the photo file
    // const userId = "67167a651eece06e76bb23b0"; // Replace with actual user ID
    const userId = user._id;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: userId,
            desc: inputText,
            photo: photo ? URL.createObjectURL(photo) : "", // URL of the photo
            like: 0, // Initialize likes
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/posts/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPost),
                credentials: "include",  // Ensures cookies are sent with the request
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setInputText("");
                setPhoto(null); // Clear the photo

                // Reload the page to see the new post
                window.location.reload();
            } else {
                console.error("Failed to save the post, response: ", response);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    // Handle photo selection
    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]); // Store the selected file
    };

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    {/* <img src="/assets/person/1.jpg" alt="" className="shareProfileImg" /> */}
                    <img src={user.profilePicture} alt="" className="shareProfileImg" />
                    <input
                        placeholder="Enter text to Share"
                        className="shareInput"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>
                <hr className="shareHr" />
                <div className="shareBottom">
                    <div className="shareOptions">
                        <div className="shareOption comingSoon">
                            <PermMedia className="shareOptionIcon" />
                            <span className="shareOptionText">Photo / Video (Coming Soon)</span>
                            {/* Disabled input */}
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                disabled
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>
                    <button onClick={handleSubmit} className="shareButton">Share</button>
                </div>
            </div>
        </div>
    );
}
