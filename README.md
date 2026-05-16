# Bojunka Restaurant & Bakery - Minimal API

This project contains a minimal Express-based API with two main paths: `/restaurant` and `/bakery`.

Features:
- Two login endpoints: `/restaurant/login` and `/bakery/login` (stub tokens).
- Food lists: `/restaurant/foods`, `/bakery/foods`.
- Availability checks: `/restaurant/foods/:id/availability`, `/bakery/foods/:id/availability`.
- Ordering endpoints: `POST /restaurant/orders`, `POST /bakery/orders` and `GET /.../orders`.

Quick start:

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

Example curl requests:

```bash
# List restaurant foods
curl http://localhost:3000/restaurant/foods

# Login to bakery
curl -X POST -H "Content-Type: application/json" -d '{"username":"alice"}' http://localhost:3000/bakery/login

# Place an order
curl -X POST -H "Content-Type: application/json" -d '{"itemId":1,"quantity":2,"customer":"Bob"}' http://localhost:3000/restaurant/orders
```
