// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import MapView from "../../../component/users/customer/FindComponent/MapView";
// import SearchBar from "../../../component/users/SearchBar/SearchBar";
// import RepairmanList from "../../../component/users/customer/FindComponent/RepairmanList";
// import { viewRepairmanDeal } from "../../../store/actions/userActions.js";
// import "./FindRepairman.css";
// import socket from "../../../socket"; // Import socket

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

//   // Xử lý dữ liệu tìm kiếm từ SearchBar
//   const handleDataChange = (data) => {
//     setSearchData(data);
//   };

//   // Hàm cuộn mượt mà tới section bản đồ
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

//   // Xử lý sự kiện tìm kiếm
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

//     // Gọi API viewRepairmanDeal nếu cần
//     if (finalRequestId) {
//       dispatch(viewRepairmanDeal(finalRequestId));
//     }

//     setTimeout(() => setIsAnimating(false), 1500);
//   };

//   // Lắng nghe WebSocket và gọi API khi có thông báo
//   useEffect(() => {
//     if (finalRequestId) {
//       socket.on('dealPriceUpdate', () => {
//         console.log('Deal price update received');
//         dispatch(viewRepairmanDeal(finalRequestId)); // Gọi API để lấy danh sách mới nhất
//       });
//     }

//     return () => {
//       socket.off('dealPriceUpdate');
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
//       {
//         repairmanDeals && repairmanDeals.length > 0 ? (
//           <div className={`results-section ${isAnimating ? "animate" : triggerSearch ? "active" : ""}`}>
//             <RepairmanList repairmanDeals={repairmanDeals} />
//           </div>
//         ) : triggerSearch ? (
//           <div className={`results-section ${isAnimating ? "animate" : "active"}`}>
//             <p>Không tìm thấy thợ nào.</p>
//           </div>
//         ) : null
//       }
//     </div>
//   );
// };

// export default FindRepairman;
// FindRepairman.jsx modifications:

import React, { useState, useRef, useEffect, useCallback } from "react"; // Add useCallback
import { useDispatch, useSelector } from "react-redux";
import MapView from "../../../component/users/customer/FindComponent/MapView";
import SearchBar from "../../../component/users/SearchBar/SearchBar";
import RepairmanList from "../../../component/users/customer/FindComponent/RepairmanList";
import { viewRepairmanDeal } from "../../../store/actions/userActions.js";
import "./FindRepairman.css";
import socket from "../../../socket";

// --- Helper Function for Debouncing ---
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
// --- End Helper ---


