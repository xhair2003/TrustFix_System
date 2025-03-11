import React from "react";
import Select from "react-select";
import "./FindSearchBar.css";

const FindSearchBar = ({ selectedRadius, setSelectedRadius, onSearch }) => {
  const categoryOptions = [
    { value: "category_1", label: "Sửa điện máy" },
    { value: "category_2", label: "Sửa điện lạnh" },
    { value: "category_3", label: "Sửa Xe" },
  ];

  const radiusOptions = [
    { value: "500", label: "500 m" },
    { value: "1000", label: "1 km" },
    { value: "2000", label: "2 km" },
    { value: "5000", label: "5 km" },
  ];

  const wardOptions = [
    { value: "ward1", label: "Hòa Khánh Nam" },
    { value: "ward2", label: "Hòa Khánh Bắc" },
    { value: "ward3", label: "Hòa Hiệp Nam" },
  ];

  const districtOptions = [
    { value: "district1", label: "Quận Liên Chiểu" },
    { value: "district2", label: "Quận Hải Châu" },
  ];

  const cityOptions = [
    { value: "hcm", label: "TP. Hồ Chí Minh" },
    { value: "hn", label: "Hà Nội" },
    { value: "dn", label: "Đà Nẵng" },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedWard, setSelectedWard] = React.useState(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState(null);
  const [selectedCity, setSelectedCity] = React.useState(null);

  const handleSearch = () => {
    const searchData = {
      category: selectedCategory?.value,
      radius: selectedRadius?.value,
      ward: selectedWard?.value,
      district: selectedDistrict?.value,
      city: selectedCity?.value,
    };
    console.log("Search data:", searchData);
    onSearch(); // Gọi hàm tìm kiếm từ props
  };

  return (
    <div className="find-search-bar">
      <div className="search-form">
        <div className="Find-form-group">
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Chọn danh mục..."
            isClearable
          />
        </div>
        <div className="Find-form-group">
          <Select
            options={radiusOptions}
            value={selectedRadius}
            onChange={setSelectedRadius}
            placeholder="Chọn bán kính..."
            isClearable
          />
        </div>
        <div className="Find-form-group">
          <Select
            options={wardOptions}
            value={selectedWard}
            onChange={setSelectedWard}
            placeholder="Chọn phường/xã..."
            isClearable
          />
        </div>
        <div className="Find-form-group">
          <Select
            options={districtOptions}
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            placeholder="Chọn quận/huyện..."
            isClearable
          />
        </div>
        <div className="Find-form-group">
          <Select
            options={cityOptions}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Chọn tỉnh/thành phố..."
            isClearable
          />
        </div>
        <button className="Find-button" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default FindSearchBar;