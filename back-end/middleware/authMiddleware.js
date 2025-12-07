const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma.js");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ msg: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = protect;
