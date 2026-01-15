<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Report;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Signaler un produit
     */
    public function reportProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'reason' => 'required|string|in:' . implode(',', array_keys(Report::REASONS)),
            'description' => 'nullable|string|max:1000',
        ]);

        // Vérifier si l'utilisateur a déjà signalé ce produit
        $existingReport = Report::where('user_id', Auth::id())
            ->where('reportable_type', Product::class)
            ->where('reportable_id', $product->id)
            ->first();

        if ($existingReport) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Vous avez déjà signalé ce produit.',
            ]);
        }

        Report::create([
            'user_id' => Auth::id(),
            'reportable_type' => Product::class,
            'reportable_id' => $product->id,
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Merci pour votre signalement. Notre équipe va l\'examiner.',
        ]);
    }

    /**
     * Signaler une boutique
     */
    public function reportShop(Request $request, Shop $shop)
    {
        $validated = $request->validate([
            'reason' => 'required|string|in:' . implode(',', array_keys(Report::REASONS)),
            'description' => 'nullable|string|max:1000',
        ]);

        // Vérifier si l'utilisateur a déjà signalé cette boutique
        $existingReport = Report::where('user_id', Auth::id())
            ->where('reportable_type', Shop::class)
            ->where('reportable_id', $shop->id)
            ->first();

        if ($existingReport) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Vous avez déjà signalé cette boutique.',
            ]);
        }

        Report::create([
            'user_id' => Auth::id(),
            'reportable_type' => Shop::class,
            'reportable_id' => $shop->id,
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Merci pour votre signalement. Notre équipe va l\'examiner.',
        ]);
    }
}
