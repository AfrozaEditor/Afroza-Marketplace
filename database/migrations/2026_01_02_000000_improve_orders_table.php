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
            // Numéro de commande unique
            $table->string('order_number')->unique()->after('id');
            
            // Informations client
            $table->string('customer_name')->nullable()->after('user_id');
            $table->string('customer_email')->nullable()->after('customer_name');
            $table->string('customer_phone')->nullable()->after('customer_email');
            
            // Adresse de livraison détaillée
            $table->string('delivery_city')->nullable()->after('delivery_address');
            $table->string('delivery_region')->nullable()->after('delivery_city');
            $table->string('delivery_postal_code')->nullable()->after('delivery_region');
            
            // Mode de livraison et frais
            $table->enum('shipping_method', ['standard', 'express', 'pickup'])->default('standard')->after('delivery_postal_code');
            $table->decimal('shipping_cost', 10, 2)->default(0)->after('shipping_method');
            
            // Paiement
            $table->enum('payment_method', ['card', 'mobile_money', 'cash_on_delivery', 'bank_transfer'])->default('mobile_money')->after('shipping_cost');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending')->after('payment_method');
            $table->string('payment_reference')->nullable()->after('payment_status');
            $table->timestamp('paid_at')->nullable()->after('payment_reference');
            
            // Statut amélioré
            $table->dropColumn('status');
        });
        
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', [
                'pending',          // En attente de paiement
                'confirmed',        // Paiement confirmé
                'processing',       // En préparation
                'shipped',          // Expédié
                'out_for_delivery', // En cours de livraison
                'delivered',        // Livré
                'cancelled',        // Annulé
                'refunded'          // Remboursé
            ])->default('pending')->after('payment_reference');
            
            // Notes et tracking
            $table->text('notes')->nullable()->after('status');
            $table->string('tracking_number')->nullable()->after('notes');
            $table->timestamp('shipped_at')->nullable()->after('tracking_number');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
            $table->timestamp('cancelled_at')->nullable()->after('delivered_at');
            $table->string('cancellation_reason')->nullable()->after('cancelled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_number',
                'customer_name',
                'customer_email',
                'customer_phone',
                'delivery_city',
                'delivery_region',
                'delivery_postal_code',
                'shipping_method',
                'shipping_cost',
                'payment_method',
                'payment_status',
                'payment_reference',
                'paid_at',
                'notes',
                'tracking_number',
                'shipped_at',
                'delivered_at',
                'cancelled_at',
                'cancellation_reason',
            ]);
            
            $table->dropColumn('status');
        });
        
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pending', 'delivered', 'cancelled'])->default('pending');
        });
    }
};
