# TaskManager API

API REST de gestion des tâches développée avec
Node.js, Express.js et MongoDB.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Installation

Cloner le projet :

    git clone URL_DU_DEPOT

Installer les dépendances :

    npm install

Créer un fichier .env :

    PORT=3000
    MONGO_URI=TON_URI_MONGODB
    JWT_SECRET=TA_CLE_SECRETE
    JWT_EXPIRES_IN=1d

Démarrer le serveur :

    npm run dev

## Routes d'authentification

POST /api/auth/register
POST /api/auth/login

## Routes des tâches

GET /api/tasks
GET /api/tasks/stats
GET /api/tasks/:id
POST /api/tasks
PUT /api/tasks/:id
PATCH /api/tasks/:id
DELETE /api/tasks/:id

## Authentification

Les routes des tâches nécessitent un token JWT.

Ajouter dans les headers :

Authorization: Bearer TON_TOKEN

## Auteur

BOCOVI Amivi Shalom