// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import MapView from "../../../component/users/customer/FindComponent/MapView";
// import SearchBar from "../../../component/users/SearchBar/SearchBar";
// import RepairmanList from "../../../component/users/customer/FindComponent/RepairmanList";
// import { viewRepairmanDeal } from "../../../store/actions/userActions.js";
// import io from "socket.io-client"; // Import Socket.IO client
// import "./FindRepairman.css";

// const socket = io("http://your-server-url"); // Thay bằng URL server của bạn

// const FindRepairman = () => {
//   const dispatch = useDispatch();
//   const [selectedRadius, setSelectedRadius] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [triggerSearch, setTriggerSearch] = useState(false);
//   const [searchData, setSearchData] = useState({});
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [storedRequestId, setStoredRequestId] = useState(localStorage.getItem("requestId"));
//   const mapSectionRef = useRef(null);

//   const { errorViewRepairmanDeal, requestId, repairmanDeals } = useSelector((state) => state.user);
//   const finalRequestId = requestId || storedRequestId;

//   const handleDataChange = (data) => {
//     setSearchData(data);
//   };

//   const smoothScrollTo = (element, duration) => {
//     const start = window.scrollY;
//     const targetPosition = element.getBoundingClientRect().top + start - 50;
//     const distance = targetPosition - start;
//     let startTime = null;

//     const animation = (currentTime) => {
//       if (!startTime) startTime = currentTime;
//       const timeElapsed = currentTime - startTime;
//       const progress = Math.min(timeElapsed / duration, 1);
//       const ease = progress * (2 - progress);

//       window.scrollTo(0, start + distance * ease);

//       if (timeElapsed < duration) {
//         requestAnimationFrame(animation);
//       }
//     };

//     requestAnimationFrame(animation);
//   };

//   const handleSearch = () => {
//     const { description, serviceIndustryId, detailAddress, ward, district, city, selectedRadius } = searchData;

//     if (!userLocation) {
//       alert("Vui lòng xác định vị trí của bạn trước khi tìm kiếm!");
//       return;
//     }
//     if (!description) {
//       alert("Vui lòng nhập mô tả tình trạng cần sửa chữa!");
//       return;
//     }
//     if (!serviceIndustryId) {
//       alert("Vui lòng chọn loại thợ!");
//       return;
//     }
//     if (!detailAddress) {
//       alert("Vui lòng nhập số nhà và tên đường!");
//       return;
//     }
//     if (!ward) {
//       alert("Vui lòng chọn phường/xã!");
//       return;
//     }
//     if (!district) {
//       alert("Vui lòng chọn quận/huyện!");
//       return;
//     }
//     if (!city) {
//       alert("Vui lòng chọn tỉnh/thành phố!");
//       return;
//     }
//     if (!selectedRadius) {
//       alert("Vui lòng chọn bán kính trước khi tìm kiếm!");
//       return;
//     }

//     setTriggerSearch(true);
//     setIsAnimating(true);

//     if (mapSectionRef.current) {
//       smoothScrollTo(mapSectionRef.current, 1500);
//     }

//     setTimeout(() => setIsAnimating(false), 1500);
//   };

//   // Lắng nghe sự kiện từ WebSocket
//   useEffect(() => {
//     if (finalRequestId) {
//       socket.on(`dealPriceUpdate_${finalRequestId}`, () => {
//         dispatch(viewRepairmanDeal(finalRequestId)); // Gọi API khi có deal giá mới
//       });
//     }

//     return () => {
//       socket.off(`dealPriceUpdate_${finalRequestId}`);
//     };
//   }, [finalRequestId, dispatch]);

//   return (
//     <div className="find-repairman-container">
//       <div className="search-section">
//         <SearchBar
//           setSelectedRadius={setSelectedRadius}
//           selectedRadius={selectedRadius}
//           onSearch={handleSearch}
//           onDataChange={handleDataChange}
//         />
//       </div>
//       <div className={`map-section ${isAnimating ? "animate" : ""}`} ref={mapSectionRef}>
//         <MapView
//           selectedRadius={selectedRadius}
//           setUserLocation={setUserLocation}
//           userLocation={userLocation}
//           triggerSearch={triggerSearch}
//           setTriggerSearch={setTriggerSearch}
//         />
//       </div>
//       {repairmanDeals && repairmanDeals.length > 0 ? (
//         <div className={`results-section ${isAnimating ? "animate" : triggerSearch ? "active" : ""}`}>
//           <RepairmanList repairmanDeals={repairmanDeals} />
//         </div>
//       ) : triggerSearch ? (
//         <div className={`results-section ${isAnimating ? "animate" : "active"}`}>
//           <p>Không tìm thấy thợ nào.</p>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default FindRepairman;


