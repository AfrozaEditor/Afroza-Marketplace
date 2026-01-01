import { Slider } from "@/components/ui/slider";

interface PriceFilterProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
}

export const PriceFilter = ({ priceRange, setPriceRange, maxPrice }: PriceFilterProps) => {
  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <div className="pt-6 border-t">
      <h3 className="font-medium text-lg mb-4">Prix (FCFA)</h3>
      <Slider 
        defaultValue={[0, maxPrice]} 
        max={maxPrice} 
        step={500}
        value={priceRange}
        onValueChange={setPriceRange}
        className="my-6"
      />
      <div className="flex items-center justify-between mt-2">
        <span className=" px-3 py-1 rounded">{formatPrice(priceRange[0])}</span>
        <span className=" px-3 py-1 rounded">{formatPrice(priceRange[1])}</span>
      </div>
    </div>
  );
};
