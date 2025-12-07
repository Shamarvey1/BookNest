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
app.use(cors());


app.use("/api/auth", authRoutes);   
app.use("/api/books", bookRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/favorites", favoriteRoutes);



app.get("/", (req, res) => {
  res.send("BookNest API is running...");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
