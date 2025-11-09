# School Equipment Lending Portal

This workspace contains a simple School Equipment Lending Portal demo with two folders:

- `server` - Node + Express backend using Postgres (SQL seed provided)
- `client` - Vite + React frontend (Redux Toolkit + Material UI)

Quick steps:
1. Setup Postgres and run `server/sql/schema.sql` to create schema and seed demo users/equipment.
2. In `server`: `npm install` and copy `.env.example` to `.env` then run `npm run dev`.
3. In `client`: `npm install` and `npm run dev`.

Demo users:
- alice@student.school / password (student)
- bob@staff.school / password (staff)
- admin@school / password (admin)

See `server/README.md` and `client/README.md` for more details.
