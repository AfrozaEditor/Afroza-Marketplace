import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

function NewsLetter() {
    return (
        <section className="py-6">
            <div className="container mx-auto px-4">
                <div className="text-center bg-gradient-to-l from-primary to-chart-3 rounded-xl py-12 px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Inscrivez-vous à notre newsletter</h2>
                    <p className="text-gray-100 mb-8 text-lg">Recevez nos dernières offres et nouvelles tendances directement dans votre boîte mail</p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-lg mx-auto">
                        <Input
                            type="email"
                            placeholder="Votre adresse email"
                            className="px-4 py-3 rounded-l-md flex-grow focus:outline-none focus:ring-2 focus:ring-white/20 sm:rounded-r-none"
                        />
                        <Button className="bg-white text-primary px-6 py-3 font-medium rounded-md sm:rounded-l-none hover:bg-gray-100 transition-colors">
                            S'inscrire
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NewsLetter;
