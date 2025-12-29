# 🚚 Système de Livraison - Documentation

## Vue d'ensemble

Ce système permet aux livreurs de :
1. **Créer un profil de livraison** avec une zone circulaire sur une carte
2. **Consulter les commandes** disponibles dans leur zone
3. **Accepter et gérer** les commandes de livraison

## 📊 Architecture

### Base de données

#### Table `delivery`
- `id` : ID du livreur
- `user_id` : Référence à l'utilisateur (FK)
- `name`, `email`, `phone` : Infos personnelles
- `address`, `city`, `postal_code` : Adresse
- **`delivery_latitude`** : Latitude du centre de la zone (décimal 10,8)
- **`delivery_longitude`** : Longitude du centre de la zone (décimal 11,8)
- **`delivery_radius_km`** : Rayon de livraison en km (décimal 5,2)
- `delivery_area` : Nom de la zone (ex: "Yaoundé Centre")
- `availability` : Horaires de disponibilité
- `vehicle_type`, `vehicle_model`, `vehicle_plate` : Info véhicule
- `url_id_card`, `url_driver_license`, `url_insurance_certificate` : Documents
- `statut` : "en attente", "approuvé", "rejeté"

#### Table `orders` (modifications)
- **`delivery_id`** : FK vers la table delivery (nullable)
- **`delivery_address`** : Adresse complète de livraison
- **`delivery_address_latitude`** : Latitude de l'adresse
- **`delivery_address_longitude`** : Longitude de l'adresse

### Services

#### `GeolocationService`
Classe utilitaire pour les calculs géographiques :

```php
// Calculer la distance entre deux points (Haversine formula)
GeolocationService::calculateDistance($lat1, $lon1, $lat2, $lon2); // retourne km

// Vérifier si une commande est dans la zone
GeolocationService::isOrderInDeliveryZone($order, $delivery); // retourne bool

// Obtenir toutes les commandes dans une zone
GeolocationService::getOrdersInZone($delivery); // retourne Collection

// Trouver les livreurs les plus proches
GeolocationService::getNearestDeliveries($order, $limit); // retourne Collection
```

### Contrôleur

#### `DeliveryController`

**Routes publiques (auth)**
- `POST /delivery` : Créer un profil de livraison
- `GET /delivery/{id}/edit` : Éditer le profil
- `PATCH /delivery/{id}` : Mettre à jour le profil

**Routes protégées (role:delivery)**
- `GET /delivery-dashboard` : Tableau de bord
- `GET /delivery/available-orders` : Commandes disponibles
- `GET /delivery/assigned-orders` : Commandes assignées
- `POST /delivery/accept-order/{orderId}` : Accepter une commande
- `PATCH /delivery/update-order-status/{orderId}` : Mettre à jour le statut

### Composants React

#### `MapZone`
Composant interactif pour dessiner une zone circulaire sur une carte Mapbox.

```tsx
<MapZone 
  onZoneChange={(data) => {
    console.log(data); // { latitude, longitude, radius_km }
  }}
  initialData={{
    latitude: 3.8667,
    longitude: 11.5167,
    radius_km: 5
  }}
  isReadOnly={false}
/>
```

**Props:**
- `onZoneChange` : Callback quand la zone change
- `initialData` : Données initiales
- `isReadOnly` : Mode lecture seule (affiche juste la zone)

## 🚀 Utilisation

### 1️⃣ Inscription livreur

1. L'utilisateur accède à `/delivery/register`
2. Remplit le formulaire en 4 étapes :
   - **Étape 1** : Infos personnelles
   - **Étape 2** : Zone de livraison (carte interactive)
   - **Étape 3** : Infos véhicule
   - **Étape 4** : Documents légaux

3. La requête est envoyée à `POST /delivery` avec validation côté serveur
4. Le profil est créé avec statut "en attente" d'approbation admin

### 2️⃣ Gestion des commandes

