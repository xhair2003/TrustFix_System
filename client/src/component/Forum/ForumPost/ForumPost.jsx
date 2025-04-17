import { useNavigate } from "react-router-dom";
import styles from "./ForumPost.module.scss";

function ForumPost({ post }) {
    const navigate = useNavigate();
    // Placeholder for service industry name (replace with actual data)
    const serviceIndustryName = post.serviceIndustry_id?.type || "Unknown Category";

    // Handle click on post title to navigate with post object
    const handleTitleClick = () => {
        navigate(`/forum/post/${post._id}`);
    };

    return (
        <div className={styles.postCard}>
            <h3
                className={styles.postTitle}
                onClick={handleTitleClick}
                style={{ cursor: "pointer", }} // Add cursor to indicate clickability
            >
                {post.title}
            </h3>
            <p className={styles.meta}>
                Đăng bởi: {post.user_id.firstName} {post.user_id.lastName} (
                {post.user_id.roles?.[0]?.type === "repairman" ? "Thợ" : "Người dùng"})| Chuyên mục: {serviceIndustryName} |{" "}
                {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className={styles.postContent}>{post.content.substring(0, 100)}...</p>
            <div className={styles.stats}>
                <span className={styles.likeCount}>{post.likeCount} lượt thích</span>
                <span className={styles.commentCount}>{post.commentCount} bình luận</span>
            </div>
        </div>
    );
}

export default ForumPost;