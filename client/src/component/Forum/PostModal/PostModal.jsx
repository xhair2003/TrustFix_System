import { useState } from "react";
import { categories } from "../../../data";
import styles from "./PostModal.module.scss";

function PostModal({ onClose, onSubmit }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [tags, setTags] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            content,
            category,
            tags: tags.split(",").map((tag) => tag.trim()),
            user: { id: 999, name: "Người dùng hiện tại", role: "customer" },
        });
        setTitle("");
        setContent("");
        setCategory(categories[0]);
        setTags("");
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Đăng bài mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Tiêu đề</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Nội dung</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Danh mục</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Thẻ (cách nhau bằng dấu phẩy)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="ví dụ: sửa chữa, mẹo vặt"
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button type="submit">Đăng bài</button>
                        <button type="button" onClick={onClose} className={styles.cancel}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostModal;