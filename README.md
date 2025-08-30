# Blog API

A secure Blog API built with Node.js, Express, MongoDB, and JWT.

## Tech
- Node.js, Express
- MongoDB, Mongoose
- JWT (auth), bcrypt
- Security: helmet, rate limiting, mongo-sanitize, xss-clean
- Validation: express-validator

## Setup
1. Copy `.env.example` to `.env`
2. `npm i`
3. `npm run dev` (http://localhost:5000)

## Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/posts` (filters: `author, tag, search, from, to`, pagination: `page, limit`)
- `GET /api/posts/:id`
- `POST /api/posts` (auth)
- `PATCH /api/posts/:id` (owner/admin)
- `DELETE /api/posts/:id` (owner/admin)
- `GET /api/posts/:postId/comments`
- `POST /api/posts/:postId/comments` (auth)
- `DELETE /api/comments/:id` (owner/admin) 
