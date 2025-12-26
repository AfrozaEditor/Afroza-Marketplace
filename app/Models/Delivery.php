<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'postal_code',
        'polygon_coordinates',
        'delivery_area',
        'availability',
        'vehicle_type',
        'vehicle_model',
        'vehicle_plate',
        'id_card',
        'url_id_card',
        'id_driver_license',
        'url_driver_license',
        'insurance_certificate',
        'url_insurance_certificate',
        'delivery_experience',
        'statut'
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
