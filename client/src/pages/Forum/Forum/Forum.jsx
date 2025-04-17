import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ForumList from "../../../component/Forum/ForumList/ForumList";
import PostModal from "../../../component/Forum/PostModal/PostModal";
import { fetchPosts, createPost, getServiceIndustryTypes, resetError, resetSuccess } from "../../../store/actions/userActions";
import styles from "./Forum.module.scss";
import Swal from "sweetalert2";
import Loading from "../../../component/Loading/Loading";

function Forum() {
    const dispatch = useDispatch();
    const { posts, loading, error, serviceTypes, success } = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedServiceIndustry, setSelectedServiceIndustry] = useState("");

    // Gọi API để lấy danh sách loại thợ khi component mount
    useEffect(() => {
        dispatch(getServiceIndustryTypes()); // Dispatch action để lấy dữ liệu serviceTypes
    }, [dispatch]);

    // Fetch posts on component mount
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: success,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetSuccess()); // Reset customer request state
                setIsModalOpen(false); // của tạo bài mới 
                dispatch(fetchPosts()); // của tạo bài mới
            });
        }
    }, [success, dispatch]);
    // Handle errorViewRequest with Swal
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset view request state
            });
        }
    }, [error, dispatch]);

    // Handle post creation
    const handleCreatePost = (newPost) => {
        dispatch(createPost(newPost));
    };

    // Filter posts based on search term and service industry
    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedServiceIndustry ? post.serviceIndustry_id === selectedServiceIndustry : true)
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
                        disabled={loading}
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
                        value={selectedServiceIndustry}
                        onChange={(e) => setSelectedServiceIndustry(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {serviceTypes.map((industry) => (
                            <option key={industry._id} value={industry._id}>
                                {industry.type}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && <Loading />}

                <ForumList posts={filteredPosts} />
                {isModalOpen && (
                    <PostModal
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleCreatePost}
                        serviceIndustries={serviceTypes}
                    />
                )}
            </div>
        </div>
    );
}

export default Forum;