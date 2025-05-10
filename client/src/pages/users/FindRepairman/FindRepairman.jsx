import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapView from "../../../component/users/customer/FindComponent/MapView";
import SearchBar from "../../../component/users/SearchBar/SearchBar";
import RepairmanList from "../../../component/users/customer/FindComponent/RepairmanList";
import { viewRepairmanDeal } from "../../../store/actions/userActions.js";
import PriceBot from "./PriceBot";
import "./FindRepairman.css";
import socket from "../../../socket";

// Helper Function to format price to VND
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper Function for Debouncing
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const FindRepairman = () => {
  const dispatch = useDispatch();
  const [selectedRadius, setSelectedRadius] = useState(null);
  const [mapCenter, setMapCenter] = useState([16.047079, 108.206230]); // Default to Da Nang
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [storedRequestId, setStoredRequestId] = useState(localStorage.getItem("requestId"));
  const [hasResults, setHasResults] = useState(false);
  const [priceResponse, setPriceResponse] = useState({ minPrice: null, maxPrice: null });
  const mapSectionRef = useRef(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { errorViewRepairmanDeal, requestId, repairmanDeals, nearbyRepairmen } = useSelector((state) => state.user);
  const finalRequestId = requestId || storedRequestId;

  // Handle price response from PriceBot
  const handlePriceResponse = useCallback(({ minPrice, maxPrice }) => {
    setPriceResponse({ minPrice, maxPrice });
  }, []);

  // Geocoding Function
  const geocodeAddress = useCallback(async (address) => {
    if (!address || address.trim() === "" || address.endsWith(", ")) return;

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        console.warn("Geocoding failed or returned no results for:", address);
      }
    } catch (error) {
      console.error("Geocoding API error:", error);
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const debouncedGeocode = useCallback(debounce(geocodeAddress, 1000), [geocodeAddress]);

  const handleDataChange = useCallback(
    (data) => {
      setSearchData(data);

      const { detailAddress, wardName, districtName, cityName } = data;
      if (cityName && districtName && wardName && detailAddress) {
        const fullAddress = `${detailAddress}, ${wardName}, ${districtName}, ${cityName}, Việt Nam`;
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
    },
    [debouncedGeocode]
  );

  const smoothScrollTo = (element, duration) => {
    const start = window.scrollY;
    const targetPosition = element.getBoundingClientRect().top + start - 50;
    const distance = targetPosition - start;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, start + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  };

  const handleSearch = () => {
    const { description, serviceIndustryId, detailAddress, wardName, districtName, cityName, selectedRadius } = searchData;

    if (!description) {
      alert("Vui lòng nhập mô tả tình trạng cần sửa chữa!");
      return;
    }
    if (!serviceIndustryId) {
      alert("Vui lòng chọn loại thợ!");
      return;
    }
    if (!detailAddress || !wardName || !districtName || !cityName) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ!");
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

    if (finalRequestId) {
      dispatch(viewRepairmanDeal(finalRequestId));
    }

    setTimeout(() => setIsAnimating(false), 1500);
  };

  // Lắng nghe WebSocket
  useEffect(() => {
    if (!finalRequestId) {
      console.warn("No request ID available for WebSocket listening.");
      return;
    }

    const handleDealPriceUpdate = () => {
      dispatch(viewRepairmanDeal(finalRequestId));
    };

    if (socket.connected) {
      socket.on("dealPriceUpdate", handleDealPriceUpdate);
    } else {
      console.warn("Socket not connected yet. Waiting...");
      const onConnect = () => {
        socket.on("dealPriceUpdate", handleDealPriceUpdate);
      };
      socket.on("connect", onConnect);

      return () => {
        if (socket.connected) {
          socket.off("dealPriceUpdate", handleDealPriceUpdate);
        }
        socket.off("connect", onConnect);
      };
    }

    return () => {
      socket.off("dealPriceUpdate", handleDealPriceUpdate);
    };
  }, [finalRequestId, dispatch]);

  // Cập nhật hasResults dựa trên repairmanDeals
  useEffect(() => {
    if (repairmanDeals && repairmanDeals.length > 0) {
      setHasResults(true);
    } else {
      setHasResults(false);
    }
  }, [repairmanDeals]);

  return (
    <div className="find-repairman-container">
      <div className="search-section">
        <SearchBar
          setSelectedRadius={setSelectedRadius}
          selectedRadius={selectedRadius}
          onSearch={handleSearch}
          onDataChange={handleDataChange}
          cities={[]}
          districts={[]}
          wards={[]}
          minPrice={priceResponse.minPrice}
          maxPrice={priceResponse.maxPrice}
        />
        <PriceBot description={searchData.description} onPriceResponse={handlePriceResponse} />
        {priceResponse.minPrice !== null && priceResponse.maxPrice !== null && (
          <div className="price-response">
            {priceResponse.minPrice === -1 && priceResponse.maxPrice === -1 ? (
              <p>Không thể ước tính chi phí sửa chữa.</p>
            ) : (
              <p>
                Ước tính chi phí sửa chữa: {formatPrice(priceResponse.minPrice)} vnd -{" "}
                {formatPrice(priceResponse.maxPrice)} vnd
              </p>
            )}
          </div>
        )}
      </div>
      <div className={`map-section ${isAnimating ? "animate" : ""}`} ref={mapSectionRef}>
        <MapView
          selectedRadius={selectedRadius}
          mapCenter={mapCenter}
          triggerSearch={triggerSearch}
          setTriggerSearch={setTriggerSearch}
          isGeocoding={isGeocoding}
          nearbyRepairmen={nearbyRepairmen} // Pass nearbyRepairmen to MapView
        />
      </div>
      {hasResults ? (
        <div className={`results-section ${isAnimating ? "animate" : "active"}`}>
          <RepairmanList repairmanDeals={repairmanDeals} />
        </div>
      ) : triggerSearch ? (
        <div className={`results-section ${isAnimating ? "animate" : "active"}`}>
          <p>Không tìm thấy thợ nào.</p>
        </div>
      ) : null}
    </div>
  );
};

export default FindRepairman;