# Solution de Gestion de Stockage

Une plateforme de gestion de stockage et de partage de fichiers construite avec Next.js 15, Appwrite, TypeScript, TailwindCSS et ShadCN. Ce projet permet aux utilisateurs de télécharger, organiser et partager des fichiers avec une interface moderne et responsive.

## Pile Technologique
- React 19
- Next.js 15
- Appwrite
- TailwindCSS
- ShadCN
- TypeScript

## Fonctionnalités
- **Authentification des utilisateurs** : Inscription, connexion et déconnexion via le système d'authentification d'Appwrite.
- **Téléchargement de fichiers** : Téléchargez des documents, images, vidéos et fichiers audio.
- **Gestion de fichiers** : Parcourez, visualisez, renommez et supprimez les fichiers stockés dans Appwrite.
- **Téléchargement de fichiers** : Téléchargez instantanément les fichiers uploadés.
- **Partage de fichiers** : Partagez des fichiers avec d'autres pour collaborer.
- **Tableau de bord** : Visualisez le stockage total et utilisé, les téléchargements récents et un résumé des fichiers par type.
- **Recherche globale** : Recherchez des fichiers et du contenu partagé sur la plateforme.
- **Options de tri** : Triez les fichiers par date, nom ou taille.
- **Design responsive moderne** : Interface épurée et minimaliste sur tous les appareils.

## Prérequis
- Node.js 18 ou supérieur
- npm
- Compte et projet Appwrite

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/nwantou/drive.git
   cd drive
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env.local` à la racine du projet et ajoutez :
   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
   NEXT_PUBLIC_APPWRITE_PROJECT="votre-id-projet"
   NEXT_PUBLIC_APPWRITE_DATABASE="votre-id-base-de-donnees"
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION="votre-id-collection-utilisateurs"
   NEXT_PUBLIC_APPWRITE_FILES_COLLECTION="votre-id-collection-fichiers"
   NEXT_PUBLIC_APPWRITE_BUCKET="votre-id-bucket"
   NEXT_APPWRITE_KEY="votre-cle-appwrite"
   ```
   Remplacez les placeholders par vos identifiants Appwrite obtenus sur [Appwrite](https://appwrite.io).

4. Lancez le projet :
   ```bash
   npm run dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Crédits
Ce projet est basé sur le tutoriel [JavaScript Mastery](https://www.youtube.com/@JavaScriptMastery) d'Adrian Hajdin.