# Real-Time Chat Application

This repository contains a real-time chat application built using a modern web development stack, including Turborepo, Next.js, PostgreSQL, Shadcn UI, Tailwind CSS, Prisma, and WebSockets. The application allows users to create and join chat rooms, facilitating live group conversations.

![image](https://github.com/user-attachments/assets/9b7428ae-4a55-472a-8e23-694fd859e6a0)
![image](https://github.com/user-attachments/assets/55ff8b5d-4e1e-48d1-9394-c9cfb909a850)
![image](https://github.com/user-attachments/assets/686238c8-b828-4304-9827-69bfed3cdb84)

---

## Table of Contents

- [Basic Overview](#basic-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Monorepo Structure](#monorepo-structure)
- [Core Technical Flow](#core-technical-flow)
- [Key Algorithms & Concepts](#key-algorithms--concepts)
- [Challenges & Bugs](#challenges--bugs)
- [Scalability & Edge Cases](#scalability--edge-cases)
- [Improvements & Future Scope](#improvements--future-scope)
- [Ownership & Authenticity](#ownership--authenticity)

---

## Basic Overview

| Field | Details |
|---|---|
| **Project Name** | ChatApp |
| **Domain / Problem Area** | Full-Stack Web Development / Real-Time Communication |
| **One-line description** | A full-stack real-time group chat application where users can sign up, create rooms, and exchange messages instantly using WebSockets. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI |
| **Backend (HTTP)** | Node.js, Express.js |
| **Backend (WebSocket)** | Node.js `ws` library (standalone WebSocket server) |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js (CredentialsProvider) with JWT (via `jose`) and bcrypt password hashing |
| **Message Queue** | BullMQ backed by Redis (IORedis / Aiven Redis) |
| **Monorepo Tooling** | Turborepo, pnpm workspaces |
| **Containerisation** | Docker |
| **Language** | TypeScript (end-to-end) |

---

## Features

- **Room Creation**: Users can create named chat rooms that other users can discover and join. (Password enforcement is planned — see [Improvements & Future Scope](#improvements--future-scope).)
- **Real-Time Communication**: WebSockets enable instant bidirectional messaging within rooms.
- **User Authentication**: Secure sign-up and sign-in with bcrypt-hashed passwords and JWT session tokens.
- **Async Message Persistence**: Messages are queued via BullMQ/Redis and written to PostgreSQL by a background worker, keeping the WebSocket hot path fast.
- **Responsive Design**: Optimised for desktops, tablets, and mobile phones with Tailwind CSS.

---

## Monorepo Structure

The project is organised as a Turborepo monorepo:

```
ChatApp/
├── apps/
│   ├── web/            # Next.js frontend + NextAuth
│   ├── http-backend/   # Express REST API (auth, rooms, chats)
│   └── ws-backend/     # Standalone WebSocket server + BullMQ worker
├── packages/
│   ├── database/       # Prisma schema & client
│   ├── backend-common/ # Shared config (JWT_SECRET, Redis URL)
│   ├── common/         # Shared Zod validation schemas
│   ├── ui/             # Shared React UI components
│   ├── eslint-config/  # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
└── docker/             # Dockerfiles
```

---

## Core Technical Flow

### Authentication Flow
```
User fills sign-in form
  → NextAuth CredentialsProvider
  → Prisma queries PostgreSQL for user
  → bcrypt.compare(password, hash)
  → jose SignJWT generates a JWT
  → JWT stored in NextAuth session & returned to client
```

### Real-Time Chat Flow
```
Client opens WebSocket connection (ws://…?token=<JWT>)
  → WS server verifies JWT
  → Client sends { type: "join-room", roomId }
  → Client sends { type: "chat", roomId, message }
  → WS server fans out message to all users in that room (in-memory)
  → WS server enqueues { roomId, message, userId } into BullMQ "chats" queue
  → BullMQ Worker dequeues job
  → Worker calls prisma.chat.create() → PostgreSQL
```

### Room Listing & History Flow
```
Browser navigates to /home
  → Next.js Server Component calls prisma.room.findMany()
  → Rooms rendered server-side

Browser navigates to /room/<slug>
  → Next.js calls HTTP backend GET /room/:slug → returns roomId
  → ChatRoom component fetches last 50 messages via HTTP backend GET /chats/:roomId
  → WebSocket connection opened for live updates
```

---

## Key Algorithms & Concepts

| Concept | How it is used |
|---|---|
| **JWT (JSON Web Tokens)** | Issued on sign-in via `jose`; verified on every WebSocket connection and protected HTTP route |
| **bcrypt** | Passwords are hashed before storage; compared securely on sign-in |
| **WebSocket Protocol** | Full-duplex channel for real-time message fan-out to all room subscribers |
| **Producer–Consumer Pattern** | WebSocket server produces chat jobs; BullMQ worker consumes and persists them, decoupling I/O-bound DB writes from the latency-sensitive messaging path |
| **Monorepo / Code Sharing** | Turborepo + pnpm workspaces allow shared Zod schemas, Prisma client, and config across frontend and both backends |
| **Server-Side Rendering** | Next.js App Router server components pre-render room lists and chat history, reducing client JavaScript |
| **Middleware-based Auth** | Express middleware extracts and verifies the JWT before protected routes are reached |

---

## Challenges & Bugs

### Hardest Problem
**Bridging NextAuth sessions with the WebSocket server.**
NextAuth issues its own session cookie/token, while the standalone WS server needs a JWT it can independently verify. The solution was to generate a custom JWT with `jose` during the NextAuth `authorize` callback, store it on the user record, and expose it through the NextAuth session so the frontend could pass it as a query parameter when opening the WebSocket.

### Tricky Bug
**In-memory user list getting stale.**
When a WebSocket connection closed unexpectedly, the user entry was not removed from the `users` array, causing messages to be sent to dead sockets and throwing unhandled errors. The fix was to add a `ws.on("close")` handler that filters the disconnected user out of the array.

### Message Ordering
Initial chat history was returned unordered. Adding `orderBy: { createdAt: "asc" }` to the Prisma query and `take: 50` for pagination solved both ordering and unbounded result-set issues.

---

## Scalability & Edge Cases

| Concern | Current Behaviour | Impact |
|---|---|---|
| **Horizontal WS scaling** | In-memory `users` array; only one WS process | Adding a second WS node breaks fan-out — messages only reach users connected to the same instance |
| **DB write throughput** | BullMQ queue buffers writes; worker processes them serially | Handles moderate load; multiple workers could be added but need idempotency guards |
| **Large rooms** | All connected room members are iterated on every message | O(n) per message; fine for small rooms, degrades at scale |
| **Token expiry** | JWT expires in 1 day; no refresh mechanism | Long-lived sessions; expired tokens cause silent WS close |
| **Room password protection** | Password field exists in schema but is not enforced in join logic | Rooms are effectively open; enforcement logic is a pending feature |

---

## Improvements & Future Scope

- **Redis Pub/Sub for horizontal WS scaling** – replace the in-memory array with a Redis channel so multiple WS nodes can fan out messages across the cluster.
- **Enforce room passwords** – validate the password when a user attempts to join a room.
- **Message pagination** – implement cursor-based pagination beyond the current hard limit of 50 messages.
- **Read receipts & online presence** – track which users are currently in a room and surface typing indicators.
- **Direct (private) messaging** – extend the Room model to support 1-to-1 conversations.
- **Token refresh** – implement silent JWT refresh to avoid unexpected session expiry.
- **Rate limiting** – add per-user message rate limiting to prevent spam.
- **End-to-end tests** – add Playwright tests for the main user journeys.

---

## Ownership & Authenticity

- **Built by**: Monu Yadav ([@MonuYadav05](https://github.com/MonuYadav05))
- **Origin**: Self-built project; not a direct tutorial follow-along.
- **Code understanding**: Every file in this repository was written and is understood end-to-end by the author — including the Turborepo workspace configuration, Prisma schema migrations, NextAuth JWT bridging logic, BullMQ producer/consumer setup, and WebSocket fan-out implementation.

