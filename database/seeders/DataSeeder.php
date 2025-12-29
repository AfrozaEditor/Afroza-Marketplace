<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Création des rôles
        $roles = [
            'admin' => Role::create(['name' => 'admin']),
            'vendor' => Role::create(['name' => 'vendor']),
            'customer' => Role::create(['name' => 'customer']),
            'delivery' => Role::create(['name' => 'delivery']),
        ];

        // Création de l'administrateur
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignSingleRole('admin');

        // Création des catégories
        $categories = [
            ['name' => 'Femmes', 'slug' => 'femmes'],
            ['name' => 'Hommes', 'slug' => 'hommes'],
            ['name' => 'Accessoires', 'slug' => 'accessoires'],
            ['name' => 'Chaussures', 'slug' => 'chaussures'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Création des vendeurs et leurs boutiques
        for ($i = 1; $i <= 5; $i++) {
            $vendor = User::create([
                'name' => "Vendor $i",
                'email' => "vendor$i@example.com",
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $vendor->assignSingleRole('vendor');

            $shop = Shop::create([
                'user_id' => $vendor->id,
                'name' => "Boutique $i",
                'slug' => Str::slug("Boutique $i"),
                'description' => "Description de la boutique $i",
                'active' => true,
            ]);

            // Création des produits pour chaque boutique
            for ($j = 1; $j <= 5; $j++) {
                Product::create([
                    'user_id' => $vendor->id,
                    'shop_id' => $shop->id,
                    'category_id' => Category::inRandomOrder()->first()->id,
                    'name' => "Produit $j de $shop->name",
                    'slug' => Str::slug("Produit $j de $shop->name"),
                    'description' => "Description du produit $j",
                    'price' => rand(1000, 10000) / 100,
                    'quantity' => rand(1, 100),
                    'active' => true,
                ]);
            }

            // Création des produits pour chaque vendeur
            for ($j = 1; $j <= 5; $j++) {
                Product::create([
                    'user_id' => $vendor->id,
                    'category_id' => Category::inRandomOrder()->first()->id,
                    'name' => "Produit $j de $vendor->name",
                    'slug' => Str::slug("Produit $j de $vendor->name"),
                    'description' => "Description du produit $j",
                    'price' => rand(1000, 10000) ,
                    'quantity' => rand(1, 100),
                    'active' => true,
                ]);
            }
        }

        // Création des clients
        for ($i = 1; $i <= 10; $i++) {
            $customer = User::create([
                'name' => "Client $i",
                'email' => "client$i@example.com",
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $customer->assignSingleRole('customer');
        }

        // Création des paniers pour les clients
        $customers = User::role('customer')->get();

        foreach ($customers as $customer) {
            // Créer un panier pour chaque client
            $cart = Cart::create([
                'user_id' => $customer->id,
                'active' => 'true',
                'total_price' => 0, // Sera mis à jour après l'ajout des produits
                'total_quantity' => 0,
            ]);

            // Ajouter 1 à 3 produits aléatoires au panier
            $randomProducts = Product::inRandomOrder()
                ->where('active', true)
                ->where('quantity', '>', 0)
                ->take(rand(1, 3))
                ->get();

            $totalPrice = 0;
            $totalQuantity = 0;

            foreach ($randomProducts as $product) {
                $quantity = rand(1, min(3, $product->quantity));
                $itemPrice = $product->price * $quantity;

                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                ]);

                $totalPrice += $itemPrice;
                $totalQuantity += $quantity;
            }

            // Mettre à jour le prix total du panier
            $cart->update([
                'total_price' => $totalPrice,
                'total_quantity' => $totalQuantity,
            ]);
        }

        // Créer quelques paniers archivés (commandes passées)
//        foreach ($customers->take(5) as $customer) {
//            $cart = Cart::create([
//                'user_id' => $customer->id,
//                'status' => 'completed',
//                'total_price' => 0,
//                'completed_at' => now()->subDays(rand(1, 30)), // Date aléatoire dans les 30 derniers jours
//            ]);
//
//            $randomProducts = Product::inRandomOrder()
//                ->where('active', true)
//                ->take(rand(2, 4))
//                ->get();
//
//            $totalPrice = 0;
//
//            foreach ($randomProducts as $product) {
//                $quantity = rand(1, 3);
//                $itemPrice = $product->price * $quantity;
//
//                CartItem::create([
//                    'cart_id' => $cart->id,
//                    'product_id' => $product->id,
//                    'quantity' => $quantity,
//                    'unit_price' => $product->price,
//                    'total_price' => $itemPrice,
//                ]);
//
//                $totalPrice += $itemPrice;
//            }
//
//            $cart->update([
//                'total_price' => $totalPrice,
//            ]);
//        }
    // ======================================
        // CRÉATION DES LIVREURS APPROUVÉS
        // ======================================
        $deliveryZones = [
            [
                'name' => 'Jean Dupont',
                'email' => 'jean.dupont@delivery.cm',
                'phone' => '+237670000001',
                'address' => '123 Rue de la Paix, Yaoundé',
                'city' => 'Yaoundé',
                'postal_code' => '1000',
                'vehicle_type' => 'voiture',
                'vehicle_model' => 'Renault Clio',
                'vehicle_plate' => 'CM-1001-AB',
                'latitude' => 3.8667,
                'longitude' => 11.5167,
                'radius_km' => 8,
                'area' => 'Yaoundé Centre',
            ],
            [
                'name' => 'Marie Kouam',
                'email' => 'marie.kouam@delivery.cm',
                'phone' => '+237670000002',
                'address' => '456 Avenue Clemenceau, Yaoundé',
                'city' => 'Yaoundé',
                'postal_code' => '1002',
                'vehicle_type' => 'moto',
                'vehicle_model' => 'Honda CB500',
                'vehicle_plate' => 'CM-1002-AB',
                'latitude' => 3.8700,
                'longitude' => 11.5100,
                'radius_km' => 5,
                'area' => 'Yaoundé Mvog-Mbi',
            ],
            [
                'name' => 'Paul Tangang',
                'email' => 'paul.tangang@delivery.cm',
                'phone' => '+237670000003',
                'address' => '789 Rue Kennedy, Douala',
                'city' => 'Douala',
                'postal_code' => '2000',
                'vehicle_type' => 'voiture',
                'vehicle_model' => 'Toyota Avanza',
                'vehicle_plate' => 'CM-2001-CD',
                'latitude' => 4.0511,
                'longitude' => 9.7679,
                'radius_km' => 10,
                'area' => 'Douala Centre',
            ],
            [
                'name' => 'Sylvie Ngnong',
                'email' => 'sylvie.ngnong@delivery.cm',
                'phone' => '+237670000004',
                'address' => '321 Boulevard de la Liberté, Douala',
                'city' => 'Douala',
                'postal_code' => '2001',
                'vehicle_type' => 'moto',
                'vehicle_model' => 'Yamaha YZF',
                'vehicle_plate' => 'CM-2002-CD',
                'latitude' => 4.0500,
                'longitude' => 9.7700,
                'radius_km' => 6,
                'area' => 'Douala Bonanjo',
            ],
            [
                'name' => 'Alexandre Lebot',
                'email' => 'alex.lebot@delivery.cm',
                'phone' => '+237670000005',
                'address' => '555 Rue Guimard, Yaoundé',
                'city' => 'Yaoundé',
                'postal_code' => '1003',
                'vehicle_type' => 'voiture',
                'vehicle_model' => 'Nissan Altima',
                'vehicle_plate' => 'CM-1003-AB',
                'latitude' => 3.8750,
                'longitude' => 11.5250,
                'radius_km' => 12,
                'area' => 'Yaoundé Bastos',
            ],
        ];

        $deliveries = [];
        foreach ($deliveryZones as $zone) {
            $deliveryUser = User::create([
                'name' => $zone['name'],
                'email' => $zone['email'],
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $deliveryUser->assignSingleRole('delivery');

            $delivery = Delivery::create([
                'user_id' => $deliveryUser->id,
                'name' => $zone['name'],
                'email' => $zone['email'],
                'phone' => $zone['phone'],
                'address' => $zone['address'],
                'city' => $zone['city'],
                'postal_code' => $zone['postal_code'],
                'delivery_latitude' => $zone['latitude'],
                'delivery_longitude' => $zone['longitude'],
                'delivery_radius_km' => $zone['radius_km'],
                'delivery_area' => $zone['area'],
                'availability' => 'Lun-Ven 7h-18h, Sam 8h-14h',
                'vehicle_type' => $zone['vehicle_type'],
                'vehicle_model' => $zone['vehicle_model'],
                'vehicle_plate' => $zone['vehicle_plate'],
                'id_card' => 'ID-' . strtoupper(Str::random(8)),
                'id_driver_license' => 'LIC-' . strtoupper(Str::random(8)),
                'insurance_certificate' => 'INS-' . strtoupper(Str::random(8)),
                'delivery_experience' => rand(1, 10) . ' ans d\'expérience',
                'statut' => 'approuvé', // Statut approuvé pour les tests
            ]);

            $deliveries[] = $delivery;
        }

        // ======================================
        // CRÉATION DES COMMANDES DE TEST
        // ======================================
        $products = Product::all();

        // Zone 1 - Yaoundé Centre (Jean Dupont - 3.8667, 11.5167, rayon 8km)
        $yaoundeOrders = [
            [
                'lat' => 3.8700,
                'lng' => 11.5200,
                'address' => '100 Rue Foch, Yaoundé',
                'status' => 'pending',
                'total' => 15000,
            ],
            [
                'lat' => 3.8650,
                'lng' => 11.5100,
                'address' => '200 Av. Clemenceau, Yaoundé',
                'status' => 'pending',
                'total' => 25000,
            ],
            [
                'lat' => 3.8680,
                'lng' => 11.5220,
                'address' => '300 Rue Kennedy, Yaoundé',
                'status' => 'pending',
                'total' => 18500,
            ],
            [
                'lat' => 3.8720,
                'lng' => 11.5180,
                'address' => '400 Boulevard de la République, Yaoundé',
                'status' => 'pending',
                'total' => 32000,
            ],
            [
                'lat' => 3.8600,
                'lng' => 11.5300,
                'address' => '500 Rue Bastos, Yaoundé',
                'status' => 'delivered',
                'total' => 12500,
            ],
        ];

        // Zone 2 - Douala Centre (Paul Tangang - 4.0511, 9.7679, rayon 10km)
        $doualaOrders = [
            [
                'lat' => 4.0550,
                'lng' => 9.7700,
                'address' => '150 Boulevard de la Liberté, Douala',
                'status' => 'pending',
                'total' => 20000,
            ],
            [
                'lat' => 4.0480,
                'lng' => 9.7600,
                'address' => '250 Rue Joss, Douala',
                'status' => 'pending',
                'total' => 28000,
            ],
            [
                'lat' => 4.0530,
                'lng' => 9.7750,
                'address' => '350 Avenue du Wouri, Douala',
                'status' => 'pending',
                'total' => 22000,
            ],
        ];

        // Créer les commandes pour Yaoundé
        foreach ($yaoundeOrders as $orderData) {
            $customer = $customers->random();
            $randomProducts = Product::inRandomOrder()
                ->where('active', true)
                ->take(rand(1, 3))
                ->get();

            $order = Order::create([
                'user_id' => $customer->id,
                'delivery_id' => $deliveries[0]->id, // Jean Dupont
                'delivery_address' => $orderData['address'],
                'delivery_address_latitude' => $orderData['lat'],
                'delivery_address_longitude' => $orderData['lng'],
                'status' => $orderData['status'],
                'total' => $orderData['total'],
            ]);

            // Ajouter les produits à la commande
            foreach ($randomProducts as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                ]);
            }
        }

        // Créer les commandes pour Douala
        foreach ($doualaOrders as $orderData) {
            $customer = $customers->random();
            $randomProducts = Product::inRandomOrder()
                ->where('active', true)
                ->take(rand(1, 3))
                ->get();

            $order = Order::create([
                'user_id' => $customer->id,
                'delivery_id' => $deliveries[2]->id, // Paul Tangang
                'delivery_address' => $orderData['address'],
                'delivery_address_latitude' => $orderData['lat'],
                'delivery_address_longitude' => $orderData['lng'],
                'status' => $orderData['status'],
                'total' => $orderData['total'],
            ]);

            // Ajouter les produits à la commande
            foreach ($randomProducts as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                ]);
            }
        }

        // Créer quelques commandes sans livreur assigné (à disposition)
        $availableOrders = [
            [
                'lat' => 3.8710,
                'lng' => 11.5140,
                'address' => '999 Rue Messina, Yaoundé',
                'total' => 16000,
            ],
            [
                'lat' => 3.8690,
                'lng' => 11.5240,
                'address' => '888 Rue Ngoumou, Yaoundé',
                'total' => 19000,
            ],
            [
                'lat' => 4.0510,
                'lng' => 9.7680,
                'address' => '777 Boulevard King, Douala',
                'total' => 24000,
            ],
        ];

        foreach ($availableOrders as $orderData) {
            $customer = $customers->random();
            $randomProducts = Product::inRandomOrder()
                ->where('active', true)
                ->take(rand(1, 3))
                ->get();

            $order = Order::create([
                'user_id' => $customer->id,
                'delivery_address' => $orderData['address'],
                'delivery_address_latitude' => $orderData['lat'],
                'delivery_address_longitude' => $orderData['lng'],
                'status' => 'pending',
                'total' => $orderData['total'],
            ]);

            // Ajouter les produits à la commande
            foreach ($randomProducts as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                    // 'price' => $product->price,
                ]);
            }
        }
    }
}
