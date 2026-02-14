# 🌐 GUIDE COMPLET - RÉSOLUTION PROBLÈME DNS NIKAHSCORE.COM

## 📅 20 Octobre 2025

---

## 🚨 **PROBLÈME IDENTIFIÉ**

Vercel détecte un **conflit de configuration DNS** :

```
❌ CONFLIT DÉTECTÉ:
Type: A
Name: @
Value: 213.186.33.5  ← ANCIEN ENREGISTREMENT À SUPPRIMER
```

---

## ✅ **SOLUTION EN 3 ÉTAPES**

### **ÉTAPE 1 : Accéder à votre panel OVH**

1. Connectez-vous à : **https://www.ovh.com/manager/**
2. Allez dans **Web Cloud** → **Noms de domaine**
3. Sélectionnez **nikahscore.com**
4. Cliquez sur l'onglet **Zone DNS**

---

### **ÉTAPE 2 : Supprimer l'enregistrement A conflictuel**

🔴 **À SUPPRIMER :**

```
Type: A
Sous-domaine: @ (ou vide)
Cible: 213.186.33.5
```

**Comment faire :**
1. Dans la liste des enregistrements DNS, cherchez l'enregistrement de type **A** avec la valeur `213.186.33.5`
2. Cliquez sur l'icône **🗑️ Supprimer** ou **Modifier**
3. Supprimez cet enregistrement
4. **Confirmez** la suppression

---

### **ÉTAPE 3 : Configurer les nouveaux enregistrements Vercel**

✅ **CONFIGURATION CORRECTE POUR VERCEL :**

#### **Pour www.nikahscore.com :**
```
Type: CNAME
Sous-domaine: www
Cible: 407f86ec2fef687a.vercel-dns-017.com.
TTL: 3600 (ou Auto)
```

#### **Pour nikahscore.com (domaine principal) :**

**OPTION A - Recommandée (CNAME flattening si supporté par OVH) :**
```
Type: CNAME
Sous-domaine: @ (ou vide)
Cible: 407f86ec2fef687a.vercel-dns-017.com.
TTL: 3600
```

**OPTION B - Alternative (si CNAME @ pas supporté) :**
```
Type: A
Sous-domaine: @ (ou vide)
Cible: 76.76.21.21
TTL: 3600
```

---

## 📋 **PROCÉDURE DÉTAILLÉE SUR OVH**

### **Ajouter l'enregistrement CNAME pour www**

1. Dans **Zone DNS**, cliquez sur **Ajouter une entrée**
2. Sélectionnez **CNAME**
3. Remplissez :
   - **Sous-domaine** : `www`
   - **Cible** : `407f86ec2fef687a.vercel-dns-017.com.`
   - **TTL** : `3600` (ou laisser par défaut)
4. Cliquez sur **Suivant** puis **Valider**

### **Configurer le domaine principal (@)**

**Si votre OVH supporte CNAME pour @ :**
1. Cliquez sur **Ajouter une entrée**
2. Sélectionnez **CNAME**
3. Remplissez :
   - **Sous-domaine** : Laissez vide ou mettez `@`
   - **Cible** : `407f86ec2fef687a.vercel-dns-017.com.`
   - **TTL** : `3600`
4. Validez

**Si CNAME @ n'est pas supporté (message d'erreur) :**
1. Cliquez sur **Ajouter une entrée**
2. Sélectionnez **A**
3. Remplissez :
   - **Sous-domaine** : Laissez vide ou mettez `@`
   - **Cible IPv4** : `76.76.21.21`
   - **TTL** : `3600`
4. Validez

---

## ⏱️ **TEMPS DE PROPAGATION**

- **OVH** : 5-30 minutes généralement
- **Propagation mondiale** : Jusqu'à 24-48 heures maximum
- **Vérification** : Vous pouvez tester immédiatement après 10-15 minutes

---

## 🧪 **VÉRIFICATION DE LA CONFIGURATION**

### **1. Vérifier les enregistrements DNS (en ligne de commande)**

```powershell
# Vérifier CNAME pour www
nslookup www.nikahscore.com

# Vérifier A ou CNAME pour le domaine principal
nslookup nikahscore.com

# Utiliser Google DNS pour vérifier
nslookup nikahscore.com 8.8.8.8
```

### **2. Vérifier en ligne**

