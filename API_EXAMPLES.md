# 📡 Exemples d'API - Système de Livraison

## Authentification

Tous les endpoints protégés nécessitent un header :
```
Authorization: Bearer {user_token}
X-CSRF-Token: {csrf_token}
```

---

## 📝 Créer un profil de livraison

### Request
```http
POST /delivery HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=Jean%20Dupont
&email=jean@example.com
&phone=%2B237670000000
&address=123%20Rue%20de%20la%20Paix
&city=Yaoundé
&postal_code=1000
&delivery_latitude=3.8667
&delivery_longitude=11.5167
&delivery_radius_km=5
&delivery_area=Yaoundé%20Centre
&availability=Lun-Ven%208h-18h
&vehicle_type=voiture
&vehicle_model=Renault%20Clio
&vehicle_plate=CM-1234-AB
&id_card=ID123456
&id_driver_license=LICENSE123456
&delivery_experience=2%20years%20experience
```

### Form Data (avec fichiers)
```
name: "Jean Dupont"
email: "jean@example.com"
phone: "+237670000000"
address: "123 Rue de la Paix"
city: "Yaoundé"
postal_code: "1000"
delivery_latitude: 3.8667
delivery_longitude: 11.5167
delivery_radius_km: 5
delivery_area: "Yaoundé Centre"
availability: "Lun-Ven 8h-18h"
vehicle_type: "voiture"
vehicle_model: "Renault Clio"
vehicle_plate: "CM-1234-AB"
id_card: "ID123456"
url_id_card: [File] id_card.jpg
id_driver_license: "LICENSE123456"
url_driver_license: [File] driver_license.jpg
insurance_certificate: "INS123456" (optional)
url_insurance_certificate: [File] insurance.jpg (optional)
delivery_experience: "2 years experience"
```

### Response 201
```json
{
  "message": "Delivery profile created successfully",
  "delivery": {
    "id": 1,
    "user_id": 42,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+237670000000",
    "address": "123 Rue de la Paix",
    "city": "Yaoundé",
    "postal_code": "1000",
    "delivery_latitude": "3.86670000",
    "delivery_longitude": "11.51670000",
    "delivery_radius_km": "5.00",
    "delivery_area": "Yaoundé Centre",
    "availability": "Lun-Ven 8h-18h",
    "vehicle_type": "voiture",
    "vehicle_model": "Renault Clio",
    "vehicle_plate": "CM-1234-AB",
    "statut": "en attente",
    "created_at": "2025-12-26T10:30:00Z",
    "updated_at": "2025-12-26T10:30:00Z"
  }
}
```

---

## 📍 Obtenir les commandes disponibles

### Request
```http
GET /delivery/available-orders HTTP/1.1
Authorization: Bearer {token}
```

### Response 200
```json
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
      "total": "45000.00",
      "delivery_address": "Rue de la Paix, Yaoundé",
      "latitude": "3.86900000",
      "longitude": "11.52000000",
      "user": {
        "name": "Alice Martin",
        "email": "alice@example.com",
        "phone": "+237699999999"
      },
      "items_count": 3
    },
    {
      "id": 2,
      "status": "pending",
      "total": "25000.00",
      "delivery_address": "Avenue Cameroun, Yaoundé",
      "latitude": "3.87100000",
      "longitude": "11.51800000",
      "user": {
        "name": "Bob Johnson",
        "email": "bob@example.com",
        "phone": "+237688888888"
      },
      "items_count": 1
    }
  ]
}
```

---

## ✅ Accepter une commande

### Request
```http
POST /delivery/accept-order/1 HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{}
```

### Response 200
```json
{
  "message": "Order accepted",
  "order": {
    "id": 1,
    "user_id": 10,
    "delivery_id": 1,
    "status": "en_cours_de_livraison",
    "total": "45000.00",
    "delivery_address": "Rue de la Paix, Yaoundé",
    "delivery_address_latitude": "3.86900000",
    "delivery_address_longitude": "11.52000000",
    "created_at": "2025-12-26T10:00:00Z",
    "updated_at": "2025-12-26T10:35:00Z"
  }
}
```

### Erreur 400 (Hors zone)
```json
{
  "error": "Order is outside your delivery zone"
}
```

---

## 🚚 Obtenir mes commandes assignées

### Request
```http
GET /delivery/assigned-orders HTTP/1.1
Authorization: Bearer {token}
```

### Response 200
```json
{
  "orders": [
    {
      "id": 1,
      "user_id": 10,
      "delivery_id": 1,
      "status": "en_cours_de_livraison",
      "total": "45000.00",
      "delivery_address": "Rue de la Paix, Yaoundé",
      "delivery_address_latitude": "3.86900000",
      "delivery_address_longitude": "11.52000000",
      "user": {
        "name": "Alice Martin",
        "email": "alice@example.com",
        "phone": "+237699999999"
      },
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 5,
          "quantity": 2,
          "price": "22500.00"
        }
      ],
      "created_at": "2025-12-26T10:00:00Z",
      "updated_at": "2025-12-26T10:35:00Z"
    }
  ]
}
```

