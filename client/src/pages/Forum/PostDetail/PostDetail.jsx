import { useParams } from "react-router-dom";
import { useState } from "react";
import { mockPosts } from "../../../data";
import Comment from "../../../component/Forum/Comment/Comment";
import styles from "./PostDetail.module.scss";

function PostDetail() {
    const { id } = useParams();
    const post = mockPosts.find((p) => p.id === parseInt(id));
    const [comments, setComments] = useState(post ? post.comments : []);
    const [newComment, setNewComment] = useState("");
    const [likes, setLikes] = useState(post ? post.likes : 0);

    if (!post) return <p>Bài đăng không tồn tại.</p>;

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([
                ...comments,
                {
                    id: comments.length + 1,
                    user: "Người dùng hiện tại",
                    content: newComment,
                    createdAt: new Date().toISOString().split("T")[0],
                },
            ]);
            setNewComment("");
        }
    };

    return (
        <div className={styles.postDetail}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.meta}>
                Đăng bởi: {post.user.name} ({post.user.role}) | Danh mục: {post.category} |{" "}
                {post.createdAt}
            </p>
            <p className={styles.content}>{post.content}</p>
            <div className={styles.stats}>
                <button className={styles.likeButton} onClick={() => setLikes(likes + 1)}>
                    {likes} lượt thích
                </button>
            </div>

            <div className={styles.commentsSection}>
                <h3 className={styles.commentsTitle}>Bình luận ({comments.length})</h3>
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
                <form onSubmit={handleAddComment} className={styles.commentForm}>
                    <textarea
                        className={styles.commentInput}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        required
                    />
                    <button className={styles.submitButton} type="submit">
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostDetail;