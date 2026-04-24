# ⚙️ simpleTodo Backend

[![Live API](https://img.shields.io/badge/status-online-green.svg?style=for-the-badge)](DEIN_LIVE_LINK_HIER)

## Table of contents
* [Introduction](#introduction)
* [Deployment](#deployment)
* [Architecture](#architecture)
* [License](#license)
* [Forbidden](#forbidden)

---

## Introduction
This is the server-side core of **simpleTodo**. It provides a robust, type-safe RESTful API that handles data persistence, task logic, and communication with the frontend client. Built with a focus on reliability and scalability, it ensures that all user data is managed efficiently.

## Deployment
The backend is fully containerized to ensure consistent behavior across different environments.
* **Containerization:** The included `Dockerfile` allows the entire server environment to be packaged and deployed as an OCI-compliant container.
* **Environment Variables:** Configuration (such as database credentials and port settings) is managed via environment variables to keep sensitive information secure.
* **Live Operation:** The service is currently deployed and running live, serving requests from the **simpleTodo** frontend.

## Architecture
The backend is built using a modern, type-safe architecture:

1.  **TypeScript Core (98%):** By using TypeScript, the backend benefits from strict typing, which drastically reduces runtime errors and improves code maintainability.
2.  **RESTful API Design:** The server implements a clean REST API, providing standardized endpoints for CRUD operations (GET, POST, PUT, DELETE).
3.  **Data Persistence (PostgreSQL):** It manages the storage and retrieval of tasks using a robust **PostgreSQL** relational database, ensuring that user data is handled efficiently and scaled securely.
4.  **Security & Middleware:** The API implements strict **CORS** (Cross-Origin Resource Sharing) policies to restrict access to authorized frontends. Furthermore, it utilizes secure **password hashing** mechanisms to protect user credentials, alongside comprehensive error-handling middleware.

## License
Copyright (c) 2026 Jan Muljowin  
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

## Forbidden
**Hold Liable:** The software is provided "as is", without warranty of any kind. The software author or license owner cannot be held liable for any damages or issues arising from the use of this software.
