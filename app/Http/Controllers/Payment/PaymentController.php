<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Services\Cinetpay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Services\LygosService;
use Illuminate\Support\Str;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

//     public function initiatePaiement(Request $request)
//     {
//         // Générer un ID de transaction unique
//         $transactionId = 'TX-' . time() . '-' . rand(1000, 9999);

//         // Récupérer le montant depuis votre panier ou le formulaire
//         $amount = $request->total ?? 100; // Montant en FCFA

//         // Configuration CinetPay
//         $siteId = config('cinetpay.site_id');
//         $apiKey = config('cinetpay.api_key');

//         // URL de notification et de retour
//         $notifyUrl = route('payment.notify');
//         $returnUrl = route('payment.return');

//         // Description de la transaction
//         $description = "Achat sur Afroza Marketplace";

//         try {
//             // Initialisation de CinetPay
//             $cinetpay = new CinetPay($siteId, $apiKey);

//             // Création du tableau de paramètres
//             $params = [
//                 'transaction_id'    => $transactionId,
//                 'amount'            => $amount,
//                 'currency'          => 'XAF',
//                 'description'       => $description,
//                 'return_url'        => $returnUrl,
//                 'notify_url'        => $notifyUrl,
//                 'customer_name'     => $request->firstName,
//                 'customer_surname' => $request->lastName,
//                 'customer_email'    => $request->email,
//                 'customer_phone'    => $request->phone,
//                 'customer_address'  => $request->address,
//                 'customer_city'     => $request->city,
//                 'customer_country'  => $request->country ?? 'CE',
//                 'customer_zip_code' => $request->postalCode,
//                 'channels'          => 'ALL',
//                 'lang'              => 'fr',
//                 'invoice_data'      => [
//                     'product_name' => 'Achat sur Afroza Marketplace',
//                     'order_id'     => $transactionId
//                 ],
//                 'metadata'          => json_encode(['user_id' => auth()->id()])
//             ];

//             // Obtenir le lien de paiement
//             $paymentResponse = $cinetpay->generatePaymentLink($params);
//             \Log::info('Réponse CinetPay:', $paymentResponse);


//             // Vérifier si nous avons une URL de paiement et rediriger
//             if (isset($paymentResponse['data']['payment_url'])) {
// //                return redirect()->away($paymentResponse['data']['payment_url']);
// //                return response()->json([
// //                    'success' => true,
// //                    'payment_url' => $paymentResponse['data']['payment_url'],
// //                ]);
//                 return Inertia::location($paymentResponse['data']['payment_url']);
//             } else {
//                 // Problème avec la réponse
//                 $errorMsg = $paymentResponse['message'] ?? 'Impossible de générer le lien de paiement';
//                 return redirect()->back()->with('error', $errorMsg);
//             }

//         } catch (\Exception $e) {
//             // Journaliser l'erreur complète pour le débogage
//             \Log::error('Erreur CinetPay: ' . $e->getMessage());
//             return redirect()->back()->with('error', 'Erreur de paiement: ' . $e->getMessage());
//         }

//         \Log::info('Paramètres CinetPay:', $params);
//         \Log::info('Réponse CinetPay:', $paymentResponse);

//     }

    // public function handleNotification(Request $request)
    // {
    //     // Récupérer les paramètres
    //     $transactionId = $request->input('cpm_trans_id');

    //     try {
    //         // Vérifier le statut de la transaction
    //         $cinetpay = new CinetPay(config('cinetpay.site_id'), config('cinetpay.api_key'));
    //         $paymentData = $cinetpay->getPayStatus($transactionId);

    //         if ($paymentData['code'] == '00') {
    //             // Paiement réussi
    //             // Mettre à jour votre commande en base de données
    //             // ...

    //             return response('Payment successful', 200);
    //         } else {
    //             // Paiement échoué
    //             // Mettre à jour le statut de la commande
    //             // ...

    //             return response('Payment failed: ' . $paymentData['message'], 400);
    //         }
    //     } catch (\Exception $e) {
    //         return response('Error: ' . $e->getMessage(), 500);
    //     }
    // }

    // public function handleReturn(Request $request)
    // {
    //     // Récupérer les paramètres
    //     $transactionId = $request->input('cpm_trans_id');
    //     $status = $request->input('cpm_result');

    //     if ($status == '00') {
    //         // Paiement réussi
    //         return redirect()->route('commandes.success')->with('success', 'Paiement réussi !');
    //     } else {
    //         // Paiement échoué
    //         return redirect()->route('commandes.failed')->with('error', 'Le paiement a échoué.');
    //     }
    // }



    

public function createPayment(Request $request, LygosService $lygos)
{
    try {
    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'Non authentifié'], 401);
    }


    /**
     * 1️⃣ Récupérer le panier côté backend
     */
    $cart = $user->cart()->with('items.product')->firstOrFail();

    /**
     * 2️⃣ Recalculer le montant (SÉCURITÉ)
     */
    $subTotal = $cart->items->sum(fn ($item) =>
        $item->product->price * $item->quantity
    );

    /**
     * 2️⃣bis Utiliser le shipping_cost envoyé par le frontend
     * car il peut varier selon la méthode (express, pickup, standard)
     */
    $shippingCost = (int) ($request->shipping_cost ?? 0);
    $totalAmount = (int) ceil($subTotal + $shippingCost);


    /**
     * 3️⃣ Créer la commande AVANT paiement
     */
    // $order = Order::create([
    //     'user_id' => $user->id,
    //     // 'reference' => 'CMD-' . strtoupper(Str::random(10)),
    //     'total' => $totalAmount,
    //     'status' => 'pending',
    //     // 'shipping_address' => $request->shipping,
    //     // 'billing_address' => $request->billing,
    //     // 'shipping_method' => $request->shippingMethod,
    // ]);

    /**
     * 4️⃣ Données Lygos (100% backend)
     */
    $data = [
        'amount' => $totalAmount,
        'shop_name' => config('app.name'),
        // 'message' => 'Paiement commande ' . $order->reference,
        // 'success_url' => route('payment.success', $order->id),
        // 'failure_url' => route('payment.failure', $order->id),
        // 'order_id' => $order->reference,
    ];

    \Log::info('Lygos payload', [
        'subTotal' => $subTotal,
        'shippingCost' => $shippingCost,
        'totalAmount' => $totalAmount,
        'shipping_method' => $request->shipping_method,
        'data' => $data
    ]);

    /**
     * 5️⃣ Appel API Lygos
     */
    $result = $lygos->createGateway($data);

    \Log::info('Lygos response', $result ?? []);

    if (!isset($result['link'])) {
        return response()->json([
            'message' => 'Erreur Lygos'
        ], 500);
    }

    /**
     * 6️⃣ Sauvegarder l’ID Lygos
     */
    // $order->update([
    //     'gateway_id' => $result['id'],
    // ]);

    /**
     * 7️⃣ Retourner UNIQUEMENT le lien
     */
    return response()->json([
        'payment_url' => $result['link'],
    ]);

    } catch (\Throwable $e) {
        \Log::error('Paiement error', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'message' => 'Erreur serveur',
            'error' => $e->getMessage()
        ], 500);
    }
}


}
