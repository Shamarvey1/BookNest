const jwt = require("jsonwebtoken");

const generateToken = (userId,userEmail) => {
  return jwt.sign({ userId, userEmail }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { generateToken };
