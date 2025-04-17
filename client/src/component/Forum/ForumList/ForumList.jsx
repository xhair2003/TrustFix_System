import ForumPost from "../ForumPost/ForumPost";
import styles from "./ForumList.module.scss";

function ForumList({ posts }) {
    return (
        <div className={styles.forumList}>
            {posts.length === 0 ? (
                <p className={styles.noPosts}>Không tìm thấy bài đăng nào.</p>
            ) : (
                <div className={styles.postsContainer}>
                    {posts.map((post) => (
                        <ForumPost key={post._id} post={post} className={styles.forumPost} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ForumList;