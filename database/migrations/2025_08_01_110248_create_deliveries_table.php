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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Volet 1 : infos perso
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('address');
            $table->string('city');
            $table->string('postal_code')->nullable();

            // Volet 2 : véhicule
            $table->string('vehicle_type')->nullable(); // Type de véhicule (voiture, moto, vélo, etc.)
            $table->string('vehicle_model')->nullable(); // Modèle du véhicule
            $table->string('vehicle_plate')->nullable(); // Plaque d'immatriculation du

            // Volet 3 : zone de livraison (circulaire)
            $table->decimal('delivery_latitude', 10, 8)->nullable(); // Latitude du centre de la zone
            $table->decimal('delivery_longitude', 11, 8)->nullable(); // Longitude du centre de la zone
            $table->decimal('delivery_radius_km', 5, 2)->nullable(); // Rayon de livraison en km
            $table->string('delivery_area')->nullable(); // Zone de livraison (par exemple, nom de la ville ou du quartier)
            $table->string('availability')->nullable(); // Disponibilité du livreur (par exemple, horaires de travail)


            // Volet 4 : documents légaux
            $table->string('id_card'); // Carte d'identité
            $table->string('url_id_card')->nullable(); // URL de la carte d'identité
            $table->string('id_driver_license'); // Permis de conduire
            $table->string('url_driver_license')->nullable(); // URL du permis de conduire
            $table->string('insurance_certificate')->nullable(); // Certificat d'assurance
            $table->string('url_insurance_certificate')->nullable(); // URL du certificat d'assurance
            $table->text('delivery_experience')->nullable(); // Expérience de livraison

            $table->string('statut')->default('en attente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
