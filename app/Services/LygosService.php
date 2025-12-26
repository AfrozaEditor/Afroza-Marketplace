<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LygosService
{
    public function createGateway(array $data)
    {
        $response = Http::withHeaders([
            'api-key' => config('services.lygos.api_key'),
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post(config('services.lygos.base_url') . '/gateway', $data);

        return $response->json();
        // $response = Http::withToken(config('services.lygos.api_key'))
        //     ->post(config('services.lygos.base_url') . '/gateway/create', $data);

        // // Log::info('Lygos sandbox response', $response);

        // if (!$response->successful()) {
        //     throw new \Exception('Erreur Lygos sandbox');
        // }

        // return $response->json();
    }
}
