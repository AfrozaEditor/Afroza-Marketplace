import { ShieldCheck, Truck, Award, RefreshCw, CreditCard, Headphones, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Articles Vérifiés',
    description: 'Tous nos articles sont vérifiés par nos experts pour garantir leur qualité',
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: <Truck size={28} />,
    title: 'Livraison Rapide',
    description: 'Livraison en 24-48h dans les grandes villes du Cameroun',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <CreditCard size={28} />,
    title: 'Paiement Sécurisé',
    description: 'Mobile Money, carte bancaire ou paiement à la livraison',
    color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: <RefreshCw size={28} />,
    title: 'Retours Faciles',
    description: 'Retours gratuits sous 14 jours si l\'article ne convient pas',
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: <Headphones size={28} />,
    title: 'Support 24/7',
    description: 'Notre équipe est disponible pour répondre à toutes vos questions',
    color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon: <MapPin size={28} />,
    title: 'Couverture Nationale',
    description: 'Livraison dans toutes les régions du Cameroun',
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: <Award size={28} />,
    title: 'Qualité Garantie',
    description: 'Des articles de qualité à prix accessibles pour tous',
    color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    icon: <Clock size={28} />,
    title: 'Vente Express',
    description: 'Vendez vos articles en quelques minutes seulement',
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Pourquoi choisir <span className="text-primary">Afroza Marketplace</span> ?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nous nous engageons à vous offrir la meilleure expérience d'achat et de vente en ligne
          </p>
        </div>

        {/* Grille des features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={cn(
                "group relative p-6 rounded-2xl transition-all duration-300",
                "hover:shadow-xl hover:-translate-y-2 cursor-default",
                "bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
              )}
            >
              {/* Icône avec fond coloré */}
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                "transition-transform duration-300 group-hover:scale-110",
                feature.color
              )}>
                {feature.icon}
              </div>
              
              {/* Titre */}
              <h3 className="text-lg font-semibold mb-2 dark:text-white group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Effet de survol - ligne colorée */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity",
                feature.color.replace('text-', 'bg-').split(' ')[0]
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
