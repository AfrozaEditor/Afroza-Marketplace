// import { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import MapboxDraw from '@mapbox/mapbox-gl-draw';
// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
// import 'mapbox-gl/dist/mapbox-gl.css';

// interface MapZoneProps {
//   onZoneChange: (data: {
//     latitude: number;
//     longitude: number;
//     radius_km: number;
//   }) => void;
//   initialData?: {
//     latitude: number;
//     longitude: number;
//     radius_km: number;
//   };
//   isReadOnly?: boolean;
// }

// export default function MapZone({
//   onZoneChange,
//   initialData,
//   isReadOnly = false,
// }: MapZoneProps) {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);
//   const circleMarker = useRef<mapboxgl.Marker | null>(null);
//   const [latitude, setLatitude] = useState(initialData?.latitude || 3.8667);
//   const [longitude, setLongitude] = useState(initialData?.longitude || 11.5167);
//   const [radiusKm, setRadiusKm] = useState(initialData?.radius_km || 5);

//   // Initialize Mapbox (you need to set your token in .env)
//   const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

//   useEffect(() => {
//     if (!mapContainer.current) return;

//     if (MAPBOX_TOKEN) {
//       mapboxgl.accessToken = MAPBOX_TOKEN;
//     }

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v12',
//       center: [longitude, latitude],
//       zoom: 12,
//     });

//     map.current.on('load', () => {
//       // Add circle source
//       updateCircle();

//       // Add click event to map
//       if (!isReadOnly) {
//         map.current!.on('click', (e) => {
//           setLatitude(e.lngLat.lat);
//           setLongitude(e.lngLat.lng);
//           onZoneChange({
//             latitude: e.lngLat.lat,
//             longitude: e.lngLat.lng,
//             radius_km: radiusKm,
//           });
//         });
//       }
//     });

//     return () => {
//       if (map.current) {
//         map.current.remove();
//       }
//     };
//   }, []);

//   const updateCircle = () => {
//     if (!map.current) return;

//     const metersRadius = radiusKm * 1000;

//     // Remove existing circle layer and source
//     if (map.current.getLayer('circle-layer')) {
//       map.current.removeLayer('circle-layer');
//     }
//     if (map.current.getSource('circle-source')) {
//       map.current.removeSource('circle-source');
//     }

//     // Create circle as a polygon
//     const circlePolygon = createCirclePolygon(latitude, longitude, radiusKm);

//     map.current.addSource('circle-source', {
//       type: 'geojson',
//       data: {
//         type: 'Feature',
//         geometry: circlePolygon,
//         properties: {},
//       },
//     });

//     map.current.addLayer({
//       id: 'circle-layer',
//       type: 'fill',
//       source: 'circle-source',
//       paint: {
//         'fill-color': '#088',
//         'fill-opacity': 0.2,
//       },
//     });

//     // Add stroke
//     map.current.addLayer({
//       id: 'circle-stroke',
//       type: 'line',
//       source: 'circle-source',
//       paint: {
//         'line-color': '#088',
//         'line-width': 2,
//       },
//     });

//     // Update marker
//     if (circleMarker.current) {
//       circleMarker.current.remove();
//     }

//     const element = document.createElement('div');
//     element.className = 'w-4 h-4 bg-blue-600 rounded-full border-2 border-white cursor-pointer';

//     circleMarker.current = new mapboxgl.Marker({ element })
//       .setLngLat([longitude, latitude])
//       .addTo(map.current);
//   };

//   const createCirclePolygon = (lat: number, lng: number, radiusKm: number) => {
//     const points = 64;
//     const coordinates = [];

//     for (let i = 0; i < points; i++) {
//       const angle = (i / points) * 2 * Math.PI;
//       const dx = (radiusKm / 111) * Math.cos(angle); // 111 km per degree
//       const dy = (radiusKm / 111) * Math.sin(angle);
//       coordinates.push([lng + dx, lat + dy]);
//     }
//     coordinates.push(coordinates[0]); // Close the polygon

//     return {
//       type: 'Polygon',
//       coordinates: [coordinates],
//     };
//   };

//   const handleRadiusChange = (newRadius: number) => {
//     setRadiusKm(newRadius);
//     onZoneChange({
//       latitude,
//       longitude,
//       radius_km: newRadius,
//     });
//     updateCircle();
//   };

//   const handleCenterChange = (newLat: number, newLng: number) => {
//     setLatitude(newLat);
//     setLongitude(newLng);
//     onZoneChange({
//       latitude: newLat,
//       longitude: newLng,
//       radius_km: radiusKm,
//     });
//     updateCircle();

//     if (map.current) {
//       map.current.panTo([newLng, newLat]);
//     }
//   };

//   return (
//     <div className="w-full space-y-4">
//       <div
//         ref={mapContainer}
//         className="w-full h-96 rounded-lg border border-gray-300"
//       />

//       {!isReadOnly && (
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Latitude: {latitude.toFixed(6)}
//             </label>
//             <input
//               type="number"
//               step="0.000001"
//               value={latitude}
//               onChange={(e) =>
//                 handleCenterChange(parseFloat(e.target.value), longitude)
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               placeholder="Latitude"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Longitude: {longitude.toFixed(6)}
//             </label>
//             <input
//               type="number"
//               step="0.000001"
//               value={longitude}
//               onChange={(e) =>
//                 handleCenterChange(latitude, parseFloat(e.target.value))
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               placeholder="Longitude"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Rayon de livraison: {radiusKm} km
//             </label>
//             <input
//               type="range"
//               min="0.5"
//               max="100"
//               step="0.5"
//               value={radiusKm}
//               onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
//               className="w-full"
//             />
//             <p className="text-xs text-gray-500 mt-2">
//               Cliquez sur la carte pour changer le centre de votre zone de
//               livraison
//             </p>
//           </div>
//         </div>
//       )}

