# Bojunka Restaurant & Bakery API

Spring Boot REST API for restaurant and bakery menus, orders, and JWT authentication.

## Requirements

- Java 17 or newer
- No Node.js or npm required

## Run the application

From the `backend` directory:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

The API listens on `http://localhost:8080`.

## Build and test

```bash
cd backend
./mvnw clean package
./mvnw test
```

## API overview

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/restaurant/foods` | No |
| GET | `/api/bakery/foods` | No |
| POST | `/api/restaurant/foods` | Yes (JWT) |
| POST | `/api/bakery/foods` | Yes (JWT) |
| POST | `/api/restaurant/orders` | Yes (JWT) |
| POST | `/api/bakery/orders` | Yes (JWT) |

Send the JWT from login in the `Authorization: Bearer <token>` header for protected routes.

## Example requests

```bash
# List restaurant foods
curl http://localhost:8080/api/restaurant/foods

# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"idNumber\":\"1\",\"phoneNumber\":\"555\",\"username\":\"alice\",\"password\":\"secret\",\"role\":\"restaurant\"}"

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"alice\",\"password\":\"secret\"}"
```

## Database

Uses an in-memory H2 database. H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:bojunkadb`, user: `sa`, empty password).
