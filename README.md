# Chirpy 

Chirpy is an HTTP web server built as a guided project as part of the Boot.dev course. 
It is a mock Twitter-style backend API that allows users to create and update accounts, and to create, search, and delete chirps (posts). 

## Motivation 

The goal of this project was to gain hands-on experience with backend server development through a structured, guided build. 
Through this project, I developed experience in:
- Designing, creating, and maintaining relational databases
- Writing SQL queries and serving database results through API responses
- Building RESTful endpoints using Express - Working with TypeScript in a backend environment
- Using modern backend tools and libraries such as Drizzle ORM and PostgreSQL
- Implementing secure authorization and authentication to protect user privacy

## Tech Stack 

- TypeScript
- Express
- Drizzle ORM
- PostgreSQL
- JWT Authentication
- Argon2 Password Hashing

## Prerequisites 

Make sure you have: 
- Node.js (v18+ recommended)
- PostgreSQL running locally
- npm

## Getting Started 

### Clone the repository

```
git clone https://github.com/yourusername/chirpy.git
cd chirpy
```
### Install Dependencies

```
npm install
```
### Set Environment Variables

Create a .env file in the root of the project:
```
DB_URL=postgres://username:password@localhost:5432/chirpy
PORT=8080
JWT_SECRET=your_secret_here
POLKA_API_KEY=your_api_key_here
```

### Generate and Run Database Migrations 

Generate migration files:
```
npm run generate
```

Apply migrations:
```
npm run migrate
```

### Starting the server 

Build the server first:
```
npm run build
```

Start the server (Production):
```
npm start
```
Start the server (Development):

```
npm run dev
```

The server will run at:

```
http://localhost:8080
```

### Run tests

```
npm test
```
## API Usage 

### Health Check

```
GET /api/healthz
```

### Create User

```
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Login

```
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```
Returns:
```
{
  "token": "JWT_TOKEN_HERE",
  "refreshToken": "REFRESH_TOKEN_HERE"
}
```

### Create Chirp (Authenticated)

```
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"body":"Hello world"}'
```

### Get Chirps

```
GET /api/chirps
GET /api/chirps?authorId=<userId>
GET /api/chirps?sort=desc
```
