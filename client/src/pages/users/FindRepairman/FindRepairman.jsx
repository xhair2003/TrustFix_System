// import React, { useState, useRef, useEffect } from "react";
// import MapView from "../../../component/users/customer/FindComponent/MapView";
// import SearchBar from "../../../component/users/SearchBar/SearchBar";
// import RepairmanList from "../../../component/users/customer/FindComponent/RepairmanList";
// import { useSelector } from "react-redux";
// import "./FindRepairman.css";

// const FindRepairman = () => {
//   const [selectedRadius, setSelectedRadius] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [triggerSearch, setTriggerSearch] = useState(false);
//   const [searchData, setSearchData] = useState({});
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [storedRequestId, setStoredRequestId] = useState(localStorage.getItem('requestId'));
//   const mapSectionRef = useRef(null);

//   const { successFindRepairman, requestId, repairmanDeals } = useSelector(state => state.user);
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

//   useEffect(() => {
//     if (successFindRepairman && successFindRepairman.requestId) {
//       localStorage.setItem('requestId', successFindRepairman.requestId);
//       setStoredRequestId(successFindRepairman.requestId);
//     }
//   }, [successFindRepairman]);

//   // Log để kiểm tra
//   useEffect(() => {
//     console.log("triggerSearch:", triggerSearch);
//     console.log("repairmanDeals:", repairmanDeals);
//   }, [triggerSearch, repairmanDeals]);

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
//       {/* Luôn hiển thị results-section, chỉ thay đổi nội dung */}
//       <div className={`results-section ${isAnimating ? "animate" : triggerSearch ? "active" : ""}`}>
//         {triggerSearch ? (
//           <p>Đang tìm thợ...</p>
//         ) : repairmanDeals && repairmanDeals.length > 0 ? (
//           <RepairmanList requestId={finalRequestId} />
//         ) : (
//           <p>Không tìm thấy thợ nào.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FindRepairman;

import React, { useState, useRef, useEffect } from "react";
import MapView from "../../../component/users/customer/FindComponent/MapView";
import SearchBar from "../../../component/users/SearchBar/SearchBar";
import RepairmanList from "../../../component/users/customer/FindComponent/RepairmanList";
import { useSelector } from "react-redux";
import "./FindRepairman.css";

const FindRepairman = () => {
  const [selectedRadius, setSelectedRadius] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [storedRequestId, setStoredRequestId] = useState(localStorage.getItem('requestId'));
  const mapSectionRef = useRef(null);

  const { successFindRepairman, requestId, repairmanDeals } = useSelector(state => state.user);
  const finalRequestId = requestId || storedRequestId;

  const handleDataChange = (data) => {
    setSearchData(data);
  };

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

    setTimeout(() => setIsAnimating(false), 1500);
  };

  useEffect(() => {
    if (successFindRepairman && successFindRepairman.requestId) {
      localStorage.setItem('requestId', successFindRepairman.requestId);
      setStoredRequestId(successFindRepairman.requestId);
    }
  }, [successFindRepairman]);

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
      {/* Hiển thị results-section nếu có repairmanDeals hoặc đang tìm kiếm */}
      {(repairmanDeals && repairmanDeals.length > 0) || triggerSearch ? (
        <div className={`results-section ${isAnimating ? "animate" : triggerSearch ? "active" : ""}`}>
          {repairmanDeals && repairmanDeals.length > 0 ? (
            <RepairmanList requestId={finalRequestId} />
          ) : (
            <p>Không tìm thấy thợ nào.</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FindRepairman;