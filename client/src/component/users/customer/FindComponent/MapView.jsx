import React, { useRef, useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapView = ({ selectedRadius, setUserLocation, userLocation, triggerSearch, setTriggerSearch }) => {
  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [isLoading, setIsLoading] = useState(false);
  const [pixelPosition, setPixelPosition] = useState(null);
  const [radarProgress, setRadarProgress] = useState(0);

  const getZoomLevelFromRadius = (radius) => {
    if (!radius) return 13;
    const radiusMeters = parseInt(radius.value);
    if (radiusMeters <= 500) return 16;
    if (radiusMeters <= 1000) return 15;
    if (radiusMeters <= 2000) return 14;
    return 13;
  };

  const MapEvents = () => {
    const map = useMapEvents({
      move: () => {
        if (userLocation && mapRef.current) {
          const point = map.latLngToContainerPoint(userLocation);
          setPixelPosition({ x: point.x, y: point.y });
        }
      },
      zoomend: () => {
        setZoomLevel(map.getZoom());
        if (userLocation && mapRef.current) {
          const point = map.latLngToContainerPoint(userLocation);
          setPixelPosition({ x: point.x, y: point.y });
        }
      },
    });
    return null;
  };

  const updateUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.log("Trình duyệt không hỗ trợ Geolocation.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = [latitude, longitude];
        setUserLocation(newLocation);

        const map = mapRef.current;
        if (map) {
          const zoom = selectedRadius ? getZoomLevelFromRadius(selectedRadius) : 16;
          map.flyTo(newLocation, zoom, { duration: 1.5, easeLinearity: 0.25 });
          const point = map.latLngToContainerPoint(newLocation);
          setPixelPosition({ x: point.x, y: point.y });
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí:", error.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, [setUserLocation, selectedRadius]);

  useEffect(() => {
    updateUserLocation();

    const map = mapRef.current;
    if (map && userLocation && selectedRadius) {
      const newZoom = getZoomLevelFromRadius(selectedRadius);
      map.flyTo(userLocation, newZoom, { duration: 1.5, easeLinearity: 0.25 });
      setZoomLevel(newZoom);
    }

    return () => { };
  }, [updateUserLocation, selectedRadius]);

  useEffect(() => {
    let animationFrameId;
    const animateRadar = () => {
      setRadarProgress((prev) => {
        const next = prev + 0.01;
        return next >= 1 ? 0 : next;
      });
      animationFrameId = requestAnimationFrame(animateRadar);
    };

    if (triggerSearch && selectedRadius) {
      animationFrameId = requestAnimationFrame(animateRadar);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [triggerSearch, selectedRadius]);

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) map.setZoom(map.getZoom() - 1);
  };

  const handleStopSearch = () => {
    setTriggerSearch(false); // Dừng tìm kiếm
  };

  return (
    <div className="map-container">
      <MapContainer
        center={userLocation || [16.047079, 108.206230]}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <MapEvents />
        {userLocation && <Marker position={userLocation} icon={customIcon} />}
        {userLocation && selectedRadius && (
          <Circle
            center={userLocation}
            radius={parseInt(selectedRadius.value)}
            pathOptions={{ color: "#3388ff", fillColor: "#3388ff", fillOpacity: 0.1 }}
          />
        )}
        {triggerSearch && userLocation && selectedRadius && (
          <>
            <Circle
              center={userLocation}
              radius={parseInt(selectedRadius.value) * radarProgress}
              pathOptions={{
                color: "rgba(51, 136, 255, 0.5)",
                fillColor: "rgba(51, 136, 255, 0.2)",
                fillOpacity: 0.2 - radarProgress * 0.15,
              }}
            />
            <Circle
              center={userLocation}
              radius={parseInt(selectedRadius.value) * ((radarProgress + 0.5) % 1)}
              pathOptions={{
                color: "rgba(51, 136, 255, 0.4)",
                fillColor: "rgba(51, 136, 255, 0.1)",
                fillOpacity: 0.1 - ((radarProgress + 0.5) % 1) * 0.08,
              }}
            />
          </>
        )}
      </MapContainer>

      {triggerSearch && (
        <div className="searching-text">
          Đang tìm thợ<span className="loader-dots">...</span>
        </div>
      )}

      {triggerSearch && (
        <button className="cancel-button" onClick={handleStopSearch} title="Dừng tìm kiếm">
          ✕ Dừng tìm
        </button>
      )}

      <div className="map-controls">
        <button
          className={`control-button ${isLoading ? "loading" : ""}`}
          onClick={updateUserLocation}
          title="Định vị lại"
          disabled={isLoading}
        >
          {isLoading ? "⏳" : "📍"}
        </button>
        <button className="control-button" onClick={handleZoomIn} title="Phóng to">
          ➕
        </button>
        <button className="control-button" onClick={handleZoomOut} title="Thu nhỏ">
          ➖
        </button>
      </div>
    </div>
  );
};

export default MapView;