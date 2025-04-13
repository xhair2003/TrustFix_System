import { Link } from "react-router-dom";
import styles from "./GuideItem.module.scss";

function GuideItem({ guide }) {
    return (
        <div className={styles.guideItem}>
            <Link to={`/guides/guide/${guide.id}`}>
                <h3>{guide.title}</h3>
            </Link>
            <p className={styles.meta}>
                Đăng bởi: {guide.createdBy.name} ({guide.createdBy.role}) | Danh mục:{" "}
                {guide.category} | {guide.createdAt}
            </p>
            <p>{guide.description}</p>
            <span className={styles.type}>{guide.type === "video" ? "Video" : "Bài viết"}</span>
        </div>
    );
}

export default GuideItem;