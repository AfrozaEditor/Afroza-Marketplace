<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
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
    }
}
