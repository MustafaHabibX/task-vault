# Task Vault

Task Vault is a backend-focused **task processing system** built with **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **BullMQ**.  
It provides **job creation**, **queuing**, **processing**, **status tracking**, and a complete **authentication flow with JWT cookies**.

This project simulates a real-world production backend where jobs are added to a queue and processed asynchronously by a dedicated **worker**.

## Tech Stack

- **Backend:** Node.js, Express
- **Queue System:** BullMQ (Redis)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (HttpOnly Cookies)
- **Environment Management:** dotenv
- **Validation & Utilities:** bcrypt, cookie-parser
- **Worker:** BullMQ Worker (separate process)

## Features

- User registration with **email verification OTP**.
- Secure login with **JWT stored in HttpOnly cookies**.
- Protected routes using custom `authenticateJWT` middleware.
- Create new jobs and store them in the database.
- Push jobs to **BullMQ** for background processing.
- Dedicated worker to process tasks asynchronously.
- Retrieve all jobs belonging to an authenticated user.
- Retrieve details of a specific job.
- Clean and modular code architecture following service/controller patterns.

## Requirements

- **Node.js** (v16 or higher recommended)
- **npm**
- **PostgreSQL** installed locally
- **Redis** installed and running locally (required for BullMQ)

## Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/MustafaHabibX/task-vault.git
```

2. Navigate into the project folder

```bash
cd task-vault
```

3. Install dependencies

```bash
npm install
```

4. Configure environment variables

```bash
cp .env.example .env
```

5. Setup Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

6. Start the server

```bash
npm start
```

7. Start the job worker

```bash
npm run worker
```

8. Access the API at:

```
http://localhost:3000
```

## Project Structure

```
task-vault/
│
├─ prisma/ # Prisma schema and migrations
├─ src/
│ ├─ controllers/ # Express route controllers
│ ├─ services/ # Business logic
│ ├─ routes/ # Express routes
│ ├─ queue/ # BullMQ queue setup
│ ├─ workers/ # Worker that processes background jobs
│ ├─ middleware/ # JWT authentication middleware
│ ├─ utils/ # Helper utilities (OTP, email, etc.)
│ ├─ server.js # Main API server entry point
│
├─ package.json
├─ .env.example
├─ .env
└─ README.md
```

## Learning Outcomes

- Implemented full authentication with **JWT cookies**.
- Built a production-like **job queue system** with BullMQ and Redis.
- Used Prisma for database management and migrations.
- Structured Node.js backend using modern **service → controller → route** layering.
- Handled OTP email flows and secure login.
- Learned real-world worker/queue architecture used in industry.
