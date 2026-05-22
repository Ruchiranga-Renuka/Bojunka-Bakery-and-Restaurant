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

| Role | Username | Password | Login page |
|------|----------|----------|------------|
| Admin | `admin` | `admin123` | http://localhost:3000/login/admin |
| Customer | (your sign-up username) | (your password) | http://localhost:3000/login/user |

The admin account is **reset on every backend restart** so `admin` / `admin123` always works.

Customers: use **Sign Up** on the site.

## Features

- **User login** — browse menu, place restaurant/bakery orders
- **Admin login** — add food items (restaurant or bakery category)
- **Menu** — public browsing; orders require user login
- **My Orders** — bill total, receipt, and thank-you SMS after printing
- Sample menu items are seeded on first API start

## Thank-you SMS (after receipt print)

When a customer prints their receipt, a text message is sent to the **mobile number from sign-up**:

> Thank you! Come again to Bojunka Bakery and Restaurant.

**Development (default):** messages are logged in the backend console (`bojunka.sms.provider=console`).

**Production (real SMS via Twilio):** in `backend/src/main/resources/application.properties`:

```properties
bojunka.sms.provider=twilio
bojunka.sms.twilio-account-sid=your_account_sid
bojunka.sms.twilio-auth-token=your_auth_token
bojunka.sms.twilio-from-number=+1234567890
```

Use the customer phone in international format (e.g. `0771234567` is normalized to `+94771234567`).

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
| GET | `/api/orders` | Customer |
| POST | `/api/orders/receipt` | Customer |
| POST | `/api/orders/receipt/{number}/thank-you` | Customer |

## Build

```bash
cd backend
mvnw.cmd clean package

cd ../frontend
npm run build
```

H2 console: `http://localhost:8080/h2-console` — JDBC URL `jdbc:h2:mem:bojunkadb`, user `sa`, empty password.
<img width="1918" height="1077" alt="image" src="https://github.com/user-attachments/assets/48cdb7c0-d7d7-40c3-8864-b38d4dddc5bf" />

