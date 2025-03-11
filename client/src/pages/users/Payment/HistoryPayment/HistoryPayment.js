import React, { useState, useEffect } from "react";
//import axios from 'axios';
//import { useSelector } from 'react-redux';
import Loading from "../../../../component/Loading/Loading";
import './HistoryPayment.css'; // Import CSS

const HistoryPayment = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    //const token = useSelector(state => state.auth.token);
    const breadcrumbItems = []

    // Dữ liệu giả cho transactions
    const mockTransactions = [
        {
            createdAt: '2023-10-01T12:00:00Z',
            paycode: 'TX123456',
            amount: 1000000,
            content: 'Nạp tiền qua MoMo',
            balance: 2000000,
            status: 'Thành công'
        },
        {
            createdAt: '2023-10-02T12:00:00Z',
            paycode: 'TX123457',
            amount: 500000,
            content: 'Nạp tiền qua chuyển khoản',
            balance: 2500000,
            status: 'Thành công'
        },
        {
            createdAt: '2023-10-03T12:00:00Z',
            paycode: 'TX123458',
            amount: 750000,
            content: 'Nạp tiền qua thẻ tín dụng',
            balance: 1750000,
            status: 'Thất bại'
        },
        {
            createdAt: '2023-10-04T12:00:00Z',
            paycode: 'TX123459',
            amount: 2000000,
            content: 'Nạp tiền qua MoMo',
            balance: 3750000,
            status: 'Thành công'
        },
        {
            createdAt: '2023-10-05T12:00:00Z',
            paycode: 'TX123460',
            amount: 1500000,
            content: 'Nạp tiền qua chuyển khoản',
            balance: 5250000,
            status: 'Thành công'
        },
    ];

    useEffect(() => {
        // Thay thế việc gọi API bằng dữ liệu giả
        setTransactions(mockTransactions);
        setLoading(false); // Đặt loading thành false sau khi dữ liệu được gán
    }, []);

    const totalPages = Math.ceil(transactions.length / itemsPerPage);

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

    // Fetch deposit history from the API
    // useEffect(() => {
    //     const fetchDepositHistory = async () => {
    //         try {
    //             const res = await axios.get('http://localhost:5000/api/v1/user/depositHistory', {
    //                 headers: {
    //                     'token': `${token}`,
    //                 }
    //             });
    //             //console.log(res)
    //             if (res.data.err === 0) {
    //                 setTransactions(res.data.transactions);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching deposit history:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchDepositHistory();
    // }, [token]);

    // Calculate the data to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
    //console.log(currentItems);
    //console.log(transactions);
    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            {/* <Breadcrumb items={breadcrumbItems} /> */}
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
                                        <th>Ngày nạp</th>
                                        <th>Mã giao dịch</th>
                                        <th>Số tiền</th>
                                        <th >Nội dung thanh toán</th>
                                        <th>Số dư</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(item.createdAt)}</td>
                                            <td>{item.paycode}</td>
                                            <td>{parseInt(item.amount).toLocaleString('vi-VN')}</td>
                                            <td>{item.content}</td>
                                            <td>{parseInt(item.balance).toLocaleString('vi-VN')}</td>
                                            <td>{item.status}</td>
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