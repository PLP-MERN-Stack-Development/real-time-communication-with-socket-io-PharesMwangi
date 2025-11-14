# Mwas Chat — Real-time chat with Socket.io

This repository contains a real-time chat application built with React (Vite) on the client and Express + Socket.io on the server. The app uses Clerk for authentication, MongoDB (Mongoose) for persistence, and Socket.io for real-time messaging.

## Highlights / Features

- Real-time messaging with Socket.io
- User presence and simple join/leave system
- Private messages and global messages (client provides helper for both)
- Typing indicators
- Clerk authentication integrated on the client

## Tech stack

- Frontend: React (Vite), Tailwind CSS, Clerk for auth
- Backend: Node.js, Express, Socket.io, Mongoose (MongoDB)

## Quick repo layout

```
./
├── client/                # React front-end (open this folder to run client)
│   └── client/
│       ├── public/
│       └── src/
│           ├── socket/socket.js   # socket client + hook
│           ├── App.jsx
│           └── pages/
├── server/                # Express + Socket.io server
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   └── routes/
│   └── server.js
├── Week5-Assignment.md    # assignment brief
└── README.md
```

## Environment variables

Create a `.env` file in the `server/` folder with at least:

- MONGO_URI — MongoDB connection string
- PORT — (optional) server port, defaults to 5000

Create a `.env` (or set environment) for the client with:

- VITE_CLERK_PUBLISHABLE_KEY — Clerk publishable key for auth
- VITE_SOCKET_URL — URL of the socket server (defaults to `http://localhost:5000`)

Example server `.env`:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/mydb
PORT=5000
```

Example client (Vite) env (place in `client/client/.env` or set prefixed vars):

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_SOCKET_URL=http://localhost:5000
```

## Installation & run (development)

Open two terminals — one for server and one for client.

Server:

```
cd server
npm install
# Start with node (or install nodemon and run nodemon server.js)
node server.js
```

Client:

```
cd client/client
npm install
npm run dev
```

Notes:
- The client `package.json` uses Vite. The `dev` script runs `vite`.
- The server will start on `PORT` (default 5000). The client expects socket server at `VITE_SOCKET_URL` or `http://localhost:5000`.

## Build (production)

Client:

```
cd client/client
npm run build
# preview locally
npm run preview
```

Server: build step not included — run `node server.js` or add `nodemon`/PM2 for production/auto-restart.

## API routes (Express)

The server registers the following routes (see `server/server.js`):

- GET / -> returns a small status string
- /api/users -> user-related routes (see `server/src/routes/userRoutes.js`)
- /api/conversations -> conversation-related routes
- /api/messages -> message-related routes

Check `server/src/routes` for full details of each route and payload shapes.

## Socket.io events (client ↔ server)

Client emits:
- `user_join` — payload: username (on connect)
- `send_message` — payload: { message }
- `private_message` — payload: { to, message }
- `typing` — payload: boolean (isTyping)

Server emits / client listens for:
- `receive_message` — new global message
- `private_message` — private message to a user
- `user_list` — list of online users
- `user_joined` — system message / notification of join
- `user_left` — system message / notification of leave
- `typing_users` — list of users currently typing

The client side socket helper is at `client/client/src/socket/socket.js` and exposes a `useSocket` hook and a `socket` instance for convenient usage.

## Important files of interest

- `client/client/src/socket/socket.js` — socket client configuration and hook
- `client/client/src/App.jsx` — top-level client app (Clerk auth + Dashboard)
- `server/server.js` — server entry (express + socket.io init)
- `server/src/config/db.js` — database connect (MongoDB via Mongoose)

## Common issues / troubleshooting

- CORS errors: ensure server allows requests from the dev client origin. The server currently sets `cors()` and socket.io is set to allow all origins.
- Socket connection failing: ensure `VITE_SOCKET_URL` points to the running server and the server port matches (default 5000). Check console logs on both server and client.
- Clerk auth not working: ensure `VITE_CLERK_PUBLISHABLE_KEY` is set for the client.
- Routes 404: verify server started and routes files exist under `server/src/routes`.

