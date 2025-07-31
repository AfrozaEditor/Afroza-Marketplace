import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Shop, ShopReview as Review } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Flag, MoreVertical, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { renderStars } from '@/components/review/render-stars';

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
    shop: Shop & {
        user_review?: Review | null; // Ajoutez cette propriété pour l'avis de l'utilisateur
    };
}

function ShopReview({ shop }: Props) {
    const { props } = usePage(); // Accédez aux props de la page via usePage
    const userReview = shop?.user_review; // Accédez directement à user_review via shop
    const [sortBy, setSortBy] = useState('newest');
    const [filterRating, setFilterRating] = useState('all');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reportDialog, setReportDialog] = useState(false);
    const [reportData, setReportData] = useState({
        reviewId: 0,
        reason: '',
        details: '',
    });
    const [newReview, setNewReview] = useState({
        rating: 0,
        title: '',
        comment: '',
    });

    // Pré-remplir le formulaire si un avis existe déjà
    useEffect(() => {
        if (userReview) {
            setNewReview({
                rating: userReview.rating,
                title: userReview.title || '', // Assurez-vous que title peut être null
                comment: userReview.comment,
            });
        } else {
            // Réinitialiser si l'utilisateur n'a pas d'avis
            setNewReview({
                rating: 0,
                title: '',
                comment: '',
            });
        }
    }, [userReview]);

    console.log(userReview);

    const averageRating = shop.reviews.reduce((sum, review) => sum + review.rating, 0) / shop.reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: shop.reviews.filter((r) => r.rating === rating).length,
        percentage: (shop.reviews.filter((r) => r.rating === rating).length / shop.reviews.length) * 100,
    }));

    // const handleSubmitReview = () => {
    //     if (newReview.rating === 0 || !newReview.comment.trim()) {
    //         // toast({
    //         //     title: "Erreur",
    //         //     description: "Veuillez remplir tous les champs obligatoires.",
    //         //     variant: "destructive"
    //         // });
    //         return;
    //     }

    //     router.post(route('shop_reviews.store'), {
    //         shop_id: shop.id,
    //         rating: newReview.rating,
    //         title: newReview.title,
    //         comment: newReview.comment,
    //     }, {
    //         onSuccess: () => {
    //             // toast({
    //             //     title: "Avis publié",
    //             //     description: "Votre avis a été publié avec succès.",
    //             // });
    //         }
    //     });

    //     setNewReview({ rating: 0, title: '', comment: '' });
    //     setShowReviewForm(false);
    // };
    const handleSubmitReview = () => {
        if (newReview.rating === 0 || !newReview.comment.trim()) return;

        if (userReview) {
            // Modification
            router.put(
                route('shop_reviews.update', userReview.id),
                {
                    rating: newReview.rating,
                    title: newReview.title,
                    comment: newReview.comment,
                },
                {
                    onSuccess: () => {
                        setShowReviewForm(false);
                    },
                },
            );
        } else {
            // Création
            router.post(
                route('shop_reviews.store'),
                {
                    shop_id: shop.id,
                    rating: newReview.rating,
                    title: newReview.title,
                    comment: newReview.comment,
                },
                {
                    onSuccess: () => {
                        setShowReviewForm(false);
                    },
                },
            );
        }
    };

    const [reviews, setReviews] = useState(shop.reviews);

    const handleHelpfulVote = (reviewId: number, type: 'helpful' | 'not_helpful') => {
        router.post(
            route('shop_reviews.vote', reviewId),
            {
                type: type,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (response) => {
                    // Mettre à jour l'état local des reviews
                    setReviews((prevReviews) =>
                        prevReviews.map((review) => {
                            if (review.id === reviewId) {
                                return {
                                    ...review,
                                    helpful: response.props.helpful,
                                    not_helpful: response.props.notHelpful,
                                };
                            }
                            return review;
                        }),
                    );

                    toast.success('Vote pris en compte');
                },
                onError: () => {
                    toast.error('Une erreur est survenue');
                },
            },
        );
    };

    const handleReport = () => {
        router.post(route('shop_reviews.report', reportData.reviewId), {
            reason: reportData.reason,
            details: reportData.details
        }, {
            onSuccess: () => {
                setReportDialog(false);
                toast.success("Avis signalé avec succès");
            },
            onError: () => {
                toast.error("Une erreur est survenue");
            }
        });
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
    // const renderStars = (rating: number, size: number = 16, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    //     return (
    //         <div className="flex items-center gap-1">
    //             {[1, 2, 3, 4, 5].map((star) => {
    //                 // Calcul du pourcentage de remplissage pour cette étoile
    //                 const fillPercent = Math.max(0, Math.min(1, rating - (star - 1)));
    //                 if (fillPercent === 1) {
    //                     // Pleine étoile
    //                     return (
    //                         <Star
    //                             key={star}
    //                             size={size}
    //                             className={`fill-amber-400 text-amber-400 ${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
    //                             onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
    //                         />
    //                     );
    //                 }
    //                 if (fillPercent === 0) {
    //                     // Vide
    //                     return (
    //                         <Star
    //                             key={star}
    //                             size={size}
    //                             className={`text-gray-300 ${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
    //                             onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
    //                         />
    //                     );
    //                 }
    //                 // Partiellement remplie
    //                 return (
    //                     <svg
    //                         key={star}
    //                         width={size}
    //                         height={size}
    //                         viewBox="0 0 24 24"
    //                         className={`${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
    //                         onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
    //                     >
    //                         <defs>
    //                             <linearGradient id={`star-gradient-${star}`}>
    //                                 <stop offset={`${fillPercent * 100}%`} stopColor="#FFB900" />
    //                                 <stop offset={`${fillPercent * 100}%`} stopColor="#FFFFFF" />
    //                             </linearGradient>
    //                         </defs>
    //                         <Star fill={`url(#star-gradient-${star})`} stroke="#FFB900" />
    //                     </svg>
    //                 );
    //             })}
    //         </div>
    //     );
    // };

    const filteredReviews = shop.reviews.filter((review) => {
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
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                                <div>
                                    {renderStars(averageRating, 20)}
                                    <p className="mt-1 text-sm text-gray-600">Basé sur {shop.reviews.length} avis</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {ratingDistribution.map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="w-8 text-sm">{rating}</span>
                                    <Star size={14} className="fill-amber-400 text-amber-400" />
                                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                                        <div className="h-2 rounded-full bg-amber-400" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="w-8 text-sm text-gray-600">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filtres et tri */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
                {props.auth.user && ( // Afficher le bouton seulement si l'utilisateur est connecté
                    <Button onClick={() => setShowReviewForm(true)}>{userReview ? 'Modifier votre avis' : 'Laisser un avis'}</Button>
                )}
            </div>

            {/* Formulaire d'avis */}
            {showReviewForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {userReview ? 'Modifier votre avis sur' : 'Laisser un avis sur'} {shop.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Note *</label>
                            {renderStars(newReview.rating, 24, true, (rating) =>
                                setNewReview((prev) => ({
                                    ...prev,
                                    rating,
                                })),
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Titre (optionnel)</label>
                            <Input
                                type="text"
                                placeholder="Résumez votre expérience..."
                                value={newReview.title}
                                onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Commentaire <span>*</span>
                            </label>
                            <Textarea
                                placeholder="Partagez votre expérience avec cette boutique..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSubmitReview}>{userReview ? "Mettre à jour l'avis" : "Publier l'avis"}</Button>
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
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        {/* <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" /> */}
                                        <img src="https://placeholder.co/100" className="h-full w-full object-cover" />
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{review.reviewer_name}</h4>
                                            {review.is_approved && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Vérifié
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mt-1 flex items-center gap-2">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
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
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setReportData({ reviewId: review.id, reason: '', details: '' });
                                                setReportDialog(true);
                                            }}
                                        >
                                            <Flag size={16} className="mr-2" />
                                            Signaler
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Dialog open={reportDialog} onOpenChange={setReportDialog}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Signaler cet avis</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Motif du signalement</Label>
                                                <Select
                                                    value={reportData.reason}
                                                    onValueChange={(value) =>
                                                        setReportData((prev) => ({
                                                            ...prev,
                                                            reason: value,
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un motif" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="inappropriate">Contenu inapproprié</SelectItem>
                                                        <SelectItem value="spam">Spam</SelectItem>
                                                        <SelectItem value="fake">Avis frauduleux</SelectItem>
                                                        <SelectItem value="other">Autre</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Détails</Label>
                                                <Textarea
                                                    placeholder="Décrivez la raison de votre signalement..."
                                                    value={reportData.details}
                                                    onChange={(e) =>
                                                        setReportData((prev) => ({
                                                            ...prev,
                                                            details: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setReportDialog(false)}>
                                                Annuler
                                            </Button>
                                            <Button
                                            onClick={handleReport}
                                            >Envoyer le signalement</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {review.title && <h5 className="mb-2 font-medium">{review.title}</h5>}

                            <p className="mb-4 text-gray-700">{review.comment}</p>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleHelpfulVote(review.id, 'helpful')}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
                                >
                                    <ThumbsUp size={16} />
                                    Utile ({review.helpful})
                                </button>
                                <button
                                    onClick={() => handleHelpfulVote(review.id, 'not_helpful')}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                                >
                                    <ThumbsDown size={16} />
                                    Pas utile ({review.not_helpful})
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredReviews.length === 0 && (
                <div className="py-12 text-center">
                    <Star className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun avis trouvé</h3>
                    <p className="mt-1 text-gray-500">
                        {filterRating !== 'all'
                            ? 'Aucun avis ne correspond à votre filtre.'
                            : 'Soyez le premier à laisser un avis sur cette boutique.'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default ShopReview;
