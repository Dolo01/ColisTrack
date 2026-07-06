# ColisTrack

Application web complète permettant de suivre des colis depuis l'achat à l'étranger jusqu'à la récupération finale par le client au Mali.

## Fonctionnalités

*   **Rôle Admin** : Enregistrement de colis, rattachement automatique via numéro de téléphone, gestion des statuts de chaque colis (8 étapes).
*   **Rôle Client** : Inscription, tableau de bord personnel, suivi détaillé avec chronologie.

## Stack Technique

*   **Frontend** : React, Vite, Tailwind CSS, React Router, Axios, Lucide React.
*   **Backend** : Node.js, Express, PostgreSQL, Prisma, JWT, Bcrypt.

## Démarrage en local

### Prérequis
*   Node.js installé
*   Un projet **Supabase** créé (base de données PostgreSQL hébergée).

### 1. Installation du Backend

```bash
cd backend
npm install
```

Configurez votre `.env` en copiant `.env.example` :
```bash
cp .env.example .env
```
Assurez-vous que `DATABASE_URL` pointe vers l'URL de connexion de votre base de données Supabase (utilisez de préférence le *Transaction pooler connection string* avec le paramètre `pgbouncer=true` ou la connexion directe).

Générez le client Prisma et appliquez les migrations :
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Démarrez le serveur :
```bash
npm start
# Le serveur démarrera sur http://localhost:3000 et créera le compte admin par défaut.
```

### 2. Installation du Frontend

Ouvrez un nouveau terminal.

```bash
cd frontend
npm install
```

Démarrez le serveur de développement :
```bash
npm run dev
# L'application sera accessible sur http://localhost:5173
```

## Déploiement sur Render

Le fichier `render.yaml` situé à la racine du projet permet de déployer l'infrastructure complète en un clic via le **Blueprint** Render (Infrastructure as Code).

### Étapes :
1. Créez un compte sur [Render](https://render.com/).
2. Connectez votre dépôt GitHub.
3. Sur le Dashboard Render, cliquez sur **New** -> **Blueprint**.
4. Sélectionnez votre dépôt et choisissez le fichier `render.yaml`.
5. Render créera automatiquement :
   - Un service Web (Backend Node.js) qui s'auto-connecte à la base de données.
   - Un site statique (Frontend React/Vite) qui se configure pour appeler l'URL du backend.
6. Lors du déploiement du backend, la commande de démarrage appliquera automatiquement les migrations Prisma (`npx prisma migrate deploy`).

### Variables d'environnement modifiables
*   `ADMIN_EMAIL` et `ADMIN_PASSWORD` (à modifier dans les paramètres d'environnement Render ou dans le fichier `render.yaml` avant le premier lancement)
