import styles from "./Comment.module.scss";

function Comment({ comment }) {
    return (
        <div className={styles.comment}>
            <p className={styles.meta}>
                {comment.user} | {comment.createdAt}
            </p>
            <p className={styles.commentContent}>{comment.content}</p>
        </div>
    );
}

export default Comment;