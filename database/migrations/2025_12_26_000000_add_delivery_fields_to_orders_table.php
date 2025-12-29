<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('delivery_id')->nullable()->constrained('deliveries')->cascadeOnDelete();
            $table->string('delivery_address')->nullable(); // Full delivery address
            $table->decimal('delivery_address_latitude', 10, 8)->nullable(); // Latitude of delivery address
            $table->decimal('delivery_address_longitude', 11, 8)->nullable(); // Longitude of delivery address
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['delivery_id']);
            $table->dropColumn(['delivery_id', 'delivery_address', 'delivery_address_latitude', 'delivery_address_longitude']);
        });
    }
};
