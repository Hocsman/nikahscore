import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Conditions Générales d'Utilisation
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Dernière mise à jour : 1er janvier 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation 
              de la plateforme NikahScore, dédiée à l'évaluation de la compatibilité matrimoniale 
              selon les valeurs islamiques.
            </p>

            <h2>2. Acceptation des conditions</h2>
            <p>
              L'utilisation de NikahScore implique l'acceptation pleine et entière des présentes CGU. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>

            <h2>3. Description du service</h2>
            <p>
              NikahScore propose :
            </p>
            <ul>
              <li>Un questionnaire de compatibilité matrimoniale</li>
              <li>Une analyse personnalisée des réponses</li>
              <li>Un rapport de compatibilité détaillé</li>
              <li>Des recommandations pour améliorer la relation</li>
            </ul>

            <h2>4. Conditions d'accès</h2>
            <p>
              L'accès au service est réservé aux personnes majeures (18 ans et plus). 
              L'utilisateur garantit l'exactitude des informations fournies.
            </p>

            <h2>5. Utilisation du service</h2>
            <p>
              L'utilisateur s'engage à :
            </p>
            <ul>
              <li>Utiliser le service de manière respectueuse et conforme aux valeurs islamiques</li>
              <li>Fournir des informations exactes et sincères</li>
              <li>Ne pas partager ses identifiants d'accès</li>
              <li>Respecter la confidentialité des informations d'autrui</li>
            </ul>

            <h2>6. Protection des données</h2>
            <p>
              NikahScore s'engage à protéger la confidentialité de vos données personnelles 
              conformément au RGPD et à notre politique de confidentialité.
            </p>

            <h2>7. Limitation de responsabilité</h2>
            <p>
              NikahScore fournit un outil d'aide à l'évaluation de la compatibilité. 
              Les résultats ne constituent pas un conseil matrimonial professionnel et 
              ne garantissent pas le succès d'une union.
            </p>

            <h2>8. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments de la plateforme NikahScore (textes, graphiques, 
              logiciels, etc.) sont protégés par le droit d'auteur et appartiennent à NikahScore.
            </p>

            <h2>9. Modification des CGU</h2>
            <p>
              NikahScore se réserve le droit de modifier les présentes CGU à tout moment. 
              Les utilisateurs seront informés des modifications importantes.
            </p>

            <h2>10. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige sera soumis 
              aux tribunaux compétents de Paris.
            </p>

            <h2>11. Contact</h2>
            <p>
              Pour toute question concernant ces CGU, vous pouvez nous contacter à :
              <br />
              Email : legal@nikahscore.com
              <br />
              Adresse : [Adresse de l'entreprise]
            </p>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium mb-2">
                Valeurs islamiques
              </p>
              <p className="text-blue-700 text-sm">
                NikahScore est conçu dans le respect des valeurs islamiques et encourage 
                le mariage halal. Notre approche est basée sur les enseignements du Coran 
                et de la Sunnah concernant le choix du conjoint.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
