import GuideItem from "../GuideItem/GuideItem";
import styles from "./GuideList.module.scss";

function GuideList({ guides }) {
    return (
        <div className={styles.guideList}>
            {guides.length === 0 ? (
                <p className={styles.noGuidesMessage}>Không tìm thấy hướng dẫn nào.</p>
            ) : (
                guides.map((guide) => <GuideItem key={guide._id} guide={guide} />)
            )}
        </div>
    );
}

export default GuideList;