const jwt = require("jsonwebtoken");
require("dotenv").config();


const createAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },  
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = {
  createAccessToken,
  createRefreshToken
};