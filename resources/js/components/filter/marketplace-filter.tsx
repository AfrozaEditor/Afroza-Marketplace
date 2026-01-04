import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Category } from '@/types';
import { Label } from '../ui/label';

interface MarketplaceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
  productsRange: number[];
  setProductsRange: (range: number[]) => void;
  featuredOnly: boolean;
  setFeaturedOnly: (featured: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
  categories: Category[];
  cities?: string[];
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
}

// const categories = ['Mode', 'Luxe', 'Vintage', 'Sport', 'Accessoires', 'Chaussures'];

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  ratingFilter,
  setRatingFilter,
  productsRange,
  setProductsRange,
  featuredOnly,
  setFeaturedOnly,
  sortBy,
  setSortBy,
  resetFilters,
  activeFiltersCount,
  categories = [],
  cities = [],
  selectedCity = '',
  setSelectedCity,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // const toggleCategory = (category: string) => {
  //   setSelectedCategories(
  //     selectedCategories.includes(category)
  //       ? selectedCategories.filter(c => c !== category)
  //       : [...selectedCategories, category]
  //   );
  // };

  // const removeCategory = (category: string) => {
  //   setSelectedCategories(selectedCategories.filter(c => c !== category));
  // };

  console.log(searchTerm)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      {/* Header with filter count and reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-primary" />
          <h3 className="font-semibold text-lg">Filtres</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-light text-primary">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <X size={16} className="mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Rechercher des boutiques..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sort */}
      <div>
        <Label className="block text-sm font-medium mb-2">Trier par</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Note (la meilleure)</SelectItem>
            <SelectItem value="products">Nombre de produits</SelectItem>
            <SelectItem value="followers">Popularité</SelectItem>
            <SelectItem value="name">Nom (A-Z)</SelectItem>
            <SelectItem value="newest">Plus récentes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City filter */}
      {cities.length > 0 && setSelectedCity && (
        <div>
          <Label className="block text-sm font-medium mb-2">Ville</Label>
          <Select value={selectedCity || 'all'} onValueChange={(value) => setSelectedCity(value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Active categories display */}
      {/* {selectedCategories.length > 0 && (
        <div>
          <Label className="block text-sm font-medium mb-2">Catégories sélectionnées</Label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="bg-videdressing-light text-videdressing-primary">
                {category}
                <button
                  onClick={() => removeCategory(category)}
                  className="ml-1 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )} */}

      {/* Advanced Filters */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Filtres avancés
            <Filter size={16} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 mt-4">
          {/* Rating filter */}
          <div>
            <Label className="block text-sm font-medium mb-2">Note minimum</Label>
            <div className="space-y-3">
              {[4.5, 4.0, 3.5, 0].map((rating) => (
                <div key={rating} className="flex items-center">
                  <Checkbox 
                    id={`rating-${rating}`}
                    checked={ratingFilter === rating}
                    onCheckedChange={() => setRatingFilter(rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="ml-2 text-sm cursor-pointer">
                    {rating === 0 ? 'Toutes les notes' : `${rating}+ étoiles`}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div>
            <Label className="block text-sm font-medium mb-2">Gamme de prix (FCFA)</Label>
            <Slider 
              value={priceRange}
              onValueChange={setPriceRange}
              max={400000}
              step={5000}
              className="my-4"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded">{formatPrice(priceRange[0])} FCFA</span>
              <span className="bg-gray-100 px-3 py-1 rounded">{formatPrice(priceRange[1])} FCFA</span>
            </div>
          </div>

          {/* Products range filter */}
          <div>
            <Label className="block text-sm font-medium mb-2">Nombre de produits</Label>
            <Slider 
              value={productsRange}
              onValueChange={setProductsRange}
              max={200}
              step={10}
              className="my-4"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded">{productsRange[0]} produits</span>
              <span className="bg-gray-100 px-3 py-1 rounded">{productsRange[1]} produits</span>
            </div>
          </div>

          {/* Categories filter */}
          {/* <div>
            <Label className="block text-sm font-medium mb-2">Catégories</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="ml-2 text-sm cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Featured only filter */}
          {/* <div className="flex items-center">
            <Checkbox 
              id="featured-only"
              checked={featuredOnly}
              onCheckedChange={setFeaturedOnly}
            />
            <Label htmlFor="featured-only" className="ml-2 text-sm cursor-pointer">
              Boutiques en vedette uniquement
            </Label>
          </div> */}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};