import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapView from "../../../component/users/customer/FindComponent/MapView";
import SearchBar from "../../../component/users/SearchBar/SearchBar";
import RepairmanList from "../../../component/users/customer/FindComponent/RepairmanList";
import { viewRepairmanDeal } from "../../../store/actions/userActions.js";
import "./FindRepairman.css";

const FindRepairman = () => {
  const dispatch = useDispatch();
  const [selectedRadius, setSelectedRadius] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [storedRequestId, setStoredRequestId] = useState(localStorage.getItem("requestId"));
  const mapSectionRef = useRef(null);

  const { errorViewRepairmanDeal, requestId, repairmanDeals } = useSelector((state) => state.user);
  const finalRequestId = requestId || storedRequestId;

  // Xử lý dữ liệu tìm kiếm từ SearchBar
  const handleDataChange = (data) => {
    setSearchData(data);
  };

  // Hàm cuộn mượt mà tới section bản đồ
  const smoothScrollTo = (element, duration) => {
    const start = window.scrollY;
    const targetPosition = element.getBoundingClientRect().top + start - 50;
    const distance = targetPosition - start;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress * (2 - progress);

      window.scrollTo(0, start + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  // Xử lý sự kiện tìm kiếm
  const handleSearch = () => {
    const { description, serviceIndustryId, detailAddress, ward, district, city, selectedRadius } = searchData;

    if (!userLocation) {
      alert("Vui lòng xác định vị trí của bạn trước khi tìm kiếm!");
      return;
    }
    if (!description) {
      alert("Vui lòng nhập mô tả tình trạng cần sửa chữa!");
      return;
    }
    if (!serviceIndustryId) {
      alert("Vui lòng chọn loại thợ!");
      return;
    }
    if (!detailAddress) {
      alert("Vui lòng nhập số nhà và tên đường!");
      return;
    }
    if (!ward) {
      alert("Vui lòng chọn phường/xã!");
      return;
    }
    if (!district) {
      alert("Vui lòng chọn quận/huyện!");
      return;
    }
    if (!city) {
      alert("Vui lòng chọn tỉnh/thành phố!");
      return;
    }
    if (!selectedRadius) {
      alert("Vui lòng chọn bán kính trước khi tìm kiếm!");
      return;
    }

    setTriggerSearch(true);
    setIsAnimating(true);

    if (mapSectionRef.current) {
      smoothScrollTo(mapSectionRef.current, 1500);
    }

    // Gọi API viewRepairmanDeal nếu cần
    if (finalRequestId) {
      dispatch(viewRepairmanDeal(finalRequestId));
    }

    setTimeout(() => setIsAnimating(false), 1500);
  };

  return (
    <div className="find-repairman-container">
      <div className="search-section">
        <SearchBar
          setSelectedRadius={setSelectedRadius}
          selectedRadius={selectedRadius}
          onSearch={handleSearch}
          onDataChange={handleDataChange}
        />
      </div>
      <div className={`map-section ${isAnimating ? "animate" : ""}`} ref={mapSectionRef}>
        <MapView
          selectedRadius={selectedRadius}
          setUserLocation={setUserLocation}
          userLocation={userLocation}
          triggerSearch={triggerSearch}
          setTriggerSearch={setTriggerSearch}
        />
      </div>
      {
        repairmanDeals && repairmanDeals.length > 0 ? (
          <div className={`results-section ${isAnimating ? "animate" : triggerSearch ? "active" : ""}`}>
            <RepairmanList repairmanDeals={repairmanDeals} />
          </div>
        ) : triggerSearch ? (
          <div className={`results-section ${isAnimating ? "animate" : "active"}`}>
            <p>Không tìm thấy thợ nào.</p>
          </div>
        ) : null
      }
    </div>
  );
};

export default FindRepairman;