// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   dealPrice,
//   resetError,
//   resetSuccess,
// } from "../../../store/actions/userActions";
// import Loading from "../../../component/Loading/Loading";
// import Swal from "sweetalert2";
// import "./DetailRequest.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import socket from "../../../socket";
// import { getChatHistory, sendMessage, resetErrorMessage } from "../../../store/actions/messageActions";
// const DetailRequest = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { loading, errorDealPrice, successDealPrice } = useSelector((state) => state.user);
//   const { loading: loadingMessage, error, messages } = useSelector((state) => state.message);
//   const [dealPriceValue, setDealPriceValue] = useState("");
//   const { requestData, status } = location.state || {};
//   const user_id = localStorage.getItem("user_id");
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [hasNewMessage, setHasNewMessage] = useState(false); // State theo dõi tin nhắn mới
//   //console.log("messages", messages);

//   const storedDealPrices = JSON.parse(localStorage.getItem("deal_prices") || "{}");
//   const storedDealPrice = storedDealPrices[requestData.parentRequest];

//   useEffect(() => {
//     if (error) {
//       Swal.fire({
//         title: "Lỗi",
//         text: error,
//         icon: "error",
//         timer: 5000,
//         showConfirmButton: false,
//       });
//       dispatch(resetErrorMessage());
//     }
//   }, [error, dispatch]);

//   useEffect(() => {
//     if (status !== false) {
//       if (errorDealPrice) {
//         Swal.fire({
//           title: "Lỗi",
//           text: errorDealPrice,
//           icon: "error",
//           timer: 5000,
//           showConfirmButton: false,
//         });
//         dispatch(resetError());
//       }
//       if (successDealPrice) {
//         Swal.fire({
//           title: "Thành công",
//           text: successDealPrice,
//           icon: "success",
//           timer: 5000,
//           showConfirmButton: false,
//         });
//         const updatedDealPrices = {
//           ...storedDealPrices,
//           [requestData.parentRequest]: dealPriceValue,
//         };
//         const keys = Object.keys(updatedDealPrices);
//         if (keys.length > 100) {
//           delete updatedDealPrices[keys[0]];
//         }
//         localStorage.setItem("deal_prices", JSON.stringify(updatedDealPrices));
//         dispatch(resetSuccess());
//         navigate("/repairman/view-requests");
//       }
//     }
//   }, [errorDealPrice, successDealPrice, dispatch, navigate, status, dealPriceValue, requestData.parentRequest, storedDealPrices]);

//   // Lắng nghe WebSocket
//   useEffect(() => {
//     if (!requestData._id) {
//       console.warn("No request ID available for WebSocket listening.");
//       return;
//     }

//     // const handleReceiveMessage = () => {
//     //   //console.log('Deal price update received');
//     //   dispatch(getChatHistory(requestData.user_id));
//     // };

//     const handleReceiveMessage = (message) => {
//       // Kiểm tra tin nhắn từ khách (requestData.user_id) và không phải từ thợ (user_id)
//       if (message.senderId === requestData.user_id && message.senderId !== user_id) {
//         setHasNewMessage(true); // Có tin nhắn mới
//         dispatch(getChatHistory(requestData.user_id));
//       }

//     };

//     if (socket.connected) {
//       socket.on('receiveMessage', handleReceiveMessage);
//     } else {
//       console.warn('Socket not connected yet. Waiting...');
//       const onConnect = () => {
//         socket.on('receiveMessage', handleReceiveMessage);
//       };
//       socket.on('connect', onConnect);

//       return () => {
//         if (socket.connected) {
//           socket.off('receiveMessage', handleReceiveMessage);
//         }
//         socket.off('connect', onConnect);
//       };
//     }

//     return () => {
//       socket.off('receiveMessage', handleReceiveMessage);
//     };
//   }, [requestData, dispatch]);

//   const shortenAddress = (address) => {
//     const parts = address.split(", ");
//     return parts.slice(1, 4).join(", ");
//   };

