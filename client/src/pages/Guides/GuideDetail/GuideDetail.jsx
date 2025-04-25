// import { useParams, Link } from "react-router-dom";
// import { mockGuides } from "../../../data";
// import styles from "./GuideDetail.module.scss";

// function GuideDetail() {
//     const { id } = useParams();
//     const guide = mockGuides.find((g) => g.id === parseInt(id));

//     if (!guide) return <p>Hướng dẫn không tồn tại.</p>;

//     return (
//         <div className={styles.guideDetail}>
//             <header className={styles.header}>
//                 <h1 className={styles.headerTitle}>Thư viện hướng dẫn sửa chữa</h1>
//             </header>
//             <div className={styles.container}>
//                 <h2 className={styles.guideTitle}>{guide.title}</h2>
//                 <p className={styles.meta}>
//                     Đăng bởi: {guide.createdBy.name} ({guide.createdBy.role}) | Danh mục:{" "}
//                     {guide.category} | {guide.createdAt}
//                 </p>
//                 {guide.type === "video" ? (
//                     <iframe
//                         className={styles.video}
//                         src={guide.content}
//                         title={guide.title}
//                         frameBorder="0"
//                         allowFullScreen
//                     ></iframe>
//                 ) : (
//                     <div className={styles.article}>{guide.content}</div>
//                 )}
//                 <p className={styles.description}>{guide.description}</p>
//             </div>
//         </div>
//     );
// }

// export default GuideDetail;


import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGuides, resetError } from "../../../store/actions/adminActions";
import Loading from "../../../component/Loading/Loading";
import styles from "./GuideDetail.module.scss";
import Swal from "sweetalert2";

function GuideDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { guides, loading, error } = useSelector((state) => state.admin);

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

    // Tìm hướng dẫn theo _id
    const guide = guides.find((g) => g._id === id);

    if (loading) return <Loading />;
    if (!guide) return <p className={styles.noGuide}>Hướng dẫn không tồn tại.</p>;

    return (
        <div className={styles.guideDetail}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>Thư viện hướng dẫn sửa chữa</h1>
            </header>
            <div className={styles.container}>
                <h2 className={styles.guideTitle}>{guide.title}</h2>
                <p className={styles.meta}>
                    Đăng bởi: {guide.createdBy?.name || "Admin"} (
                    {guide.createdBy?.role || "Quản trị viên"}) | Chuyên mục: {guide.category} |{" "}
                    {new Date(guide.createdAt).toLocaleDateString()}
                </p>
                {guide.type === "video" ? (
                    <video
                        className={styles.video}
                        src={guide.content[0]} // Lấy URL đầu tiên từ mảng content
                        controls
                        title={guide.title}
                    />
                ) : guide.type === "images" ? (
                    <div className={styles.images}>
                        {guide.content.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`${guide.title} - ${index + 1}`}
                                className={styles.image}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.article}>{guide.description}</div>
                )}
                <p className={styles.description}>{guide.description}</p>
            </div>
        </div>
    );
}

export default GuideDetail;