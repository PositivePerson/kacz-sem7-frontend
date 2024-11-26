import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Feed({ user, searchTerm }) {
    const [posts, setPosts] = useState([]);

    // Fetch posts from the backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch only posts created by the current user
                console.log(`calling /api/posts?userId=${user._id}`)
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/posts?userId=${user._id}`, {
                    withCredentials: true,  // Ensures cookies are sent with the request
                });

                // Sort posts by createdAt in descending order (newest first)
                setPosts(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, [user._id]);

    // Filter posts based on search term (description)
    const filteredPosts = posts.filter((post) => {
        return searchTerm
            ? post.desc?.toLowerCase().includes(searchTerm.toLowerCase())
            : true; // If no search term, show all posts
    });

    return (
        <div className="feed">
            <div className="feedWrapper">
                <Share user={user} />
                {filteredPosts.map((post) => (
                    <Post key={post._id} post={post} currentUserId={user._id} isAdmin={user.isAdmin} />
                ))}
            </div>
        </div>
    );
}
