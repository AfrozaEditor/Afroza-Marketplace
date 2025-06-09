import { Category } from "@/types";
import { Button } from "../ui/button";

interface CategoryFilterProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  showAllOption?: boolean;
  categories: Category[];
}

// const categories: Category[] = [
//   { id: 1, name: 'Hommes' },
//   { id: 2, name: 'Femmes' },
//   { id: 3, name: 'Accessoires' },
//   { id: 4, name: 'Chaussures' }
// ];


export const CategoryFilter = ({ 
  selectedCategory, 
  setSelectedCategory, 
//   showAllOption = true,
  categories
}: CategoryFilterProps) => {
//   const allCategories = showAllOption 
//         ? [{ id: 0, name: 'Tous', slug: 'tous' } as Category, ...categories] 
//         : categories;
    const defaultCategory = { id: 0, name: 'Tous', slug: 'tous' } as Category;
    const allCategories = [defaultCategory, ...categories];

    console.log(allCategories[0]);


  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-4">Catégories</h3>
      <div className="flex flex-wrap md:flex-col gap-2">
        {allCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory.id === category.id ? "default" : "outline"}
            className={selectedCategory.id === category.id ? "bg-primary" : ""}
            onClick={() => setSelectedCategory(category)}
            size="sm"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};