<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Plan gratuit pour commencer à vendre',
                'price' => 0,
                'product_limit' => 10,
                'commission_rate' => 15.00,
                'has_badge' => false,
                'badge_label' => null,
                'priority_search' => false,
                'featured_placement' => false,
                'dedicated_support' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Pour les vendeurs en croissance',
                'price' => 9900,
                'product_limit' => 50,
                'commission_rate' => 10.00,
                'has_badge' => true,
                'badge_label' => 'Pro',
                'priority_search' => true,
                'featured_placement' => false,
                'dedicated_support' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Pour les vendeurs professionnels',
                'price' => 29900,
                'product_limit' => null,
                'commission_rate' => 5.00,
                'has_badge' => true,
                'badge_label' => 'Enterprise',
                'priority_search' => true,
                'featured_placement' => true,
                'dedicated_support' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
