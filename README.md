# 🚀 EVO LABS - Déploiement sur Vercel

Site web pour Evo Labs Research - Premium Research Peptides

## 📦 Contenu du projet

- `index.html` - Votre site complet (4760 lignes de code)
- `vercel.json` - Configuration Vercel
- `package.json` - Métadonnées du projet

## 🌐 Déploiement sur Vercel

### Méthode 1 : Via l'interface web Vercel (RECOMMANDÉ - Le plus simple)

1. **Créer un compte Vercel**
   - Allez sur https://vercel.com
   - Cliquez sur "Sign Up"
   - Connectez-vous avec GitHub, GitLab ou email

2. **Créer un dépôt GitHub**
   - Allez sur https://github.com/new
   - Nommez votre repo : `evo-labs-website`
   - Créez le repository (public ou privé)

3. **Télécharger les fichiers sur GitHub**
   - Uploadez tous les fichiers de ce dossier sur GitHub :
     - `index.html`
     - `vercel.json`
     - `package.json`
     - `README.md`

4. **Importer sur Vercel**
   - Retournez sur https://vercel.com
   - Cliquez sur "Add New..." → "Project"
   - Sélectionnez "Import Git Repository"
   - Choisissez votre repo `evo-labs-website`
   - Cliquez sur "Deploy"
   - ✅ C'est tout ! Votre site sera en ligne en 30 secondes !

### Méthode 2 : Via Vercel CLI (Pour les développeurs)

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Se connecter à Vercel**
   ```bash
   vercel login
   ```

3. **Déployer le site**
   ```bash
   vercel --prod
   ```

4. **Suivre les instructions à l'écran**
   - Confirmer le dossier du projet
   - Confirmer les paramètres
   - Votre site sera déployé automatiquement !

## 🔗 Après le déploiement

### Configurer votre domaine personnalisé

1. Dans le dashboard Vercel, cliquez sur votre projet
2. Allez dans "Settings" → "Domains"
3. Ajoutez votre nom de domaine
4. Suivez les instructions pour configurer les DNS

Vercel vous fournira :
- Un sous-domaine gratuit : `votre-projet.vercel.app`
- La possibilité d'ajouter votre propre domaine

### Prochaines étapes

Une fois déployé, vous pourrez :
- ✅ Tester le site en ligne
- ✅ Configurer Stripe pour les paiements
- ✅ Ajouter des fonctionnalités backend
- ✅ Optimiser le SEO
- ✅ Configurer les certificats SSL (automatique avec Vercel)

## 🛠️ Développement local

Pour tester localement avant de déployer :

```bash
# Méthode 1 : Avec Python (simple)
python3 -m http.server 8000
# Ouvrez http://localhost:8000

# Méthode 2 : Avec Node.js
npx http-server
```

## 📞 Support

Pour toute question sur Vercel :
- Documentation : https://vercel.com/docs
- Support : https://vercel.com/support

---

**Fait avec ❤️ pour Evo Labs**
