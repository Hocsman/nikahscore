# 🔍 ANALYSE CONFIGURATION DNS ACTUELLE - NIKAHSCORE.COM

## 📅 20 Octobre 2025

---

## 📊 CONFIGURATION ACTUELLE (Copie OVH)

```
✅ NS Records (OK - Ne pas toucher):
- dns10.ovh.net
- ns10.ovh.net

❌ PROBLÈME - Enregistrements A en CONFLIT:
1. nikahscore.com → 213.186.33.5  ← À SUPPRIMER !
2. nikahscore.com → 76.76.21.21   ← BON (Vercel)
3. nikahscore.com → 76.76.21.21   ← DOUBLON à supprimer

❌ PROBLÈME - www.nikahscore.com:
- TXT: "407f86ec2fef687a.vercel-dns-017.com."  ← MAUVAIS TYPE !
  (Devrait être CNAME, pas TXT)

✅ Email Records (OK - Ne pas toucher):
- MX records OVH
- MX record Amazon SES
- SPF records
- DKIM (resend._domainkey)
- DMARC (_dmarc)
```

---

## 🎯 ACTIONS REQUISES

### ✅ **CE QU'IL FAUT FAIRE :**

#### **1️⃣ SUPPRIMER ces 2 enregistrements :**

```
❌ À SUPPRIMER #1:
Type: A
Domaine: nikahscore.com
Cible: 213.186.33.5

❌ À SUPPRIMER #2 (doublon):
Type: A
Domaine: nikahscore.com
Cible: 76.76.21.21  (un des deux doublons)
```

#### **2️⃣ GARDER cet enregistrement :**

```
✅ À CONSERVER:
Type: A
Domaine: nikahscore.com
Cible: 76.76.21.21  (garder un seul)
```

#### **3️⃣ SUPPRIMER et RECRÉER www :**

```
❌ À SUPPRIMER:
Type: TXT
Domaine: www.nikahscore.com
Valeur: "407f86ec2fef687a.vercel-dns-017.com."

✅ À CRÉER À LA PLACE:
Type: CNAME
Domaine: www
Cible: 407f86ec2fef687a.vercel-dns-017.com.
TTL: 3600
```

---

## 📝 PROCÉDURE DÉTAILLÉE SUR OVH

### **ÉTAPE 1 : Supprimer l'enregistrement A conflictuel (213.186.33.5)**

1. Dans la liste DNS, trouvez la ligne :
   ```
   nikahscore.com. → A → 213.186.33.5
   ```
2. Cliquez sur l'icône **🗑️ Supprimer** à droite
3. Confirmez la suppression

---

### **ÉTAPE 2 : Supprimer un des doublons 76.76.21.21**

Vous avez **2 fois** le même enregistrement A vers 76.76.21.21 :
1. Trouvez UNE des deux lignes identiques :
   ```
   nikahscore.com. → A → 76.76.21.21
   ```
2. Supprimez-en **UNE SEULE** (gardez l'autre)
3. Résultat : vous devez avoir **1 seul** enregistrement A vers 76.76.21.21

---

### **ÉTAPE 3 : Corriger www.nikahscore.com**

#### **3A : Supprimer le mauvais enregistrement TXT**
1. Trouvez :
   ```
   www.nikahscore.com. → TXT → "407f86ec2fef687a.vercel-dns-017.com."
   ```
2. **Supprimez-le** (c'est le mauvais type)

#### **3B : Créer le bon enregistrement CNAME**
1. Cliquez sur **"Ajouter une entrée"**
2. Sélectionnez **CNAME**
3. Remplissez :
   - **Sous-domaine** : `www`
   - **Cible** : `407f86ec2fef687a.vercel-dns-017.com.`
   - **TTL** : `3600` (ou laisser par défaut)
4. Cliquez sur **Valider**

---

## ✅ CONFIGURATION FINALE ATTENDUE

Après modifications, votre Zone DNS devrait contenir :

### **Pour nikahscore.com (domaine principal) :**
```
Type: A
Domaine: nikahscore.com
Cible: 76.76.21.21
TTL: 0 ou 3600
```

### **Pour www.nikahscore.com :**
```
Type: CNAME
Domaine: www.nikahscore.com
Cible: 407f86ec2fef687a.vercel-dns-017.com.
TTL: 0 ou 3600
```

### **Autres enregistrements à conserver :**
- ✅ Tous les **NS** (dns10.ovh.net, ns10.ovh.net)
- ✅ Tous les **MX** (mail OVH et Amazon SES)
- ✅ Tous les **TXT** sauf celui de www (SPF, DKIM, DMARC)
- ✅ **Ne touchez pas** aux enregistrements email !

---

## 🎯 RÉSUMÉ DES ACTIONS

| Action | Type | Domaine | Valeur |
|--------|------|---------|--------|
| ❌ **SUPPRIMER** | A | nikahscore.com | 213.186.33.5 |
| ❌ **SUPPRIMER** | A | nikahscore.com | 76.76.21.21 (1 des 2) |
| ❌ **SUPPRIMER** | TXT | www | "407f86ec2fef687a..." |
| ✅ **CRÉER** | CNAME | www | 407f86ec2fef687a.vercel-dns-017.com. |
| ✅ **GARDER** | A | nikahscore.com | 76.76.21.21 (1 seul) |

---

## ⚠️ POINTS D'ATTENTION

1. **NE PAS TOUCHER** aux enregistrements :
   - NS (dns10.ovh.net, ns10.ovh.net)
   - MX (tous les enregistrements mail)
   - SPF (v=spf1...)
   - DKIM (resend._domainkey)
   - DMARC (_dmarc)

2. **IMPORTANT pour le CNAME www :**
   - Bien mettre le **POINT FINAL** : `.vercel-dns-017.com.`
   - Type doit être **CNAME** (pas TXT !)
   - Sous-domaine : `www` (pas www.nikahscore.com)

3. **Après modification :**
   - Attendez 10-15 minutes
   - Testez avec `nslookup`
   - Retournez sur Vercel et cliquez "Refresh"

---

## 🧪 VÉRIFICATION APRÈS MODIFICATION

```powershell
# Vider le cache DNS local
ipconfig /flushdns

# Vérifier nikahscore.com
nslookup nikahscore.com
# Devrait montrer: 76.76.21.21

# Vérifier www.nikahscore.com
nslookup www.nikahscore.com
# Devrait montrer: CNAME vers 407f86ec2fef687a.vercel-dns-017.com
```

---

## 🎉 RÉSULTAT ATTENDU SUR VERCEL

Après ces modifications et 15 minutes de propagation :

```
✅ nikahscore.com → Valid Configuration
✅ www.nikahscore.com → Valid Configuration
```

Votre site sera accessible sur :
- ✅ https://nikahscore.com
- ✅ https://www.nikahscore.com

---

## 📊 CHECKLIST DE VALIDATION

- [ ] Enregistrement A (213.186.33.5) supprimé
- [ ] Un doublon A (76.76.21.21) supprimé
- [ ] Un seul A (76.76.21.21) reste pour nikahscore.com
- [ ] TXT www supprimé
- [ ] CNAME www → Vercel créé avec le point final
- [ ] Autres enregistrements (NS, MX, SPF, etc.) intacts
- [ ] Attente de 15 minutes effectuée
- [ ] Test nslookup effectué
- [ ] Vercel "Refresh" cliqué
- [ ] Statut Vercel = "Valid Configuration" ✅

---

**🚀 Suivez ces étapes précises et votre domaine sera opérationnel !**

*Analyse effectuée le 20 octobre 2025 - Configuration DNS OVH pour Vercel*