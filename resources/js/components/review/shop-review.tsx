import { Flag, MoreVertical, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { Shop } from '@/types';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';

// interface Review {
//     id: number;
//     userId: number;
//     userName: string;
//     userAvatar: string;
//     rating: number;
//     title: string;
//     comment: string;
//     date: string;
//     helpful: number;
//     notHelpful: number;
//     verified: boolean;
//     productName?: string;
// }
// Données d'exemple des avis
// const reviews: Review[] = [
//     {
//         id: 1,
//         userId: 1,
//         userName: 'Marie Dupont',
//         userAvatar: 'https://source.unsplash.com/ieic5Tq8YMk',
//         rating: 5,
//         title: 'Excellent vendeur !',
//         comment: 'Très satisfaite de mon achat. L\'article était exactement comme décrit, envoi rapide et soigné. Je recommande vivement cette boutique !',
//         date: '2024-01-15',
//         helpful: 12,
//         notHelpful: 0,
//         verified: true,
//         productName: 'Robe fleurie d\'été'
//     },
//     // {
//     //     id: 2,
//     //     userId: 2,
//     //     userName: 'Julie Martin',
//     //     userAvatar: 'https://source.unsplash.com/hCb3lIB8L8E',
//     //     rating: 4,
//     //     title: 'Bonne qualité',
//     //     comment: 'Article conforme à la description. Quelques signes d\'usure mais rien de grave. Communication fluide avec le vendeur.',
//     //     date: '2024-01-10',
//     //     helpful: 8,
//     //     notHelpful: 1,
//     //     verified: true,
//     //     productName: 'Sac à main cuir'
//     // },
//     {
//         id: 3,
//         userId: 3,
//         userName: 'Claire Rousseau',
//         userAvatar: 'https://source.unsplash.com/KPDbRyFOTnE',
//         rating: 5,
//         title: 'Parfait !',
//         comment: 'Transaction parfaite du début à la fin. Article neuf, emballage soigné, livraison rapide. Merci !',
//         date: '2024-01-08',
//         helpful: 15,
//         notHelpful: 0,
//         verified: true,
//         productName: 'Veste en cuir'
//     },
//     {
//         id: 4,
//         userId: 4,
//         userName: 'Anne Leblanc',
//         userAvatar: 'https://source.unsplash.com/QRKJwE6yfJo',
//         rating: 4,
//         title: 'Correct',
//         comment: 'L\'article correspond à la description mais j\'attendais un peu mieux pour le prix. Cela reste correct.',
//         date: '2024-01-05',
//         helpful: 4,
//         notHelpful: 2,
//         verified: false
//     }
// ];

interface Props {
    shop: Shop;
}

function ShopReview({shop}: Props) {

    const [sortBy, setSortBy] = useState('newest');
    const [filterRating, setFilterRating] = useState('all');
    const [newReview, setNewReview] = useState({
        rating: 0,
        title: '',
        comment: ''
    });
    const [showReviewForm, setShowReviewForm] = useState(false);

    const averageRating = shop.reviews.reduce((sum, review) => sum + review.rating, 0) / shop.reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: shop.reviews.filter(r => r.rating === rating).length,
        percentage: (shop.reviews.filter(r => r.rating === rating).length / shop.reviews.length) * 100
    }));

    const handleSubmitReview = () => {
        if (newReview.rating === 0 || !newReview.comment.trim()) {
            // toast({
            //     title: "Erreur",
            //     description: "Veuillez remplir tous les champs obligatoires.",
            //     variant: "destructive"
            // });
            return;
        }

        // router.post(route(''))

        // toast({
        //     title: "Avis publié",
        //     description: "Votre avis a été publié avec succès.",
        // });

        setNewReview({ rating: 0, title: '', comment: '' });
        setShowReviewForm(false);
    };

    const handleHelpfulVote = (id: number, type: 'helpful' | 'notHelpful') => {
        // toast({
        //     title: "Vote enregistré",
        //     description: "Merci pour votre retour !",
        // });
    };

    // const renderStars = (rating: number, size: number = 16, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    //     return (
    //         <div className="flex items-center gap-1">
    //             {[1, 2, 3, 4, 5].map((star) => (
    //                 <Star
    //                     key={star}
    //                     size={size}
    //                     className={`${
    //                         star <= rating
    //                             ? 'fill-amber-400 text-amber-400'
    //                             : 'text-gray-300'
    //                     } ${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
    //                     onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
    //                 />
    //             ))}
    //         </div>
    //     );
    // };
    const renderStars = (
  rating: number,
  size: number = 16,
  interactive: boolean = false,
  onRatingChange?: (rating: number) => void
) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        // Calcul du pourcentage de remplissage pour cette étoile
        const fillPercent = Math.max(0, Math.min(1, rating - (star - 1)));
        if (fillPercent === 1) {
          // Pleine étoile
          return (
            <Star
              key={star}
              size={size}
              className={`fill-amber-400 text-amber-400 ${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
              onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            />
          );
        }
        if (fillPercent === 0) {
          // Vide
          return (
            <Star
              key={star}
              size={size}
              className={`text-gray-300 ${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
              onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            />
          );
        }
        // Partiellement remplie
        return (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={`${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          >
            <defs>
              <linearGradient id={`star-gradient-${star}`}>
                <stop offset={`${fillPercent * 100}%`} stopColor="#FFB900" />
                <stop offset={`${fillPercent * 100}%`} stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <Star fill={`url(#star-gradient-${star})`} stroke="#FFB900" />
          </svg>
        );
      })}
    </div>
  );
};

    const filteredReviews = shop.reviews.filter(review => {
        if (filterRating === 'all') return true;
        return review.rating === parseInt(filterRating);
    });

    const sortedReviews = [...filteredReviews].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            case 'helpful':
                return b.helpful - a.helpful;
            default:
                return 0;
        }
    });


    return (
        <div className="space-y-6">
            {/* Résumé des évaluations */}
            <Card>
                <CardHeader>
                    <CardTitle>Évaluations des clients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                                <div>
                                    {renderStars((averageRating), 20)}
                                    <p className="text-sm text-gray-600 mt-1">
                                        Basé sur {shop.reviews.length} avis
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {ratingDistribution.map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="text-sm w-8">{rating}</span>
                                    <Star size={14} className="fill-amber-400 text-amber-400" />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-amber-400 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm w-8 text-gray-600">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filtres et tri */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="grid grid-cols-2 gap-2">
                    <Select value={filterRating} onValueChange={setFilterRating}>
                        <SelectTrigger className="truncate">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les notes</SelectItem>
                            <SelectItem value="5">5 étoiles</SelectItem>
                            <SelectItem value="4">4 étoiles</SelectItem>
                            <SelectItem value="3">3 étoiles</SelectItem>
                            <SelectItem value="2">2 étoiles</SelectItem>
                            <SelectItem value="1">1 étoile</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Plus récents</SelectItem>
                            <SelectItem value="oldest">Plus anciens</SelectItem>
                            <SelectItem value="highest">Note croissante</SelectItem>
                            <SelectItem value="lowest">Note décroissante</SelectItem>
                            <SelectItem value="helpful">Plus utiles</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={() => setShowReviewForm(true)}>
                    Laisser un avis
                </Button>
            </div>

            {/* Formulaire d'avis */}
            {showReviewForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Laisser un avis sur {shop.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Note *</label>
                            {renderStars(newReview.rating, 24, true, (rating) =>
                                setNewReview(prev => ({ ...prev, rating }))
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Titre (optionnel)</label>
                            <Input
                                type="text"
                                placeholder="Résumez votre expérience..."
                                value={newReview.title}
                                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Commentaire <span>*</span></label>
                            <Textarea
                                placeholder="Partagez votre expérience avec cette boutique..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSubmitReview}>Publier l'avis</Button>
                            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                                Annuler
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Liste des avis */}
            <div className="space-y-4">
                {sortedReviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{review.user.name}</h4>
                                            {review.is_approved && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Vérifié
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            <Flag size={16} className="mr-2" />
                                            Signaler
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {review.title && (
                                <h5 className="font-medium mb-2">{review.title}</h5>
                            )}

                            <p className="text-gray-700 mb-4">{review.comment}</p>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleHelpfulVote(review.id, 'helpful')}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
                                >
                                    <ThumbsUp size={16} />
                                    Utile ({review.helpful})
                                </button>
                                <button
                                    onClick={() => handleHelpfulVote(review.id, 'notHelpful')}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                                >
                                    <ThumbsDown size={16} />
                                    Pas utile ({review.notHelpful})
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredReviews.length === 0 && (
                <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun avis trouvé</h3>
                    <p className="mt-1 text-gray-500">
                        {filterRating !== 'all'
                            ? 'Aucun avis ne correspond à votre filtre.'
                            : 'Soyez le premier à laisser un avis sur cette boutique.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}

export default ShopReview;
