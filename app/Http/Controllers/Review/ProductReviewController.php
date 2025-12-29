<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\ProductReviewVote;
use App\Models\ShopReview;
use App\Models\ShopReviewVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductReviewController extends Controller
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
        $validated = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'rating'    => 'required|integer|min:1|max:5',
            // 'title'     => 'nullable|string|max:255',
            'comment'   => 'required|string|max:1000',
        ]);

        $review = ProductReview::create([
            'product_id'   => $validated['product_id'],
            'user_id'   => auth()->id(),
            'rating'    => $validated['rating'],
            // 'title'     => $validated['title'] ?? null,
            'reviewer_name' => Auth::user()->name,
            'reviewer_email' => Auth::user()->email,
            'comment'   => $validated['comment'],
            'is_approved' => false, // à approuver par un admin si besoin
        ]);

        // Optionnel : notifier le propriétaire de la boutique ou afficher un message de succès
        return redirect()->back()->with('success', 'Votre avis a été enregistré et sera publié après validation.');
    }

    public function userReview(Request $request, $productId)
    {
        $review = ProductReview::where('product_id', $productId)
            ->where('user_id', auth()->id())
            ->first();

        return response()->json($review);
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
        // Récupérer l'avis à modifier
        $review = ProductReview::where('id', $id)
            ->where('user_id', auth()->id()) // S'assurer que l'utilisateur est bien le propriétaire de l'avis
            ->firstOrFail();

        $validated = $request->validate([
            'rating'    => 'required|integer|min:1|max:5',
            // 'title'     => 'nullable|string|max:255',
            'comment'   => 'required|string|max:1000',
        ]);

        $review->update([
            'rating'    => $validated['rating'],
            // 'title'     => $validated['title'] ?? null,
            'comment'   => $validated['comment'],
            'is_approved' => false, // Peut-être réinitialiser à false si une nouvelle approbation est requise après modification
        ]);

        return redirect()->back()->with('success', 'Votre avis a été mis à jour avec succès et sera publié après validation.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function vote(Request $request, ProductReview $review)
    {
        $type = $request->input('type');
        $userId = auth()->id();

        // Vérifier si l'utilisateur a déjà voté
        $existingVote = ProductReviewVote::where('review_id', $review->id)
            ->where('user_id', $userId)
            ->first();

        if ($existingVote) {
            if ($existingVote->type === $type) {
                // Si même vote, on supprime
                $existingVote->delete();
                $message = 'Vote retiré';
            } else {
                // Si vote différent, on met à jour
                $existingVote->update(['type' => $type]);
                $message = 'Vote mis à jour';
            }
        } else {
            // Créer un nouveau vote
            ProductReviewVote::create([
                'review_id' => $review->id,
                'user_id' => $userId,
                'type' => $type
            ]);
            $message = 'Vote enregistré';
        }

        // Mettre à jour les compteurs
        $review->helpful = $review->votes()->where('type', 'helpful')->count();
        $review->not_helpful = $review->votes()->where('type', 'not_helpful')->count();
        $review->save();

        return back()->with([
            'message' => $message,
            'helpful' => $review->helpful,
            'notHelpful' => $review->not_helpful
        ]);
    }

    public function report(Request $request, ProductReview $review)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:255',
            'details' => 'required|string|max:1000'
        ]);

        // Créer le signalement
        $report = $review->reports()->create([
            'user_id' => auth()->id(),
            'reason' => $validated['reason'],
            'details' => $validated['details']
        ]);

        return back()->with('message', 'Avis signalé avec succès');
    }
}
