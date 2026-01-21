const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const writingRoutes = require("./routes/writingRoutes");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-nest-ashy.vercel.app"
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/writing", writingRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("BookNest API is running...");
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
