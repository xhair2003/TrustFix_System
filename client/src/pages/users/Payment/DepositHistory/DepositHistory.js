import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch và useSelector
import { fetchDepositHistory } from '../../../../store/actions/userActions'; // Import action
import Loading from "../../../../component/Loading/Loading";
import './DepositHistory.css'; // Import CSS

const DepositHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const dispatch = useDispatch(); // Khởi tạo dispatch
    const { loading, depositeTransactions, error } = useSelector(state => state.user); // Lấy thông tin từ Redux

    useEffect(() => {
        dispatch(fetchDepositHistory()); // Gọi action để lấy lịch sử nạp tiền
    }, [dispatch]);

    const totalPages = Math.ceil(depositeTransactions.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Calculate the data to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = depositeTransactions.slice(indexOfFirstItem, indexOfLastItem);

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>; // Hiển thị lỗi nếu có
    }

    return (
        <div>
            {/* <Breadcrumb items={breadcrumbItems} /> */}
            <div className='dh-container'>
                <div className='dh-card'>
                    <h1 className='dh-title'>
                        Lịch sử nạp tiền
                    </h1>
                    <div className='dh-flex-container'>
                        <div className="dh-table-container">
                            <table className="dh-table">
                                <thead>
                                    <tr>
                                        <th>Ngày nạp</th>
                                        <th>Mã giao dịch</th>
                                        <th>Phương thức</th>
                                        <th>Số tiền</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(item.createdAt)}</td>
                                            <td>{item.payCode}</td>
                                            <td>{item.payCode.startsWith('PAY') ? 'PayOS' : 'MOMO'}</td>
                                            <td>{parseInt(item.amount).toLocaleString('vi-VN')}</td>
                                            <td>{item.status === 1 ? 'Thành công' : 'Thất bại'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="dh-pagination">
                            <div className="dh-items-per-page">
                                <label className="dh-label">Hiển thị</label>
                                <select className="dh-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                </select>
                                <span>giao dịch mỗi trang</span>
                            </div>
                            <div className="dh-pagination-controls">
                                <button onClick={handlePreviousPage} className="dh-button" disabled={currentPage === 1}>Trước</button>
                                <span>{currentPage} trên {totalPages} trang</span>
                                <button onClick={handleNextPage} className="dh-button" disabled={currentPage === totalPages}>Sau</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepositHistory;