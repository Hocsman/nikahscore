import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Politique de Confidentialité
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Dernière mise à jour : 1er janvier 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              NikahScore accorde une importance primordiale à la protection de votre vie privée 
              et de vos données personnelles. Cette politique explique comment nous collectons, 
              utilisons et protégeons vos informations.
            </p>

            <h2>2. Données collectées</h2>
            <h3>2.1 Données d'identification</h3>
            <ul>
              <li>Adresse email</li>
              <li>Âge</li>
              <li>Ville de résidence</li>
            </ul>

            <h3>2.2 Données du questionnaire</h3>
            <ul>
              <li>Réponses aux questions de compatibilité</li>
              <li>Niveau d'importance accordé à chaque réponse</li>
              <li>Préférences et valeurs personnelles</li>
            </ul>

            <h3>2.3 Données techniques</h3>
            <ul>
              <li>Adresse IP (anonymisée)</li>
              <li>Informations de navigation</li>
              <li>Cookies nécessaires au fonctionnement</li>
            </ul>

            <h2>3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Calculer votre score de compatibilité</li>
              <li>Générer des recommandations personnalisées</li>
              <li>Vous envoyer vos résultats par email</li>
              <li>Améliorer notre service (données anonymisées)</li>
              <li>Assurer la sécurité de la plateforme</li>
            </ul>

            <h2>4. Base légale</h2>
            <p>
              Le traitement de vos données repose sur :
            </p>
            <ul>
              <li><strong>Votre consentement</strong> pour l'utilisation du service</li>
              <li><strong>L'exécution du contrat</strong> pour la fourniture du service</li>
              <li><strong>L'intérêt légitime</strong> pour l'amélioration du service</li>
            </ul>

            <h2>5. Partage des données</h2>
            <h3>5.1 Avec votre partenaire</h3>
            <p>
              Vos réponses sont partagées uniquement avec la personne que vous avez invitée 
              et qui a accepté de participer au questionnaire.
            </p>

            <h3>5.2 Avec des tiers</h3>
            <p>
              Nous ne vendons ni ne louons vos données personnelles. Nous pouvons partager 
              des données anonymisées avec des partenaires de recherche dans le domaine 
              des relations matrimoniales.
            </p>

            <h3>5.3 Prestataires techniques</h3>
            <ul>
              <li>Supabase (hébergement des données)</li>
              <li>Resend/Brevo (envoi d'emails)</li>
              <li>Vercel (hébergement de l'application)</li>
            </ul>

            <h2>6. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées :
            </p>
            <ul>
              <li>Chiffrement des données sensibles</li>
              <li>Contrôle d'accès strict</li>
              <li>Surveillance continue des systèmes</li>
              <li>Sauvegarde sécurisée des données</li>
            </ul>

            <h2>7. Conservation des données</h2>
            <ul>
              <li><strong>Données de compte :</strong> 2 ans après la dernière connexion</li>
              <li><strong>Réponses au questionnaire :</strong> 1 an après la création</li>
              <li><strong>Résultats de compatibilité :</strong> 2 ans pour permettre les consultations</li>
              <li><strong>Données techniques :</strong> 13 mois maximum</li>
            </ul>

            <h2>8. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d'accès :</strong> Connaître les données que nous détenons</li>
              <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
              <li><strong>Droit à la portabilité :</strong> Récupérer vos données</li>
              <li><strong>Droit d'opposition :</strong> Vous opposer au traitement</li>
              <li><strong>Droit de limitation :</strong> Limiter l'usage de vos données</li>
            </ul>

            <h2>9. Cookies</h2>
            <p>
              Nous utilisons uniquement des cookies essentiels au fonctionnement :
            </p>
            <ul>
              <li>Cookies de session pour l'authentification</li>
              <li>Cookies de préférences (langue, thème)</li>
              <li>Cookies de sécurité (protection CSRF)</li>
            </ul>

            <h2>10. Transferts internationaux</h2>
            <p>
              Vos données peuvent être transférées vers des pays tiers disposant d'un niveau 
              de protection adéquat ou via des garanties appropriées (clauses contractuelles types).
            </p>

            <h2>11. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. Nous vous informerons des modifications 
              importantes par email ou via une notification sur la plateforme.
            </p>

            <h2>12. Contact et réclamations</h2>
            <p>
              Pour exercer vos droits ou poser une question :
              <br />
              <strong>Email :</strong> privacy@nikahscore.com
              <br />
              <strong>DPO :</strong> dpo@nikahscore.com
            </p>
            <p>
              Vous pouvez également déposer une réclamation auprès de la CNIL :
              <br />
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                www.cnil.fr
              </a>
            </p>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium mb-2">
                Engagement islamique
              </p>
              <p className="text-green-700 text-sm">
                Conformément aux valeurs islamiques d'honnêteté et de respect de la vie privée, 
                nous nous engageons à traiter vos données avec la plus grande confidentialité 
                et transparence. La protection de votre intimité (Haram) est une priorité absolue.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
