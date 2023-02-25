const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.passwordHash
  );
  if (!validPassword)
    return res.status(400).json({ error: "Invalid email or password" });

  if (!user.verified)
    return res
      .status(403)
      .send({ error: "You have to verify email before login" });

  const jwtToken = user.generateAuthToken();
  res.status(200).json({ token: jwtToken });
});

function validate(loginInfo) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(loginInfo);
}

module.exports = router;