//   const handleDealSubmit = () => {
//     Swal.fire({
//       title: "Xác nhận Deal giá?",
//       text: `Bạn có chắc muốn deal với giá ${dealPriceValue} VNĐ không?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Xác nhận",
//       cancelButtonText: "Hủy",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const dealData = {
//           deal_price: dealPriceValue,
//           isDeal: "true",
//         };
//         dispatch(dealPrice(requestData.parentRequest, dealData));
//       }
//     });
//   };

//   const handleCancel = () => {
//     Swal.fire({
//       title: "Xác nhận hủy bỏ?",
//       text: "Bạn có chắc muốn hủy bỏ deal giá không?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Xác nhận",
//       cancelButtonText: "Hủy",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const dealData = {
//           isDeal: "false",
//         };
//         setDealPriceValue("");
//         dispatch(dealPrice(requestData.parentRequest, dealData));
//         const updatedDealPrices = { ...storedDealPrices };
//         delete updatedDealPrices[requestData.parentRequest];
//         localStorage.setItem("deal_prices", JSON.stringify(updatedDealPrices));
//         navigate(-1);
//       }
//     });
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleClose = () => {
//     navigate(-1); // Đóng modal bằng cách quay lại trang trước
//   };

//   const handleOpenChat = () => {
//     setIsChatOpen(true);
//     setHasNewMessage(false); // Xóa chấm đỏ khi mở chat
//     dispatch(getChatHistory(requestData.user_id));
//   };

//   const handleCloseChat = () => {
//     setIsChatOpen(false);
//     setNewMessage('');
//     dispatch({ type: 'RESET_MESSAGES' }); // Thêm action để reset messages trong store
//   };

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) {
//       Swal.fire({
//         title: 'Lỗi',
//         text: 'Tin nhắn không được để trống!',
//         icon: 'error',
//         timer: 3000,
//         showConfirmButton: false,
//       });
//       return;
//     }
//     dispatch(sendMessage(requestData.user_id, newMessage, user_id));
//     setNewMessage('');
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className="modal-overlay">
//       {isChatOpen && (
//         <div className="chat-window">
//           <div className="chat-header">
//             <h3>Chat với khách hàng #{requestData.user_id.slice(-6)}</h3>
//             <button onClick={handleCloseChat} className="chat-close-button">✖</button>
//           </div>
//           <div className="chat-messages">
//             {loadingMessage && <p>Đang tải tin nhắn...</p>}
//             {messages.length === 0 && !loadingMessage && <p>Chưa có tin nhắn.</p>}
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`chat-message ${msg.senderId?.id === user_id ? 'chat-message-self' : 'chat-message-opponent'
//                   }`}
//               >
//                 <p>
//                   <strong>{msg.senderId?.id === user_id ? 'Bạn' : 'Khách hàng'}:</strong> {msg.message}
//                 </p>
//                 <span className="chat-timestamp">
//                   {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <div className="chat-input-group">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Nhập tin nhắn..."
//               className="chat-input"
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//             />
//             <button onClick={handleSendMessage} className="chat-send-button">
//               Gửi
//             </button>
//           </div>
//         </div>
//       )}


//       <div
//         className="request-detail-container"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="request-title">
//           Chi tiết đơn sửa chữa #{requestData._id.slice(-6)}
//         </h2>

//         <section className="request-section">
//           <h3>Thông tin cơ bản</h3>
//           <div className="request-info-grid">
//             <p>
//               <strong>Mô tả vấn đề:</strong> {requestData.description}
//             </p>
//             <p>
//               <strong>Khu vực:</strong> {shortenAddress(requestData.address)}
//             </p>
//             <p>
//               <strong>Ngày tạo:</strong>{" "}
//               {new Date(requestData.createdAt).toLocaleDateString('vi-VN')}
//             </p>
//             <p>
//               <strong>Trạng thái:</strong>
//               {
//                 requestData.status === "Completed" ? "Đã hoàn thành" :
//                   requestData.status === "Confirmed" ? "Đã xác nhận" :
//                     requestData.status === "Pending" ? "Đang chờ xử lý" :
//                       requestData.status === "Cancelled" ? "Đã hủy" :
//                         requestData.status === "Requesting Details" ? "Yêu cầu chi tiết" :
//                           requestData.status === "Deal price" ? "Thỏa thuận giá" :
//                             requestData.status === "Done deal price" ? "Đã chốt giá" :
//                               requestData.status === "Make payment" ? "Chờ thanh toán" :
//                                 requestData.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
//                                   requestData.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
//                                     "Trạng thái không xác định"
//               }
//             </p>
//           </div>
//         </section>