const FindRepairman = () => {
  const dispatch = useDispatch();
  const [selectedRadius, setSelectedRadius] = useState(null);
  // Rename userLocation to mapCenter and initialize with a default (e.g., Da Nang)
  const [mapCenter, setMapCenter] = useState([16.047079, 108.206230]);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [storedRequestId, setStoredRequestId] = useState(localStorage.getItem("requestId"));
  const mapSectionRef = useRef(null);
  const [isGeocoding, setIsGeocoding] = useState(false); // Add state for geocoding status

  const { errorViewRepairmanDeal, requestId, repairmanDeals } = useSelector((state) => state.user);
  const finalRequestId = requestId || storedRequestId;

  // --- Geocoding Function ---
  const geocodeAddress = useCallback(async (address) => {
    if (!address || address.trim() === "" || address.endsWith(', ')) return; // Basic check

    setIsGeocoding(true);
    console.log(`Geocoding address: ${address}`);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log(`Geocoded successfully: [${lat}, ${lon}]`);
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        console.warn("Geocoding failed or returned no results for:", address);
        // Optionally keep the previous center or set a default
      }
    } catch (error) {
      console.error("Geocoding API error:", error);
    } finally {
      setIsGeocoding(false);
    }
  }, []); // useCallback to memoize

  // Debounce the geocoding function
  const debouncedGeocode = useCallback(debounce(geocodeAddress, 1000), [geocodeAddress]); // 1 second delay


  // Xử lý dữ liệu tìm kiếm từ SearchBar
  const handleDataChange = useCallback((data) => {
    setSearchData(data);

    // Construct address string for geocoding
    const { detailAddress, wardName, districtName, cityName } = data; // Assuming SearchBar sends names now
    if (cityName && districtName && wardName && detailAddress) {
      const fullAddress = `${detailAddress}, ${wardName}, ${districtName}, ${cityName}, Việt Nam`;
      // Call debounced geocoding
      debouncedGeocode(fullAddress);
    } else if (cityName && districtName && wardName) {
      const partialAddress = `${wardName}, ${districtName}, ${cityName}, Việt Nam`;
      debouncedGeocode(partialAddress);
    } else if (cityName && districtName) {
      const partialAddress = `${districtName}, ${cityName}, Việt Nam`;
      debouncedGeocode(partialAddress);
    } else if (cityName) {
      const partialAddress = `${cityName}, Việt Nam`;
      debouncedGeocode(partialAddress);
    }
  }, [debouncedGeocode]); // Add debouncedGeocode dependency

  // ... (smoothScrollTo remains the same) ...
  const smoothScrollTo = (element, duration) => {
    // ... (implementation)
    const start = window.scrollY;
    const targetPosition = element.getBoundingClientRect().top + start - 50; // Adjust offset if needed
    const distance = targetPosition - start;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      // Use an easing function (e.g., easeInOutQuad)
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, start + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  };

  // Xử lý sự kiện tìm kiếm
  const handleSearch = () => {
    // Validation logic remains largely the same, checking searchData
    const { description, serviceIndustryId, detailAddress, ward, district, city, selectedRadius } = searchData;

    // Use mapCenter instead of userLocation for validation if needed,
    // though address fields are the primary check now.
    // if (!mapCenter) {
    //   alert("Vui lòng cung cấp địa chỉ hợp lệ!");
    //   return;
    // }

    if (!description) {
      alert("Vui lòng nhập mô tả tình trạng cần sửa chữa!");
      return;
    }
    if (!serviceIndustryId) {
      alert("Vui lòng chọn loại thợ!");
      return;
    }
    // Make sure address fields used in SearchBar's handleSearchClick are present
    if (!detailAddress || !searchData.wardName || !searchData.districtName || !searchData.cityName) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ!");
      return;
    }
    // if (!ward) { // Check ID if still needed by API
    //   alert("Vui lòng chọn phường/xã!");
    //   return;
    // }
    // if (!district) { // Check ID if still needed by API
    //   alert("Vui lòng chọn quận/huyện!");
    //   return;
    // }
    // if (!city) { // Check ID if still needed by API
    //   alert("Vui lòng chọn tỉnh/thành phố!");
    //   return;
    // }
    if (!selectedRadius) {
      alert("Vui lòng chọn bán kính trước khi tìm kiếm!");
      return;
    }

    setTriggerSearch(true);
    setIsAnimating(true);

    if (mapSectionRef.current) {
      smoothScrollTo(mapSectionRef.current, 1500);
    }

    // Dispatch the findRepairman action (ensure SearchBar passes correct data for this)
    // The findRepairman action likely still needs IDs, so SearchBar needs to manage both names (for display/geocode) and IDs (for API)
    // Or modify the findRepairman action/API to accept names. Let's assume SearchBar handles this for now.


    // Gọi API viewRepairmanDeal nếu cần
    if (finalRequestId) {
      dispatch(viewRepairmanDeal(finalRequestId));
    }

    setTimeout(() => setIsAnimating(false), 1500);
  };

  // Lắng nghe WebSocket và gọi API khi có thông báo
  useEffect(() => {
    if (finalRequestId) {
      socket.on('dealPriceUpdate', () => {
        console.log('Deal price update received');
        dispatch(viewRepairmanDeal(finalRequestId)); // Gọi API để lấy danh sách mới nhất
      });
    }

    return () => {
      socket.off('dealPriceUpdate');
    };
  }, [finalRequestId, dispatch]);

  return (
    <div className="find-repairman-container">
      <div className="search-section">
        <SearchBar
          setSelectedRadius={setSelectedRadius}
          selectedRadius={selectedRadius}
          onSearch={handleSearch} // handleSearch triggers the actual API call via dispatch in SearchBar
          onDataChange={handleDataChange} // Pass address data up for geocoding
          cities={[]} // Pass fetched cities/districts/wards if SearchBar doesn't fetch them itself
          districts={[]}
          wards={[]}
        />
      </div>
      {/* Pass mapCenter instead of userLocation */}
      {/* Pass isGeocoding to potentially show a loading indicator on the map */}
      <div className={`map-section ${isAnimating ? "animate" : ""}`} ref={mapSectionRef}>
        <MapView
          selectedRadius={selectedRadius}
          mapCenter={mapCenter} // Changed prop name
          // Remove setUserLocation
          triggerSearch={triggerSearch}
          setTriggerSearch={setTriggerSearch}
          isGeocoding={isGeocoding} // Pass geocoding status
        />
      </div>
      {
        repairmanDeals && repairmanDeals.length > 0 ? (
          <div className={`results-section ${isAnimating ? "animate" : triggerSearch ? "active" : ""}`}>
            <RepairmanList repairmanDeals={repairmanDeals} />
          </div>
        ) : triggerSearch ? (
          <div className={`results-section ${isAnimating ? "animate" : "active"}`}>
            <p>Không tìm thấy thợ nào.</p> { /* Consider adding "trong khu vực đã chọn." */}
          </div>
        ) : null
      }
    </div>
  );
};

export default FindRepairman;
