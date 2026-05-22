# Bojunka Bakery and Restaurant

Full-stack app: **Spring Boot** REST API + **React** frontend for customer orders and admin food management.

## Requirements

- Java 17+
- Node.js 18+ (for the frontend only)


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
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/efee1b35-3f79-46cb-bf2c-c2faa6999e73" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ef1a6be0-613d-400f-9856-5b3f6d6476e7" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c88fa056-c1ec-4c7f-b157-89f926e7aea0" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/4d2ef881-5528-4bd1-ba79-ceb969d26bac" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/3a23b5cd-0c2b-4416-bd63-726178e18fa9" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/f8cb9afa-99bd-461c-b332-67f381635868" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/48286dc2-457b-4253-9ebf-1f44e3b5aa1a" />
<img width="1914" height="1079" alt="image" src="https://github.com/user-attachments/assets/c075f563-0ee0-4a44-be05-9a6f4b4dffc4" />
<img width="1919" height="1075" alt="image" src="https://github.com/user-attachments/assets/4f3b821b-c865-4b2c-bc7a-52c0ca3f8169" />






