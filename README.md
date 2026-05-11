# 📚 BookNest – Modern Full-Stack Book Reading Platform

![Status](https://img.shields.io/badge/Status-In_Development-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-ISC-blue)

A cutting-edge full-stack web application for discovering, reading, and managing books online. BookNest combines seamless reading experiences with premium features like bookmarks, reading progress tracking, and personalized reading goals.

**Live Demo:** [book-nest-ashy.vercel.app](https://book-nest-ashy.vercel.app)

---

## 🏷️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/Frontend-React.js%2019-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/Style-CSS3-264de4?logo=css3&logoColor=white)
![Router](https://img.shields.io/badge/Router-React%20Router%20v7-CA4245?logo=reactrouter&logoColor=white)

**Libraries:** React Icons, Lucide React, Ant Design, React PageFlip

### Backend
![Node.js](https://img.shields.io/badge/Runtime-Node.js-3c873a?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express.js%205-grey?logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Security-Bcryptjs-blue)

**Libraries:** Axios, Razorpay, CORS, Dotenv

### Database & ORM
![MongoDB](https://img.shields.io/badge/Database-MongoDB-4faa41?logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/ORM-Prisma%206-black?logo=prisma&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/Frontend%20Hosting-Vercel-000?logo=vercel&logoColor=white)
![Payment](https://img.shields.io/badge/Payments-Razorpay-2485FF)

---






## 📖 Table of Contents

1. [✨ Features](#-features)
2. [🛠️ Tech Stack](#️-tech-stack)
3. [📂 Project Structure](#-project-structure)
4. [⚙️ Installation & Setup](#️-installation--setup)
5. [🚀 Getting Started](#-getting-started)
6. [🔐 API Endpoints](#-api-endpoints)
7. [💾 Database Schema](#-database-schema)
8. [📝 Environment Variables](#-environment-variables)
9. [🔄 Contributing](#-contributing)
10. [🚀 Deployment](#-deployment)
11. [📝 License](#-license)

---

## ✨ Features

### 👤 **Authentication & Authorization**
- ✅ User registration with email verification
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Protected routes with middleware
- ✅ Auto-redirect for authenticated users
- ✅ Session management

### 📚 **Book Reading Experience**
- ✅ Browse & search books from external APIs
- ✅ Full-screen custom reader page
- ✅ Page-flip animation with React PageFlip
- ✅ Save reading position in database
- ✅ Book recommendations & discovery
- ✅ Advanced book filtering & sorting
- ✅ Responsive design for all devices

### ⭐ **Premium Features**
- ✅ Bookmark management (Create, Read, Update, Delete)
- ✅ Reading goals & daily tasks
- ✅ Reading progress tracking
- ✅ Favorite books collection
- ✅ Premium access lock system
- ✅ Subscription management

### 💳 **Payments & Subscriptions**
- ✅ Razorpay payment integration
- ✅ Subscription plans
- ✅ Plan upgrade/downgrade
- ✅ Payment history
- ✅ Automatic renewal handling

### 👥 **User Profile & Management**
- ✅ User profile customization
- ✅ Avatar upload
- ✅ Bio/About section
- ✅ Reading statistics
- ✅ Account settings

### 🎨 **UI/UX Enhancements**
- ✅ Modern, clean interface
- ✅ Dark/Light mode support ready
- ✅ Loading skeletons for better UX
- ✅ Toast notifications
- ✅ Pagination for book lists
- ✅ Real-time search

---

## 📂 Project Structure

```
Book_Nest/
├── frontend/                  # React Vite application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images, icons
│   │   ├── components/       # Reusable React components
│   │   │   ├── BookCard/
│   │   │   ├── SearchBar/
│   │   │   ├── Layout/
│   │   │   ├── Loader/
│   │   │   ├── Toast/
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Signup/
│   │   │   ├── ReaderPage/
│   │   │   ├── Library/
│   │   │   ├── Profile/
│   │   │   ├── Writing/
│   │   │   └── premium/
│   │   ├── services/         # API service functions
│   │   ├── context/          # React Context API
│   │   ├── hooks/            # Custom React hooks
│   │   ├── config/           # Configuration files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── back-end/                 # Express.js server
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── bookmarkController.js
│   │   ├── favoriteController.js
│   │   ├── paymentController.js
│   │   ├── premiumController.js
│   │   ├── profileController.js
│   │   ├── progressController.js
│   │   └── writingController.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── bookmarkRoutes.js
│   │   └── ...
│   ├── middleware/           # Express middleware
│   │   └── authMiddleware.js
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── config/
│   │   └── prisma.js
│   ├── utils/                # Helper functions
│   │   ├── jwt.js
│   │   ├── cache.js
│   │   └── paginate.js
│   ├── server.js             # Express server entry
│   ├── package.json
│   └── .env                  # Environment variables
│
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas or local)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shamarvey1/BookNest.git
cd Book_Nest
```

### Step 2: Install Backend Dependencies

```bash
cd back-end
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Setup Environment Variables

#### Backend `.env` file (back-end/.env):
```env
PORT=5001
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/booknest
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

#### Frontend Configuration (frontend/src/config/endpoint.js):
```javascript
const API_URL = "http://localhost:5001/api";
export default API_URL;
```

---

## 🚀 Getting Started

### Running Backend Server

```bash
cd back-end
npm run dev
```
Server runs on: `http://localhost:5001`

### Running Frontend Development

```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd back-end
npm start
```

---

## 🔐 API Endpoints

### Authentication Routes `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| GET | `/profile` | Get current user profile |
| PUT | `/update` | Update user profile |

### Books Routes `/api/books`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all books |
| GET | `/:id` | Get book details |
| GET | `/search/:query` | Search books |

### Bookmarks Routes `/api/bookmarks`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all bookmarks |
| POST | `/` | Create bookmark |
| PUT | `/:id` | Update bookmark |
| DELETE | `/:id` | Delete bookmark |

### Favorites Routes `/api/favorites`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all favorites |
| POST | `/` | Add to favorites |
| DELETE | `/:id` | Remove from favorites |

### Writing Routes `/api/writing`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get reading tasks |
| POST | `/` | Create reading task |
| PUT | `/:id` | Update task |
| DELETE | `/:id` | Delete task |

### Progress Routes `/api/progress`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get reading progress |
| POST | `/` | Create progress entry |
| PUT | `/:id` | Update progress |
| DELETE | `/:id` | Delete progress |

### Payment Routes `/api/payments`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-order` | Create Razorpay order |
| POST | `/verify` | Verify payment |
| GET | `/history` | Payment history |

### Premium Routes `/api/premium`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Check premium status |
| POST | `/upgrade` | Upgrade to premium |
| POST | `/cancel` | Cancel subscription |

### Profile Routes `/api/profile`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get profile details |
| PUT | `/` | Update profile |
| POST | `/avatar` | Upload avatar |

---

## 💾 Database Schema

### User Model
```prisma
model User {
  id                   String
  name                 String
  email                String (unique)
  password             String (hashed)
  isPremium            Boolean
  plan                 String
  validTill            DateTime
  avatarUrl            String
  bio                  String
  bookmarks            Bookmark[]
  favorites            Favorite[]
  userBooks            UserBook[]
  readingProgresses    ReadingProgress[]
  createdAt            DateTime
}
```

### Book Model
```prisma
model Book {
  id              String
  title           String
  author          String
  coverImage      String
  description     String
  content         String
  totalPages      Int
  language        String
  bookmarks       Bookmark[]
  favorites       Favorite[]
  userBooks       UserBook[]
}
```

### Related Models
- **Bookmark**: User bookmarks for specific pages/books
- **Favorite**: User's favorite books collection
- **ReadingProgress**: Track reading progress per book
- **UserBook**: User reading history

---

## 📝 Environment Variables

### Backend Variables (back-end/.env)
```env
PORT                    # Server port (default: 5001)
DATABASE_URL           # MongoDB connection string
JWT_SECRET             # Secret key for JWT tokens
RAZORPAY_KEY_ID        # Razorpay public key
RAZORPAY_KEY_SECRET    # Razorpay secret key
NODE_ENV               # Environment (development/production)
```

### Frontend Variables
Configured in `frontend/src/config/endpoint.js`:
```javascript
const API_URL = "http://localhost:5001/api";
```

---

## 🔄 Contributing

We welcome contributions! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/YourFeature`)
3. **Commit** your changes (`git commit -m 'Add YourFeature'`)
4. **Push** to the branch (`git push origin feature/YourFeature`)
5. **Open** a Pull Request

### Coding Standards
- Use meaningful variable and function names
- Add comments for complex logic
- Follow ESLint rules (run `npm run lint`)
- Test before submitting PR

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically on push to main branch

### Backend (Render or Railway)
1. Create account on Render/Railway
2. Connect GitHub repository
3. Set environment variables
4. Deploy from main branch

---

## 🔮 Future Enhancements

- [ ] Advanced book recommendations using AI/ML
- [ ] Social features (sharing, comments, ratings)
- [ ] Reading clubs and community features
- [ ] Offline reading mode
- [ ] Audio narration support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Dark mode implementation
- [ ] Email notifications
- [ ] Book discussion forums

---

## 📧 Support & Contact

- **GitHub Issues**: [Report bugs](https://github.com/Shamarvey1/BookNest/issues)
- **Email**: [Contact author]
- **Documentation**: [Wiki/Docs]

---

## 📝 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Shamarvey** - Full Stack Developer

- GitHub: [@Shamarvey1](https://github.com/Shamarvey1)
- Repository: [BookNest](https://github.com/Shamarvey1/BookNest)

---

## 🙏 Acknowledgments

- External book APIs for book data
- MongoDB for database hosting
- Razorpay for payment processing
- Vercel for frontend deployment
- Open source community

---

**Made with ❤️ by Shamarvey**

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
  "email": "ajitlookfor@gmail.com",
  "password": "123456"
}

Login

POST /api/auth/login

{
  "email": "ajitlookfor@gmail.com",
  "password": "123456"
}

Response:
{
  "token": "JWT_TOKEN"
}

📸 Screenshots
🟦 Landing Page

![alt text](<Screenshot 2026-05-12 at 12.35.31 AM.png>)

📚 Home Page

![alt text](<Screenshot 2026-05-12 at 12.37.06 AM.png>)

📖 Reader Page

![alt text](image.png)

🚀 Future Enhancements

AI Book Summary Generator

Razorpay payment integration


User Profile Page

Book Upload (for creators)

Search + Filter + Pagination

Reading Statistics Dashboard

👨🏻‍💻 Author

Ajit Kumar Prasad (Shamarvey)
Full Stack Developer
📍 Rourkela, Odisha
📧 Email: ajitlookforbest@gmail.com



