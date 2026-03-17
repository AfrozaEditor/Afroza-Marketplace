<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('active');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->string('rejection_reason')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Backfill existing vendors with Starter plan
        $starterPlan = \App\Models\SubscriptionPlan::where('slug', 'starter')->first();
        if ($starterPlan) {
            $vendorUsers = \App\Models\User::role('vendor')->get();
            foreach ($vendorUsers as $vendor) {
                \App\Models\Subscription::create([
                    'user_id' => $vendor->id,
                    'subscription_plan_id' => $starterPlan->id,
                    'status' => 'active',
                    'starts_at' => $vendor->created_at,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
