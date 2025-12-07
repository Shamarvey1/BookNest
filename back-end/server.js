const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// ⭐ ALLOW BOTH LOCALHOST & VERCEL FRONTEND
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-nest-peach.vercel.app"
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// ⭐ API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/favorites", favoriteRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("BookNest API is running...");
});

// SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