#### Vue des commandes disponibles
```
GET /delivery/available-orders

Response:
{
  "delivery_zone": {
    "latitude": 3.8667,
    "longitude": 11.5167,
    "radius_km": 5
  },
  "orders": [
    {
      "id": 1,
      "status": "pending",
      "total": 45000,
      "delivery_address": "Rue de la Paix, Yaoundé",
      "latitude": 3.8690,
      "longitude": 11.5200,
      "user": {
        "name": "Jean Dupont",
        "email": "jean@example.com",
        "phone": "+237..."
      },
      "items_count": 3
    }
  ]
}
```

#### Accepter une commande
```
POST /delivery/accept-order/1

Response:
{
  "message": "Order accepted",
  "order": { ... }
}
```

#### Mise à jour du statut
```
PATCH /delivery/update-order-status/1

Body:
{
  "status": "livré" // ou "en_cours_de_livraison", "impossible_de_livrer"
}
```

## 📍 Calculs géographiques

### Formule Haversine
Utilisée pour calculer la distance entre deux points GPS :

```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

Où :
- φ = latitude, λ = longitude
- R = 6371 km (rayon terrestre)
- d = distance en km

### Validation de zone
Pour chaque commande :
1. Récupérer les coordonnées de livraison
2. Calculer la distance avec le centre de la zone du livreur
3. Vérifier si distance ≤ rayon

## 🔐 Sécurité

- Authentification requise pour créer/éditer un profil
- Validation des coordonnées (latitude -90 à 90, longitude -180 à 180)
- Rayon limité entre 0.5 et 100 km
- Upload d'images sécurisé vers S3
- Vérification des permissions pour chaque action

## 📦 Environnement

Ajouter à `.env` :

```env
# Mapbox (optionnel pour les cartes)
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# S3/MinIO
AWS_ACCESS_KEY_ID=jedidia
AWS_SECRET_ACCESS_KEY=Jed@@25!!
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=vide-dressing
AWS_ENDPOINT=http://minio:9000
```

## 🛠️ Migrations

Exécuter les migrations :

```bash
php artisan migrate
```

Cela crée/modifie les tables :
- `delivery` (nouvelle)
- `orders` (ajout de colonnes)

## 📝 Exemples

### Créer un livreur

```php
$delivery = Delivery::create([
    'user_id' => auth()->id(),
    'name' => 'Jean Dupont',
    'email' => 'jean@example.com',
    'phone' => '+237670000000',
    'address' => '123 Rue de la Paix',
    'city' => 'Yaoundé',
    'delivery_latitude' => 3.8667,
    'delivery_longitude' => 11.5167,
    'delivery_radius_km' => 5,
    'vehicle_type' => 'voiture',
    'statut' => 'en attente'
]);
```

### Obtenir les commandes dans une zone

```php
use App\Services\GeolocationService;

$delivery = auth()->user()->delivery;
$ordersInZone = GeolocationService::getOrdersInZone($delivery);
```

### Vérifier si une commande est dans la zone

```php
use App\Services\GeolocationService;

$delivery = Delivery::find(1);
$order = Order::find(1);

if (GeolocationService::isOrderInDeliveryZone($order, $delivery)) {
    // La commande est dans la zone
}
```

## 🎨 UI/UX

### Page d'inscription
- Formulaire multi-étapes avec progression visuelle
- Intégration Mapbox pour choisir la zone
- Preview des uploads de documents
- Validation en temps réel

### Tableau de bord
- Carte affichant la zone de livraison
- Statistiques (commandes disponibles, en cours, livrées)
- Onglets pour switcher entre commandes disponibles/assignées
- Cartes de commandes avec infos client et actions

## 🔄 Flux typique

1. **Livreur** crée son profil avec zone circulaire
2. **Admin** approuve le profil
3. **Client** passe commande avec adresse
4. **Système** calcule quels livreurs peuvent livrer
5. **Livreur** voit la commande en "disponible"
6. **Livreur** accepte la commande
7. **Livreur** marque comme "en cours" puis "livrée"
8. **Historique** mise à jour

---

**Prochains développements possibles :**
- Géofencing temps réel avec notifications
- Optimisation d'itinéraire (plusieurs commandes)
- Zones polygonales pour plus de flexibilité
- Rating des livreurs
- Intégration GPS en temps réel
