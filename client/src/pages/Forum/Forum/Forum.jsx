import { useState } from "react";
import ForumList from "../../../component/Forum/ForumList/ForumList";
import PostModal from "../../../component/Forum/PostModal/PostModal";
import { mockPosts, categories } from "../../../data";
import styles from "./Forum.module.scss";

function Forum() {
    const [posts, setPosts] = useState(mockPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCreatePost = (newPost) => {
        setPosts([
            {
                id: posts.length + 1,
                ...newPost,
                createdAt: new Date().toISOString().split("T")[0],
                likes: 0,
                comments: [],
            },
            ...posts,
        ]);
        setIsModalOpen(false);
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory ? post.category === selectedCategory : true)
    );

    return (
        <div className={styles.forum}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>Diễn đàn sửa chữa</h1>
            </header>
            <div className={styles.container}>
                <div className={styles.forumHeader}>
                    <h2 className={styles.forumTitle}>Danh sách bài đăng</h2>
                    <button
                        className={styles.createButton}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Đăng bài mới
                    </button>
                </div>

                <div className={styles.filters}>
                    <input
                        className={styles.filterInput}
                        type="text"
                        placeholder="Tìm kiếm bài đăng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={styles.filterSelect}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <ForumList posts={filteredPosts} />
                {isModalOpen && (
                    <PostModal
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleCreatePost}
                    />
                )}
            </div>
        </div>
    );
}

export default Forum;