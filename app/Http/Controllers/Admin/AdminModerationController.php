<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ProductReviewReport;
use App\Models\ShopReview;
use App\Models\ShopReviewReport;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminModerationController extends Controller
{
    /**
     * Afficher le tableau de bord de modération
     */
    public function index(Request $request)
    {
        $tab = $request->get('tab', 'product_reviews');
        
        // Compter les signalements en attente (avis non approuvés)
        $productReviewReportsCount = ProductReviewReport::whereHas('review', function ($q) {
            $q->where('is_approved', true);
        })->count();
        
        $shopReviewReportsCount = ShopReviewReport::whereHas('review', function ($q) {
            $q->where('is_approved', true);
        })->count();
        
        // Récupérer les avis produits signalés (avis existants non supprimés)
        $productReviewReports = ProductReviewReport::with(['review.user', 'review.product', 'user'])
            ->whereHas('review')
            ->latest()
            ->paginate(10, ['*'], 'product_page')
            ->withQueryString();
            
        // Récupérer les avis boutiques signalés
        $shopReviewReports = ShopReviewReport::with(['review.user', 'review.shop', 'user'])
            ->whereHas('review')
            ->latest()
            ->paginate(10, ['*'], 'shop_page')
            ->withQueryString();

        // Récupérer les produits signalés (si applicable)
        // $reportedProducts = Product::where('status', 'reported')
        //     ->with(['user', 'category'])
        //     ->latest()
        //     ->paginate(10, ['*'], 'products_page')
        //     ->withQueryString();

        // Statistiques
        $stats = [
            'total_product_review_reports' => ProductReviewReport::count(),
            'pending_product_review_reports' => $productReviewReportsCount,
            'total_shop_review_reports' => ShopReviewReport::count(),
            'pending_shop_review_reports' => $shopReviewReportsCount,
            // 'reported_products' => Product::where('status', 'reported')->count(),
            // 'blocked_users' => User::where('status', 'blocked')->count(),
        ];
        
        return Inertia::render('admin/moderation/index', [
            'productReviewReports' => $productReviewReports,
            'shopReviewReports' => $shopReviewReports,
            // 'reportedProducts' => $reportedProducts,
            'stats' => $stats,
            'currentTab' => $tab,
        ]);
    }

    /**
     * Approuver un avis produit (ignorer le signalement)
     */
    public function approveProductReview(ProductReview $review)
    {
        $review->update(['is_approved' => true]);
        
        // Supprimer les signalements associés
        ProductReviewReport::where('review_id', $review->id)->delete();
        
        return back()->with('success', 'Avis approuvé et signalements supprimés.');
    }

    /**
     * Rejeter/Supprimer un avis produit
     */
    public function rejectProductReview(ProductReview $review)
    {
        $review->update(['is_approved' => false]);
        
        return back()->with('success', 'Avis rejeté.');
    }

    /**
     * Supprimer définitivement un avis produit
     */
    public function deleteProductReview(ProductReview $review)
    {
        $review->delete();
        
        return back()->with('success', 'Avis supprimé définitivement.');
    }

    /**
     * Approuver un avis boutique (ignorer le signalement)
     */
    public function approveShopReview(ShopReview $review)
    {
        $review->update(['is_approved' => true]);
        
        // Supprimer les signalements associés
        ShopReviewReport::where('review_id', $review->id)->delete();
        
        return back()->with('success', 'Avis approuvé et signalements supprimés.');
    }

    /**
     * Rejeter/Supprimer un avis boutique
     */
    public function rejectShopReview(ShopReview $review)
    {
        $review->update(['is_approved' => false]);
        
        return back()->with('success', 'Avis rejeté.');
    }

    /**
     * Supprimer définitivement un avis boutique
     */
    public function deleteShopReview(ShopReview $review)
    {
        $review->delete();
        
        return back()->with('success', 'Avis supprimé définitivement.');
    }

    /**
     * Approuver un produit signalé
     */
    public function approveProduct(Product $product)
    {
        $product->update(['status' => 'active']);
        
        return back()->with('success', 'Produit approuvé.');
    }

    /**
     * Rejeter un produit signalé
     */
    public function rejectProduct(Product $product)
    {
        $product->update(['status' => 'rejected']);
        
        return back()->with('success', 'Produit rejeté.');
    }

    /**
     * Supprimer un signalement d'avis produit
     */
    public function dismissProductReviewReport(ProductReviewReport $report)
    {
        $report->delete();
        
        return back()->with('success', 'Signalement ignoré.');
    }

    /**
     * Supprimer un signalement d'avis boutique
     */
    public function dismissShopReviewReport(ShopReviewReport $report)
    {
        $report->delete();
        
        return back()->with('success', 'Signalement ignoré.');
    }

    /**
     * Bloquer un utilisateur
     */
    public function blockUser(User $user)
    {
        $user->update(['status' => 'blocked']);
        
        return back()->with('success', 'Utilisateur bloqué.');
    }

    /**
     * Débloquer un utilisateur
     */
    public function unblockUser(User $user)
    {
        $user->update(['status' => 'active']);
        
        return back()->with('success', 'Utilisateur débloqué.');
    }
}
