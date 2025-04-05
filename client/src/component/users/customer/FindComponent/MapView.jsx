// import React, { useRef, useEffect, useState, useCallback } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import "./MapView.css";

// const customIcon = new L.Icon({
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const MapView = ({ selectedRadius, setUserLocation, userLocation, triggerSearch, setTriggerSearch }) => {
//   const mapRef = useRef(null);
//   const [zoomLevel, setZoomLevel] = useState(13);
//   const [isLoading, setIsLoading] = useState(false);
//   const [pixelPosition, setPixelPosition] = useState(null);
//   const [radarProgress, setRadarProgress] = useState(0);

//   const getZoomLevelFromRadius = (radius) => {
//     if (!radius) return 13;
//     const radiusMeters = parseInt(radius.value);
//     if (radiusMeters <= 500) return 16;
//     if (radiusMeters <= 1000) return 15;
//     if (radiusMeters <= 2000) return 14;
//     return 13;
//   };

//   const MapEvents = () => {
//     const map = useMapEvents({
//       move: () => {
//         if (userLocation && mapRef.current) {
//           const point = map.latLngToContainerPoint(userLocation);
//           setPixelPosition({ x: point.x, y: point.y });
//         }
//       },
//       zoomend: () => {
//         setZoomLevel(map.getZoom());
//         if (userLocation && mapRef.current) {
//           const point = map.latLngToContainerPoint(userLocation);
//           setPixelPosition({ x: point.x, y: point.y });
//         }
//       },
//     });
//     return null;
//   };

//   const updateUserLocation = useCallback(() => {
//     if (!navigator.geolocation) {
//       console.log("Trình duyệt không hỗ trợ Geolocation.");
//       return;
//     }

//     setIsLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const newLocation = [latitude, longitude];
//         setUserLocation(newLocation);

//         const map = mapRef.current;
//         if (map) {
//           const zoom = selectedRadius ? getZoomLevelFromRadius(selectedRadius) : 16;
//           map.flyTo(newLocation, zoom, { duration: 1.5, easeLinearity: 0.25 });
//           const point = map.latLngToContainerPoint(newLocation);
//           setPixelPosition({ x: point.x, y: point.y });
//         }
//         setIsLoading(false);
//       },
//       (error) => {
//         console.error("Lỗi khi lấy vị trí:", error.message);
//         setIsLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//     );
//   }, [setUserLocation, selectedRadius]);

//   useEffect(() => {
//     updateUserLocation();

//     const map = mapRef.current;
//     if (map && userLocation && selectedRadius) {
//       const newZoom = getZoomLevelFromRadius(selectedRadius);
//       map.flyTo(userLocation, newZoom, { duration: 1.5, easeLinearity: 0.25 });
//       setZoomLevel(newZoom);
//     }

//     return () => { };
//   }, [updateUserLocation, selectedRadius]);

//   useEffect(() => {
//     let animationFrameId;
//     const animateRadar = () => {
//       setRadarProgress((prev) => {
//         const next = prev + 0.01;
//         return next >= 1 ? 0 : next;
//       });
//       animationFrameId = requestAnimationFrame(animateRadar);
//     };

//     if (triggerSearch && selectedRadius) {
//       animationFrameId = requestAnimationFrame(animateRadar);
//     }

//     return () => {
//       if (animationFrameId) cancelAnimationFrame(animationFrameId);
//     };
//   }, [triggerSearch, selectedRadius]);

//   const handleZoomIn = () => {
//     const map = mapRef.current;
//     if (map) map.setZoom(map.getZoom() + 1);
//   };

//   const handleZoomOut = () => {
//     const map = mapRef.current;
//     if (map) map.setZoom(map.getZoom() - 1);
//   };

//   const handleStopSearch = () => {
//     setTriggerSearch(false); // Dừng tìm kiếm
//   };

//   return (
//     <div className="map-container">
//       <MapContainer
//         center={userLocation || [16.047079, 108.206230]}
//         zoom={zoomLevel}
//         style={{ height: "100%", width: "100%" }}
//         ref={mapRef}
//         scrollWheelZoom={true}
//         doubleClickZoom={true}
//         zoomControl={false}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           maxZoom={19}
//         />
//         <MapEvents />
//         {userLocation && <Marker position={userLocation} icon={customIcon} />}
//         {userLocation && selectedRadius && (
//           <Circle
//             center={userLocation}
//             radius={parseInt(selectedRadius.value)}
//             pathOptions={{ color: "#3388ff", fillColor: "#3388ff", fillOpacity: 0.1 }}
//           />
//         )}
//         {triggerSearch && userLocation && selectedRadius && (
//           <>
//             <Circle
//               center={userLocation}
//               radius={parseInt(selectedRadius.value) * radarProgress}
//               pathOptions={{
//                 color: "rgba(51, 136, 255, 0.5)",
//                 fillColor: "rgba(51, 136, 255, 0.2)",
//                 fillOpacity: 0.2 - radarProgress * 0.15,
//               }}
//             />
//             <Circle
//               center={userLocation}
//               radius={parseInt(selectedRadius.value) * ((radarProgress + 0.5) % 1)}
//               pathOptions={{
//                 color: "rgba(51, 136, 255, 0.4)",
//                 fillColor: "rgba(51, 136, 255, 0.1)",
//                 fillOpacity: 0.1 - ((radarProgress + 0.5) % 1) * 0.08,
//               }}
//             />
//           </>
//         )}
//       </MapContainer>

//       {triggerSearch && (
//         <div className="searching-text">
//           Đang tìm thợ<span className="loader-dots">...</span>
//         </div>
//       )}

//       {triggerSearch && (
//         <button className="cancel-button" onClick={handleStopSearch} title="Dừng tìm kiếm">
//           ✕ Dừng tìm
//         </button>
//       )}

//       <div className="map-controls">
//         <button
//           className={`control-button ${isLoading ? "loading" : ""}`}
//           onClick={updateUserLocation}
//           title="Định vị lại"
//           disabled={isLoading}
//         >
//           {isLoading ? "⏳" : "📍"}
//         </button>
//         <button className="control-button" onClick={handleZoomIn} title="Phóng to">
//           ➕
//         </button>
//         <button className="control-button" onClick={handleZoomOut} title="Thu nhỏ">
//           ➖
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MapView;
// MapView.jsx modifications:

import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css";

// Make sure the icon path is correct or use a default
const customIcon = new L.Icon({
  // iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default Leaflet icon
  iconUrl: require('leaflet/dist/images/marker-icon.png'), // Use local package version
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'), // Add shadow
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


// Receive mapCenter instead of userLocation, remove setUserLocation
const MapView = ({ selectedRadius, mapCenter, triggerSearch, setTriggerSearch, isGeocoding }) => {
  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(13); // Initial zoom
  // const [isLoading, setIsLoading] = useState(false); // Remove geolocation loading state
  const [pixelPosition, setPixelPosition] = useState(null); // Keep for potential radar effect positioning
  const [radarProgress, setRadarProgress] = useState(0);

  // Adjust zoom level based on radius
  const getZoomLevelFromRadius = (radius) => {
    if (!radius) return 13; // Default zoom if no radius
    const radiusMeters = parseInt(radius.value);
    if (radiusMeters <= 500) return 16;
    if (radiusMeters <= 1000) return 15;
    if (radiusMeters <= 2000) return 14;
    if (radiusMeters <= 5000) return 13;
    if (radiusMeters <= 10000) return 12;
    return 11; // Zoom out further for larger radii
  };

  // Effect to fly to the new mapCenter when it changes or radius changes
  useEffect(() => {
    const map = mapRef.current;
    if (map && mapCenter) {
      const newZoom = getZoomLevelFromRadius(selectedRadius);
      // Check if mapCenter actually changed to avoid unnecessary flyTo
      const currentCenter = map.getCenter();
      const tolerance = 0.0001; // Small tolerance for floating point comparison
      if (Math.abs(currentCenter.lat - mapCenter[0]) > tolerance || Math.abs(currentCenter.lng - mapCenter[1]) > tolerance || map.getZoom() !== newZoom) {
        console.log("Flying to new center:", mapCenter, "Zoom:", newZoom);
        map.flyTo(mapCenter, newZoom, { duration: 1.5, easeLinearity: 0.25 });
      }
    }
  }, [mapCenter, selectedRadius]); // Depend on mapCenter and selectedRadius


  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => { // Use moveend to update after panning/zooming finishes
        if (mapCenter && mapRef.current) {
          try {
            const point = map.latLngToContainerPoint(mapCenter);
            setPixelPosition({ x: point.x, y: point.y });
          } catch (e) {
            console.error("Error converting latLng to container point:", e);
            // This can happen if the map isn't fully initialized or the center is invalid
          }
        }
        setZoomLevel(map.getZoom()); // Update zoom level on moveend as well
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

  // Remove the updateUserLocation function and related useEffect
  // useEffect(() => {
  //   updateUserLocation(); // This was the geolocation call
  //   ...
  // }, [updateUserLocation, selectedRadius]);


  // Radar animation effect (remains the same)
  useEffect(() => {
    let animationFrameId;
    const animateRadar = () => {
      setRadarProgress((prev) => {
        const next = prev + 0.01; // Adjust speed if needed
        return next >= 1 ? 0 : next;
      });
      animationFrameId = requestAnimationFrame(animateRadar);
    };

    if (triggerSearch && selectedRadius && mapCenter) { // Ensure mapCenter exists
      // Calculate initial pixel position when search starts
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
      setRadarProgress(0); // Reset progress when search stops
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [triggerSearch, selectedRadius, mapCenter]); // Add mapCenter dependency

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) map.zoomIn(); // Use built-in zoomIn/Out
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) map.zoomOut();
  };

  const handleStopSearch = () => {
    setTriggerSearch(false); // Dừng tìm kiếm
  };

  // --- Key for re-rendering MapContainer when center fundamentally changes ---
  // Useful if Leaflet doesn't always react smoothly to center prop changes alone
  const mapKey = mapCenter ? `${mapCenter[0]}_${mapCenter[1]}` : 'default';

  return (
    <div className="map-container">
      {/* Add a loading overlay during geocoding */}
      {isGeocoding && (
        <div className="map-loading-overlay">
          Đang xác định vị trí địa chỉ...
        </div>
      )}
      <MapContainer
        key={mapKey} // Add key here
        center={mapCenter || [16.047079, 108.206230]} // Use mapCenter, provide default
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={false} // We have custom controls
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <MapEvents />
        {/* Display marker only if mapCenter is valid */}
        {mapCenter && Array.isArray(mapCenter) && mapCenter.length === 2 && (
          <Marker position={mapCenter} icon={customIcon} />
        )}
        {/* Display circles only if mapCenter and radius are valid */}
        {mapCenter && selectedRadius && (
          <Circle
            center={mapCenter}
            radius={parseInt(selectedRadius.value)}
            pathOptions={{ color: "#3388ff", fillColor: "#3388ff", fillOpacity: 0.1 }}
          />
        )}
        {/* Radar animation */}
        {triggerSearch && mapCenter && selectedRadius && pixelPosition && (
          <>
            {/* Expanding radar circles */}
            <Circle
              center={mapCenter}
              radius={parseInt(selectedRadius.value) * radarProgress}
              pathOptions={{
                color: "rgba(51, 136, 255, 0.5)", // Blueish radar
                fillColor: "rgba(51, 136, 255, 0.2)",
                fillOpacity: 0.2 - radarProgress * 0.15,
                weight: 1 // Thin line
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
            {/* Optional: Add a static outer ring for the search radius */}
            {/* <Circle
                             center={mapCenter}
                             radius={parseInt(selectedRadius.value)}
                             pathOptions={{ color: "#3388ff", fill: false, weight: 2, dashArray: '5, 5' }} // Dashed outline
                         /> */}
          </>
        )}
      </MapContainer>

      {/* Searching text and cancel button (keep as is) */}
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

      {/* Map Controls - Remove the geolocation button */}
      <div className="map-controls">
        {/* <button
                    className={`control-button ${isLoading ? "loading" : ""}`} // isLoading removed
                    onClick={updateUserLocation} // Function removed
                    title="Định vị lại"
                    disabled={isLoading} // isLoading removed
                >
                    {isLoading ? "⏳" : "📍"} // isLoading removed
                </button> */}
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
