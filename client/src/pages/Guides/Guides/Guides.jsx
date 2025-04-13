import { useState } from "react";
import GuideList from "../../../component/Guide/GuideList/GuideList";
import { mockGuides, categories } from "../../../data";
import styles from "./Guides.module.scss";

function Guides() {
    const [guides, setGuides] = useState(mockGuides);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const filteredGuides = guides.filter(
        (guide) =>
            guide.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory ? guide.category === selectedCategory : true)
    );

    return (
        <div className={styles.guides}>
            <header className={styles.header}>
                <h1>Thư viện hướng dẫn sửa chữa</h1>
            </header>
            <div className={styles.container}>
                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm hướng dẫn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
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
                <GuideList guides={filteredGuides} />
            </div>
        </div>
    );
}

export default Guides;