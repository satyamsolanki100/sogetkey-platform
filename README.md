# SoGetKey – Smart Coupon Marketplace

## Overview

SoGetKey is a full-stack web application that allows users to search products and access verified coupons uploaded by providers. It connects product search with a user-driven coupon marketplace controlled by an admin approval system.

---

## Features

- JWT Authentication (Admin, Provider, Buyer)
- Product search using external API
- Provider dashboard to upload coupons with proof images
- Admin approval system for coupons
- Buyer access to verified coupons
- Coupon application and external platform redirection
- Provider earnings tracking

---

## Tech Stack

Frontend:

- React (Vite), Tailwind CSS, Axios

Backend:

- Node.js, Express.js, MongoDB, Mongoose

Other:

- JWT Auth, Multer (file upload), Helmet, CORS

---

## Project Structure

client/ → React frontend  
server/ → Node + Express backend

---

## Key APIs

- POST /api/auth/register
- POST /api/auth/login
- GET /api/products/search
- POST /api/vouchers
- GET /api/vouchers
- GET /api/vouchers/product/:id

---

## Setup

Backend:

cd server
npm install
npm start

Frontend:

cd client
npm install
npm run dev

---

## Future Scope

- AI-based product matching
- Smart ranking system
- Real OTP verification
- Payment integration

---

## Author

Satyam Kumar Solanki
