const prisma = require("../config/prisma.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt.js");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if(existing) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed
      }
    });
    res.json({ msg: "Signup successful" });
  } catch (err) {
    console.error(" SIGNUP ERROR:", err);  
    res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const token = generateToken(user.id,user.email);

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);     
    res.status(500).json({ msg: "Server error" });
  }
};
module.exports = { signup, login };