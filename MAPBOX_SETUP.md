# 📍 Configuration Mapbox

## Pourquoi Mapbox ?

Le composant `MapZone` utilise Mapbox GL JS pour :
- ✅ Rendu cartographique haute performance
- ✅ Support du dessin circulaire interactif
- ✅ Géolocalisation précise
- ✅ Zooming/panning fluide
- ✅ Nombreuses couches de données

## Installation

### 1. Installer les dépendances

```bash
npm install mapbox-gl @mapbox/mapbox-gl-draw @types/mapbox-gl
```

### 2. Obtenez une clé Mapbox (gratuit)

1. Allez sur https://www.mapbox.com/
2. Créez un compte gratuitement
3. Allez dans **Account > Tokens**
4. Copiez votre **Default public token**

### 3. Configurez `.env`

```env
VITE_MAPBOX_TOKEN=pk_your_public_token_here
```

### 4. CSS (automatique)

Le composant importe automatiquement les CSS Mapbox :
```tsx
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
```

## Utilisation basique

```tsx
import MapZone from '@/components/MapZone';

export default function MyPage() {
  const [zone, setZone] = useState({
    latitude: 3.8667,
    longitude: 11.5167,
    radius_km: 5
  });

  return (
    <MapZone 
      onZoneChange={setZone}
      initialData={zone}
    />
  );
}
```

## Fonctionnalités

### Dessin de zone circulaire

- **Cliquer sur la carte** = déplacer le centre
- **Slider** = ajuster le rayon de livraison
- **Inputs** = entrer coordonnées précises

### Cercle visuel

- Zone d'or semi-transparent
- Bordure bleutée (2px)
- Marqueur au centre

## Coordonnées par défaut

| Ville | Latitude | Longitude |
|-------|----------|-----------|
| Yaoundé (Cameroun) | 3.8667 | 11.5167 |
| Douala | 4.0511 | 9.7679 |
| Kinshasa (RDC) | -4.3369 | 15.3136 |

Modifiez les valeurs par défaut dans [MapZone.tsx](resources/js/components/MapZone.tsx) ligne 45-46.

## Plan gratuit Mapbox

- ✅ **50 000** requêtes API/mois
- ✅ **Zoom illimité**
- ✅ **Mode hors ligne**
- ⚠️ Plan limité à usage personnel/prototype

Pour production, upgrade vers plan payant.

## Dépannage

### Token invalide
```
Error: "access token must be provided"
```
**Solution :** Vérifiez `VITE_MAPBOX_TOKEN` dans `.env`

### Carte ne s'affiche pas
```
Error: "Container not found"
```
**Solution :** Assurez-vous que le div contenant la carte a une hauteur (h-96 défini)

### CORS error
```
Error: "Failed to fetch"
```
**Solution :** Mapbox nécessite HTTPS en production. En dev, utilisez `http://localhost`

## Alternatives (si pas d'API Mapbox disponible)

### OpenStreetMap + Leaflet
```tsx
import { MapContainer, TileLayer, Circle } from 'react-leaflet';

export default function MapZone() {
  return (
    <MapContainer center={[3.8667, 11.5167]} zoom={12}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={[3.8667, 11.5167]} radius={5000} />
    </MapContainer>
  );
}
```

**Avantages :**
- ✅ 100% open source
- ✅ Pas de token requis
- ✅ Performance acceptable

**Inconvénients :**
- ⚠️ Moins fluide que Mapbox
- ⚠️ Styles basiques

## Performance

- Carte charge en ~500ms (avec token)
- Interaction fluide à 60 FPS
- Cercle recalculé en ~50ms lors du zoom

## Ressources

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [Exemples Mapbox](https://docs.mapbox.com/mapbox-gl-js/examples/)
- [API Geocoding](https://docs.mapbox.com/api/search/geocoding/)

---

**Note:** Pour utiliser l'API Geocoding (convertir adresse → coordonnées), utilisez le même token Mapbox.
