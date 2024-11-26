import "./topbar.css";
import { Search } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Topbar({ searchTerm, setSearchTerm, currentUser }) {
    const history = useHistory();

    console.log("currentUser", currentUser);

    const homepage = () => {
        history.push('/');
    };

    const profilepage = () => {
        history.push('/profile');
    };

    const handleLogout = async () => {
        try {
            // Make a POST request to the /logout endpoint with credentials
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`,
                {},  // Pass an empty body
                { withCredentials: true }  // Ensures cookies are sent with the request
            );

            // Clear the token from localStorage (if applicable)
            localStorage.removeItem("authToken");

            // Redirect to the login page or homepage
            history.push('/login');  // Assuming '/login' is your login route
        } catch (err) {
            console.error("Error logging out", err);
        }
    };

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <span className="logo" onClick={homepage}>Forum</span>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon" />
                    <input
                        placeholder="Search post content"
                        className="searchInput"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink" onClick={homepage}>Home</span>
                    <span className="topbarLink" onClick={profilepage}>Profile</span>
                    <button className="logoutButton" onClick={handleLogout}>Logout</button> {/* Logout Button */}
                </div>
                <img src={currentUser.profilePicture || "/assets/default-avatar.png"} alt="Profile" className="topbarImg" onClick={profilepage} />
            </div>
        </div>
    );
}