//         <section className="request-section">
//           <h3>Hình ảnh minh họa</h3>
//           <div className="image-list">
//             {requestData.image && requestData.image.length > 0 ? (
//               requestData.image.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`Ảnh ${index}`}
//                   className="request-image"
//                 />
//               ))
//             ) : (
//               <p>Không có hình ảnh.</p>
//             )}
//           </div>
//         </section>

//         {status !== false ? (
//           <section className="request-section deal-section">
//             <h3>Deal giá</h3>
//             <div className="deal-info">
//               <p>
//                 <strong>Khoảng giá đề xuất:</strong>{" "}
//                 {requestData.minPrice?.toLocaleString() || "N/A"} -{" "}
//                 {requestData.maxPrice?.toLocaleString() || "N/A"} VNĐ
//               </p>
//               <div className="deal-input-group">
//                 <input
//                   type="number"
//                   value={dealPriceValue}
//                   onChange={(e) => setDealPriceValue(e.target.value)}
//                   placeholder="Nhập giá deal (VNĐ)"
//                   className="deal-input"
//                 />
//                 <div className="deal-buttons-container">
//                   <div className="deal-buttons">
//                     <button onClick={handleDealSubmit} className="confirm-button">
//                       Xác nhận
//                     </button>
//                     <button onClick={handleCancel} className="cancel-button">
//                       Hủy bỏ
//                     </button>
//                     {/* Thêm nút chat */}
//                     <button onClick={handleOpenChat} className={`chat-button ${hasNewMessage ? 'has-new-message' : ''}`}>
//                       <span role="img" aria-label="chat">💬</span> Nhắn tin với khách hàng
//                     </button>
//                   </div>
//                   <button onClick={handleClose} className="close-button">
//                     Đóng
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//         ) : (
//           <section className="request-section deal-section">
//             <h3>Thông tin Deal</h3>
//             <div className="deal-info">
//               <p>
//                 <strong>Giá đã Deal:</strong>{" "}
//                 {storedDealPrice ? `${Number(storedDealPrice).toLocaleString()} VNĐ` : "Chưa có thông tin giá deal"}
//               </p>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 {/* Thêm nút chat */}
//                 <button onClick={handleOpenChat} className={`chat-button ${hasNewMessage ? 'has-new-message' : ''}`}>
//                   <span role="img" aria-label="chat">💬</span> Nhắn tin với khách hàng
//                 </button>
//                 <button onClick={handleBack} className="back-button" style={{ marginTop: "18px", marginLeft: "10px" }}>
//                   Trở về
//                 </button>
//               </div>
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DetailRequest;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dealPrice,
  resetError,
  resetSuccess,
} from "../../../store/actions/userActions";
import Loading from "../../../component/Loading/Loading";
import Swal from "sweetalert2";
import "./DetailRequest.css";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../../socket";
import { getChatHistory, sendMessage, resetErrorMessage } from "../../../store/actions/messageActions";

const DetailRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, errorDealPrice, successDealPrice } = useSelector((state) => state.user);
  const { loading: loadingMessage, error, messages } = useSelector((state) => state.message);
  const [dealPriceValue, setDealPriceValue] = useState("");
  const { requestData, status } = location.state || {};
  const user_id = localStorage.getItem("user_id");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  //console.log("requestData", requestData);
  const storedDealPrices = JSON.parse(localStorage.getItem("deal_prices") || "{}");
  const storedDealPrice = storedDealPrices[requestData.parentRequest];

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Lỗi",
        text: error,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetErrorMessage());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (status !== false) {
      if (errorDealPrice) {
        Swal.fire({
          title: "Lỗi",
          text: errorDealPrice,
          icon: "error",
          timer: 5000,
          showConfirmButton: false,
        });
        dispatch(resetError());
      }
      if (successDealPrice) {
        Swal.fire({
          title: "Thành công",
          text: successDealPrice,
          icon: "success",
          timer: 5000,
          showConfirmButton: false,
        });
        const updatedDealPrices = {
          ...storedDealPrices,
          [requestData.parentRequest]: dealPriceValue,
        };
        const keys = Object.keys(updatedDealPrices);
        if (keys.length > 100) {
          delete updatedDealPrices[keys[0]];
        }
        localStorage.setItem("deal_prices", JSON.stringify(updatedDealPrices));
        dispatch(resetSuccess());
        navigate("/repairman/view-requests");
      }
    }
  }, [errorDealPrice, successDealPrice, dispatch, navigate, status, dealPriceValue, requestData.parentRequest, storedDealPrices]);

  useEffect(() => {
    if (!requestData._id) {
      console.warn("No request ID available for WebSocket listening.");
      return;
    }

    const handleReceiveMessage = (message) => {
      if (message.senderId === requestData.user_id && message.senderId !== user_id) {
        setHasNewMessage(true);
      }
      dispatch(getChatHistory(requestData.user_id, null));
    };

    if (socket.connected) {
      socket.on('receiveMessage', handleReceiveMessage);
    } else {
      console.warn('Socket not connected yet. Waiting...');
      const onConnect = () => {
        socket.on('receiveMessage', handleReceiveMessage);
      };
      socket.on('connect', onConnect);

      return () => {
        if (socket.connected) {
          socket.off('receiveMessage', handleReceiveMessage);
        }
        socket.off('connect', onConnect);
      };
    }

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [requestData, dispatch]);

  const shortenAddress = (address) => {
    const parts = address.split(", ");
    return parts.slice(1, 4).join(", ");
  };

  const handleDealSubmit = () => {
    Swal.fire({
      title: "Xác nhận Deal giá?",
      text: `Bạn có chắc muốn deal với giá ${dealPriceValue} VNĐ không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const dealData = {
          deal_price: dealPriceValue,
          isDeal: "true",
        };
        dispatch(dealPrice(requestData.parentRequest, dealData));
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Xác nhận hủy bỏ?",
      text: "Bạn có chắc muốn hủy bỏ deal giá không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const dealData = {
          isDeal: "false",
        };
        setDealPriceValue("");
        dispatch(dealPrice(requestData.parentRequest, dealData));
        const updatedDealPrices = { ...storedDealPrices };
        delete updatedDealPrices[requestData.parentRequest];
        localStorage.setItem("deal_prices", JSON.stringify(updatedDealPrices));
        navigate(-1);
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setHasNewMessage(false);
    dispatch(getChatHistory(requestData.user_id, null));
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setNewMessage('');
    dispatch({ type: 'RESET_MESSAGES' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Tin nhắn không được để trống!',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }
    dispatch(sendMessage(requestData.user_id, newMessage, user_id, requestData.parentRequest)).then(() => {
      setNewMessage('');
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="modal-overlay">
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat với khách hàng #{requestData.user_id.slice(-6)}</h3>
            <button onClick={handleCloseChat} className="chat-close-button">✖</button>
          </div>
          <div className="chat-messages">
            {loadingMessage && <p>Đang tải tin nhắn...</p>}
            {messages.length === 0 && !loadingMessage && <p>Chưa có tin nhắn.</p>}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.senderId === user_id || msg.senderId?.id === user_id
                  ? 'chat-message-self'
                  : 'chat-message-opponent'
                  }`}
              >
                <p>
                  <strong>
                    {msg.senderId === user_id || msg.senderId?.id === user_id ? 'Bạn' : 'Khách hàng'}:
                  </strong>{' '}
                  {msg.message}
                </p>
                <span className="chat-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
          <div className="chat-input-group">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="chat-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="chat-send-button">
              Gửi
            </button>
          </div>
        </div>
      )}

      <div
        className="request-detail-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="request-title">
          Chi tiết đơn sửa chữa #{requestData._id.slice(-6)}
        </h2>

        <section className="request-section">
          <h3>Thông tin cơ bản</h3>
          <div className="request-info-grid">
            <p>
              <strong>Mô tả vấn đề:</strong> {requestData.description}
            </p>
            <p>
              <strong>Khu vực:</strong> {shortenAddress(requestData.address)}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(requestData.createdAt).toLocaleDateString('vi-VN')}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              {
                requestData.status === "Completed" ? "Đã hoàn thành" :
                  requestData.status === "Confirmed" ? "Đã xác nhận" :
                    requestData.status === "Pending" ? "Đang chờ xử lý" :
                      requestData.status === "Cancelled" ? "Đã hủy" :
                        requestData.status === "Requesting Details" ? "Yêu cầu chi tiết" :
                          requestData.status === "Deal price" ? "Thỏa thuận giá" :
                            requestData.status === "Done deal price" ? "Đã chốt giá" :
                              requestData.status === "Make payment" ? "Chờ thanh toán" :
                                requestData.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                                  requestData.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
                                    "Trạng thái không xác định"
              }
            </p>
          </div>
        </section>

        <section className="request-section">
          <h3>Hình ảnh minh họa</h3>
          <div className="image-list">
            {requestData.image && requestData.image.length > 0 ? (
              requestData.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Ảnh ${index}`}
                  className="request-image"
                />
              ))
            ) : (
              <p>Không có hình ảnh.</p>
            )}
          </div>
        </section>

        {status !== false ? (
          <section className="request-section deal-section">
            <h3>Deal giá</h3>
            <div className="deal-info">
              {(requestData.minPrice?.toLocaleString() !== -1 || requestData.maxPrice?.toLocaleString() !== -1) &&
                (<p>
                  <strong>Khoảng giá đề xuất:</strong>{" "}
                  {requestData.minPrice?.toLocaleString() || "N/A"} -{" "}
                  {requestData.maxPrice?.toLocaleString() || "N/A"} VNĐ
                </p>)
              }
              <div className="deal-input-group">
                <input
                  type="number"
                  value={dealPriceValue}
                  onChange={(e) => setDealPriceValue(e.target.value)}
                  placeholder="Nhập giá deal (VNĐ)"
                  className="deal-input"
                />
                <div className="deal-buttons-container">
                  <div className="deal-buttons">
                    <button onClick={handleDealSubmit} className="confirm-button">
                      Xác nhận
                    </button>
                    <button onClick={handleCancel} className="cancel-button">
                      Hủy bỏ
                    </button>
                    <button onClick={handleOpenChat} className={`chat-button ${hasNewMessage ? 'has-new-message' : ''}`}>
                      <span role="img" aria-label="chat">💬</span> Nhắn tin với khách hàng
                    </button>
                  </div>
                  <button onClick={handleClose} className="close-button">
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="request-section deal-section">
            <h3>Thông tin Deal</h3>
            <div className="deal-info">
              <p>
                <strong>Giá đã Deal:</strong>{" "}
                {storedDealPrice ? `${Number(storedDealPrice).toLocaleString()} VNĐ` : "Chưa có thông tin giá deal"}
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button onClick={handleOpenChat} className={`chat-button ${hasNewMessage ? 'has-new-message' : ''}`}>
                  <span role="img" aria-label="chat">💬</span> Nhắn tin với khách hàng
                </button>
                <button onClick={handleBack} className="back-button" style={{ marginTop: "18px", marginLeft: "10px" }}>
                  Trở về
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DetailRequest;