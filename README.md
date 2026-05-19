# Bojunka Bakery and Restaurant

Full-stack app: **Spring Boot** REST API + **React** frontend for customer orders and admin food management.

## Requirements

- Java 17+
- Node.js 18+ (for the frontend only)

## Quick start

### 1. Start the API (port 8080)

```bash
cd backend
mvnw.cmd spring-boot:run
```

### 2. Start the frontend (port 3000)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

## Default accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

Customers: use **Sign Up** on the site (role `customer`).

## Features

- **User login** — browse menu, place restaurant/bakery orders
- **Admin login** — add food items (restaurant or bakery category)
- **Menu** — public browsing; orders require user login
- Sample menu items are seeded on first API start

## API (Spring Boot)

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/register` | Public (customer only) |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/restaurant/foods` | Public |
| GET | `/api/bakery/foods` | Public |
| POST | `/api/restaurant/foods` | Admin |
| POST | `/api/bakery/foods` | Admin |
| POST | `/api/restaurant/orders` | Customer |
| POST | `/api/bakery/orders` | Customer |

## Build

```bash
cd backend
mvnw.cmd clean package

cd ../frontend
npm run build
```

H2 console: `http://localhost:8080/h2-console` — JDBC URL `jdbc:h2:mem:bojunkadb`, user `sa`, empty password.
