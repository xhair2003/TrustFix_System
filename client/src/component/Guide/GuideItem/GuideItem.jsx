import { Link } from "react-router-dom";
import styles from "./GuideItem.module.scss";

function GuideItem({ guide }) {
    return (
        <div className={styles.guideItem}>
            <Link to={`/guides/guide/${guide._id}`}>
                <h3 className={styles.guideTitle}>{guide.title}</h3>
            </Link>
            <p className={styles.meta}>
                Đăng bởi: {guide.createdBy?.name || "Admin"} (
                {guide.createdBy?.role || "Quản trị viên"}) | Chuyên mục: {guide.category} |{" "}
                {new Date(guide.createdAt).toLocaleDateString()}
            </p>
            <p className={styles.guideDescription}>{guide.description}</p>
            <span className={styles.type}>
                {guide.type === "video" ? "Video" : guide.type === "images" ? "Hình ảnh" : "Bài viết"}
            </span>
        </div>
    );
}

export default GuideItem;