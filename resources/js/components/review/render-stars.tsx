import { Star } from 'lucide-react';

export const renderStars = (rating: number, size: number = 16, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
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
