const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const tokenExtractor = require("../utils/tokenExtractor");

const auth = async (req, res, next) => {
  const token = tokenExtractor(req.get("authorization"));

  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });

  const decoded = jwt.verify(token, config.JWTSECRET);
  if (!decoded.id) return res.status(401).send({ error: "Invalid token" });

  req.user = await User.findById(decoded.id);

  next();
};

module.exports = auth;
