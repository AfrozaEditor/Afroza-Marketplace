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
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('rating')->default(0); // Rating out of 5
            $table->text('comment')->nullable(); // Optional comment
            $table->boolean('is_approved')->default(false); // Review approval status
            $table->timestamp('approved_at')->nullable(); // Timestamp for when the review was approved
            $table->string('reviewer_name')->nullable(); // Name of the reviewer, if provided
            $table->string('reviewer_email')->nullable(); // Email of the reviewer, if provided
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};
