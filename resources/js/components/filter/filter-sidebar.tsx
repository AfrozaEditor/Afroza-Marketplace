import { Category } from "@/types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { CategoryFilter } from "./category-filter";
import { PriceFilter } from "./price-filter";
import { SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
  showAllOption?: boolean;
  resetFilters: () => void;
  selectedBrands?: string[];
  toggleBrand?: (brand: string) => void;
  brands?: string[];
  selectedSizes?: string[];
  toggleSize?: (size: string) => void;
  sizes?: string[];
  selectedConditions?: string[];
  toggleCondition?: (condition: string) => void;
  conditions?: string[];
  categories: Category[];
}

export const FilterSidebar = ({ 
  selectedCategory, 
  setSelectedCategory,
  priceRange,
  setPriceRange,
  maxPrice,
  showAllOption = true,
  resetFilters,
  selectedBrands = [],
  toggleBrand,
  brands = [],
  selectedSizes = [],
  toggleSize,
  sizes = [],
  selectedConditions = [],
  toggleCondition,
  conditions = [],
  categories
}: FilterSidebarProps) => {
  // Compter les filtres actifs
  const activeFiltersCount = [
    selectedCategory.id !== 0,
    priceRange[0] > 0 || priceRange[1] < maxPrice,
    selectedBrands.length > 0,
    selectedSizes.length > 0,
    selectedConditions.length > 0
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Filtres</h3>
              {activeFiltersCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters} 
            className={cn(
              "text-xs h-8 px-3 gap-1.5 rounded-full transition-all",
              activeFiltersCount > 0 
                ? "text-primary hover:text-primary hover:bg-primary/10" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            <RotateCcw className="h-3 w-3" />
            Réinitialiser
          </Button>
        </div>
      </div>
      
      <div className="p-5">
        {/* Catégories */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showAllOption={showAllOption}
          categories={categories}
        />
        
        {/* Marques */}
        {brands.length > 0 && toggleBrand && (
          <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
            <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Marques
              {selectedBrands.length > 0 && (
                <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {selectedBrands.length}
                </span>
              )}
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {brands.map((brand) => (
                <label 
                  key={brand} 
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
                    selectedBrands.includes(brand) 
                      ? "bg-primary/5 border border-primary/20" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <Checkbox 
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className={cn(
                    "text-sm",
                    selectedBrands.includes(brand) 
                      ? "font-medium text-primary" 
                      : "text-gray-700 dark:text-gray-300"
                  )}>
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Tailles */}
        {sizes.length > 0 && toggleSize && (
          <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
            <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">
              Tailles
              {selectedSizes.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {selectedSizes.length}
                </span>
              )}
            </h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button 
                  key={size} 
                  onClick={() => toggleSize(size)}
                  className={cn(
                    "flex items-center justify-center h-10 min-w-[40px] px-3 border-2 rounded-lg font-medium text-sm transition-all duration-200",
                    selectedSizes.includes(size) 
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                      : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* État/Condition */}
        {conditions.length > 0 && toggleCondition && (
          <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
            <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">
              État
              {selectedConditions.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {selectedConditions.length}
                </span>
              )}
            </h4>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label 
                  key={condition} 
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border",
                    selectedConditions.includes(condition) 
                      ? "bg-primary/5 border-primary/30" 
                      : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <Checkbox 
                    id={`condition-${condition}`}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => toggleCondition(condition)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className={cn(
                    "text-sm",
                    selectedConditions.includes(condition) 
                      ? "font-medium text-primary" 
                      : "text-gray-700 dark:text-gray-300"
                  )}>
                    {condition}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Filtre de prix */}
        <PriceFilter 
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={maxPrice}
        />
      </div>
    </div>
  );
};