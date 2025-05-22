import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDateShort } from '@/lib/utils';
import { Shop } from '@/types';
import { Heart, MessageSquare, Share, ShoppingCart, Star, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    shop: Shop;
}

function Show({ shop }: Props) {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        if (!isFollowing) {
            toast.success(`Vous suivez maintenant ${shop.name}`);
        } else {
            toast.error(`Vous ne suivez plus ${shop.name}`);
        }
    };

    return (
        <AppLayout>
            <div className="relative h-48 overflow-hidden md:h-64">
                <img
                    // src={seller.coverImage}
                    alt={`${shop.name} couverture`}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            <div className="relative container mx-auto -mt-16 px-4 md:px-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row">
                    {/* Profile image and info */}
                    <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md md:flex-row md:gap-6 md:p-6">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md md:h-32 md:w-32">
                            <img
                                // src={seller.image}
                                alt={shop.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:items-start">
                                <div>
                                    <h1 className="text-2xl font-bold md:text-3xl">{shop.name}</h1>
                                    <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-start">
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
                                    <p className="mt-2 text-gray-600">{shop.description}</p>
                                    <div className="mt-2 flex flex-wrap justify-center gap-1 md:justify-start">
                                        {/*{seller.categories.map(cat => (*/}
                                        {/*    <Badge key={cat} variant="outline" className="bg-gray-100">*/}
                                        {/*        {cat}*/}
                                        {/*    </Badge>*/}
                                        {/*))}*/}
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col gap-2 md:mt-0">
                                    <Button
                                        onClick={handleFollow}
                                        variant={isFollowing ? 'default' : 'outline'}
                                        className={isFollowing ? 'bg-primary' : ''}
                                    >
                                        <Heart size={16} className="mr-2" fill={isFollowing ? 'white' : 'none'} />
                                        {isFollowing ? 'Abonné' : 'Suivre'}
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

                            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-500 md:justify-start">
                                <span>Membre depuis {formatDateShort(shop.created_at)}</span>
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
