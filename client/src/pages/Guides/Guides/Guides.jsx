// import { useState } from "react";
// import GuideList from "../../../component/Guide/GuideList/GuideList";
// import { mockGuides, categories } from "../../../data";
// import styles from "./Guides.module.scss";

// function Guides() {
//     const [guides, setGuides] = useState(mockGuides);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");

//     const filteredGuides = guides.filter(
//         (guide) =>
//             guide.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//             (selectedCategory ? guide.category === selectedCategory : true)
//     );

//     return (
//         <div className={styles.guides}>
//             <header className={styles.header}>
//                 <h1 className={styles.headerTitle}>Thư viện hướng dẫn sửa chữa</h1>
//             </header>
//             <div className={styles.container}>
//                 <div className={styles.filters}>
//                     <input
//                         className={styles.filterInput}
//                         type="text"
//                         placeholder="Tìm kiếm hướng dẫn..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <select
//                         className={styles.filterSelect}
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                     >
//                         <option value="">Tất cả danh mục</option>
//                         {categories.map((cat) => (
//                             <option key={cat} value={cat}>
//                                 {cat}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <GuideList guides={filteredGuides} />
//             </div>
//         </div>
//     );
// }

// export default Guides;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GuideList from "../../../component/Guide/GuideList/GuideList";
import { getGuides, resetError } from "../../../store/actions/adminActions";
import Loading from "../../../component/Loading/Loading";
import styles from "./Guides.module.scss";
import Swal from "sweetalert2";

function Guides() {
    const dispatch = useDispatch();
    const { guides, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Gọi API khi component mount
    useEffect(() => {
        dispatch(getGuides());
    }, [dispatch]);

    // Handle error notifications
    useEffect(() => {
        if (error) {
            Swal.fire({
                title: "Lỗi",
                text: error,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetError());
        }
    }, [error, dispatch]);

    // Tạo danh sách danh mục động từ dữ liệu guides
    const categories = [...new Set(guides.map((guide) => guide.category).filter(Boolean))];

    // Lọc hướng dẫn theo tiêu đề và danh mục
    const filteredGuides = guides.filter(
        (guide) =>
            guide.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory ? guide.category === selectedCategory : true)
    );

    if (loading) return <Loading />;

    return (
        <div className={styles.guides}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>Thư viện hướng dẫn sửa chữa</h1>
            </header>
            <div className={styles.container}>
                <div className={styles.filters}>
                    <input
                        className={styles.filterInput}
                        type="text"
                        placeholder="Tìm kiếm hướng dẫn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={styles.filterSelect}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tất cả chuyên mục</option>
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