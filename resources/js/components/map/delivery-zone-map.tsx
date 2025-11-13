import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

interface DeliveryZoneMapProps {
  onZoneSelect: (geojson: any) => void;
}

const DeliveryZoneMap: React.FC<DeliveryZoneMapProps> = ({ onZoneSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    // Patch pour MapLibre
    MapboxDraw.constants.classes.CANVAS = "maplibregl-canvas";
    MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
    MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
    MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";
    MapboxDraw.constants.classes.ATTRIBUTION = "maplibregl-ctrl-attrib";

    // Création de la carte
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "https://api.maptiler.com/maps/streets/style.json?key=8rwYW8bd85cw3rDKebQg",
      center: [11.5021, 3.8480], // Yaoundé
      zoom: 12
    });

    // On NE met PAS le NavigationControl pour ne pas afficher + / -
    // mapRef.current.addControl(new maplibregl.NavigationControl());

    // Ajout de Draw directement en haut à droite
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });
    mapRef.current.addControl(draw, "top-right"); // remplace le zoom

    // Gestion des événements
    const updateZone = () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        console.log("Zone dessinée :", data);
        console.log("Surface :", area, "m²");
        onZoneSelect(data);
      } else {
        onZoneSelect(null);
      }
    };

    mapRef.current.on("draw.create", updateZone);
    mapRef.current.on("draw.update", updateZone);
    mapRef.current.on("draw.delete", () => onZoneSelect(null));
  }, [onZoneSelect]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    />
  );
};

export default DeliveryZoneMap;
