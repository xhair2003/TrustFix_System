// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import styles from './ManageGuides.module.scss';
// import { getGuides, addGuide, updateGuide, deleteGuide, resetError, resetSuccess } from '../../../store/actions/adminActions';
// import Loading from "../../../component/Loading/Loading";
// import Swal from "sweetalert2";

// const ManageGuides = () => {
//     const dispatch = useDispatch();
//     const { guides, loading, error, success } = useSelector((state) => state.admin);

//     // State cho tìm kiếm và modal
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [selectedGuide, setSelectedGuide] = useState(null);

//     // State cho form thêm/sửa
//     const [formData, setFormData] = useState({
//         title: '',
//         type: 'article',
//         description: '',
//         category: '',
//         tags: '',
//         content: [],
//     });

//     useEffect(() => {
//         dispatch(getGuides());
//     }, [dispatch]);

//     // Handle error notifications
//     useEffect(() => {
//         if (error) {
//             Swal.fire({
//                 title: "Lỗi",
//                 text: error,
//                 icon: "error",
//                 timer: 5000,
//                 showConfirmButton: false,
//             });
//             dispatch(resetError());
//         }
//     }, [error, dispatch]);

//     // Handle success notifications
//     useEffect(() => {
//         if (success) {
//             Swal.fire({
//                 title: "Thành công",
//                 text: success,
//                 icon: "success",
//                 timer: 5000,
//                 showConfirmButton: false,
//             });
//             dispatch(resetSuccess());
//         }
//     }, [dispatch, success]);

//     // Lọc hướng dẫn theo tiêu đề
//     const filteredGuides = guides.filter((guide) =>
//         guide.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Xử lý form thêm/sửa
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         setFormData({ ...formData, content: e.target.files });
//     };

//     const handleAddSubmit = (e) => {
//         e.preventDefault();
//         const data = new FormData();
//         data.append('title', formData.title);
//         data.append('type', formData.type);
//         data.append('description', formData.description);
//         data.append('category', formData.category);
//         data.append('tags', formData.tags);
//         for (let file of formData.content) {
//             data.append('content', file);
//         }
//         dispatch(addGuide(data)).then(() => {
//             setShowAddModal(false);
//             setFormData({
//                 title: '',
//                 type: 'article',
//                 description: '',
//                 category: '',
//                 tags: '',
//                 content: [],
//             });
//         });
//     };

//     const handleEditSubmit = (e) => {
//         e.preventDefault();
//         const data = new FormData();
//         data.append('title', formData.title);
//         data.append('type', formData.type);
//         data.append('description', formData.description);
//         data.append('category', formData.category);
//         data.append('tags', formData.tags);
//         for (let file of formData.content) {
//             data.append('content', file);
//         }
//         dispatch(updateGuide(selectedGuide._id, data)).then(() => {
//             setShowEditModal(false);
//             setSelectedGuide(null);
//         });
//     };

//     const handleDelete = (id) => {
//         if (window.confirm('Bạn có chắc muốn xóa hướng dẫn này?')) {
//             dispatch(deleteGuide(id));
//         }
//     };

//     const openEditModal = (guide) => {
//         setSelectedGuide(guide);
//         setFormData({
//             title: guide.title,
//             type: guide.type,
//             description: guide.description,
//             category: guide.category,
//             tags: Array.isArray(guide.tags)
//                 ? guide.tags.join(', ')
//                 : typeof guide.tags === 'string'
//                     ? guide.tags
//                     : '', // Nếu không phải mảng hoặc chuỗi, để rỗng
//             content: [],
//         });
//         setShowEditModal(true);
//     };

//     const openDetailModal = (guide) => {
//         setSelectedGuide(guide);
//         setShowDetailModal(true);
//     };

//     if (loading) return <Loading />;

//     return (
//         <div className={styles.container}>
//             <h2 className={styles.title}>Quản lý hướng dẫn</h2>

//             {/* Thanh tìm kiếm và nút thêm mới */}
//             <div className={styles.controls}>
//                 <div className={styles.search}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                         type="text"
//                         placeholder="Tìm kiếm theo tiêu đề..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className={styles.searchInput}
//                     />
//                 </div>
//                 <button
//                     className={styles.addButton}
//                     onClick={() => setShowAddModal(true)}
//                 >
//                     <FaPlus /> Thêm hướng dẫn
//                 </button>
//             </div>

