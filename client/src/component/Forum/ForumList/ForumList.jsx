import ForumPost from "../ForumPost/ForumPost";
import styles from "./ForumList.module.scss";

function ForumList({ posts }) {
    return (
        <div className={styles.forumList}>
            {posts.length === 0 ? (
                <p>Không tìm thấy bài đăng nào.</p>
            ) : (
                posts.map((post) => <ForumPost key={post.id} post={post} />)
            )}
        </div>
    );
}

export default ForumList;