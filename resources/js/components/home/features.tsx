import { ShieldCheck, Truck, Award, RefreshCw } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Vêtements vérifiés',
    description: 'Tous nos articles sont vérifiés par nos experts',
  },
  {
    icon: <Truck size={28} />,
    title: 'Livraison rapide',
    description: 'Livraison en 2-5 jours dans toute le Cameroun',
  },
  {
    icon: <Award size={28} />,
    title: 'Qualité garantie',
    description: 'Des articles de qualité à prix accessibles',
  },
  {
    icon: <RefreshCw size={28} />,
    title: 'Retours faciles',
    description: 'Retours gratuits sous 14 jours',
  },
];

const Features = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