//             {/* Bảng danh sách hướng dẫn */}
//             {loading ? (
//                 <p className={styles.loading}>Đang tải...</p>
//             ) : error ? (
//                 <p className={styles.error}>{error}</p>
//             ) : (
//                 <table className={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>STT</th>
//                             <th>Tiêu đề</th>
//                             <th>Loại</th>
//                             <th>Danh mục</th>
//                             <th>Thẻ</th>
//                             <th>Chức năng</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredGuides.map((guide, index) => (
//                             <tr key={guide._id} className={styles.row}>
//                                 <td>{index + 1}</td>
//                                 <td>{guide.title}</td>
//                                 <td>{guide.type}</td>
//                                 <td>{guide.category}</td>
//                                 <td>
//                                     {Array.isArray(guide.tags)
//                                         ? guide.tags.join(', ')
//                                         : typeof guide.tags === 'string'
//                                             ? guide.tags.split(',').map(tag => tag.trim()).join(', ')
//                                             : 'Không có thẻ'}
//                                 </td>
//                                 <td className={styles.actions}>
//                                     <button
//                                         className={styles.viewButton}
//                                         onClick={() => openDetailModal(guide)}
//                                     >
//                                         <FaEye />
//                                     </button>
//                                     <button
//                                         className={styles.editButton}
//                                         onClick={() => openEditModal(guide)}
//                                     >
//                                         <FaEdit />
//                                     </button>
//                                     <button
//                                         className={styles.deleteButton}
//                                         onClick={() => handleDelete(guide._id)}
//                                     >
//                                         <FaTrash />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//             {/* Modal thêm hướng dẫn */}
//             {showAddModal && (
//                 <div className={styles.modal}>
//                     <div className={styles.modalContent}>
//                         <h3>Thêm hướng dẫn mới</h3>
//                         <form onSubmit={handleAddSubmit}>
//                             <div className={styles.formGroup}>
//                                 <label>Tiêu đề</label>
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={formData.title}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Loại</label>
//                                 <select
//                                     name="type"
//                                     value={formData.type}
//                                     onChange={handleInputChange}
//                                     required
//                                 >
//                                     <option value="article">Bài viết</option>
//                                     <option value="video">Video</option>
//                                     <option value="images">Hình ảnh</option>
//                                 </select>
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Mô tả</label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Danh mục</label>
//                                 <input
//                                     type="text"
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Thẻ (phân cách bởi dấu phẩy)</label>
//                                 <input
//                                     type="text"
//                                     name="tags"
//                                     value={formData.tags}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Nội dung (tệp)</label>
//                                 <input
//                                     type="file"
//                                     multiple
//                                     onChange={handleFileChange}
//                                 />
//                             </div>
//                             <div className={styles.modalActions}>
//                                 <button type="submit" className={styles.submitButton}>
//                                     Thêm
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className={styles.cancelButton}
//                                     onClick={() => setShowAddModal(false)}
//                                 >
//                                     Hủy
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Modal sửa hướng dẫn */}
//             {showEditModal && selectedGuide && (
//                 <div className={styles.modal}>
//                     <div className={styles.modalContent}>
//                         <h3>Sửa hướng dẫn</h3>
//                         <form onSubmit={handleEditSubmit}>
//                             <div className={styles.formGroup}>
//                                 <label>Tiêu đề</label>
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={formData.title}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Loại</label>
//                                 <select
//                                     name="type"
//                                     value={formData.type}
//                                     onChange={handleInputChange}
//                                     required
//                                 >
//                                     <option value="article">Bài viết</option>
//                                     <option value="video">Video</option>
//                                     <option value="images">Hình ảnh</option>
//                                 </select>
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Mô tả</label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Danh mục</label>
//                                 <input
//                                     type="text"
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Thẻ (phân cách bởi dấu phẩy)</label>
//                                 <input
//                                     type="text"
//                                     name="tags"
//                                     value={formData.tags}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Nội dung (tệp mới, nếu có)</label>
//                                 <input
//                                     type="file"
//                                     multiple
//                                     onChange={handleFileChange}
//                                 />
//                             </div>
//                             <div className={styles.modalActions}>
//                                 <button type="submit" className={styles.submitButton}>
//                                     Cập nhật
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className={styles.cancelButton}
//                                     onClick={() => setShowEditModal(false)}
//                                 >
//                                     Hủy
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Modal xem chi tiết */}
//             {showDetailModal && selectedGuide && (
//                 <div className={styles.modal}>
//                     <div className={styles.modalContent}>
//                         <h3>{selectedGuide.title}</h3>
//                         <p><strong>Loại:</strong> {selectedGuide.type}</p>
//                         <p><strong>Mô tả:</strong> {selectedGuide.description}</p>
//                         <p><strong>Danh mục:</strong> {selectedGuide.category}</p>
//                         <p>
//                             <strong>Thẻ:</strong>{' '}
//                             {Array.isArray(selectedGuide.tags)
//                                 ? selectedGuide.tags.join(', ')
//                                 : typeof selectedGuide.tags === 'string'
//                                     ? selectedGuide.tags.split(',').map(tag => tag.trim()).join(', ')
//                                     : 'Không có thẻ'}
//                         </p>
//                         <div className={styles.contentPreview}>
//                             <strong>Nội dung:</strong>
//                             {selectedGuide.content.map((url, index) => (
//                                 <div key={index}>
//                                     {selectedGuide.type === 'video' ? (
//                                         <video src={url} controls className={styles.previewMedia} />
//                                     ) : (
//                                         <img src={url} alt="Content" className={styles.previewMedia} />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className={styles.modalActions}>
//                             <button
//                                 className={styles.cancelButton}
//                                 onClick={() => setShowDetailModal(false)}
//                             >
//                                 Đóng
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ManageGuides;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import styles from './ManageGuides.module.scss';
import { getGuides, addGuide, updateGuide, deleteGuide, resetError, resetSuccess } from '../../../store/actions/adminActions';
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";

