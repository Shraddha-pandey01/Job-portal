const jwt = require("jsonwebtoken");
const responseHelper = require("../helpers/responseHelper");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorised Access!!");
    error.status = 401;
    return responseHelper.handleError(res, error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    error.message = "Invalid or expired token!!";
    error.status = 401;
    return responseHelper.handleError(res, error);
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error("Access denied!!");
      error.status = 403;
      return responseHelper.handleError(res, error);
    }
    next();
  };
};

const verifyCookie = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    const error = new Error("Unauthorised Access!!");
    error.status = 401;
    return responseHelper.handleError(res, error);
  }

  next();
};

module.exports = {
  verifyToken,
  authorizeRole,
  verifyCookie, 
};
