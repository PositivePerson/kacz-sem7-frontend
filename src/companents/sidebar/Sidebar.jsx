import "./sidebar.css";
import {
    RssFeed,
    Chat,
    Group,
} from "@material-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Sidebar() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Retrieve token from local storage or any other storage
                const res = await axios.get("http://localhost:8800/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request headers
                    },
                });
                setUsers(res.data); // Save users in state
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem inactive">
                        <RssFeed className="sidebarListItemIcon" />
                        <span className="sidebarListItemText">Feed</span>
                        <span className="comingSoonText">Coming Soon</span>
                    </li>
                    <li className="sidebarListItem inactive">
                        <Chat className="sidebarListItemIcon" />
                        <span className="sidebarListItemText">Chats</span>
                        <span className="comingSoonText">Coming Soon</span>
                    </li>
                    <li className="sidebarListItem inactive">
                        <Group className="sidebarListItemIcon" />
                        <span className="sidebarListItemText">Groups</span>
                        <span className="comingSoonText">Coming Soon</span>
                    </li>
                </ul>
                <hr className="sidebarHr" />
                <button className="sidebarButton">Friend List</button>

                <ul className="sidebarFriendList">
                    {users.map((user) => (
                        <li className="sidebarFriend" key={user._id}>
                            <img src={user.profilePicture} alt="" className="sidebarFriendImg" />
                            <span className="sidebarFriendName">{user.username}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
