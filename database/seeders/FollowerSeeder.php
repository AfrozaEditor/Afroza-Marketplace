<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Shop;

class FollowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer tous les clients
        $customers = User::role('customer')->get();
        
        // Récupérer toutes les boutiques
        $shops = Shop::all();

        // Pour chaque client, suivre 1 à 3 boutiques aléatoires
        foreach ($customers as $customer) {
            $randomShops = $shops->random(rand(1, 3));
            
            foreach ($randomShops as $shop) {
                $shop->followers()->attach($customer->id, [
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
