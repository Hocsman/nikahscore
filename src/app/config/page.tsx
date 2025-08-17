import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Settings, Key, CheckCircle, ExternalLink } from 'lucide-react'

export default function SupabaseConfigPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuration Supabase pour NikahScore
          </h1>
          <p className="text-gray-600">
            Suivez ces étapes pour configurer l'authentification par email
          </p>
        </div>

        <div className="space-y-6">
          {/* Étape 1: SMTP Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                1. Configuration SMTP dans Supabase
              </CardTitle>
              <CardDescription>
                Configurez votre service email pour l'envoi des codes OTP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Action requise</h4>
                <p className="text-yellow-700">
                  L'erreur "Error sending confirmation email" indique que votre projet Supabase 
                  n'a pas de service SMTP configuré.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Accédez à votre dashboard Supabase :</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Allez sur <Badge variant="outline">https://supabase.com/dashboard</Badge></li>
                  <li>Sélectionnez votre projet <Badge variant="outline">vhwdgjzjxrcglbmnjzot</Badge></li>
                  <li>Dans la sidebar, cliquez sur <Badge>Authentication</Badge></li>
                  <li>Cliquez sur <Badge>Settings</Badge></li>
                  <li>Scrollez jusqu'à la section <Badge>SMTP Settings</Badge></li>
                </ol>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Gmail */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Gmail SMTP</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Host:</strong> smtp.gmail.com</div>
                    <div><strong>Port:</strong> 587</div>
                    <div><strong>Username:</strong> votre-email@gmail.com</div>
                    <div><strong>Password:</strong> App Password (pas votre mot de passe Gmail)</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Activez l'authentification à 2 facteurs et créez un App Password
                    </div>
                  </CardContent>
                </Card>

                {/* Brevo */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Brevo (ex-Sendinblue)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Host:</strong> smtp-relay.brevo.com</div>
                    <div><strong>Port:</strong> 587</div>
                    <div><strong>Username:</strong> votre-email@domain.com</div>
                    <div><strong>Password:</strong> Votre clé API SMTP</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Gratuit jusqu'à 300 emails/jour
                    </div>
                  </CardContent>
                </Card>

                {/* Resend */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Resend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Host:</strong> smtp.resend.com</div>
                    <div><strong>Port:</strong> 587</div>
                    <div><strong>Username:</strong> resend</div>
                    <div><strong>Password:</strong> Votre API Key Resend</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Gratuit jusqu'à 3000 emails/mois
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Recommandation</h4>
                <p className="text-blue-700 text-sm">
                  Pour débuter rapidement, utilisez <strong>Resend</strong> qui offre une configuration simple 
                  et 3000 emails gratuits par mois. Créez un compte sur 
                  <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">
                    resend.com <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Étape 2: Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                2. Configuration de la base de données
              </CardTitle>
              <CardDescription>
                Créez les tables nécessaires pour l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Exécutez les migrations SQL :</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Dans votre dashboard Supabase, cliquez sur <Badge>SQL Editor</Badge></li>
                  <li>Copiez-collez le contenu du fichier <Badge variant="outline">supabase/migrations/*.sql</Badge></li>
                  <li>Cliquez sur <Badge>Run</Badge> pour créer les tables</li>
                  <li>Exécutez aussi le script de seed pour insérer les 60 questions</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Tables à créer</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <Badge variant="secondary">users</Badge>
                  <Badge variant="secondary">pairs</Badge>
                  <Badge variant="secondary">questions</Badge>
                  <Badge variant="secondary">answers</Badge>
                  <Badge variant="secondary">matches</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Étape 3: RLS Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                3. Politiques de sécurité (RLS)
              </CardTitle>
              <CardDescription>
                Configurez Row Level Security pour protéger vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Activez RLS sur toutes les tables :</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Allez dans <Badge>Database</Badge> → <Badge>Tables</Badge></li>
                  <li>Pour chaque table, cliquez sur les 3 points → <Badge>Edit Table</Badge></li>
                  <li>Activez <Badge>Enable Row Level Security (RLS)</Badge></li>
                  <li>Les politiques sont déjà définies dans les migrations</li>
                </ol>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">🔒 Sécurité</h4>
                <p className="text-orange-700 text-sm">
                  RLS garantit que chaque utilisateur ne peut accéder qu'à ses propres données 
                  et aux données partagées avec lui via les tokens d'invitation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Étape 4: Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                4. Test de la configuration
              </CardTitle>
              <CardDescription>
                Vérifiez que tout fonctionne correctement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Liste de vérification :</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    SMTP configuré et testé dans Supabase
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Tables créées avec succès
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    60 questions insérées dans la table questions
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    RLS activé sur toutes les tables
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Test d'inscription avec email réel
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🎉 Prêt à tester</h4>
                <p className="text-green-700 text-sm">
                  Une fois la configuration SMTP terminée, vous pourrez vous connecter sur 
                  <Badge variant="outline">http://localhost:3001/login</Badge> et recevoir des emails avec les codes OTP.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