const ManageGuides = () => {
    const dispatch = useDispatch();
    const { guides, loading, error, success } = useSelector((state) => state.admin);

    // State cho tìm kiếm và modal
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);

    // State cho form thêm/sửa
    const [formData, setFormData] = useState({
        title: '',
        type: 'article',
        description: '',
        category: '',
        tags: '',
        newContent: [], // File mới thêm
        existingContent: [], // URL hiện có
    });

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
        }
    }, [dispatch, success]);

    // Lọc hướng dẫn theo tiêu đề
    const filteredGuides = guides.filter((guide) =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý form thêm/sửa
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, newContent: e.target.files });
    };

    const handleRemoveExistingContent = (index) => {
        const updatedExistingContent = formData.existingContent.filter((_, i) => i !== index);
        setFormData({ ...formData, existingContent: updatedExistingContent });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('type', formData.type);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('tags', formData.tags);
        for (let file of formData.newContent) {
            data.append('content', file);
        }
        dispatch(addGuide(data)).then(() => {
            setShowAddModal(false);
            setFormData({
                title: '',
                type: 'article',
                description: '',
                category: '',
                tags: '',
                newContent: [],
                existingContent: [],
            });
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('type', formData.type);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('tags', formData.tags);
        // Gửi danh sách URL hiện có
        data.append('existingContent', JSON.stringify(formData.existingContent));
        // Gửi file mới (nếu có)
        for (let file of formData.newContent) {
            data.append('content', file);
        }
        dispatch(updateGuide(selectedGuide._id, data)).then(() => {
            setShowEditModal(false);
            setSelectedGuide(null);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa hướng dẫn này?')) {
            dispatch(deleteGuide(id));
        }
    };

    const openEditModal = (guide) => {
        setSelectedGuide(guide);
        setFormData({
            title: guide.title || '',
            type: guide.type || 'article',
            description: guide.description || '',
            category: guide.category || '',
            tags: Array.isArray(guide.tags)
                ? guide.tags.join(', ')
                : typeof guide.tags === 'string'
                    ? guide.tags
                    : '',
            newContent: [],
            existingContent: guide.content || [], // Khởi tạo với danh sách URL hiện có
        });
        setShowEditModal(true);
    };

    const openDetailModal = (guide) => {
        setSelectedGuide(guide);
        setShowDetailModal(true);
    };

    if (loading) return <Loading />;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý hướng dẫn</h2>

            {/* Thanh tìm kiếm và nút thêm mới */}
            <div className={styles.controls}>
                <div className={styles.search}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tiêu đề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <button
                    className={styles.addButton}
                    onClick={() => setShowAddModal(true)}
                >
                    <FaPlus /> Thêm hướng dẫn
                </button>
            </div>

            {/* Bảng danh sách hướng dẫn */}
            {loading ? (
                <p className={styles.loading}>Đang tải...</p>
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Loại</th>
                            <th>Chuyên mục</th>
                            <th>Thẻ</th>
                            <th>Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuides.map((guide, index) => (
                            <tr key={guide._id} className={styles.row}>
                                <td>{index + 1}</td>
                                <td>{guide.title}</td>
                                <td>{guide.type}</td>
                                <td>{guide.category}</td>
                                <td>
                                    {Array.isArray(guide.tags)
                                        ? guide.tags.join(', ')
                                        : typeof guide.tags === 'string'
                                            ? guide.tags.split(',').map(tag => tag.trim()).join(', ')
                                            : 'Không có thẻ'}
                                </td>
                                <td className={styles.actions}>
                                    <button
                                        className={styles.viewButton}
                                        onClick={() => openDetailModal(guide)}
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => openEditModal(guide)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(guide._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal thêm hướng dẫn */}
            {showAddModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Thêm hướng dẫn mới</h3>
                        <form onSubmit={handleAddSubmit}>
                            <div className={styles.formGroup}>
                                <label>Tiêu đề</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Loại</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="article">Bài viết</option>
                                    <option value="video">Video</option>
                                    <option value="images">Hình ảnh</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mô tả</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Chuyên mục</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Thẻ (phân cách bởi dấu phẩy)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nội dung (tệp)</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.submitButton}>
                                    Thêm
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal sửa hướng dẫn */}
            {showEditModal && selectedGuide && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Sửa hướng dẫn</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className={styles.formGroup}>
                                <label>Tiêu đề</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Loại</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="article">Bài viết</option>
                                    <option value="video">Video</option>
                                    <option value="images">Hình ảnh</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mô tả</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Chuyên mục</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Thẻ (phân cách bởi dấu phẩy)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ảnh/Video hiện có</label>
                                {formData.existingContent.length > 0 ? (
                                    <div className={styles.contentPreview}>
                                        {formData.existingContent.map((url, index) => (
                                            <div key={index} className={styles.contentItem}>
                                                {formData.type === 'video' ? (
                                                    <video
                                                        src={url}
                                                        controls
                                                        className={styles.previewMedia}
                                                    />
                                                ) : (
                                                    <img
                                                        src={url}
                                                        alt="Content"
                                                        className={styles.previewMedia}
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    className={styles.removeButton}
                                                    onClick={() => handleRemoveExistingContent(index)}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Không có Ảnh/Video hiện có</p>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ảnh/Video mới</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.submitButton}>
                                    Cập nhật
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal xem chi tiết */}
            {showDetailModal && selectedGuide && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{selectedGuide.title}</h3>
                        <p><strong>Loại:</strong> {selectedGuide.type}</p>
                        <p><strong>Mô tả:</strong> {selectedGuide.description}</p>
                        <p><strong>Chuyên mục:</strong> {selectedGuide.category}</p>
                        <p>
                            <strong>Thẻ:</strong>{' '}
                            {Array.isArray(selectedGuide.tags)
                                ? selectedGuide.tags.join(', ')
                                : typeof selectedGuide.tags === 'string'
                                    ? selectedGuide.tags.split(',').map(tag => tag.trim()).join(', ')
                                    : 'Không có thẻ'}
                        </p>
                        {selectedGuide.content && selectedGuide.content.length > 0 && (
                            <div className={styles.contentPreview}>
                                <strong>Nội dung:</strong>
                                {selectedGuide.content.map((url, index) => (
                                    <div key={index}>
                                        {selectedGuide.type === 'video' ? (
                                            <video src={url} controls className={styles.previewMedia} />
                                        ) : (
                                            <img src={url} alt="Content" className={styles.previewMedia} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowDetailModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGuides;