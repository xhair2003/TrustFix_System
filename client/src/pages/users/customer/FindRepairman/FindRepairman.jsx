import React, { useState } from "react";
import FindSearchBar from "../../../../component/users/customer/FindComponent/FindSearchBar";
import MapView from "../../../../component/users/customer/FindComponent/MapView";

const FindRepairman = () => {
  const [selectedRadius, setSelectedRadius] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleSearch = () => {
    if (!userLocation) {
      alert("Vui lòng xác định vị trí của bạn trước khi tìm kiếm!");
      return;
    }
    if (!selectedRadius) {
      alert("Vui lòng chọn bán kính trước khi tìm kiếm!");
      return;
    }
    setTriggerSearch(true);
  };

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "20px" }}>
      <FindSearchBar
        setSelectedRadius={setSelectedRadius}
        selectedRadius={selectedRadius}
        onSearch={handleSearch}
      />
      <MapView
        selectedRadius={selectedRadius}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        triggerSearch={triggerSearch}
        setTriggerSearch={setTriggerSearch} // Truyền hàm để dừng radar
      />
    </div>
  );
};

export default FindRepairman;