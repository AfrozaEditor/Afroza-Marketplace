<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->integer('price')->default(0);
            $table->integer('product_limit')->nullable();
            $table->decimal('commission_rate', 5, 2)->default(15.00);
            $table->boolean('has_badge')->default(false);
            $table->string('badge_label')->nullable();
            $table->boolean('priority_search')->default(false);
            $table->boolean('featured_placement')->default(false);
            $table->boolean('dedicated_support')->default(false);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
