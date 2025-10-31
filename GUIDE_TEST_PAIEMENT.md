# Guide de test du processus de paiement

## 📋 Configuration requise

### 1. Clés Stripe

Vous devez avoir :
- **Clé publique Stripe** (Publishable Key) : commence par `pk_test_...` pour les tests
- **Clé secrète Stripe** (Secret Key) : commence par `sk_test_...` pour les tests

Pour les obtenir :
1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Allez dans **Developers > API keys**
3. Copiez les clés en mode Test

### 2. Configuration Vercel

Dans votre projet Vercel, ajoutez la variable d'environnement :
- `STRIPE_SECRET_KEY` = votre clé secrète Stripe (ex: `sk_test_51Qh7JcB2Vv8LrG9X...`)

**Pour ajouter la variable d'environnement :**
1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings > Environment Variables**
4. Ajoutez `STRIPE_SECRET_KEY` avec votre clé secrète
5. Redéployez le projet

### 3. Configuration EmailJS

Les credentials EmailJS sont déjà configurés dans le code :
- Service ID: `service_dlxoage`
- Template ID: `template_i0akca4`
- Public Key: `7eqj2mK9qj1RaWlHq`

**Important :** Vérifiez que votre template EmailJS accepte les variables :
- `to_email`
- `to_name`
- `message`
- `subject`

## 🧪 Tester le processus de paiement

### Étape 1 : Initialiser Stripe dans le code

Dans `index.html`, trouvez cette ligne (vers la ligne 5455) :
```javascript
// initStripe('pk_test_VOTRE_CLE_PUBLIQUE_ICI');
```

Décommentez-la et remplacez par votre clé publique :
```javascript
initStripe('pk_test_51Qh7JcB2Vv8LrG9X...'); // Votre clé publique Stripe
```

### Étape 2 : Tester avec une carte de test

Stripe fournit des cartes de test pour tester différents scénarios :

#### ✅ Carte de test pour un paiement réussi
- **Numéro** : `4242 4242 4242 4242`
- **Date d'expiration** : n'importe quelle date future (ex: `12/25`)
- **CVC** : n'importe quel 3 chiffres (ex: `123`)
- **Code postal** : n'importe quel code postal (ex: `75001`)

#### ❌ Carte de test pour un paiement refusé
- **Numéro** : `4000 0000 0000 0002`
- **Date d'expiration** : n'importe quelle date future
- **CVC** : n'importe quel 3 chiffres
- **Code postal** : n'importe quel code postal

#### ⚠️ Carte nécessitant une authentification 3D Secure
- **Numéro** : `4000 0027 6000 3184`
- **Date d'expiration** : n'importe quelle date future
- **CVC** : n'importe quel 3 chiffres
- **Code postal** : n'importe quel code postal

### Étape 3 : Processus de test complet

1. **Ajouter des produits au panier**
   - Naviguez sur le site
   - Ajoutez un ou plusieurs produits au panier
   - Vérifiez que les frais de livraison s'affichent correctement :
     - **Gratuit** si le total >= 90€
     - **5€** si le total < 90€

2. **Passer la commande**
   - Cliquez sur "Passer la commande" dans le panier
   - Remplissez le formulaire de checkout :
     - Informations personnelles
     - Adresse de livraison
   - Cliquez sur "Payer maintenant"

3. **Effectuer le paiement**
   - Vous serez redirigé vers Stripe Checkout
   - Remplissez les informations de la carte de test
   - Cliquez sur "Pay"

4. **Vérifier la confirmation**
   - Vous serez redirigé vers le site
   - Une notification de succès doit s'afficher
   - Un email de confirmation doit être envoyé à l'adresse indiquée
   - Le panier doit être vidé
   - La commande doit apparaître dans l'espace personnel (si connecté)

### Étape 4 : Vérifications à faire

#### ✅ Checklist de test

- [ ] La redirection vers Stripe Checkout fonctionne
- [ ] Le paiement avec une carte de test réussit
- [ ] La redirection après paiement fonctionne
- [ ] L'email de confirmation est envoyé
- [ ] Le panier est vidé après paiement
- [ ] La commande est sauvegardée dans localStorage
- [ ] La commande apparaît dans l'espace personnel (si connecté)
- [ ] Les frais de livraison sont correctement calculés (0€ si >= 90€, 5€ sinon)
- [ ] La notification de succès s'affiche correctement
- [ ] Le numéro de commande est unique et généré correctement

#### 🔍 Vérifications dans le code

Ouvrez la console du navigateur (F12) et vérifiez :
- Pas d'erreurs JavaScript
- Messages de log confirmant :
  - `Stripe initialisé avec succès`
  - `Session Stripe vérifiée avec succès`
  - `Email de confirmation envoyé avec succès`
  - `Commande confirmée et email envoyé avec succès`

#### 📧 Vérifier l'email

L'email de confirmation doit contenir :
- Nom et prénom du client
- Numéro de commande
- Liste des produits commandés
- Sous-total
- Frais de livraison
- Total
- Adresse de livraison
- Message de remerciement

## 🐛 Résolution des problèmes

### Problème : "Stripe n'est pas initialisé"
**Solution :** Vérifiez que vous avez bien initialisé Stripe avec votre clé publique dans le code.

### Problème : "Erreur lors de la création de la session Stripe"
**Solutions :**
- Vérifiez que la variable d'environnement `STRIPE_SECRET_KEY` est bien configurée dans Vercel
- Vérifiez que votre clé secrète est correcte
- Redéployez le projet après avoir ajouté la variable d'environnement

### Problème : L'email n'est pas envoyé
**Solutions :**
- Vérifiez que votre template EmailJS est bien configuré
- Vérifiez les logs dans la console pour voir l'erreur
- Vérifiez que les credentials EmailJS sont corrects

### Problème : Le paiement réussit mais la commande n'est pas confirmée
**Solutions :**
- Vérifiez les logs dans la console
- Vérifiez que l'endpoint `/api/verify-session` fonctionne correctement
- Vérifiez que `confirmOrderAfterPayment` est bien appelé

## 🔒 Sécurité

- ⚠️ **JAMAIS** ne commitez vos clés secrètes dans le code
- Utilisez toujours les clés de test (`pk_test_` et `sk_test_`) pour le développement
- En production, utilisez les clés live (`pk_live_` et `sk_live_`)
- La vérification côté serveur de la session Stripe ajoute une couche de sécurité supplémentaire

## 📚 Ressources

- [Documentation Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Cartes de test Stripe](https://stripe.com/docs/testing)
- [Dashboard Stripe](https://dashboard.stripe.com)
- [Documentation EmailJS](https://www.emailjs.com/docs/)

