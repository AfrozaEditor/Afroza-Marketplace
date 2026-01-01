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
        Schema::table('deliveries', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('statut');
            $table->text('suspension_reason')->nullable()->after('rejection_reason');
            $table->timestamp('approved_at')->nullable()->after('suspension_reason');
            $table->timestamp('rejected_at')->nullable()->after('approved_at');
            $table->timestamp('suspended_at')->nullable()->after('rejected_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            $table->dropColumn([
                'rejection_reason',
                'suspension_reason',
                'approved_at',
                'rejected_at',
                'suspended_at',
            ]);
        });
    }
};
