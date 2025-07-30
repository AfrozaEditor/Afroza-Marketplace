import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '@/components/ui/button';

function ProductReview() {

    // const [reviews, setReviews] = useState<Review[]>(initialReviews);
    // const [showAddReview, setShowAddReview] = useState(false);

    // const handleReviewAdded = (newReview: Review) => {
    //     setReviews(prev => [newReview, ...prev]);
    //     setShowAddReview(false);
    // };

    // const averageRating = reviews.length > 0
    //     ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    //     : 0;

    // const renderStars = (rating: number) => {
    //     return Array.from({ length: 5 }, (_, i) => (
    //         <Star
    //             key={i}
    //             className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    //         />
    //     ));
    // };

    return (
        <div className="px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {/*<span>Avis clients ({reviews.length})</span>*/}
                        <span>Avis clients (0)</span>
                        {/*{!showAddReview && (*/}
                        {/*    <Button */}
                        {/*        // onClick={() => setShowAddReview(true)}*/}
                        {/*        variant="outline"*/}
                        {/*    >*/}
                        {/*        Laisser un avis*/}
                        {/*    </Button>*/}
                        {/*)}*/}
                    </CardTitle>
                    {/*{reviews.length > 0 && (*/}
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                {/*{renderStars(averageRating)}*/}
                            </div>
                            {/*<span className="font-medium">{averageRating.toFixed(1)}</span>*/}
                            <span className="font-medium">{5}</span>
                            <span className="text-muted-foreground">sur 5</span>
                        </div>
                    {/*)}*/}
                </CardHeader>
                <CardContent>
                    {/*{reviews.length === 0 ? (*/}
                    {/*    <p className="text-muted-foreground text-center py-8">*/}
                    {/*        Aucun avis pour ce produit. Soyez le premier à laisser un avis !*/}
                    {/*    </p>*/}
                    {/*) : (*/}
                        <div className="space-y-4">
                            {/*{reviews.map((review) => (*/}
                            {/*    <ReviewCard key={review.id} review={review} />*/}
                            {/*))}*/}
                        </div>
                    {/*)}*/}
                </CardContent>
            </Card>

            {/*{showAddReview && (*/}
            {/*    <AddReviewForm*/}
            {/*        productId={productId}*/}
            {/*        onReviewAdded={handleReviewAdded}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
}

export default ProductReview;
