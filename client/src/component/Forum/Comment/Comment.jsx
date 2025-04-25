import styles from "./Comment.module.scss";

function Comment({ comment }) {
    return (
        <div className={styles.comment}>
            <p className={styles.meta}>
                {comment.user_id.firstName} {comment.user_id.lastName} (
                {comment.user_id.roles?.[0]?.type === "repairman" ? "Thợ" : "Người dùng"}) |{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
            </p>
            <p className={styles.content}>{comment.content}</p>
        </div>
    );
}

export default Comment;