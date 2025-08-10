# Plotify

A plot selling platform with buyers and sellers. Sellers can upload multiple images and publish listings. Buyers can browse, favorite, and contact sellers.

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose, GridFS), JWT, Nodemailer
- Frontend: React (Vite), Chakra UI, Swiper

## Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB URI)

## Environment

Backend `.env`:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/plotify
JWT_SECRET=change_this_to_a_strong_secret
# optional for emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=Plotify <no-reply@plotify.dev>
# for reset links
APP_BASE_URL=http://localhost:5173
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Run
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

## Seed
Run once to create a demo seller and sample plots (images stored in GridFS):
```
cd backend
node src/seed.js
```
