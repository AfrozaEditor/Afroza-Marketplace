<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Supprimer les anciennes catégories
        Category::truncate();

        $categories = [
            [
                'name' => 'Mode & Accessoires',
                'slug' => 'mode-accessoires',
                'icon' => 'Shirt',
                'description' => 'Vêtements, chaussures et accessoires de mode',
                'children' => [
                    ['name' => 'Vêtements Homme', 'slug' => 'vetements-homme'],
                    ['name' => 'Vêtements Femme', 'slug' => 'vetements-femme'],
                    ['name' => 'Vêtements Enfant', 'slug' => 'vetements-enfant'],
                    ['name' => 'Chaussures', 'slug' => 'chaussures'],
                    ['name' => 'Sacs & Maroquinerie', 'slug' => 'sacs-maroquinerie'],
                    ['name' => 'Bijoux & Montres', 'slug' => 'bijoux-montres'],
                ],
            ],
            [
                'name' => 'Électronique & High-tech',
                'slug' => 'electronique-high-tech',
                'icon' => 'Smartphone',
                'description' => 'Téléphones, ordinateurs et appareils électroniques',
                'children' => [
                    ['name' => 'Téléphones & Accessoires', 'slug' => 'telephones-accessoires'],
                    ['name' => 'Ordinateurs & Périphériques', 'slug' => 'ordinateurs-peripheriques'],
                    ['name' => 'Électroménager', 'slug' => 'electromenager'],
                    ['name' => 'TV, Audio & Vidéo', 'slug' => 'tv-audio-video'],
                ],
            ],
            [
                'name' => 'Maison & Décoration',
                'slug' => 'maison-decoration',
                'icon' => 'Home',
                'description' => 'Meubles, décoration et articles pour la maison',
                'children' => [
                    ['name' => 'Meubles', 'slug' => 'meubles'],
                    ['name' => 'Décoration', 'slug' => 'decoration'],
                    ['name' => 'Cuisine', 'slug' => 'cuisine'],
                    ['name' => 'Linge de maison', 'slug' => 'linge-maison'],
                ],
            ],
            [
                'name' => 'Bébé & Enfants',
                'slug' => 'bebe-enfants',
                'icon' => 'Baby',
                'description' => 'Articles pour bébés et enfants',
                'children' => [
                    ['name' => 'Vêtements Bébé & Enfants', 'slug' => 'vetements-bebe-enfants'],
                    ['name' => 'Jouets & Jeux', 'slug' => 'jouets-jeux'],
                    ['name' => 'Fournitures scolaires', 'slug' => 'fournitures-scolaires'],
                    ['name' => 'Poussettes & Sièges auto', 'slug' => 'poussettes-sieges-auto'],
                ],
            ],
            [
                'name' => 'Beauté & Santé',
                'slug' => 'beaute-sante',
                'icon' => 'Sparkles',
                'description' => 'Cosmétiques, parfums et produits de santé',
                'children' => [
                    ['name' => 'Soins & Cosmétiques', 'slug' => 'soins-cosmetiques'],
                    ['name' => 'Parfums', 'slug' => 'parfums'],
                    ['name' => 'Produits naturels', 'slug' => 'produits-naturels'],
                ],
            ],
            [
                'name' => 'Sports & Loisirs',
                'slug' => 'sports-loisirs',
                'icon' => 'Dumbbell',
                'description' => 'Équipements sportifs et articles de loisirs',
                'children' => [
                    ['name' => 'Équipements de sport', 'slug' => 'equipements-sport'],
                    ['name' => 'Vélo & Randonnée', 'slug' => 'velo-randonnee'],
                    ['name' => 'Fitness & Musculation', 'slug' => 'fitness-musculation'],
                    ['name' => 'Instruments de musique', 'slug' => 'instruments-musique'],
                ],
            ],
            [
                'name' => 'Auto & Moto',
                'slug' => 'auto-moto',
                'icon' => 'Car',
                'description' => 'Véhicules, pièces et accessoires',
                'children' => [
                    ['name' => 'Pièces détachées', 'slug' => 'pieces-detachees'],
                    ['name' => 'Accessoires auto', 'slug' => 'accessoires-auto'],
                    ['name' => 'Véhicules', 'slug' => 'vehicules'],
                ],
            ],
            [
                'name' => 'Livres & Éducation',
                'slug' => 'livres-education',
                'icon' => 'BookOpen',
                'description' => 'Livres, manuels et fournitures éducatives',
                'children' => [
                    ['name' => 'Livres scolaires', 'slug' => 'livres-scolaires'],
                    ['name' => 'Romans & BD', 'slug' => 'romans-bd'],
                    ['name' => 'Manuels & Guides', 'slug' => 'manuels-guides'],
                    ['name' => 'Fournitures', 'slug' => 'fournitures'],
                ],
            ],
            [
                'name' => 'Services',
                'slug' => 'services',
                'icon' => 'Briefcase',
                'description' => 'Services professionnels et personnels',
                'children' => [
                    ['name' => 'Répétiteurs & Cours', 'slug' => 'repetiteurs-cours'],
                    ['name' => 'Coiffure & Beauté', 'slug' => 'coiffure-beaute'],
                    ['name' => 'Couture & Retouches', 'slug' => 'couture-retouches'],
                    ['name' => 'Freelance', 'slug' => 'freelance'],
                ],
            ],
            [
                'name' => 'Divers',
                'slug' => 'divers',
                'icon' => 'Package',
                'description' => 'Articles divers et objets atypiques',
                'children' => [
                    ['name' => 'Objets de collection', 'slug' => 'objets-collection'],
                    ['name' => 'Autres', 'slug' => 'autres'],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $parent = Category::create($categoryData);

            foreach ($children as $child) {
                Category::create([
                    'name' => $child['name'],
                    'slug' => $child['slug'],
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}
