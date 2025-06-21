import React from 'react';

function Faq() {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Questions fréquentes</h2>

            <div className="space-y-4">
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Comment devenir vendeur ?</h3>
                    <p className="text-gray-600">Pour devenir vendeur, créez un compte, puis complétez votre profil vendeur avec vos informations et préférences de paiement. Une fois approuvé, vous pourrez commencer à publier des articles.</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Quelles sont les commissions ?</h3>
                    <p className="text-gray-600">Nous appliquons une commission de 10% sur chaque vente. Les frais de livraison sont à la charge de l'acheteur, sauf si vous proposez la livraison gratuite.</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Comment sont gérés les retours ?</h3>
                    <p className="text-gray-600">Les acheteurs ont 14 jours pour demander un retour si l'article ne correspond pas à la description. Les frais de retour sont à la charge de l'acheteur, sauf si l'article est défectueux.</p>
                </div>
            </div>
        </div>
    );
}

export default Faq;
