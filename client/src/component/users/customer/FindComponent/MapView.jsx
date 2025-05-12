import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css";

// Customer icon (default marker)
const customerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Repairman icon (person-shaped icon)
const repairmanIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3514/3514997.png', // Person icon from Flaticon
  iconSize: [32, 32], // Adjust size to fit map
  iconAnchor: [16, 32], // Center bottom of icon
  popupAnchor: [0, -32], // Popup above icon
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41]
});

const MapView = ({ selectedRadius, mapCenter, triggerSearch, setTriggerSearch, isGeocoding, nearbyRepairmen }) => {
  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [pixelPosition, setPixelPosition] = useState(null);
  const [radarProgress, setRadarProgress] = useState(0);
  const [repairmenLocations, setRepairmenLocations] = useState([]);

  console.log("MapView: nearbyRepairmen", nearbyRepairmen);

  // Geocode repairmen addresses
  useEffect(() => {
    if (!nearbyRepairmen || nearbyRepairmen.length === 0) {
      setRepairmenLocations([]);
      return;
    }

    const geocodeRepairmen = async () => {
      const locations = await Promise.all(
        nearbyRepairmen.map(async (repairman) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(repairman.address)}&limit=1`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              return {
                ...repairman,
                coordinates: [parseFloat(lat), parseFloat(lon)]
              };
            }
            return null;
          } catch (error) {
            console.error(`Geocoding failed for address ${repairman.address}:`, error);
            return null;
          }
        })
      );
      setRepairmenLocations(locations.filter(location => location !== null));
    };

    geocodeRepairmen();
  }, [nearbyRepairmen]);

  // Adjust zoom level based on radius
  const getZoomLevelFromRadius = (radius) => {
    if (!radius) return 13;
    const radiusMeters = parseInt(radius.value);
    if (radiusMeters <= 500) return 16;
    if (radiusMeters <= 1000) return 15;
    if (radiusMeters <= 2000) return 14;
    if (radiusMeters <= 5000) return 13;
    if (radiusMeters <= 10000) return 12;
    return 11;
  };

  // Fly to new mapCenter or adjust zoom
  useEffect(() => {
    const map = mapRef.current;
    if (map && mapCenter) {
      const newZoom = getZoomLevelFromRadius(selectedRadius);
      const currentCenter = map.getCenter();
      const tolerance = 0.0001;
      if (
        Math.abs(currentCenter.lat - mapCenter[0]) > tolerance ||
        Math.abs(currentCenter.lng - mapCenter[1]) > tolerance ||
        map.getZoom() !== newZoom
      ) {
        map.flyTo(mapCenter, newZoom, { duration: 1.5, easeLinearity: 0.25 });
      }
    }
  }, [mapCenter, selectedRadius]);

  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => {
        if (mapCenter && mapRef.current) {
          try {
            const point = map.latLngToContainerPoint(mapCenter);
            setPixelPosition({ x: point.x, y: point.y });
          } catch (e) {
            console.error("Error converting latLng to container point:", e);
          }
        }
        setZoomLevel(map.getZoom());
      },
      zoomend: () => {
        setZoomLevel(map.getZoom());
        if (mapCenter && mapRef.current) {
          try {
            const point = map.latLngToContainerPoint(mapCenter);
            setPixelPosition({ x: point.x, y: point.y });
          } catch (e) {
            console.error("Error converting latLng to container point on zoom:", e);
          }
        }
      },
    });
    return null;
  };

  // Radar animation effect
  useEffect(() => {
    let animationFrameId;
    const animateRadar = () => {
      setRadarProgress((prev) => {
        const next = prev + 0.01;
        return next >= 1 ? 0 : next;
      });
      animationFrameId = requestAnimationFrame(animateRadar);
    };

    if (triggerSearch && selectedRadius && mapCenter) {
      const map = mapRef.current;
      if (map) {
        try {
          const point = map.latLngToContainerPoint(mapCenter);
          setPixelPosition({ x: point.x, y: point.y });
        } catch (e) {
          console.error("Error setting initial pixel position for radar:", e);
        }
      }
      animationFrameId = requestAnimationFrame(animateRadar);
    } else {
      setRadarProgress(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [triggerSearch, selectedRadius, mapCenter]);

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) map.zoomOut();
  };

  const handleStopSearch = () => {
    setTriggerSearch(false);
  };

  const mapKey = mapCenter ? `${mapCenter[0]}_${mapCenter[1]}` : 'default';

  return (
    <div className="map-container">
      {isGeocoding && (
        <div className="map-loading-overlay">
          Đang xác định vị trí địa chỉ...
        </div>
      )}
      <MapContainer
        key={mapKey}
        center={mapCenter || [16.047079, 108.206230]}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <MapEvents />
        {mapCenter && Array.isArray(mapCenter) && mapCenter.length === 2 && (
          <Marker position={mapCenter} icon={customerIcon}>
            <Popup>Vị trí của bạn</Popup>
          </Marker>
        )}
        {repairmenLocations.map((repairman, index) => (
          repairman.coordinates && (
            <Marker
              key={repairman._id || index}
              position={repairman.coordinates}
              icon={repairmanIcon}
            >
              <Popup>
                <div>
                  <strong>{repairman.firstName} {repairman.lastName}</strong><br />
                  Khoảng cách: {repairman.distance}<br />
                  Thời gian di chuyển: {repairman.duration}
                </div>
              </Popup>
            </Marker>
          )
        ))}
        {mapCenter && selectedRadius && (
          <Circle
            center={mapCenter}
            radius={parseInt(selectedRadius.value)}
            pathOptions={{ color: "#3388ff", fillColor: "#3388ff", fillOpacity: 0.1 }}
          />
        )}
        {triggerSearch && mapCenter && selectedRadius && pixelPosition && (
          <>
            <Circle
              center={mapCenter}
              radius={parseInt(selectedRadius.value) * radarProgress}
              pathOptions={{
                color: "rgba(51, 136, 255, 0.5)",
                fillColor: "rgba(51, 136, 255, 0.2)",
                fillOpacity: 0.2 - radarProgress * 0.15,
                weight: 1
              }}
            />
            <Circle
              center={mapCenter}
              radius={parseInt(selectedRadius.value) * ((radarProgress + 0.5) % 1)}
              pathOptions={{
                color: "rgba(51, 136, 255, 0.4)",
                fillColor: "rgba(51, 136, 255, 0.1)",
                fillOpacity: 0.1 - ((radarProgress + 0.5) % 1) * 0.08,
                weight: 1
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