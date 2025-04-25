import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, likePost, fetchPosts, resetError } from "../../../store/actions/userActions";
import Comment from "../../../component/Forum/Comment/Comment";
import styles from "./PostDetail.module.scss";
import Swal from "sweetalert2";
import Loading from "../../../component/Loading/Loading";

function PostDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector((state) => state.user);
    // Find the post in Redux posts
    const post = posts.find((p) => p._id === id);
    const [newComment, setNewComment] = useState("");

    // Fetch posts on component mount
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    // Handle errorViewRequest with Swal
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset view request state
            });
        }
    }, [error, dispatch]);

    if (!post) return <p>Bài đăng không tồn tại.</p>;

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            dispatch(addComment(post._id, { content: newComment }));
            setNewComment("");
            dispatch(fetchPosts()); // Refetch posts to update comments
        }
    };

    const handleLike = () => {
        dispatch(likePost(post._id));
    };

    if (loading) return <Loading />;

    return (
        <div className={styles.postDetail}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.meta}>
                Đăng bởi: {post.user_id.firstName} {post.user_id.lastName} (
                {post.user_id.roles?.[0]?.type === "repairman" ? "Thợ" : "Người dùng"}) | Chuyên mục:{" "}
                {post.serviceIndustry_id?.type || "Unknown"} |{" "}
                {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className={styles.content}>{post.content}</p>
            {post.images && post.images.length > 0 && (
                <div className={styles.postImages}>
                    {post.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className={styles.postImage}
                        />
                    ))}
                </div>
            )}
            <div className={styles.stats}>
                <button
                    className={styles.likeButton}
                    onClick={handleLike}
                    disabled={loading}
                >
                    {post.likeCount} lượt thích
                </button>
            </div>

            <div className={styles.commentsSection}>
                <h3 className={styles.commentsTitle}>Bình luận ({post.commentCount})</h3>
                {post.forumComments?.length > 0 ? (
                    post.forumComments.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                    ))
                ) : (
                    <p>Chưa có bình luận.</p>
                )}

                <form onSubmit={handleAddComment} className={styles.commentForm}>
                    <textarea
                        className={styles.commentInput}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        required
                    />
                    <button className={styles.submitButton} type="submit" disabled={loading}>
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostDetail;