# Socket Chat

Application de chat en temps réel construite avec un monorepo npm workspaces.

## Stack

| Couche | Technologie |
|--------|------------|
| Backend | NestJS, Socket.IO |
| Frontend | React, Vite, Tailwind CSS |
| Transport | WebSockets (socket.io) |

## Architecture

```
socket-chat/
├── apps/
│   ├── api/   # Serveur NestJS + Socket.IO (port 3000)
│   └── web/   # Client React + Vite (port 5173)
└── package.json
```

## Fonctionnalités

- Connexion avec un pseudo
- Salons de discussion multiples (Général, Tech, Random)
- Messages en temps réel
- Historique des messages par salon
- Notifications d'entrée/sortie des utilisateurs
- Compteur de membres par salon

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer les deux apps simultanément
npm run dev

# Ou séparément
npm run dev:api   # API sur http://localhost:3000
npm run dev:web   # Web sur http://localhost:5173
```

## Événements Socket.IO

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `room:join` | client → serveur | Rejoindre un salon |
| `room:leave` | client → serveur | Quitter un salon |
| `message:send` | client → serveur | Envoyer un message |
| `rooms` | serveur → client | Liste des salons disponibles |
| `room:history` | serveur → client | Historique des messages d'un salon |
| `message:received` | serveur → client | Nouveau message reçu |
| `user:joined` | serveur → client | Un utilisateur a rejoint le salon |
| `user:left` | serveur → client | Un utilisateur a quitté le salon |
