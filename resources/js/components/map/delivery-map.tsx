import React, { useEffect, useRef } from 'react';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface DeliveryMapProps {
    onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ onLocationSelect }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (mapRef.current) return; // éviter de recréer la carte

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current!,
            style: "https://api.maptiler.com/maps/streets/style.json?key=8rwYW8bd85cw3rDKebQg",
            center: [11.5021, 3.8480], // Yaoundé
            zoom: 12
        });

        // Ajouter zoom + rotation
        mapRef.current.addControl(new maplibregl.NavigationControl());

        // Quand l’utilisateur clique sur la carte
        mapRef.current.on("click", async (e) => {
            const { lng, lat } = e.lngLat;

            // Placer un marqueur
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new maplibregl.Marker({ color: "red" })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);
            }

            // Adresse inversée avec Nominatim (gratuit)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();

            onLocationSelect({
                lat,
                lng,
                address: data.display_name || "Adresse inconnue"
            });
        });
    }, [onLocationSelect]);

    return <div ref={mapContainerRef} style={{ height: "400px", width: "100%", borderRadius: "8px" }} />;
}

export default DeliveryMap;
