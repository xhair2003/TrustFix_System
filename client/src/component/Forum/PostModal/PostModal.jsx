import { useState } from "react";
import styles from "./PostModal.module.scss";

function PostModal({ onClose, onSubmit, serviceIndustries }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [serviceIndustryId, setServiceIndustryId] = useState(
        serviceIndustries[0]?._id || ""
    );
    const [tags, setTags] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Handle image selection and preview
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Generate previews
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    // Clean up previews to prevent memory leaks
    const handleClose = () => {
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setImages([]);
        setImagePreviews([]);
        setTitle("");
        setContent("");
        setServiceIndustryId(serviceIndustries[0]?._id || "");
        setTags("");
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            content,
            serviceIndustry_id: serviceIndustryId,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            images, // Pass the raw File objects
        });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Đăng bài mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Tiêu đề</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Nội dung</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className={styles.formTextarea}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Danh mục</label>
                        <select
                            value={serviceIndustryId}
                            onChange={(e) => setServiceIndustryId(e.target.value)}
                            className={styles.formSelect}
                        >
                            {serviceIndustries.map((industry) => (
                                <option key={industry._id} value={industry._id}>
                                    {industry.type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Thẻ (cách nhau bằng dấu phẩy)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="ví dụ: sửa chữa, mẹo vặt"
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Hình ảnh (tùy chọn)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.formInput}
                        />
                        {imagePreviews.length > 0 && (
                            <div className={styles.imagePreview}>
                                {imagePreviews.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className={styles.previewImage}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.submitButton}>
                            Đăng bài
                        </button>
                        <button type="button" onClick={handleClose} className={styles.cancelButton}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostModal;