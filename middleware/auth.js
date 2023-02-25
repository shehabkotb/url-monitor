const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const auth = async (req, res, next) => {
  const token = tokenExtractor(req);

  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });

  const decoded = jwt.verify(token, config.JWTSECRET);
  if (!decoded.id) return res.status(401).send({ error: "Invalid token" });

  req.user = await User.findById(decoded.id);

  next();
};

// todo unit-test
const tokenExtractor = (req) => {
  // jwt token gets send in authorization header ex "bearer eyJhbGciOiJIUzI1NiIsIn..."
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

module.exports = auth;
