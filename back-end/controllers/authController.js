import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Signup request received:", req.body);

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    res.json({ msg: "Signup successful" });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);  
    res.status(500).json({ msg: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", req.body);


    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.json({ token });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);     
    res.status(500).json({ msg: "Server error" });
  }
};
