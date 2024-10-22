import "./rightbar.css"
// import {Users} from '../../data'
import { useState, useEffect } from "react";
import axios from "axios";

export default function Rightbar({ profile }) {
  const HomeRightBar = () => {
    return (<></>)
  }
  const ProfileRightbar = () => {
    const [location, setLocation] = useState("Loading...");

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
              .then((response) => response.json())
              .then((data) => {
                setLocation(data.city || "Location not found");
              })
              .catch((error) => {
                console.error("Error fetching location:", error);
                setLocation("Location not found");
              });
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            setLocation("Location not found");
          }
        );
      } else {
        setLocation("Geolocation not supported");
      }
    }, []);

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
      <>
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Current Location:</span>
            <span className="rightbarInfoValue">{location}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">Nanded, India</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {users.map((friend) => (
            <div className="rightbarFollowing">
              <img
                src={
                  friend.profilePicture}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightBar />}
      </div>
    </div>
  )
}
