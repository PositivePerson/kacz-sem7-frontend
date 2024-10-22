import "./topbar.css";
import { Search } from '@material-ui/icons';
import { useHistory } from "react-router-dom";

export default function Topbar({ searchTerm, setSearchTerm, currentUser }) {
    const history = useHistory();

    console.log("currentUser", currentUser);

    const homepage = () => {
        history.push('/');
    };

    const profilepage = () => {
        history.push('/profile');
    };

    const handleLogout = () => {
        // Clear the token from localStorage (or sessionStorage)
        localStorage.removeItem("authToken");

        // Redirect to the login page or homepage
        history.push('/login');  // Assuming '/login' is your login route
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
