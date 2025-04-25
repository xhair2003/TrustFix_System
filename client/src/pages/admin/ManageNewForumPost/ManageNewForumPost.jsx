import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, moderatePost, resetError, resetSuccess } from "../../../store/actions/adminActions";
import Swal from "sweetalert2";
import { FaFileAlt, FaEye } from "react-icons/fa";
import styles from "./ManageNewForumPost.module.scss";
import Loading from "../../../component/Loading/Loading";

function ManageNewForumPost() {
    const dispatch = useDispatch();
    const { posts, loading, error, success } = useSelector((state) => state.admin);
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    // Fetch pending posts on mount
    useEffect(() => {
        dispatch(getPosts());
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

    // Handle success notifications
    useEffect(() => {
        if (success) {
            Swal.fire({
                title: "Thành công",
                text: success,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetSuccess());
            dispatch(getPosts()); // Refresh the post list
        }
    }, [dispatch, success]);

    // Handle approve action
    const handleApprove = (postId) => {
        dispatch(moderatePost(postId, "approve"));
    };

    // Handle reject action (open modal)
    const handleReject = (postId) => {
        setSelectedPostId(postId);
        setIsRejectModalOpen(true);
    };

    // Handle view details action (open modal)
    const handleViewDetails = (post) => {
        setSelectedPost(post);
        setIsDetailsModalOpen(true);
    };

    // Submit rejection with reason
    const handleSubmitRejection = () => {
        if (!rejectionReason.trim()) {
            Swal.fire({
                title: "Lỗi",
                text: "Vui lòng cung cấp lý do từ chối!",
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            return;
        }
        dispatch(moderatePost(selectedPostId, "reject", rejectionReason)).then(() => {
            setIsRejectModalOpen(false);
            setRejectionReason("");
            setSelectedPostId(null);
        });
    };

    if (loading) return <Loading />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <FaFileAlt /> Quản lý bài đăng diễn đàn mới
            </h1>
            {!loading && posts.length === 0 && (
                <p className={styles.noPosts}>Không có bài đăng nào chờ duyệt.</p>
            )}
            {posts.length > 0 && (
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableRow}>
                            <th className={styles.tableHeader}>Tiêu đề</th>
                            <th className={styles.tableHeader}>Nội dung</th>
                            <th className={styles.tableHeader}>Người đăng</th>
                            <th className={styles.tableHeader}>Ngày tạo</th>
                            <th className={styles.tableHeader}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id} className={styles.tableRow}>
                                <td className={styles.tableCell}>{post.title}</td>
                                <td className={styles.tableCell}>{post.content.substring(0, 100)}...</td>
                                <td className={styles.tableCell}>
                                    {post.user_id?.firstName} {post.user_id?.lastName} (
                                    {post.user_id?.roles?.[0]?.type === "repairman" ? "Thợ" : "Người dùng"})
                                </td>
                                <td className={styles.tableCell}>
                                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td className={styles.tableCell}>
                                    <button
                                        className={styles.viewButton}
                                        onClick={() => handleViewDetails(post)}
                                        disabled={loading}
                                    >
                                        <FaEye /> Xem
                                    </button>
                                    <button
                                        className={styles.approveButton}
                                        onClick={() => handleApprove(post._id)}
                                        disabled={loading}
                                    >
                                        Phê duyệt
                                    </button>
                                    <button
                                        className={styles.rejectButton}
                                        onClick={() => handleReject(post._id)}
                                        disabled={loading}
                                    >
                                        Từ chối
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Rejection Reason Modal */}
            {isRejectModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Lý do từ chối</h2>
                        <textarea
                            className={styles.textarea}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                            rows={4}
                        />
                        <div className={styles.modalActions}>
                            <button
                                className={styles.submitButton}
                                onClick={handleSubmitRejection}
                                disabled={loading}
                            >
                                Gửi
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setRejectionReason("");
                                    setSelectedPostId(null);
                                }}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Details Modal */}
            {isDetailsModalOpen && selectedPost && (
                <div className={styles.detailsModal}>
                    <div className={styles.detailsModalContent}>
                        <h2 className={styles.detailsModalTitle}>Chi tiết bài đăng</h2>
                        <div className={styles.detailsModalBody}>
                            <p className={styles.detailsModalField}>
                                <strong>Tiêu đề:</strong> {selectedPost.title}
                            </p>
                            <p className={styles.detailsModalField}>
                                <strong>Nội dung:</strong> {selectedPost.content}
                            </p>
                            {selectedPost.images && selectedPost.images.length > 0 && (
                                <div className={styles.detailsModalField}>
                                    <strong>Hình ảnh:</strong>
                                    <div className={styles.postImages}>
                                        {selectedPost.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Post image ${index + 1}`}
                                                className={styles.postImage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <p className={styles.detailsModalField}>
                                <strong>Người đăng:</strong> {selectedPost.user_id?.firstName}{" "}
                                {selectedPost.user_id?.lastName} (
                                {selectedPost.user_id?.roles?.[0]?.type === "repairman" ? "Thợ" : "Người dùng"})
                            </p>
                            <p className={styles.detailsModalField}>
                                <strong>Ngày tạo:</strong>{" "}
                                {new Date(selectedPost.createdAt).toLocaleString("vi-VN")}
                            </p>
                        </div>
                        <div className={styles.detailsModalActions}>
                            <button
                                className={styles.closeButton}
                                onClick={() => {
                                    setIsDetailsModalOpen(false);
                                    setSelectedPost(null);
                                }}
                                disabled={loading}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageNewForumPost;
