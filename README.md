# NikahScore

Plateforme moderne de compatibilité matrimoniale selon les valeurs islamiques.

## 🌟 Présentation

NikahScore est une application web innovante qui aide les musulmans à évaluer leur compatibilité matrimoniale de manière respectueuse et conforme aux valeurs islamiques. L'application propose un questionnaire détaillé et génère un rapport de compatibilité complet.

## ✨ Fonctionnalités

- **Questionnaire de compatibilité** : 35-45 questions couvrant les aspects essentiels de la vie conjugale
- **Système de scoring intelligent** : Algorithme de calcul de compatibilité basé sur les réponses
- **Rapport détaillé** : Visualisations radar, forces/frictions, conseils personnalisés
- **Partage sécurisé** : Système d'invitation par email pour les couples
- **Export PDF** : Téléchargement du rapport de compatibilité
- **Interface moderne** : Design responsive et accessible

## 🛠 Technologies

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth (OTP email)
- **Graphiques** : Recharts
- **Email** : Resend / Brevo
- **Validation** : Zod
- **Déploiement** : Vercel

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone [url-du-repo]
cd nikahscore
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
Copier `.env.local` et remplir les variables :
```bash
cp .env.local.example .env.local
```

4. **Configurer Supabase**
```bash
# Lancer les migrations
npx supabase db reset
```

5. **Injecter les questions**
```bash
npm run seed
```

6. **Lancer le serveur de développement**
```bash
npm run dev
```

## 📁 Structure du projet

```
src/
├─ app/              # Pages Next.js (App Router)
├─ components/       # Composants React réutilisables
├─ lib/             # Utilitaires et configuration
├─ hooks/           # Hooks React personnalisés
└─ styles/          # Styles CSS globaux
```

## 🔒 Sécurité & Confidentialité

- Chiffrement des données sensibles
- Politiques de sécurité au niveau des lignes (RLS)
- Respect du RGPD
- Anonymisation des données

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support, contactez-nous à : support@nikahscore.com

---

Fait avec ❤️ pour la communauté musulmane
