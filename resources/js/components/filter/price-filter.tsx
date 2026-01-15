import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Banknote } from "lucide-react";
import { useState } from "react";

interface PriceFilterProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
}

export const PriceFilter = ({ priceRange, setPriceRange, maxPrice }: PriceFilterProps) => {
  // États locaux pour les inputs
  const [minInput, setMinInput] = useState(priceRange[0].toString());
  const [maxInput, setMaxInput] = useState(priceRange[1].toString());

  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleMinChange = (value: string) => {
    setMinInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxChange = (value: string) => {
    setMaxInput(value);
    const numValue = parseInt(value) || maxPrice;
    if (numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value);
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  };

  // Préréglages de prix rapides
  const pricePresets = [
    { label: 'Moins de 5 000', min: 0, max: 5000 },
    { label: '5 000 - 15 000', min: 5000, max: 15000 },
    { label: '15 000 - 50 000', min: 15000, max: 50000 },
    { label: '50 000+', min: 50000, max: maxPrice },
  ];

  return (
    <div className="pt-4">
      <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <Banknote className="h-4 w-4 text-primary" />
        Budget (FCFA)
      </h4>
      
      {/* Préréglages rapides */}
      <div className="flex flex-wrap gap-2 mb-4">
        {pricePresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setPriceRange([preset.min, preset.max]);
              setMinInput(preset.min.toString());
              setMaxInput(preset.max.toString());
            }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              priceRange[0] === preset.min && priceRange[1] === preset.max
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      {/* Slider */}
      <div className="px-1">
        <Slider 
          defaultValue={[0, maxPrice]} 
          max={maxPrice} 
          step={500}
          value={priceRange}
          onValueChange={handleSliderChange}
          className="my-4"
        />
      </div>
      
      {/* Inputs Min/Max */}
      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Min</label>
          <div className="relative">
            <Input
              type="number"
              value={minInput}
              onChange={(e) => handleMinChange(e.target.value)}
              className="pr-12 h-10 text-sm"
              min={0}
              max={priceRange[1]}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              FCFA
            </span>
          </div>
        </div>
        
        <span className="text-gray-400 mt-5">—</span>
        
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Max</label>
          <div className="relative">
            <Input
              type="number"
              value={maxInput}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="pr-12 h-10 text-sm"
              min={priceRange[0]}
              max={maxPrice}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              FCFA
            </span>
          </div>
        </div>
      </div>
      
      {/* Affichage de la plage sélectionnée */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
          <span className="font-semibold text-primary">{formatPrice(priceRange[0])}</span>
          <span className="mx-2">à</span>
          <span className="font-semibold text-primary">{formatPrice(priceRange[1])}</span>
          <span className="text-gray-500 ml-1">FCFA</span>
        </p>
      </div>
    </div>
  );
};