//       {isReadOnly && (
//         <div className="bg-gray-50 p-4 rounded-md space-y-2">
//           <p>
//             <strong>Centre:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}
//           </p>
//           <p>
//             <strong>Rayon:</strong> {radiusKm} km
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// import { MapContainer, TileLayer, Circle } from 'react-leaflet';

// export default function MapZone() {
//   return (
//     <MapContainer center={[3.8667, 11.5167]} zoom={12}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <Circle center={[3.8667, 11.5167]} radius={5000} />
//     </MapContainer>
//   );
// }


import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapZoneProps {
  onZoneChange: (data: {
    latitude: number;
    longitude: number;
    radius_km: number;
  }) => void;
  initialData?: {
    latitude: number;
    longitude: number;
    radius_km: number;
  };
  isReadOnly?: boolean;
}

export default function MapZone({
  onZoneChange,
  initialData,
  isReadOnly = false,
}: MapZoneProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const circleLayer = useRef<L.Circle | null>(null);
  const markerLayer = useRef<L.Marker | null>(null);

  const [latitude, setLatitude] = useState(initialData?.latitude || 3.8667);
  const [longitude, setLongitude] = useState(
    initialData?.longitude || 11.5167
  );
  const [radiusKm, setRadiusKm] = useState(initialData?.radius_km || 5);

  // Initialize map on mount
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create map instance
    mapInstance.current = L.map(mapContainer.current).setView(
      [latitude, longitude],
      12
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© OpenStreetMap contributors | © Vide-Dressing Delivery',
      maxZoom: 19,
      minZoom: 3,
    }).addTo(mapInstance.current);

    // Draw initial circle and marker
    updateCircleAndMarker(latitude, longitude, radiusKm);

    // Add click event to map (if not read-only)
    if (!isReadOnly) {
      mapInstance.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        onZoneChange({
          latitude: lat,
          longitude: lng,
          radius_km: radiusKm,
        });
        updateCircleAndMarker(lat, lng, radiusKm);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // Update circle and marker when values change
  const updateCircleAndMarker = (
    lat: number,
    lng: number,
    radiusKm: number
  ) => {
    if (!mapInstance.current) return;

    // Remove existing circle
    if (circleLayer.current) {
      mapInstance.current.removeLayer(circleLayer.current);
    }

    // Remove existing marker
    if (markerLayer.current) {
      mapInstance.current.removeLayer(markerLayer.current);
    }

    // Add new circle (radius in meters)
    circleLayer.current = L.circle([lat, lng], {
      radius: radiusKm * 1000, // Convert km to meters
      color: '#2563eb',
      weight: 2,
      opacity: 0.8,
      fill: true,
      fillColor: '#fbbf24',
      fillOpacity: 0.15,
    }).addTo(mapInstance.current);

    // Add marker at center
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background-color: #2563eb;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    markerLayer.current = L.marker([lat, lng], { icon: markerIcon })
      .addTo(mapInstance.current)
      .bindPopup(`<strong>Zone de livraison</strong><br>Rayon: ${radiusKm} km`);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadiusKm(newRadius);
    onZoneChange({
      latitude,
      longitude,
      radius_km: newRadius,
    });
    updateCircleAndMarker(latitude, longitude, newRadius);
  };

  const handleCenterChange = (newLat: number, newLng: number) => {
    setLatitude(newLat);
    setLongitude(newLng);
    onZoneChange({
      latitude: newLat,
      longitude: newLng,
      radius_km: radiusKm,
    });
    updateCircleAndMarker(newLat, newLng, radiusKm);

    // Pan map to new location
    if (mapInstance.current) {
      mapInstance.current.panTo([newLat, newLng]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full rounded-lg border border-gray-300"
        style={{ height: '400px' }}
      />

      {!isReadOnly && (
        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          {/* Latitude Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude: <span className="font-mono">{latitude.toFixed(6)}</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={latitude}
              onChange={(e) =>
                handleCenterChange(parseFloat(e.target.value), longitude)
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Latitude"
            />
          </div>

          {/* Longitude Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude:{' '}
              <span className="font-mono">{longitude.toFixed(6)}</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={longitude}
              onChange={(e) =>
                handleCenterChange(latitude, parseFloat(e.target.value))
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Longitude"
            />
          </div>

          {/* Radius Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rayon de livraison:{' '}
              <span className="font-semibold text-blue-600">{radiusKm} km</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="100"
              step="0.5"
              value={radiusKm}
              onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
              className="mt-2 w-full cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0.5 km</span>
              <span>100 km</span>
            </div>
          </div>

          {/* Help Text */}
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            💡 <strong>Conseil :</strong> Cliquez sur la carte pour déplacer le
            centre de votre zone de livraison, ou utilisez les champs de saisie
            pour les coordonnées précises.
          </div>
        </div>
      )}

      {isReadOnly && (
        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900">Zone de livraison</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Centre:</span>
              <span className="font-mono font-semibold">
                {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rayon:</span>
              <span className="font-semibold text-blue-600">{radiusKm} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Surface:</span>
              <span className="font-semibold">
                {(Math.PI * radiusKm * radiusKm).toFixed(1)} km²
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}