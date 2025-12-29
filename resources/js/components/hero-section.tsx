import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import React from 'react';

interface HeroSectionProps {
    title: string;
    description?: string;
    image?: string;
    buttons?: {
        primary?: {
            text: string;
            href: string;
        };
        secondary?: {
            text: string;
            href: string;
        };
    };
    className?: string;
    style?: React.CSSProperties;
}

export function HeroSection({
                                title,
                                description,
                                // image = "",
                                buttons,
                                className,
                                style,
                            }: HeroSectionProps) {
    return (
        <div className={cn("relative w-full h-auto", className)}>
            {/* Image d'arrière-plan */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={style}
            >
                {/* Superposition semi-transparente */}
                {/* <div className="absolute inset-0 bg-black/50" /> */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
            </div>

            {/* Contenu */}
            <div className="relative h-full max-w-7xl mx-auto px-4 py-10 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
                    {title}
                </h1>

                {description && (
                    <p className="text-lg md:text-xl mb-4 max-w-2xl">
                        {description}
                    </p>
                )}

                {buttons && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        {buttons.primary && (
                            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                                <Link href={buttons.primary.href}>
                                    {buttons.primary.text}
                                </Link>
                            </Button>
                        )}

                        {buttons.secondary && (
                            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                                <Link href={buttons.secondary.href}>
                                    {buttons.secondary.text}
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
