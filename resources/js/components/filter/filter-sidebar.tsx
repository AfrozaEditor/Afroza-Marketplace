import { Category } from "@/types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { CategoryFilter } from "./category-filter";
import { PriceFilter } from "./price-filter";

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
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm h-8 px-2 hover:text-primary">
          Réinitialiser
        </Button>
      </div>
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showAllOption={showAllOption}
        categories={categories}
      />
      
      {brands.length > 0 && toggleBrand && (
        <div className="border-b pb-6 mb-6">
          <h4 className="font-medium mb-4">Marques</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox 
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {sizes.length > 0 && toggleSize && (
        <div className="border-b pb-6 mb-6">
          <h4 className="font-medium mb-4">Tailles</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <label key={size} className="cursor-pointer">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                <span className={`flex items-center justify-center h-9 w-9 border rounded-md hover:bg-gray-50 transition-colors ${
                  selectedSizes.includes(size) 
                    ? 'bg-videdressing-primary text-white border-videdressing-primary' 
                    : ''
                }`}>
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {conditions.length > 0 && toggleCondition && (
        <div className="pb-6 border-b mb-6">
          <h4 className="font-medium mb-4">État</h4>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center">
                <Checkbox 
                  id={`condition-${condition}`}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                />
                <label
                  htmlFor={`condition-${condition}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <PriceFilter 
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        maxPrice={maxPrice}
      />
    </div>
  );
};