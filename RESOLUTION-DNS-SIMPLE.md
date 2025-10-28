# 🚨 RÉSOLUTION RAPIDE - PROBLÈME DNS NIKAHSCORE.COM

## 📅 20 Octobre 2025 - Configuration Vercel

---

## LE PROBLÈME

Vercel dit : **"Invalid Configuration"** ❌

**Cause :** Vous avez un ancien enregistrement DNS qui entre en conflit.

---

## LA SOLUTION EN 3 ÉTAPES SIMPLES

### ✅ ÉTAPE 1 : Se connecter à OVH

1. Allez sur : **https://www.ovh.com/manager/**
2. Connectez-vous
3. Cliquez sur **Web Cloud** → **Noms de domaine**
4. Sélectionnez **nikahscore.com**
5. Cliquez sur l'onglet **Zone DNS**

---

### 🗑️ ÉTAPE 2 : SUPPRIMER l'ancien enregistrement

**CHERCHEZ et SUPPRIMEZ cet enregistrement :**

```
Type: A
Nom: @ (ou vide)  
Valeur: 213.186.33.5  ← À SUPPRIMER !
```

**Comment :**
- Dans la liste, trouvez la ligne avec `213.186.33.5`
- Cliquez sur l'icône **Poubelle** 🗑️ ou **Supprimer**
- Confirmez la suppression

---

### ➕ ÉTAPE 3 : AJOUTER les nouveaux enregistrements

#### **Enregistrement 1 - Pour www**

```
Type:   CNAME
Nom:    www
Cible:  407f86ec2fef687a.vercel-dns-017.com.
TTL:    3600
```

#### **Enregistrement 2 - Pour le domaine principal**

**OPTION A (Essayez d'abord celle-ci) :**
```
Type:   CNAME
Nom:    @ (ou laissez vide)
Cible:  407f86ec2fef687a.vercel-dns-017.com.
TTL:    3600
```

**OPTION B (Si CNAME @ ne marche pas) :**
```
Type:   A
Nom:    @ (ou laissez vide)
Cible:  76.76.21.21
TTL:    3600
```

---

## ⚠️ TRÈS IMPORTANT !

1. ✅ **Mettez bien le POINT à la fin** : `407f86ec2fef687a.vercel-dns-017.com.`
2. ⏱️ **Attendez 10-15 minutes** après modification
3. 🔄 **Ne paniquez pas** si ça ne marche pas immédiatement
4. 🧪 **Testez** avec les commandes ci-dessous

---

## 🧪 TESTER LA CONFIGURATION

### Dans PowerShell (Windows) :

```powershell
# Vider le cache DNS
ipconfig /flushdns

# Tester nikahscore.com
nslookup nikahscore.com

# Tester www
nslookup www.nikahscore.com
```

### En ligne :
- **https://dnschecker.org/** → Entrez `nikahscore.com`

---

## ✅ CONFIGURATION FINALE

**Voici ce que vous devriez avoir dans votre Zone DNS OVH :**

| Type  | Nom | Cible                                | TTL  |
|-------|-----|--------------------------------------|------|
| CNAME | www | 407f86ec2fef687a.vercel-dns-017.com. | 3600 |
| CNAME | @   | 407f86ec2fef687a.vercel-dns-017.com. | 3600 |

**OU (si CNAME @ impossible) :**

| Type  | Nom | Cible                                | TTL  |
|-------|-----|--------------------------------------|------|
| CNAME | www | 407f86ec2fef687a.vercel-dns-017.com. | 3600 |
| A     | @   | 76.76.21.21                          | 3600 |

---

## 🎯 APRÈS CONFIGURATION

1. Attendez **15 minutes**
2. Testez avec `nslookup nikahscore.com`
3. Retournez sur **Vercel**
4. Cliquez sur **"Refresh"** ou **"Verify"**
5. Le statut devrait passer à **✅ Valid Configuration**

---

## 🚀 RÉSULTAT FINAL

✅ **nikahscore.com** → Fonctionne  
✅ **www.nikahscore.com** → Fonctionne  
✅ **HTTPS** → Activé automatiquement  
✅ **Certificat SSL** → Généré par Vercel  

---

## 📞 BESOIN D'AIDE ?

**Si ça ne marche toujours pas après 30 minutes :**
- Contactez le **support OVH** via votre espace client
- Demandez : *"Configuration DNS pour domaine Vercel"*
- Montrez-leur ce guide

---

**🎉 C'est simple, vous y arriverez !**

*Guide créé le 20 octobre 2025 - NikahScore*