---

## 📊 Mettre à jour le statut d'une commande

### Request
```http
PATCH /delivery/update-order-status/1 HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "livré"
}
```

### Statuts valides
- `en_cours_de_livraison` - En cours de livraison
- `livré` - Commande livrée
- `impossible_de_livrer` - Impossible de livrer

### Response 200
```json
{
  "message": "Status updated",
  "order": {
    "id": 1,
    "user_id": 10,
    "delivery_id": 1,
    "status": "livré",
    "total": "45000.00",
    "updated_at": "2025-12-26T11:20:00Z"
  }
}
```

---

## ✏️ Mettre à jour le profil de livraison

### Request
```http
PATCH /delivery/1 HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "delivery_radius_km": 7.5,
  "availability": "Lun-Ven 8h-20h, Sam 9h-13h",
  "vehicle_model": "Renault Scenic"
}
```

### Response 200
```json
{
  "message": "Profile updated successfully",
  "delivery": {
    "id": 1,
    "user_id": 42,
    "name": "Jean Dupont",
    "delivery_latitude": "3.86670000",
    "delivery_longitude": "11.51670000",
    "delivery_radius_km": "7.50",
    "availability": "Lun-Ven 8h-20h, Sam 9h-13h",
    "vehicle_model": "Renault Scenic",
    "updated_at": "2025-12-26T11:25:00Z"
  }
}
```

---

## 🔍 Obtenir le profil d'un livreur

### Request
```http
GET /delivery/1 HTTP/1.1
Authorization: Bearer {token}
```

### Response 200
```json
{
  "id": 1,
  "user_id": 42,
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+237670000000",
  "address": "123 Rue de la Paix",
  "city": "Yaoundé",
  "postal_code": "1000",
  "delivery_latitude": "3.86670000",
  "delivery_longitude": "11.51670000",
  "delivery_radius_km": "5.00",
  "delivery_area": "Yaoundé Centre",
  "availability": "Lun-Ven 8h-18h",
  "vehicle_type": "voiture",
  "vehicle_model": "Renault Clio",
  "vehicle_plate": "CM-1234-AB",
  "statut": "approuvé",
  "created_at": "2025-12-26T10:30:00Z",
  "updated_at": "2025-12-26T10:30:00Z",
  "user": {
    "id": 42,
    "name": "Jean Dupont",
    "email": "jean@example.com"
  }
}
```

---

## ❌ Erreurs courantes

### 401 Unauthorized
```json
{
  "error": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "delivery_latitude": ["The delivery latitude must be between -90 and 90."],
    "delivery_radius_km": ["The delivery radius km must be at least 0.5."]
  }
}
```

---

## 🧪 Tester avec cURL

### Créer un profil
```bash
curl -X POST http://localhost:8000/delivery \
  -H "Authorization: Bearer {token}" \
  -H "X-CSRF-Token: {csrf_token}" \
  -F "name=Jean Dupont" \
  -F "email=jean@example.com" \
  -F "phone=+237670000000" \
  -F "address=123 Rue de la Paix" \
  -F "city=Yaoundé" \
  -F "postal_code=1000" \
  -F "delivery_latitude=3.8667" \
  -F "delivery_longitude=11.5167" \
  -F "delivery_radius_km=5" \
  -F "id_card=ID123456" \
  -F "url_id_card=@id_card.jpg" \
  -F "id_driver_license=LICENSE123456" \
  -F "url_driver_license=@driver_license.jpg"
```

### Obtenir commandes disponibles
```bash
curl http://localhost:8000/delivery/available-orders \
  -H "Authorization: Bearer {token}"
```

### Accepter une commande
```bash
curl -X POST http://localhost:8000/delivery/accept-order/1 \
  -H "Authorization: Bearer {token}" \
  -H "X-CSRF-Token: {csrf_token}"
```

### Mettre à jour le statut
```bash
curl -X PATCH http://localhost:8000/delivery/update-order-status/1 \
  -H "Authorization: Bearer {token}" \
  -H "X-CSRF-Token: {csrf_token}" \
  -H "Content-Type: application/json" \
  -d '{"status":"livré"}'
```

---

## 📊 Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Authentification requise |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource inexistante |
| 422 | Unprocessable Entity - Validation échouée |
| 500 | Internal Server Error - Erreur serveur |

---

**Note :** Remplacez `{token}` et `{csrf_token}` par les valeurs réelles de votre session.
