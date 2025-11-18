📚 BookNest – Modern Full Stack Book Reading Platform

A clean, modern full-stack web application for reading books, tracking progress, managing daily reading goals, and exploring premium features — powered by APIs, Prisma, and MongoDB.

# 🏷️ Badges

![Status](https://img.shields.io/badge/Status-In_Development-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)

<!-- FRONTEND -->
![React](https://img.shields.io/badge/Frontend-React.js-61dafb?logo=react&logoColor=white)
![CSS3](https://img.shields.io/badge/Style-CSS3-264de4?logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?logo=vite&logoColor=white)

<!-- BACKEND -->
![Node](https://img.shields.io/badge/Backend-Node.js-3c873a?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express.js-grey?logo=express)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)
![Bcrypt](https://img.shields.io/badge/Security-Bcrypt-blue)

<!-- DATABASE -->
![MongoDB](https://img.shields.io/badge/Database-MongoDB-4faa41?logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/ORM-Prisma-black?logo=prisma)

<!-- TOOLS -->
![Git](https://img.shields.io/badge/Version_Control-Git-orange?logo=git&logoColor=white)
![VSCode](https://img.shields.io/badge/Editor-VSCode-007ACC?logo=visual-studio-code)
![Postman](https://img.shields.io/badge/API_Testing-Postman-orange?logo=postman)








📌 Table of Contents

📖 Overview

✨ Features

🛠️ Tech Stack

📂 Folder Structure

⚙️ Installation Guide

🔐 API (Auth)

📸 Screenshots

🚀 Future Enhancements

👨🏻‍💻 Author

📖 Overview

BookNest is a full-stack book reading platform designed for students and readers struggling to access books online.
The platform integrates external book APIs and provides:

A custom Reader Page

Authentication using JWT

Premium features like bookmarks & reading tasks

A modern UI inspired by real-world SaaS products

It is built to showcase full-stack skills, perfect for internships and job portfolios.

✨ Features
👤 Authentication

Login / Signup

JWT-based auth

Protected routes

Auto redirect if already logged in

📚 Book Reading

Browse books using an external API

Custom full-screen Reader Page

Save book content to DB

Store reading position

⭐ Premium Features

Bookmarks (CRUD)

Daily reading Todo (CRUD)

Premium access lock system

Payment gateway (future)

🧭 UI/UX

Beautiful Landing Page

React Icons

Sidebar navigation

Responsive layout

Clean login/signup UI

🛠️ Tech Stack
Frontend

⚛ React.js

🔗 React Router

🎨 CSS3

🧭 React Icons

📦 LocalStorage Auth

🌐 Fetch API

Backend

🟢 Node.js

🚀 Express.js

🔒 JWT Authentication

🔒 Bcrypt Password Hashing

📦 Prisma

🍃 MongoDB Atlas

📂 Folder Structure
BookNest/
│
├── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── assets/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── back-end/
    ├── prisma/
    ├── config/
    ├── controllers/
    ├── routes/
    ├── middlewares/
    ├── utils/
    ├── server.js
    ├── app.js
    ├── .env
    └── package.json

⚙️ Installation Guide
🔧 Backend Setup
cd back-end
npm install


Create .env:

DATABASE_URL="your mongodb url"
JWT_SECRET="your_secret"
PORT=5000


Push Prisma schema:

npx prisma db push


Start backend:

npm start

💻 Frontend Setup
cd frontend
npm install
npm run dev

🔐 API (Auth)
Signup

POST /api/auth/signup

{
  "name": "Ajit",
  "email": "ajit@gmail.com",
  "password": "123456"
}

Login

POST /api/auth/login

{
  "email": "ajit@gmail.com",
  "password": "123456"
}

Response:
{
  "token": "JWT_TOKEN"
}

📸 Screenshots
🟦 Landing Page

(Add screenshot here)

📚 Home Page

(Add screenshot here)

📖 Reader Page

(Add screenshot here)

🚀 Future Enhancements

AI Book Summary Generator

Razorpay payment integration

Themes (Dark/Light)

User Profile Page

Book Upload (for creators)

Search + Filter + Pagination

Reading Statistics Dashboard

👨🏻‍💻 Author

Ajit Kumar Prasad (Shamarvey)
Full Stack Developer
📍 Rourkela, Odisha
📧 Email: ajitlookforbest@gmail.com