- **https://dnschecker.org/** → Entrez `nikahscore.com`
- **https://mxtoolbox.com/SuperTool.aspx** → DNS Lookup

### **3. Ce que vous devriez voir**

✅ **Résultat attendu pour www.nikahscore.com :**
```
www.nikahscore.com
CNAME → 407f86ec2fef687a.vercel-dns-017.com
```

✅ **Résultat attendu pour nikahscore.com :**
```
nikahscore.com
CNAME → 407f86ec2fef687a.vercel-dns-017.com (si supporté)
OU
A → 76.76.21.21 (alternative)
```

---

## ✅ **CHECKLIST FINALE**

Avant de valider sur Vercel, assurez-vous que :

- [ ] ❌ Enregistrement A @ → 213.186.33.5 **SUPPRIMÉ**
- [ ] ✅ CNAME www → 407f86ec2fef687a.vercel-dns-017.com **AJOUTÉ**
- [ ] ✅ CNAME @ → 407f86ec2fef687a.vercel-dns-017.com **AJOUTÉ**
  - OU A @ → 76.76.21.21 (si CNAME @ impossible)
- [ ] ⏱️ Attendre 10-15 minutes minimum
- [ ] 🧪 Tester avec nslookup ou dnschecker.org
- [ ] 🔄 Retourner sur Vercel et cliquer sur **"Refresh"** ou **"Verify"**

---

## 🎯 **CONFIGURATION FINALE ATTENDUE**

### **Dans votre Zone DNS OVH, vous devriez avoir :**

| Type  | Sous-domaine | Cible                                | TTL  |
|-------|--------------|--------------------------------------|------|
| CNAME | www          | 407f86ec2fef687a.vercel-dns-017.com. | 3600 |
| CNAME | @            | 407f86ec2fef687a.vercel-dns-017.com. | 3600 |

**OU (si CNAME @ impossible) :**

| Type  | Sous-domaine | Cible                                | TTL  |
|-------|--------------|--------------------------------------|------|
| CNAME | www          | 407f86ec2fef687a.vercel-dns-017.com. | 3600 |
| A     | @            | 76.76.21.21                          | 3600 |

---

## 🚨 **ERREURS COURANTES À ÉVITER**

❌ **NE PAS FAIRE :**
- Oublier le point final : `407f86ec2fef687a.vercel-dns-017.com.` ← Important !
- Laisser l'ancien enregistrement A (213.186.33.5)
- Utiliser des guillemets dans la cible
- Mettre un slash `/` à la fin

✅ **À FAIRE :**
- Utiliser exactement : `407f86ec2fef687a.vercel-dns-017.com.`
- Supprimer TOUS les anciens enregistrements A pour @
- Attendre au moins 15 minutes avant de tester
- Vider le cache DNS de votre ordinateur : `ipconfig /flushdns` (Windows)

---

## 📞 **SI VOUS RENCONTREZ DES DIFFICULTÉS**

### **Option 1 : Support OVH**
- Téléphone : Consulter le support OVH
- Ticket : Depuis votre espace client OVH
- Demander : "Configuration DNS pour domaine Vercel avec CNAME"

### **Option 2 : Support Vercel**
- Documentation : https://vercel.com/docs/concepts/projects/domains
- Support : support@vercel.com
- Discord : https://vercel.com/discord

---

## ✨ **APRÈS VALIDATION**

Une fois les DNS correctement configurés et propagés :

1. Retournez sur **Vercel Dashboard**
2. Allez dans **Settings** → **Domains**
3. Cliquez sur **Refresh** à côté de nikahscore.com
4. Le statut devrait passer à **✅ Valid Configuration**
5. Votre site sera accessible via :
   - ✅ https://nikahscore.com
   - ✅ https://www.nikahscore.com
6. Certificat SSL automatiquement généré par Vercel

---

## 🎉 **RÉSULTAT FINAL**

Après succès, vous aurez :
- ✅ nikahscore.com pointant vers Vercel
- ✅ www.nikahscore.com redirigeant vers Vercel
- ✅ HTTPS automatique avec certificat SSL
- ✅ CDN mondial Vercel actif
- ✅ Déploiements automatiques fonctionnels

---

**📅 Guide mis à jour le 20 octobre 2025**
**🚀 NikahScore - Configuration DNS Vercel**