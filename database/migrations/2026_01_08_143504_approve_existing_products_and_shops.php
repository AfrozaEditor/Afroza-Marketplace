<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Approuver toutes les boutiques existantes
        DB::table('shops')
            ->whereNull('is_approved')
            ->orWhere('is_approved', false)
            ->update([
                'is_approved' => true,
                'approved_at' => now(),
            ]);

        // Approuver tous les produits existants
        DB::table('products')
            ->whereNull('is_approved')
            ->orWhere('is_approved', false)
            ->update([
                'is_approved' => true,
                'approved_at' => now(),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // On ne fait rien en rollback, car on ne peut pas savoir
        // quels produits/boutiques étaient "vraiment" non approuvés avant
    }
};
