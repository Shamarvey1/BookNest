import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("BookNest Backend is Live 🚀");
});

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on " + process.env.PORT);
});
