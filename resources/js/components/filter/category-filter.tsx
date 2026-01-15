import { Category } from "@/types";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChevronRight, ChevronDown, FolderOpen, Folder, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  showAllOption?: boolean;
  categories: Category[];
}

export const CategoryFilter = ({ 
  selectedCategory, 
  setSelectedCategory, 
  categories
}: CategoryFilterProps) => {
  // State pour tracker quelle catégorie parent est ouverte
  const [expandedParentId, setExpandedParentId] = useState<number | null>(null);
  
  const defaultCategory = { id: 0, name: 'Tous', slug: 'tous' } as Category;
  
  // Filtrer uniquement les catégories parents (sans parent_id)
  const parentCategories = categories.filter(cat => !cat.parent_id);

  // Vérifier si une catégorie a des enfants
  const hasChildren = (category: Category) => {
    return category.children && category.children.length > 0;
  };

  // Toggle l'expansion d'une catégorie parent
  const toggleExpand = (categoryId: number) => {
    setExpandedParentId(prev => prev === categoryId ? null : categoryId);
  };

  // Vérifier si la catégorie sélectionnée est un enfant de ce parent
  const isChildSelected = (parent: Category) => {
    if (!parent.children) return false;
    return parent.children.some(child => child.id === selectedCategory.id);
  };

  // Sélectionner une catégorie
  const handleSelect = (category: Category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
      <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        Catégories
      </h4>
      
      <div className="space-y-1">
        {/* Option "Tous" */}
        <button
          onClick={() => handleSelect(defaultCategory)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory.id === 0
              ? "bg-primary text-white shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <FolderOpen className="h-4 w-4" />
          Toutes les catégories
        </button>

        {/* Catégories parents */}
        {parentCategories.map((parent) => (
          <div key={parent.id} className="space-y-1">
            {/* Bouton parent */}
            <div className="flex items-center gap-1">
              {hasChildren(parent) ? (
                <>
                  {/* Bouton pour expand/collapse */}
                  <button
                    onClick={() => toggleExpand(parent.id)}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      expandedParentId === parent.id
                        ? "bg-primary/10 text-primary"
                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {expandedParentId === parent.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {/* Nom du parent (cliquable pour sélectionner) */}
                  <button
                    onClick={() => handleSelect(parent)}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all text-left",
                      selectedCategory.id === parent.id
                        ? "bg-primary text-white shadow-sm"
                        : isChildSelected(parent)
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {expandedParentId === parent.id ? (
                      <FolderOpen className="h-4 w-4" />
                    ) : (
                      <Folder className="h-4 w-4" />
                    )}
                    {parent.name}
                    {hasChildren(parent) && (
                      <span className="ml-auto text-xs opacity-60">
                        {parent.children?.length}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                /* Parent sans enfants */
                <button
                  onClick={() => handleSelect(parent)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ml-6",
                    selectedCategory.id === parent.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Tag className="h-4 w-4" />
                  {parent.name}
                </button>
              )}
            </div>

            {/* Sous-catégories (visibles uniquement si parent ouvert) */}
            {hasChildren(parent) && expandedParentId === parent.id && (
              <div className="ml-8 pl-3 border-l-2 border-gray-200 dark:border-gray-600 space-y-1">
                {parent.children?.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleSelect(child)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all text-left",
                      selectedCategory.id === child.id
                        ? "bg-primary text-white shadow-sm font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    {child.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};