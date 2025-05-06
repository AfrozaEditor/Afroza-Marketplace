import React from 'react';
import { Shop } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Heart, MessageSquare, Share, ShoppingCart, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatDate } from '@/lib/utils';


interface Props {
    shop: Shop;
}

function Show({shop}: Props) {
    return (
        <AppLayout>
            <div className="relative h-48 md:h-64 overflow-hidden">
                <img
                    // src={seller.coverImage}
                    alt={`${shop.name} couverture`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>


            <div className="container mx-auto px-4 md:px-8 -mt-16 relative">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Profile image and info */}
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img
                                // src={seller.image}
                                alt={shop.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">{shop.name}</h1>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 justify-center md:justify-start">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={18} fill="currentColor" />
                                            <span>
                                                {/*{seller.rating}/5 ({seller.reviews} avis)*/}
                                                5/5 (100 avis)
                                            </span>
                                        </div>
                                        <span className="text-gray-500">|</span>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <ShoppingCart size={16} />
                                            <span>{shop.products.length} produits</span>
                                        </div>
                                        <span className="text-gray-500">|</span>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Users size={16} />
                                            <span>
                                                {/*{seller.followers} abonnés*/}
                                                100 abonnés
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mt-2">{shop.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2 justify-center md:justify-start">
                                        {/*{seller.categories.map(cat => (*/}
                                        {/*    <Badge key={cat} variant="outline" className="bg-gray-100">*/}
                                        {/*        {cat}*/}
                                        {/*    </Badge>*/}
                                        {/*))}*/}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mt-4 md:mt-0">
                                    <Button
                                        // onClick={handleFollow}
                                        // variant={isFollowing ? "default" : "outline"}
                                        // className={isFollowing ? "bg-primary" : ""}
                                    >
                                        <Heart size={16} className="mr-2"
                                               // fill={isFollowing ? "white" : "none"}
                                        />
                                        {/*{isFollowing ? "Abonné" : "Suivre"}*/}
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            // onClick={handleContactSeller}
                                        >
                                            <MessageSquare size={16} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            // onClick={handleShare}
                                        >
                                            <Share size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3 justify-center md:justify-start">
                                <span>Membre depuis {formatDate(shop.created_at)}</span>
                                <span>•</span>
                                {/*<span>{seller.location}</span>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Show;
