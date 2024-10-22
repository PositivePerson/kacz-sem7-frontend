import { MoreVert, ThumbUp } from "@material-ui/icons";
import "./post.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Post({ post, currentUserId, isAdmin }) {
    const [like, setLike] = useState(post.likes ? post.likes.length : 0);
    const [islike, setIslike] = useState(false);
    const [user, setUser] = useState({}); // State to hold user information
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown
    const [isEditing, setIsEditing] = useState(false); // For editing state
    const [editedDesc, setEditedDesc] = useState(post.desc); // For editing the description
    const [comments, setComments] = useState([]); // State for comments
    const [newComment, setNewComment] = useState(""); // State for new comment input


    const formattedDate = new Date(post.date).toLocaleString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }); // Format the date without seconds

    // Fetch the user data based on post.userId
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/users/${post.userId}`);
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [post.userId]);

    // Fetch comments for the post
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/posts/${post._id}/comments`);
                setComments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [post._id]);

    // Toggle the dropdown visibility
    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Check if the logged-in user is the author or an admin
    const canEditOrDelete = post.userId === currentUserId || isAdmin;

    // Like handler
    const likeHandler = async () => {
        try {
            const res = await axios.put(`http://localhost:8800/api/posts/${post._id}/like`, { userId: currentUserId });

            // If the server response confirms success, fetch the updated like count
            const updatedPost = await axios.get(`http://localhost:8800/api/posts/${post._id}`);

            // Update the like count and state based on the fresh data from the backend
            setLike(updatedPost.data.likes.length);
            setIslike(!islike); // Toggle like state based on action
        } catch (err) {
            console.error("Failed to update like status", err);
        }
    };

    // Edit handler: toggle edit mode
    const handleEdit = () => {
        setIsEditing(true);
        setIsDropdownOpen(false); // Close dropdown
    };

    // Save edited post
    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://localhost:8800/api/posts/${post._id}/edit`, {
                userId: post.userId, // Ensure userId is included in the request body
                desc: editedDesc,
            });
            setIsEditing(false); // Exit editing mode
            window.location.reload();
        } catch (err) {
            console.error("Failed to update post", err);
        }
    };

    // Delete handler: confirm and delete post
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/api/posts/${post._id}/delete`, {
                    data: { userId: post.userId } // Include userId in the request body
                });
                // You may also want to update the state in the parent component to remove the post from the UI
                window.location.reload(); // Reload to reflect the changes
            } catch (err) {
                console.error("Failed to delete post", err);
            }
        }
        setIsDropdownOpen(false); // Close dropdown
    };

    /// Fetch user info, comments, etc. (same as in the previous implementation)
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/posts/${post._id}/comments`);
                setComments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [post._id]);

    // Handle deleting a comment
    const handleDeleteComment = async (commentId) => {
        if (!commentId) {
            console.error("Comment ID is undefined");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/api/posts/${post._id}/comments/${commentId}`, {
                    data: { userId: currentUserId, isAdmin }
                });
                setComments(comments.filter(comment => comment._id !== commentId));  // Update state after deletion
            } catch (err) {
                console.error("Failed to delete comment", err);
            }
        }
    };

    // Handle new comment submission (same as before)
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;
        try {
            const res = await axios.post(`http://localhost:8800/api/posts/${post._id}/comments`, {
                userId: currentUserId,
                text: newComment
            });
            setComments([...comments, res.data]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        {/* Use dynamic user data */}
                        <img src={user.profilePicture || "/assets/default-profile.png"} alt="" className="postProfileImg" />
                        <span className="postUsername">{user.username || "Unknown User"}</span>
                        <span className="postDate">{formattedDate}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert onClick={handleDropdownToggle} className="postOptionsIcon" />
                        {isDropdownOpen && canEditOrDelete && (
                            <div className="postOptionsDropdown">
                                <span className="postOption" onClick={handleEdit}>Edit</span>
                                <span className="postOption" onClick={handleDelete}>Delete</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="postCenter">
                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                value={editedDesc}
                                onChange={(e) => setEditedDesc(e.target.value)}
                                className="editInput"
                            />
                            <button onClick={handleSaveEdit} className="saveButton">Save</button>
                            <button onClick={() => setIsEditing(false)} className="cancelButton">Cancel</button>
                        </div>
                    ) : (
                        <>
                            <span className="postText">{post.desc}</span>
                            <img src={post.photo} alt="" className="postImg" />
                        </>
                    )}
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <ThumbUp className="likeButton" onClick={likeHandler} />
                        <span className="postLikeCounter">{like} Likes</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postComment">{comments.length} Comments</span>
                    </div>
                </div>

                {/* Comments section */}
                <div className="postComments">
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <span>
                                <strong>{comment.username}</strong>: {comment.text}
                            </span>
                            {(comment.userId === currentUserId || isAdmin) && (
                                <span
                                    className="commentDelete"
                                    onClick={() => handleDeleteComment(comment._id)}  // Ensure _id is passed correctly
                                >
                                    Delete
                                </span>
                            )}
                        </div>
                    ))}
                    <form className="commentForm" onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            className="commentInput"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="commentSubmitButton">Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
}