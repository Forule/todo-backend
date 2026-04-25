# ⚙️ simpleTodo — Backend

[![Live](https://img.shields.io/badge/status-online-green.svg?style=for-the-badge)](https://todo.janmuljowin.de)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

The server-side core of **simpleTodo**. Provides a type-safe RESTful API with user authentication, persistent data storage via PostgreSQL, and full containerized deployment.

> 🔗 **Live:** [todo.janmuljowin.de](https://todo.janmuljowin.de) — Frontend repo: [todo-frontend](https://github.com/Forule/todo-frontend)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **User Authentication** — Register and log in with a personal account; passwords are stored using secure hashing (never in plain text)
- **Per-user Data Isolation** — Each user can only access their own tasks; enforced at the API level
- **Persistent Storage** — All task and user data is stored in a **PostgreSQL** relational database
- **Type-Safe API** — Built entirely in TypeScript (98%) for reduced runtime errors and better maintainability
- **Security Middleware** — Strict CORS policies restrict access to authorized frontends; comprehensive error-handling middleware throughout
- **Containerized** — Fully Dockerized for consistent behavior across environments

---

## Architecture

1. **TypeScript Core (98%)** — Strict typing throughout reduces runtime errors and keeps the codebase maintainable as it grows.
2. **RESTful API Design** — Clean endpoints for all CRUD operations (GET, POST, PUT, DELETE) on tasks and users.
3. **User Authentication** — Registration and login flow with secure password hashing; session management via tokens.
4. **PostgreSQL** — Relational database for persistent, user-scoped task storage. Schema ensures data integrity across all operations.
5. **Security & Middleware** — CORS policies, input validation, and centralized error handling.

---

## Deployment

The backend is fully containerized for consistent behavior across environments.

- **Containerization** — The included `Dockerfile` packages the entire server environment as an OCI-compliant container.
- **Environment Variables** — Database credentials, port settings, and secrets are managed via environment variables (never hardcoded).
- **CI/CD** — Automated build and push to GHCR via GitHub Actions on every merge to `main`.
- **Live** — Currently deployed and serving requests from the simpleTodo frontend.

---

## License

Copyright (c) 2026 Jan Muljowin — MIT License.
