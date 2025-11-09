# Lending Portal - Server

Simple Node + Express backend for the School Equipment Lending Portal.

Requirements:
- Node 18+
- Postgres (create DB and set DATABASE_URL)

Quick start
1. Copy `.env.example` to `.env` and set DATABASE_URL and PORT.
2. Run the SQL in `sql/schema.sql` to create tables and seed data.
3. npm install
4. npm run dev

APIs:
- POST /api/auth/login { email, password }
- GET /api/equipment
- POST /api/equipment (admin)
- PUT /api/equipment/:id (admin)
- DELETE /api/equipment/:id (admin)
- POST /api/requests (authenticated)
- GET /api/requests (authenticated)
- POST /api/requests/:id/approve (admin)
- POST /api/requests/:id/return (auth)

Tokens: simple base64(JSON) token returned at login for demo purposes.
