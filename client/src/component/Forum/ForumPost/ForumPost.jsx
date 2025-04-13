import { Link } from "react-router-dom";
import styles from "./ForumPost.module.scss";

function ForumPost({ post }) {
    return (
        <div className={styles.postCard}>
            <Link to={`/forum/post/${post.id}`}>
                <h3>{post.title}</h3>
            </Link>
            <p className={styles.meta}>
                Đăng bởi: {post.user.name} ({post.user.role}) | Danh mục: {post.category} |{" "}
                {post.createdAt}
            </p>
            <p>{post.content.substring(0, 100)}...</p>
            <div className={styles.stats}>
                <span>{post.likes} lượt thích</span>
                <span>{post.comments.length} bình luận</span>
            </div>
        </div>
    );
}

export default ForumPost;