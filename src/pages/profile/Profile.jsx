import React, { useEffect, useState } from 'react';
import "./profile.css";
import Topbar from "../../companents/topbar/Topbar";
import Sidebar from "../../companents/sidebar/Sidebar";
import Rightbar from "../../companents/rightbar/Rightbar";
import ProfileFeed from "../../companents/feed/ProfileFeed";
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Destructured import, not default
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

export default function Profile() {
    useAuthRedirect(); // Redirects if the user is not authenticated

    const [user, setUser] = useState({}); // State to hold the fetched user data
    const [searchTerm, setSearchTerm] = useState(""); // State for search input

    // Extract the auth token from localStorage
    const authToken = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(authToken); // Decode the token to get user info
    const userId = decodedToken.userId; // Assuming the token contains userId
    console.log("decoded: ", decodedToken);

    // Fetch user info from the backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
                    withCredentials: true,  // Ensures cookies are sent with the request
                });
                console.log("user in res.data: ", res.data);
                setUser(res.data); // Save the user data in the state
            } catch (err) {
                console.error("Error fetching user data", err);
            }
        };
        fetchUser();
    }, [userId, authToken]); // Re-run when userId or authToken changes

    return (
        <>
            <Topbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} currentUser={user} />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileTop">
                        <div className="profileCover">
                            <img src="/assets/cover/1.jpg" alt="" className="profileCoverImg" />
                            <img src={user?.profilePicture || "/assets/person/1.jpg"} alt="" className="profileImg" />
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{user.username || "Unknown User"}</h4>
                            <span className="profileInfoDesc">{user.description || "This user has not provided a description yet."}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <ProfileFeed user={user} searchTerm={searchTerm} />
                        <Rightbar profile />
                    </div>
                </div>
            </div>
        </>
    );
}
