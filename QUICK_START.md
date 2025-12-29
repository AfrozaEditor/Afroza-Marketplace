# 🚀 QUICK START - Système de Livraison

> Mise en route en **5 minutes** ⏱️

---

## 1️⃣ Installation (2 min)

### Installer dépendances NPM
```bash
npm install mapbox-gl @mapbox/mapbox-gl-draw @types/mapbox-gl
```

### Ajouter token Mapbox
```bash
# Récupérer token sur https://www.mapbox.com (gratuit)
# Éditer .env
VITE_MAPBOX_TOKEN=pk_your_token_here
```

### Migrations
```bash
php artisan migrate
```

---

## 2️⃣ Tester (3 min)

### Créer un compte
1. Accès `/register`
2. Créer utilisateur
3. Assigner rôle `delivery` (via Admin ou Tinker)

### Accéder à l'inscription livreur
```
http://localhost:8000/delivery/register
```

### Remplir formulaire
- **Étape 1** : Infos perso
- **Étape 2** : Dessiner zone sur carte (cliquer = centrer, slider = rayon)
- **Étape 3** : Infos véhicule
- **Étape 4** : Documents légaux

### Soumettre
- Profil créé avec statut "en attente"

---

## 3️⃣ Approuver (Admin)

### Accéder à Admin
```
http://localhost:8000/admin
```

### Approuver profil livreur
```bash
# Via Tinker
php artisan tinker
> $d = Delivery::first()
> $d->update(['statut' => 'approuvé'])
```

---

## 4️⃣ Voir le tableau de bord

### URL
```
http://localhost:8000/delivery-dashboard
```

### Éléments affichés
- 📍 Carte de votre zone
- 📦 Commandes disponibles dans votre zone
- 🚚 Mes commandes assignées
- 📊 Statistiques

---

## 🎯 Cas d'usage complet

### Setup initial
```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite (React)
npm run dev
```

### Créer données de test
```bash
php artisan tinker

# Créer utilisateur livreur
$user = User::factory()->create();
$user->assignRole('delivery');

# Créer livreur
$delivery = Delivery::create([
    'user_id' => $user->id,
    'name' => 'Test Livreur',
    'email' => 'test@example.com',
    'phone' => '+237670000000',
    'address' => '123 Rue Test',
    'city' => 'Yaoundé',
    'delivery_latitude' => 3.8667,
    'delivery_longitude' => 11.5167,
    'delivery_radius_km' => 5,
    'statut' => 'approuvé'
]);

# Créer commandes (1 dans zone, 1 hors zone)
Order::factory(2)->create([
    'status' => 'pending',
    'user_id' => User::factory(),
    'delivery_address_latitude' => 3.8700, // Dans zone
    'delivery_address_longitude' => 11.5200,
]);

Order::factory()->create([
    'status' => 'pending',
    'user_id' => User::factory(),
    'delivery_address_latitude' => 4.0511, // Douala (hors zone)
    'delivery_address_longitude' => 9.7679,
]);
```

### Se connecter comme livreur
1. Logout de admin
2. Connecter avec compte livreur
3. Aller à `/delivery-dashboard`

### Voir les commandes
```
GET /delivery/available-orders
```

### Accepter une commande
```
POST /delivery/accept-order/1
```

### Marquer livrée
```
PATCH /delivery/update-order-status/1
Body: {"status": "livré"}
```

---

## 🧪 Tests rapides

### Run tests
```bash
php artisan test tests/Feature/DeliverySystemTest.php
```

### Résultat attendu
```
✓ test_create_delivery_profile
✓ test_calculate_distance
✓ test_order_in_delivery_zone
✓ test_order_outside_delivery_zone
✓ test_get_orders_in_zone
✓ test_accept_order_in_zone
✓ test_cannot_accept_order_outside_zone
✓ test_update_order_status
✓ test_validate_coordinates
```

---

## 🗂️ Fichiers importants

| Fichier | Rôle |
|---------|------|
| `app/Services/GeolocationService.php` | Calculs GPS |
| `app/Http/Controllers/Delivery/DeliveryController.php` | Routes livreur |
| `resources/js/components/MapZone.tsx` | Composant carte |
| `resources/js/pages/delivery/Create.tsx` | Inscription |
| `resources/js/pages/delivery/Dashboard.tsx` | Tableau de bord |

---

## 🆘 Troubleshooting

### Carte ne s'affiche pas
```
❌ Error: "access token must be provided"

✅ Solution:
- Vérifier VITE_MAPBOX_TOKEN dans .env
- Token commençant par pk_
- Rebuild: npm run dev
```

### Commandes ne s'affichent pas
```
❌ Error: "no orders in zone"

✅ Solutions:
- Vérifier statut delivery = "approuvé"
- Vérifier orders ont delivery_address_latitude/longitude
- Vérifier distance < delivery_radius_km
```

### Upload documents échoue
```
❌ Error: "File upload failed"

✅ Solutions:
- Vérifier S3/MinIO configuré
- AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY
- Fichiers < 3MB
```

---

## 📚 Documentation complète

- 📖 [DELIVERY_SYSTEM.md](DELIVERY_SYSTEM.md) - Doc technique complète
- 🗺️ [MAPBOX_SETUP.md](MAPBOX_SETUP.md) - Configuration Mapbox
- 📡 [API_EXAMPLES.md](API_EXAMPLES.md) - Exemples API
- 📋 [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Résumé
- 📝 [CHANGELOG.md](CHANGELOG.md) - Historique

---

## ✨ Prochaines étapes

Après la mise en route basique :

1. **Sécuriser**
   - [ ] Token Mapbox en variable d'environnement
   - [ ] CORS configuré
   - [ ] S3 en production

2. **Customizer**
   - [ ] Logos/couleurs de la marque
   - [ ] Zones par défaut Cameroun
   - [ ] Messages d'erreur localisés

3. **Intégrer**
   - [ ] Notifications (Reverb)
   - [ ] GPS temps réel
   - [ ] Dashboard admin avancé

---

## 📞 Support rapide

### Problème courant #1: Carte blanche
```
Vérifier console (F12)
- VITE_MAPBOX_TOKEN défini ?
- Pas d'erreur CORS ?
- MapContainer a une hauteur ?
```

### Problème courant #2: Commandes ne s'affichent pas
```
Vérifier:
- Livraison statut = "approuvé"
- Orders ont delivery_address_lat/lng
- Distance < radius
```

### Problème courant #3: Upload échoue
```
Vérifier:
- S3 configuré dans .env
- Fichiers < 3MB
- Permissions S3
```

---

**⏱️ Vous devriez avoir un système fonctionnel en 5 minutes !**

Questions ? → Voir [DELIVERY_SYSTEM.md](DELIVERY_SYSTEM.md)
