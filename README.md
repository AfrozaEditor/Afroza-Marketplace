# Vide Dressing Marketplace

Vide Dressing Marketplace est une plateforme camerounaise dédiée à la vente et à l'achat de vêtements de seconde main. Elle permet aux utilisateurs de créer des boutiques, vendre des articles, acheter, discuter via une messagerie intégrée, laisser des avis, et bien plus encore.

## Fonctionnalités principales

- **Marketplace** : Création et gestion de boutiques, ajout de produits, gestion des commandes.
- **Recherche & Filtres** : Recherche avancée, filtres par catégorie, prix, marque, taille, état.
- **Messagerie** : Chat privé entre acheteurs et vendeurs.
- **Avis & Notations** : Système d'avis sur les boutiques et produits.
- **Promotions** : Gestion des codes promo et offres spéciales.
- **Livraison** : Inscription des livreurs, gestion des zones et documents.
- **Blog** : Articles, conseils, tendances, guides et interviews.
- **Tableau de bord vendeur** : Statistiques, notifications, gestion des commandes et produits.
- **Favoris** : Liste d'articles favoris pour les acheteurs.
- **Sécurité** : Paiement sécurisé, protection des données, gestion des retours.

## Structure du projet

- `app/` : Code backend Laravel (contrôleurs, modèles, événements, etc.)
- `resources/js/` : Frontend React/TypeScript (pages, composants, hooks, utils)
- `database/migrations/` : Migrations des tables (produits, boutiques, avis, etc.)
- `database/seeders/` : Seeders pour les données de test (utilisateurs, boutiques, produits, followers)
- `routes/web.php` : Définition des routes Laravel
- `public/` : Fichiers statiques et assets
- `config/` : Configuration Laravel
- `.env.example` : Exemple de configuration d'environnement

## Installation

### Prérequis

- PHP >= 8.2
- Node.js >= 18
- Composer
- Docker
- Un accès à une base de données (MySQL, PostgreSQL, SQLite, etc.)
- Un bucket S3 pour le stockage des images (configuré dans `.env`)

### Étapes

1. **Cloner le dépôt**
   ```sh
   git clone <url-du-repo>
   cd Vide-dressing
   ```

2. **Installer les dépendances**
   ```sh
   composer install
   npm install
   ```

3. **Configurer l'environnement**
   ```sh
   cp .env.example .env
   # Modifier les variables dans .env (DB, S3, etc.)
   php artisan key:generate
   ```

4. **Migrer la base de données**
   ```sh
   php artisan migrate --seed
   ```

5. **Lancer le serveur**
   ```sh
   npm run dev
   php artisan serve
   ```

6. **Accéder à l'application**
   - Frontend : http://localhost:5173
   - Backend/API : http://localhost:8000

## Scripts utiles

- **Développement complet (serveur, queue, Vite)**
  ```sh
  composer run dev
  ```
- **Build frontend**
  ```sh
  npm run build
  ```
- **Tests**
  ```sh
  php artisan test
  npm run test
  ```

## Technologies utilisées

- **Backend** : Laravel 12, Inertia.js, Spatie Permission, Socialite, S3
- **Frontend** : React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Base de données** : Eloquent ORM, Migrations, Seeders
- **Notifications temps réel** : Laravel Reverb (WebSockets)
- **Tests** : PHPUnit, Pest

## Structure des dossiers principaux

- [app/Events/NewMessage.php](app/Events/NewMessage.php) : Événement pour la messagerie
- [app/Http/Controllers/Marketplace/MarketplaceController.php](app/Http/Controllers/Marketplace/MarketplaceController.php) : Contrôleur principal marketplace
- [resources/js/pages/marketplace/Create.tsx](resources/js/pages/marketplace/Create.tsx) : Création de boutique
- [resources/js/pages/product/Create.tsx](resources/js/pages/product/Create.tsx) : Création de produit
- [resources/js/pages/chat/Index.tsx](resources/js/pages/chat/Index.tsx) : Messagerie
- [resources/js/components/review/shop-review.tsx](resources/js/components/review/shop-review.tsx) : Avis boutique
- [resources/js/pages/order/Create.tsx](resources/js/pages/order/Create.tsx) : Création de commande
- [resources/js/pages/delivery/Create.tsx](resources/js/pages/delivery/Create.tsx) : Inscription livreur
- [resources/js/pages/promotion/Index.tsx](resources/js/pages/promotion/Index.tsx) : Promotions et codes promo
- [resources/js/pages/blog/Index.tsx](resources/js/pages/blog/Index.tsx) : Blog

## Contribution

Les contributions sont les bienvenues !  
Merci de soumettre vos PR ou d'ouvrir une issue pour toute suggestion ou bug.

### Workflow GitFlow recommandé

Pour faciliter la collaboration et garder le projet organisé, nous utilisons le workflow **GitFlow**. Voici les étapes à suivre :

1. **Branche principale**
   - `main` : contient le code de production.
   - `develop` : contient le code en cours de développement.

2. **Fonctionnalités**
   - Pour chaque nouvelle fonctionnalité, crée une branche à partir de `develop` :
     ```sh
     git checkout develop
     git pull
     git checkout -b feature/nom-fonctionnalite
     ```
   - Une fois la fonctionnalité terminée, pousse la branche et ouvre une Pull Request vers `develop`.

3. **Corrections de bugs**
   - Pour corriger un bug, crée une branche à partir de `develop` :
     ```sh
     git checkout develop
     git pull
     git checkout -b bugfix/nom-bug
     ```
   - Pousse la branche et ouvre une Pull Request vers `develop`.

4. **Release**
   - Pour préparer une version, crée une branche à partir de `develop` :
     ```sh
     git checkout develop
     git pull
     git checkout -b release/x.y.z
     ```
   - Après validation, fusionne dans `main` et `develop`, puis tague la release.

5. **Hotfix**
   - Pour une correction urgente en production, crée une branche à partir de `main` :
     ```sh
     git checkout main
     git pull
     git checkout -b hotfix/nom-hotfix
     ```
   - Après correction, fusionne dans `main` et `develop`.

6. **Règles**
   - Toujours ouvrir une Pull Request pour toute modification.
   - Demander une revue de code avant de fusionner.
   - Utiliser des noms de branches explicites (`feature/`, `bugfix/`, `release/`, `hotfix/`).

Pour plus d’informations, consulte la documentation officielle : [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)


## Licence

Ce projet est sous licence MIT.

---

Pour toute question, consulte la page [help](resources/js/pages/help.tsx) ou contacte l'équipe via la page [contact](resources/js/pages/contact.tsx).