import React, { useState, useEffect } from "react";
//import axios from 'axios';
//import { useSelector } from 'react-redux';
import Loading from "../../../../component/Loading";
import './DepositHistory.css'; // Import CSS

const DepositHistory = () => {
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
            status: 'Thành công'
        },
        {
            createdAt: '2023-10-02T12:00:00Z',
            paycode: 'TX123457',
            amount: 500000,
            status: 'Thành công'
        },
        {
            createdAt: '2023-10-03T12:00:00Z',
            paycode: 'TX123458',
            amount: 750000,
            status: 'Thất bại'
        },
        {
            createdAt: '2023-10-04T12:00:00Z',
            paycode: 'TX123459',
            amount: 2000000,
            status: 'Thành công'
        },
        {
            createdAt: '2023-10-05T12:00:00Z',
            paycode: 'TX123460',
            amount: 1500000,
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
            <div className='container'>
                <div className='card'>
                    <h1 className='title'>
                        Lịch sử nạp tiền
                    </h1>
                    <div className='flex-container'>
                        <div className="table-container">
                            <table className="table">
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
                                            <td>{item.paycode}</td>
                                            <td>{item.paycode.startsWith('MOMO') ? 'MoMo' : 'Chuyển khoản'}</td>
                                            <td>{parseInt(item.amount).toLocaleString('vi-VN')}</td>
                                            <td>{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination">
                            <div className="items-per-page">
                                <label className="label">Hiển thị</label>
                                <select className="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                </select>
                                <span>giao dịch mỗi trang</span>
                            </div>
                            <div className="pagination-controls">
                                <button onClick={handlePreviousPage} className="button" disabled={currentPage === 1}>Trước</button>
                                <span>{currentPage} trên {totalPages} trang</span>
                                <button onClick={handleNextPage} className="button" disabled={currentPage === totalPages}>Sau</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepositHistory;