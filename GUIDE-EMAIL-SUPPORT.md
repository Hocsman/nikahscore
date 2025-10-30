# 📧 CONFIGURATION EMAIL SUPPORT@NIKAHSCORE.COM

## ✅ Ce qui a été fait

Vous avez créé l'email **support@nikahscore.com** sur OVH.
Le code a été mis à jour pour envoyer les messages à cet email.

---

## ⚠️ ÉTAPE IMPORTANTE : Vérifier l'email dans Resend

Pour que Resend puisse envoyer des emails à `support@nikahscore.com`, vous devez **ajouter cet email à la liste des destinataires autorisés** dans Resend (en mode gratuit).

### 🔧 Comment faire :

1. **Aller sur Resend:**
   - https://resend.com/emails
   - Connectez-vous à votre compte

2. **Ajouter l'email destinataire:**
   - Aller dans **Settings** → **Audience**
   - OU directement : https://resend.com/audiences
   - Cliquer sur **"Add Email"** ou **"Add Contact"**
   - Ajouter : `support@nikahscore.com`

3. **Vérifier l'email:**
   - Resend va envoyer un email de vérification à `support@nikahscore.com`
   - Aller dans votre boîte OVH Webmail : https://www.ovh.com/fr/mail/
   - Ouvrir l'email de Resend
   - Cliquer sur le lien de vérification

4. **Une fois vérifié:**
   - ✅ Resend pourra envoyer des emails à `support@nikahscore.com`
   - ✅ Vous recevrez tous les messages de contact

---

## 🎯 CONFIGURATION ACTUELLE

### Dans `src/app/api/contact/route.ts`:

```typescript
// Ligne 23-25
from: 'NikahScore Contact <onboarding@resend.dev>', // Email d'envoi
to: 'support@nikahscore.com', // ✅ Email de réception (OVH)
```

**Status:**
- ✅ Email destinataire configuré
- ⚠️ Email d'envoi temporaire (`onboarding@resend.dev`)

---

## 📧 WEBMAIL OVH - Comment accéder à vos emails

### Option 1: Webmail OVH

1. Aller sur : https://www.ovh.com/fr/mail/
2. Se connecter avec :
   - Email: `support@nikahscore.com`
   - Mot de passe: (celui que vous avez défini lors de la création)

### Option 2: Configurer dans un client email (Gmail, Outlook, etc.)

**Paramètres IMAP (pour recevoir) :**
- Serveur: `ssl0.ovh.net`
- Port: `993`
- SSL: Oui
- Nom d'utilisateur: `support@nikahscore.com`
- Mot de passe: (votre mot de passe OVH)

**Paramètres SMTP (pour envoyer) :**
- Serveur: `ssl0.ovh.net`
- Port: `465` ou `587`
- SSL/TLS: Oui
- Nom d'utilisateur: `support@nikahscore.com`
- Mot de passe: (votre mot de passe OVH)

---

## 🧪 TEST COMPLET DU SYSTÈME

### 1. Vérifier l'email dans Resend

```bash
# Checklist:
☐ Aller sur https://resend.com/audiences
☐ Ajouter support@nikahscore.com
☐ Vérifier l'email depuis le Webmail OVH
☐ Email marqué comme "Vérifié" dans Resend
```

### 2. Tester l'API en local

```bash
# Démarrer le serveur
npm run dev

# Aller sur http://localhost:3000/contact
# Remplir le formulaire
# Envoyer

# Vérifier dans le terminal:
📧 Envoi du message de contact...
✅ Email admin envoyé: { id: '...' }
✅ Email confirmation utilisateur envoyé: { id: '...' }
```

### 3. Vérifier réception dans OVH Webmail

```bash
☐ Se connecter à https://www.ovh.com/fr/mail/
☐ Vérifier la réception du message de test
☐ Vérifier que toutes les infos sont présentes
☐ Tester le bouton "Répondre"
```

---

## 🚀 AMÉLIORATION FUTURE (Optionnel)

### Pour des emails 100% professionnels

Actuellement, les emails sont envoyés depuis `onboarding@resend.dev` (email Resend de test).

**Pour envoyer depuis `contact@nikahscore.com` ou `support@nikahscore.com` :**

1. **Vérifier le domaine dans Resend:**
   - Aller sur : https://resend.com/domains
   - Cliquer sur **"Add Domain"**
   - Ajouter : `nikahscore.com`

2. **Configurer les enregistrements DNS sur OVH:**
   - Resend vous donnera des enregistrements DNS à ajouter
   - Types : SPF, DKIM, DMARC
   - Aller dans OVH → Zone DNS → Ajouter ces enregistrements

3. **Attendre la vérification (~10-30 minutes)**

4. **Modifier le code:**
   ```typescript
   // Dans route.ts, ligne 23
   from: 'NikahScore Contact <contact@nikahscore.com>',
   
   // Et ligne 125
   from: 'NikahScore Support <support@nikahscore.com>',
   ```

**Avantages:**
- Emails envoyés depuis @nikahscore.com (plus professionnel)
- Meilleure délivrabilité
- Moins de risque de spam
- Limite gratuite augmentée (3000 emails/jour)

**Pour l'instant:**
- Le système fonctionne avec `onboarding@resend.dev`
- Vous recevrez bien les emails sur `support@nikahscore.com`
- Vous pouvez améliorer plus tard

---

## ✅ CHECKLIST FINALE AVANT DÉPLOIEMENT

### Configuration:
- [x] Email OVH créé (support@nikahscore.com)
- [x] Code mis à jour avec l'email destinataire
- [ ] Email vérifié dans Resend Audience
- [ ] Test local réussi
- [ ] Email reçu dans Webmail OVH

### Déploiement:
- [ ] Commit et push du code
- [ ] Vérifier RESEND_API_KEY dans Vercel
- [ ] Test en production (nikahscore.com/contact)
- [ ] Email de test reçu en production

---

## 📊 FLUX COMPLET DES EMAILS

```
Utilisateur remplit formulaire nikahscore.com/contact
                    ↓
         API /api/contact (Next.js)
                    ↓
         Resend envoie 2 emails:
                    ↓
    ┌───────────────┴──────────────┐
    ↓                              ↓
Email admin                  Email confirmation
(vers support@nikahscore.com)    (vers utilisateur)
    ↓                              ↓
Webmail OVH                   Boîte utilisateur
(vous lisez)                  (il confirme)
    ↓
Vous répondez depuis OVH
    ↓
L'utilisateur reçoit votre réponse
```

---

## 🎯 RÉSULTAT ATTENDU

**Quand un utilisateur envoie un message:**

1. **Vous recevez dans support@nikahscore.com:**
   - Nom complet de l'utilisateur
   - Email de l'utilisateur
   - Sujet de la demande
   - Message complet
   - Date/heure
   - Bouton pour répondre facilement

2. **L'utilisateur reçoit une confirmation:**
   - Confirmation de réception
   - Délai de réponse (24-48h)
   - Liens utiles (FAQ, Dashboard)
   - Branding NikahScore

3. **Vous pouvez répondre:**
   - Directement depuis votre Webmail OVH
   - Ou depuis Gmail/Outlook si configuré
   - Le Reply-To est configuré automatiquement

---

## 🆘 DÉPANNAGE

### Problème: "Email non autorisé" dans Resend

**Solution:**
- Aller sur https://resend.com/audiences
- Vérifier que `support@nikahscore.com` est dans la liste
- Vérifier qu'il est marqué "Verified"
- Si pas vérifié, vérifier dans Webmail OVH l'email de confirmation

### Problème: "Email non reçu dans OVH"

**Solution:**
- Vérifier le dossier Spam/Courrier indésirable
- Vérifier que l'email a bien été créé sur OVH
- Tester de vous envoyer un email test directement
- Vérifier les logs Resend: https://resend.com/emails

### Problème: "Impossible d'accéder au Webmail OVH"

**Solution:**
- Vérifier l'URL: https://www.ovh.com/fr/mail/
- Vérifier le mot de passe (le réinitialiser si besoin depuis OVH Manager)
- Essayer en navigation privée
- Vider le cache du navigateur

---

## 📞 PROCHAINES ÉTAPES

### Maintenant:

1. **Vérifier l'email dans Resend** (5 min)
   - https://resend.com/audiences
   - Ajouter support@nikahscore.com
   - Vérifier depuis Webmail OVH

2. **Tester en local** (5 min)
   - npm run dev
   - Envoyer message test
   - Vérifier réception

3. **Déployer** (10 min)
   - git add, commit, push
   - Tester en production

### Plus tard (optionnel):

4. **Vérifier domaine Resend** (30 min)
   - Pour emails depuis @nikahscore.com
   - Meilleure délivrabilité

---

**🎉 Félicitations ! Votre email professionnel est prêt !**

*Guide créé le 28 octobre 2025 - NikahScore*
