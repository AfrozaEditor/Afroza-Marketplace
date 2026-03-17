interface SuggestedMessagesProps {
    productName: string;
    onSelect: (message: string) => void;
}

const SUGGESTIONS = [
    "Bonjour, je suis intéressé(e) par ce produit",
    "Est-ce que ce produit est toujours disponible ?",
    "Quel est le délai de livraison ?",
    "Est-il possible de négocier le prix ?",
    "Pouvez-vous m'envoyer plus de photos ?",
];

export default function SuggestedMessages({ productName, onSelect }: SuggestedMessagesProps) {
    return (
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Messages suggérés :
            </p>
            <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
}
