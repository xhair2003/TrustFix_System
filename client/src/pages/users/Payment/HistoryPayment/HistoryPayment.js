import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch và useSelector
import { fetchtHistoryPayment } from '../../../../store/actions/userActions'; // Import action
import Loading from "../../../../component/Loading/Loading";
import './HistoryPayment.css'; // Import CSS

const HistoryPayment = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const dispatch = useDispatch(); // Khởi tạo dispatch
    const { loading, paymentTransactions, error } = useSelector(state => state.user); // Lấy thông tin từ Redux

    useEffect(() => {
        dispatch(fetchtHistoryPayment()); // Gọi action để lấy lịch sử thanh toán
    }, [dispatch]);

    const totalPages = Math.ceil(paymentTransactions.length / itemsPerPage);

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
    const currentItems = paymentTransactions.slice(indexOfFirstItem, indexOfLastItem);

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
            <div className='hp-container'>
                <div className='hp-card'>
                    <h1 className='hp-title'>
                        Lịch sử thanh toán
                    </h1>
                    <div className='hp-flex-container'>
                        <div className="hp-table-container">
                            <table className="hp-table">
                                <thead>
                                    <tr>
                                        <th>Ngày thanh toán</th>
                                        <th>Mã giao dịch</th>
                                        <th>Số tiền</th>
                                        <th>Nội dung thanh toán</th>
                                        <th>Số dư</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(item.createdAt)}</td>
                                            <td>{item.payCode}</td>
                                            <td>{parseInt(item.amount).toLocaleString('vi-VN')}</td>
                                            <td>{item.content}</td>
                                            <td>{parseInt(item.balanceAfterTransact).toLocaleString('vi-VN')}</td>
                                            <td>{item.status === 1 ? 'Thành công' : 'Thất bại'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="hp-pagination">
                            <div className="hp-items-per-page">
                                <label className="hp-label">Hiển thị</label>
                                <select className="hp-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                </select>
                                <span>giao dịch mỗi trang</span>
                            </div>
                            <div className="hp-pagination-controls">
                                <button onClick={handlePreviousPage} className="hp-button" disabled={currentPage === 1}>Trước</button>
                                <span>{currentPage} trên {totalPages} trang</span>
                                <button onClick={handleNextPage} className="hp-button" disabled={currentPage === totalPages}>Sau</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryPayment;