const { Check } = require("../models/check");

// auth middleware has to be used before access
const access = async (req, res, next) => {
  if (!req.user)
    return res.status(403).send({ error: "Access denied. No token provided." });
  const user = req.user;

  if (!req.params.id) return res.status(400).send({ error: "bad url" });
  const checkId = req.params.id;

  const check = await Check.findById(checkId);
  if (!check) return res.status(404).send({ error: "check doesn't exist" });

  if (!check.createdBy.equals(user._id))
    return res
      .status(401)
      .send({ error: "Access denied. no access privilege to object" });

  req.check = check;

  next();
};

module.exports = access;
