import { useParams, Link } from "react-router-dom";
import { mockGuides } from "../../../data";
import styles from "./GuideDetail.module.scss";

function GuideDetail() {
    const { id } = useParams();
    const guide = mockGuides.find((g) => g.id === parseInt(id));

    if (!guide) return <p>Hướng dẫn không tồn tại.</p>;

    return (
        <div className={styles.guideDetail}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>Thư viện hướng dẫn sửa chữa</h1>
            </header>
            <div className={styles.container}>
                <h2 className={styles.guideTitle}>{guide.title}</h2>
                <p className={styles.meta}>
                    Đăng bởi: {guide.createdBy.name} ({guide.createdBy.role}) | Danh mục:{" "}
                    {guide.category} | {guide.createdAt}
                </p>
                {guide.type === "video" ? (
                    <iframe
                        className={styles.video}
                        src={guide.content}
                        title={guide.title}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className={styles.article}>{guide.content}</div>
                )}
                <p className={styles.description}>{guide.description}</p>
            </div>
        </div>
    );
}

export default GuideDetail;